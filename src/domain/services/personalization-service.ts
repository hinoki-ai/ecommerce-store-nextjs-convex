import { ID } from '../types';
import { Product } from '../entities/product';
import { User } from '../entities/user';
import { AISEOService } from '../../lib/ai-seo';

export interface UserBehaviorEvent {
  userId?: ID;
  sessionId: ID;
  eventType: 
    | 'page_view'
    | 'product_view' 
    | 'add_to_cart'
    | 'remove_from_cart'
    | 'wishlist_add'
    | 'search'
    | 'category_browse'
    | 'checkout_start'
    | 'checkout_abandon'
    | 'purchase'
    | 'review_submit';
  entityId?: ID;
  entityType?: string;
  metadata?: Record<string, any>;
  deviceInfo?: DeviceInfo;
  location?: LocationInfo;
  timestamp: number;
}

export interface DeviceInfo {
  type: 'mobile' | 'desktop' | 'tablet';
  os?: string;
  browser?: string;
  screenSize?: string;
}

export interface LocationInfo {
  country: string;
  region?: string;
  city?: string;
}

export interface PersonalizationProfile {
  userId?: ID;
  sessionId: ID;
  preferences: UserPreferences;
  patterns: BehavioralPatterns;
  recommendations?: RecommendationCache;
  lastUpdated: number;
}

export interface UserPreferences {
  categories: Array<{
    categoryId: string;
    score: number;
    lastUpdated: number;
  }>;
  priceRange: {
    min: number;
    max: number;
    preferred: number;
  };
  brands: Array<{
    brand: string;
    score: number;
  }>;
  tags: Array<{
    tag: string;
    score: number;
  }>;
}

export interface BehavioralPatterns {
  sessionDuration: number;
  pageViewsPerSession: number;
  conversionRate: number;
  averageOrderValue: number;
  purchaseFrequency: number;
  seasonalPatterns?: Record<string, number>;
  timePatterns?: Record<string, number>;
}

export interface RecommendationCache {
  products: string[];
  collections: string[];
  promotions: string[];
  lastGenerated: number;
  score: number;
}

export interface PersonalizationRecommendations {
  products: RecommendedProduct[];
  collections: RecommendedCollection[];
  promotions: RecommendedPromotion[];
  content: RecommendedContent[];
  confidence: number;
  explanation: string[];
}

export interface RecommendedProduct {
  productId: ID;
  score: number;
  reason: string;
  category: string;
  price: number;
  discount?: number;
}

export interface RecommendedCollection {
  collectionId: ID;
  score: number;
  reason: string;
  productCount: number;
}

export interface RecommendedPromotion {
  promotionId: ID;
  score: number;
  reason: string;
  discount: number;
  validUntil: number;
}

export interface RecommendedContent {
  type: 'blog' | 'guide' | 'video';
  contentId: ID;
  title: string;
  score: number;
  reason: string;
}

export class PersonalizationService {

