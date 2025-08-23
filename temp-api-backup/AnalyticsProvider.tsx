'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { analytics } from '@/lib/analytics';

interface AnalyticsContextType {
  track: (event: string, properties?: Record<string, any>) => Promise<void>;
  trackError: (error: Error, context?: any) => Promise<void>;
  trackPerformance: (metrics: any) => Promise<void>;
  isInitialized: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const { user, isLoaded } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      // Initialize analytics with user context
      if (user) {
        analytics.track('user_session_start', {
          user_id: user.id,
          user_email: user.emailAddresses[0]?.emailAddress,
          user_created_at: user.createdAt,
          user_role: user.publicMetadata?.role || 'customer'
        }, user.id);
      } else {
        analytics.track('anonymous_session_start');
      }

      // Track initial page view
      analytics.track('page_view', {
        page_path: window.location.pathname,
        page_title: document.title,
        referrer: document.referrer
      }, user?.id);

      setIsInitialized(true);
    }
  }, [isLoaded, user]);

  // Track route changes
  useEffect(() => {
    const handleRouteChange = () => {
      analytics.track('page_view', {
        page_path: window.location.pathname,
        page_title: document.title,
        referrer: document.referrer
      }, user?.id);
    };

    // Listen for history changes (client-side navigation)
    window.addEventListener('popstate', handleRouteChange);
    
    // Track performance navigation API if available
    if ('navigation' in performance) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            analytics.trackPerformance({
              feature: 'navigation',
              operation: 'page_load',
              duration: navEntry.loadEventEnd - navEntry.loadEventStart,
              success: true,
              metadata: {
                dom_content_loaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
                first_paint: navEntry.responseEnd - navEntry.requestStart,
                dns_lookup: navEntry.domainLookupEnd - navEntry.domainLookupStart,
                connect_time: navEntry.connectEnd - navEntry.connectStart,
                response_time: navEntry.responseEnd - navEntry.responseStart
              }
            });
          }
        }
      });
      observer.observe({ entryTypes: ['navigation'] });
    }

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [user]);

  // Track Core Web Vitals
  useEffect(() => {
    if (typeof window !== 'undefined' && 'web-vitals' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS((metric) => {
          analytics.trackPerformance({
            feature: 'core_web_vitals',
            operation: 'cls',
            duration: metric.value,
            success: metric.value < 0.1,
            metadata: {
              rating: metric.rating,
              id: metric.id
            }
          });
        });

        getFID((metric) => {
          analytics.trackPerformance({
            feature: 'core_web_vitals',
            operation: 'fid',
            duration: metric.value,
            success: metric.value < 100,
            metadata: {
              rating: metric.rating,
              id: metric.id
            }
          });
        });

        getFCP((metric) => {
          analytics.trackPerformance({
            feature: 'core_web_vitals',
            operation: 'fcp',
            duration: metric.value,
            success: metric.value < 1800,
            metadata: {
              rating: metric.rating,
              id: metric.id
            }
          });
        });

        getLCP((metric) => {
          analytics.trackPerformance({
            feature: 'core_web_vitals',
            operation: 'lcp',
            duration: metric.value,
            success: metric.value < 2500,
            metadata: {
              rating: metric.rating,
              id: metric.id
            }
          });
        });

        getTTFB((metric) => {
          analytics.trackPerformance({
            feature: 'core_web_vitals',
            operation: 'ttfb',
            duration: metric.value,
            success: metric.value < 800,
            metadata: {
              rating: metric.rating,
              id: metric.id
            }
          });
        });
      });
    }
  }, []);

  // Error boundary integration
  useEffect(() => {
    const handleUnhandledError = (event: ErrorEvent) => {
      analytics.trackError(new Error(event.message), {
        feature: 'global',
        action: 'unhandled_error',
        userId: user?.id,
        additionalInfo: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        }
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      analytics.trackError(new Error('Unhandled Promise Rejection'), {
        feature: 'global',
        action: 'unhandled_promise_rejection',
        userId: user?.id,
        additionalInfo: {
          reason: event.reason
        }
      });
    };

    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [user]);

  // Visibility tracking
  useEffect(() => {
    let startTime = Date.now();
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const sessionDuration = Date.now() - startTime;
        analytics.track('session_end', {
          session_duration: sessionDuration,
          page_path: window.location.pathname
        }, user?.id);
      } else {
        startTime = Date.now();
        analytics.track('session_resume', {
          page_path: window.location.pathname
        }, user?.id);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Track session end on cleanup
      const sessionDuration = Date.now() - startTime;
      analytics.track('session_end', {
        session_duration: sessionDuration,
        page_path: window.location.pathname
      }, user?.id);
    };
  }, [user]);

  const contextValue: AnalyticsContextType = {
    track: async (event: string, properties?: Record<string, any>) => {
      await analytics.track(event, properties, user?.id);
    },
    trackError: async (error: Error, context?: any) => {
      await analytics.trackError(error, { ...context, userId: user?.id });
    },
    trackPerformance: async (metrics: any) => {
      await analytics.trackPerformance(metrics);
    },
    isInitialized
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

// Higher-order component for automatic event tracking
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>,
  eventName?: string
) {
  return function AnalyticsWrappedComponent(props: P) {
    const { track } = useAnalytics();

    useEffect(() => {
      if (eventName) {
        track(`component_${eventName}_mounted`, {
          component_name: Component.displayName || Component.name
        });
      }
    }, [track]);

    return <Component {...props} />;
  };
}

// Hook for tracking component interactions
export function useComponentTracking(componentName: string) {
  const { track } = useAnalytics();

  const trackInteraction = async (action: string, properties?: Record<string, any>) => {
    await track(`${componentName}_${action}`, {
      component: componentName,
      ...properties
    });
  };

  const trackClick = async (element: string, properties?: Record<string, any>) => {
    await trackInteraction('click', { element, ...properties });
  };

  const trackView = async (properties?: Record<string, any>) => {
    await trackInteraction('view', properties);
  };

  const trackSubmit = async (formName: string, properties?: Record<string, any>) => {
    await trackInteraction('submit', { form: formName, ...properties });
  };

  return {
    trackInteraction,
    trackClick,
    trackView,
    trackSubmit
  };
}