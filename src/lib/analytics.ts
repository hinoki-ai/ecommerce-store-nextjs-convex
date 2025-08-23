/**
 * Advanced Analytics Service
 * Tracks all advanced features with detailed metrics
 */

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp?: number;
  source?: 'client' | 'server';
}

interface AnalyticsConfig {
  googleAnalytics?: {
    measurementId: string;
    apiSecret: string;
  };
  mixpanel?: {
    token: string;
  };
  customEndpoint?: string;
  debug?: boolean;
}

export class AdvancedAnalytics {
  private static instance: AdvancedAnalytics;
  private config: AnalyticsConfig;
  private eventQueue: AnalyticsEvent[] = [];
  private isOnline: boolean = true;
  private flushInterval: NodeJS.Timeout | null = null;

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.initializeTracking();
    this.setupOfflineHandling();
    this.startEventFlushing();
  }

  static getInstance(config?: AnalyticsConfig): AdvancedAnalytics {
    if (!AdvancedAnalytics.instance && config) {
      AdvancedAnalytics.instance = new AdvancedAnalytics(config);
    }
    return AdvancedAnalytics.instance;
  }

  // Core tracking methods
  async track(event: string, properties?: Record<string, any>, userId?: string) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        ...this.getDeviceInfo()
      },
      userId,
      sessionId: this.getSessionId(),
      timestamp: Date.now(),
      source: 'client'
    };

    // Add to queue for batch processing
    this.eventQueue.push(analyticsEvent);

    // Log in debug mode
    if (this.config.debug) {
      console.log('📊 Analytics Event:', analyticsEvent);
    }

    // Flush immediately for critical events
    const criticalEvents = ['purchase', 'signup', 'subscription', 'error'];
    if (criticalEvents.includes(event)) {
      await this.flush();
    }
  }

  // Promotion Analytics
  async trackPromotionEvent(event: 'promotion_viewed' | 'promotion_applied' | 'promotion_failed', data: {
    promotionId: string;
    promotionCode?: string;
    promotionType: string;
    discountAmount?: number;
    cartValue?: number;
    reason?: string;
    userId?: string;
  }) {
    await this.track(`promotion_${event}`, {
      promotion_id: data.promotionId,
      promotion_code: data.promotionCode,
      promotion_type: data.promotionType,
      discount_amount: data.discountAmount,
      cart_value: data.cartValue,
      reason: data.reason,
      category: 'promotions'
    }, data.userId);
  }

  async trackPromotionPerformance(promotionId: string, metrics: {
    totalUses: number;
    revenue: number;
    conversionRate: number;
    averageOrderValue: number;
    costPerAcquisition?: number;
  }) {
    await this.track('promotion_performance', {
      promotion_id: promotionId,
      total_uses: metrics.totalUses,
      revenue: metrics.revenue,
      conversion_rate: metrics.conversionRate,
      average_order_value: metrics.averageOrderValue,
      cost_per_acquisition: metrics.costPerAcquisition,
      category: 'promotions'
    });
  }

  // Social Media Analytics
  async trackSocialShare(data: {
    entityId: string;
    entityType: string;
    platform: string;
    shareType: string;
    userId?: string;
  }) {
    await this.track('social_share', {
      entity_id: data.entityId,
      entity_type: data.entityType,
      platform: data.platform,
      share_type: data.shareType,
      category: 'social'
    }, data.userId);
  }

  async trackSocialEngagement(data: {
    shareId: string;
    engagementType: 'click' | 'conversion' | 'view';
    platform: string;
    value?: number;
  }) {
    await this.track('social_engagement', {
      share_id: data.shareId,
      engagement_type: data.engagementType,
      platform: data.platform,
      value: data.value,
      category: 'social'
    });
  }

  // PWA Analytics
  async trackPWAEvent(event: 'install' | 'launch' | 'offline_usage' | 'notification_sent' | 'notification_clicked', data?: {
    source?: string;
    notificationType?: string;
    offlineAction?: string;
    userId?: string;
  }) {
    await this.track(`pwa_${event}`, {
      source: data?.source,
      notification_type: data?.notificationType,
      offline_action: data?.offlineAction,
      category: 'pwa'
    }, data?.userId);
  }

  async trackServiceWorkerEvent(event: 'install' | 'activate' | 'fetch' | 'sync' | 'push', data: {
    success: boolean;
    cacheHit?: boolean;
    syncType?: string;
    fetchUrl?: string;
    error?: string;
  }) {
    await this.track(`sw_${event}`, {
      success: data.success,
      cache_hit: data.cacheHit,
      sync_type: data.syncType,
      fetch_url: data.fetchUrl,
      error: data.error,
      category: 'pwa'
    });
  }

  // AI Personalization Analytics
  async trackPersonalizationEvent(event: 'profile_created' | 'recommendation_shown' | 'recommendation_clicked' | 'preference_updated', data: {
    userId?: string;
    profileId?: string;
    recommendationType?: string;
    recommendationId?: string;
    confidence?: number;
    accuracy?: number;
  }) {
    await this.track(`personalization_${event}`, {
      profile_id: data.profileId,
      recommendation_type: data.recommendationType,
      recommendation_id: data.recommendationId,
      confidence: data.confidence,
      accuracy: data.accuracy,
      category: 'personalization'
    }, data.userId);
  }

  async trackBehaviorEvent(event: {
    eventType: string;
    entityId?: string;
    entityType?: string;
    userId?: string;
    sessionId?: string;
    metadata?: Record<string, any>;
  }) {
    await this.track(`behavior_${event.eventType}`, {
      entity_id: event.entityId,
      entity_type: event.entityType,
      session_id: event.sessionId,
      ...event.metadata,
      category: 'behavior'
    }, event.userId);
  }

  // Error Analytics
  async trackError(error: Error, context?: {
    feature?: string;
    action?: string;
    userId?: string;
    additionalInfo?: Record<string, any>;
  }) {
    await this.track('error', {
      error_message: error.message,
      error_stack: error.stack,
      feature: context?.feature,
      action: context?.action,
      additional_info: context?.additionalInfo,
      category: 'errors'
    }, context?.userId);
  }

  // Performance Analytics
  async trackPerformance(metrics: {
    feature: string;
    operation: string;
    duration: number;
    success: boolean;
    metadata?: Record<string, any>;
  }) {
    await this.track('performance', {
      feature: metrics.feature,
      operation: metrics.operation,
      duration: metrics.duration,
      success: metrics.success,
      ...metrics.metadata,
      category: 'performance'
    });
  }

  // Funnel Analytics
  async trackFunnelStep(funnel: string, step: string, data?: {
    stepIndex?: number;
    totalSteps?: number;
    userId?: string;
    metadata?: Record<string, any>;
  }) {
    await this.track('funnel_step', {
      funnel_name: funnel,
      step_name: step,
      step_index: data?.stepIndex,
      total_steps: data?.totalSteps,
      ...data?.metadata,
      category: 'funnels'
    }, data?.userId);
  }

  // A/B Testing Analytics
  async trackExperiment(experimentId: string, variant: string, event: 'view' | 'conversion', data?: {
    userId?: string;
    value?: number;
    metadata?: Record<string, any>;
  }) {
    await this.track('experiment', {
      experiment_id: experimentId,
      variant,
      event,
      value: data?.value,
      ...data?.metadata,
      category: 'experiments'
    }, data?.userId);
  }

  // Business Metrics
  async trackBusinessMetric(metric: string, value: number, data?: {
    unit?: string;
    category?: string;
    metadata?: Record<string, any>;
  }) {
    await this.track('business_metric', {
      metric_name: metric,
      metric_value: value,
      metric_unit: data?.unit,
      metric_category: data?.category,
      ...data?.metadata,
      category: 'business'
    });
  }

  // Batch processing and flushing
  private async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const eventsToFlush = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // Send to multiple analytics providers
      await Promise.allSettled([
        this.sendToGoogleAnalytics(eventsToFlush),
        this.sendToMixpanel(eventsToFlush),
        this.sendToCustomEndpoint(eventsToFlush)
      ]);
    } catch (error) {
      console.error('Analytics flush failed:', error);
      // Re-add events to queue for retry
      this.eventQueue.unshift(...eventsToFlush);
    }
  }

  private async sendToGoogleAnalytics(events: AnalyticsEvent[]): Promise<void> {
    if (!this.config.googleAnalytics) return;

    const { measurementId, apiSecret } = this.config.googleAnalytics;

    for (const event of events) {
      try {
        const payload = {
          client_id: event.sessionId || 'anonymous',
          user_id: event.userId,
          events: [{
            name: event.event,
            parameters: {
              ...event.properties,
              session_id: event.sessionId,
              timestamp_micros: (event.timestamp || Date.now()) * 1000
            }
          }]
        };

        const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;
        
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (error) {
        console.error('GA4 tracking failed:', error);
      }
    }
  }

  private async sendToMixpanel(events: AnalyticsEvent[]): Promise<void> {
    if (!this.config.mixpanel) return;

    // Mixpanel implementation would go here
    console.log('Sending to Mixpanel:', events.length, 'events');
  }

  private async sendToCustomEndpoint(events: AnalyticsEvent[]): Promise<void> {
    if (!this.config.customEndpoint) return;

    try {
      await fetch(this.config.customEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events })
      });
    } catch (error) {
      console.error('Custom analytics endpoint failed:', error);
    }
  }

  // Utility methods
  private initializeTracking(): void {
    if (typeof window !== 'undefined') {
      // Track page views automatically
      window.addEventListener('beforeunload', () => {
        this.flush();
      });

      // Track visibility changes
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.flush();
        }
      });
    }
  }

  private setupOfflineHandling(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.flush();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
      });

      this.isOnline = navigator.onLine;
    }
  }

  private startEventFlushing(): void {
    // Flush events every 10 seconds or when queue reaches 50 events
    this.flushInterval = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flush();
      }
    }, 10000);

    // Also flush when queue gets large
    if (this.eventQueue.length >= 50) {
      this.flush();
    }
  }

  private getSessionId(): string {
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('aramac-analytics-session');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        sessionStorage.setItem('aramac-analytics-session', sessionId);
      }
      return sessionId;
    }
    return 'server_session';
  }

  private getDeviceInfo() {
    if (typeof window === 'undefined') return {};

    return {
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      color_depth: window.screen.colorDepth,
      pixel_ratio: window.devicePixelRatio,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      connection: (navigator as any).connection?.effectiveType,
      memory: (navigator as any).deviceMemory,
      cpu_cores: navigator.hardwareConcurrency
    };
  }

  // Cleanup
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flush();
  }
}

// Initialize analytics singleton
const analyticsConfig: AnalyticsConfig = {
  googleAnalytics: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    apiSecret: process.env.GA_API_SECRET || ''
  } : undefined,
  customEndpoint: process.env.CUSTOM_ANALYTICS_ENDPOINT,
  debug: process.env.NODE_ENV === 'development'
};

export const analytics = AdvancedAnalytics.getInstance(analyticsConfig);

// Convenience functions for common tracking
export const trackPromotionUsage = analytics.trackPromotionEvent.bind(analytics);
export const trackSocialShare = analytics.trackSocialShare.bind(analytics);
export const trackPWAInstall = (source?: string, userId?: string) => 
  analytics.trackPWAEvent('install', { source, userId });
export const trackPersonalizationClick = (data: Parameters<typeof analytics.trackPersonalizationEvent>[1]) =>
  analytics.trackPersonalizationEvent('recommendation_clicked', data);
export const trackError = analytics.trackError.bind(analytics);
export const trackPerformance = analytics.trackPerformance.bind(analytics);