  /**
   * Track user behavior event
   */
  static async trackBehaviorEvent(event: UserBehaviorEvent): Promise<void> {
    try {
      // Store event in database
      await this.storeBehaviorEvent(event);
      
      // Update user profile in real-time for high-impact events
      const highImpactEvents = ['purchase', 'add_to_cart', 'wishlist_add'];
      if (highImpactEvents.includes(event.eventType)) {
        await this.updateUserProfileRealTime(event);
      }
      
      // Track with analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event.eventType, {
          entity_id: event.entityId,
          entity_type: event.entityType,
          session_id: event.sessionId,
          user_id: event.userId
        });
      }
    } catch (error) {
      console.error('Failed to track behavior event:', error);
    }
  }

  /**
   * Generate personalized recommendations using AI
   */
  static async generatePersonalizedRecommendations(
    profile: PersonalizationProfile,
    context: {
      currentPage?: string;
      currentProduct?: ID;
      cartItems?: ID[];
      recentlyViewed?: ID[];
      timeOfDay?: string;
      dayOfWeek?: string;
      season?: string;
    }
  ): Promise<PersonalizationRecommendations> {
    try {
      // Get user's top preferences
      const topCategories = profile.preferences.categories
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      
      const topTags = profile.preferences.tags
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      // Generate AI-powered recommendations
      const aiRecommendations = await this.generateAIRecommendations(
        profile,
        context,
        topCategories,
        topTags
      );

      // Apply business rules and filters
      const filteredRecommendations = await this.applyBusinessRules(
        aiRecommendations,
        profile,
        context
      );

      // Calculate confidence score
      const confidence = this.calculateConfidenceScore(profile, filteredRecommendations);

      return {
        ...filteredRecommendations,
        confidence,
        explanation: this.generateRecommendationExplanation(profile, context)
      };
    } catch (error) {
      console.error('Recommendation generation failed:', error);
      return this.getFallbackRecommendations();
    }
  }

  /**
   * Update user profile based on behavior
   */
  static async updateUserProfile(
    userId: ID | undefined,
    sessionId: ID,
    events: UserBehaviorEvent[]
  ): Promise<PersonalizationProfile> {
    try {
      // Get existing profile or create new one
      let profile = await this.getPersonalizationProfile(userId, sessionId);
      
      if (!profile) {
        profile = this.createNewProfile(userId, sessionId);
      }

      // Update preferences based on events
      profile = await this.updatePreferencesFromEvents(profile, events);
      
      // Update behavioral patterns
      profile = await this.updateBehavioralPatterns(profile, events);
      
      // Generate fresh recommendations if significant changes
      const significantChange = this.hasSignificantPreferenceChange(profile, events);
      if (significantChange || !profile.recommendations) {
        const recommendations = await this.generatePersonalizedRecommendations(profile, {});
        profile.recommendations = {
          products: recommendations.products.map(p => p.productId),
          collections: recommendations.collections.map(c => c.collectionId),
          promotions: recommendations.promotions.map(p => p.promotionId),
          lastGenerated: Date.now(),
          score: recommendations.confidence
        };
      }

      profile.lastUpdated = Date.now();
      
      // Save updated profile
      await this.savePersonalizationProfile(profile);
      
      return profile;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  }

  /**
   * Get personalization insights for analytics
   */
  static async getPersonalizationInsights(
    dateRange: { start: Date; end: Date }
  ): Promise<{
    totalProfiles: number;
    activeProfiles: number;
    topCategories: Array<{ category: string; users: number; score: number }>;
    topTags: Array<{ tag: string; users: number; score: number }>;
    conversionByPersonalization: {
      personalized: number;
      nonPersonalized: number;
    };
    recommendationAccuracy: number;
  }> {
    // This would query the database for analytics data
    return {
      totalProfiles: 0, // Mock data
      activeProfiles: 0,
      topCategories: [],
      topTags: [],
      conversionByPersonalization: {
        personalized: 0,
        nonPersonalized: 0
      },
      recommendationAccuracy: 0
    };
  }

  /**
   * A/B test different personalization strategies
   */
  static async testPersonalizationStrategy(
    strategy: 'collaborative' | 'content_based' | 'hybrid' | 'ai_enhanced',
    profile: PersonalizationProfile,
    context: any
  ): Promise<PersonalizationRecommendations> {
    switch (strategy) {
      case 'collaborative':
        return this.collaborativeFiltering(profile, context);
      
      case 'content_based':
        return this.contentBasedFiltering(profile, context);
      
      case 'hybrid':
        return this.hybridRecommendations(profile, context);
      
      case 'ai_enhanced':
      default:
        return this.generatePersonalizedRecommendations(profile, context);
    }
  }

  // Private helper methods
  private static async generateAIRecommendations(
    profile: PersonalizationProfile,
    context: any,
    topCategories: any[],
    topTags: any[]
  ): Promise<Partial<PersonalizationRecommendations>> {
    // This would integrate with OpenAI or other AI service
    // For now, return mock data based on preferences
    
    const products: RecommendedProduct[] = [];
    const collections: RecommendedCollection[] = [];
    const promotions: RecommendedPromotion[] = [];
    
    // Generate product recommendations based on preferences
    for (const category of topCategories) {
      products.push({
        productId: `product_${category.categoryId}_${Date.now()}`,
        score: category.score,
        reason: `Based on your interest in ${category.categoryId}`,
        category: category.categoryId,
        price: profile.preferences.priceRange.preferred,
        discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : undefined
      });
    }
    
    return { products, collections, promotions };
  }

  private static async applyBusinessRules(
    recommendations: Partial<PersonalizationRecommendations>,
    profile: PersonalizationProfile,
    context: any
  ): Promise<Partial<PersonalizationRecommendations>> {
    // Apply business rules like inventory checks, pricing rules, etc.
    const filteredProducts = recommendations.products?.filter(product => {
      // Check inventory, active status, price range, etc.
      return product.price <= profile.preferences.priceRange.max &&
             product.price >= profile.preferences.priceRange.min;
    }) || [];

    return {
      ...recommendations,
      products: filteredProducts
    };
  }

  private static calculateConfidenceScore(
    profile: PersonalizationProfile,
    recommendations: Partial<PersonalizationRecommendations>
  ): number {
    // Calculate confidence based on:
    // - Amount of user data available
    // - Recency of data
    // - Quality of recommendations
    
    const dataAmount = (profile.preferences.categories.length + 
                       profile.preferences.tags.length) / 20; // Normalize to 0-1
    
    const dataRecency = Math.max(0, 1 - (Date.now() - profile.lastUpdated) / (7 * 24 * 60 * 60 * 1000)); // Week decay
    
    const recommendationCount = (recommendations.products?.length || 0) / 10; // Normalize to 0-1
    
    return Math.min(1, (dataAmount * 0.4 + dataRecency * 0.3 + recommendationCount * 0.3));
  }

  private static generateRecommendationExplanation(
    profile: PersonalizationProfile,
    context: any
  ): string[] {
    const explanations: string[] = [];
    
    // Top category explanation
    const topCategory = profile.preferences.categories[0];
    if (topCategory) {
      explanations.push(`Basado en tu interés en ${topCategory.categoryId}`);
    }
    
    // Price preference explanation
    const priceRange = profile.preferences.priceRange;
    explanations.push(`Productos en tu rango de precio preferido ($${priceRange.min}-$${priceRange.max})`);
    
    // Behavioral pattern explanation
    if (profile.patterns.conversionRate > 0.1) {
      explanations.push('Seleccionados para usuarios con alto nivel de compra');
    }
    
    return explanations;
  }

  private static getFallbackRecommendations(): PersonalizationRecommendations {
    return {
      products: [],
      collections: [],
      promotions: [],
      content: [],
      confidence: 0.1,
      explanation: ['Recomendaciones generales - necesitamos más información sobre tus preferencias']
    };
  }

  private static async storeBehaviorEvent(event: UserBehaviorEvent): Promise<void> {
    // Store in Convex userBehavior table
    // This would be implemented with actual database calls
    console.log('Storing behavior event:', event);
  }

  private static async updateUserProfileRealTime(event: UserBehaviorEvent): Promise<void> {
    // Update user profile immediately for high-impact events
    // This ensures real-time personalization
    console.log('Real-time profile update for:', event);
  }

  private static async getPersonalizationProfile(
    userId: ID | undefined,
    sessionId: ID
  ): Promise<PersonalizationProfile | null> {
    // Get from Convex personalizationProfiles table
    return null; // Mock implementation
  }

  private static createNewProfile(userId: ID | undefined, sessionId: ID): PersonalizationProfile {
    return {
      userId,
      sessionId,
      preferences: {
        categories: [],
        priceRange: { min: 0, max: 1000000, preferred: 50000 },
        brands: [],
        tags: []
      },
      patterns: {
        sessionDuration: 0,
        pageViewsPerSession: 0,
        conversionRate: 0,
        averageOrderValue: 0,
        purchaseFrequency: 0
      },
      lastUpdated: Date.now()
    };
  }

  private static async updatePreferencesFromEvents(
    profile: PersonalizationProfile,
    events: UserBehaviorEvent[]
  ): Promise<PersonalizationProfile> {
    // Update category preferences based on product views, purchases, etc.
    for (const event of events) {
      if (event.eventType === 'product_view' || event.eventType === 'purchase') {
        const categoryId = event.metadata?.categoryId;
        if (categoryId) {
          const existing = profile.preferences.categories.find(c => c.categoryId === categoryId);
          const scoreIncrease = event.eventType === 'purchase' ? 0.1 : 0.02;
          
          if (existing) {
            existing.score = Math.min(1, existing.score + scoreIncrease);
            existing.lastUpdated = Date.now();
          } else {
            profile.preferences.categories.push({
              categoryId,
              score: scoreIncrease,
              lastUpdated: Date.now()
            });
          }
        }
      }
    }
    
    return profile;
  }

  private static async updateBehavioralPatterns(
    profile: PersonalizationProfile,
    events: UserBehaviorEvent[]
  ): Promise<PersonalizationProfile> {
    // Update behavioral patterns based on events
    const sessionEvents = events.filter(e => e.sessionId === profile.sessionId);
    
    if (sessionEvents.length > 0) {
      profile.patterns.pageViewsPerSession = sessionEvents.filter(e => e.eventType === 'page_view').length;
      
      const purchases = sessionEvents.filter(e => e.eventType === 'purchase');
      if (purchases.length > 0) {
        profile.patterns.conversionRate = purchases.length / sessionEvents.length;
      }
    }
    
    return profile;
  }

  private static hasSignificantPreferenceChange(
    profile: PersonalizationProfile,
    events: UserBehaviorEvent[]
  ): boolean {
    // Check if recent events significantly changed user preferences
    const significantEvents = ['purchase', 'add_to_cart', 'wishlist_add'];
    return events.some(event => significantEvents.includes(event.eventType));
  }

  private static async savePersonalizationProfile(profile: PersonalizationProfile): Promise<void> {
    // Save to Convex personalizationProfiles table
    console.log('Saving personalization profile:', profile);
  }

  // Alternative recommendation strategies for A/B testing
  private static async collaborativeFiltering(
    profile: PersonalizationProfile,
    context: any
  ): Promise<PersonalizationRecommendations> {
    // Find similar users and recommend based on their preferences
    return this.getFallbackRecommendations();
  }

  private static async contentBasedFiltering(
    profile: PersonalizationProfile,
    context: any
  ): Promise<PersonalizationRecommendations> {
    // Recommend based on product attributes and user preferences
    return this.getFallbackRecommendations();
  }

  private static async hybridRecommendations(
    profile: PersonalizationProfile,
    context: any
  ): Promise<PersonalizationRecommendations> {
    // Combine collaborative and content-based approaches
    return this.getFallbackRecommendations();
  }
}