import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PersonalizationService } from '@/domain/services/personalization-service';

const getProfileSchema = z.object({
  userId: z.string().optional(),
  sessionId: z.string().min(1)
});

const updateProfileSchema = z.object({
  profile: z.object({
    userId: z.string().optional(),
    sessionId: z.string().min(1),
    preferences: z.object({
      categories: z.array(z.object({
        categoryId: z.string(),
        score: z.number().min(0).max(1),
        lastUpdated: z.number()
      })),
      priceRange: z.object({
        min: z.number().min(0),
        max: z.number().min(0),
        preferred: z.number().min(0)
      }),
      brands: z.array(z.object({
        brand: z.string(),
        score: z.number().min(0).max(1)
      })),
      tags: z.array(z.object({
        tag: z.string(),
        score: z.number().min(0).max(1)
      }))
    }),
    patterns: z.object({
      sessionDuration: z.number().min(0),
      pageViewsPerSession: z.number().min(0),
      conversionRate: z.number().min(0).max(1),
      averageOrderValue: z.number().min(0),
      purchaseFrequency: z.number().min(0)
    }),
    recommendations: z.object({
      products: z.array(z.string()),
      collections: z.array(z.string()),
      promotions: z.array(z.string()),
      lastGenerated: z.number(),
      score: z.number().min(0).max(1)
    }).optional(),
    lastUpdated: z.number()
  })
});

const trackEventSchema = z.object({
  event: z.object({
    userId: z.string().optional(),
    sessionId: z.string().min(1),
    eventType: z.enum([
      'page_view',
      'product_view',
      'add_to_cart',
      'remove_from_cart',
      'wishlist_add',
      'search',
      'category_browse',
      'checkout_start',
      'checkout_abandon',
      'purchase',
      'review_submit'
    ]),
    entityId: z.string().optional(),
    entityType: z.string().optional(),
    metadata: z.record(z.any()).optional(),
    deviceInfo: z.object({
      type: z.enum(['mobile', 'desktop', 'tablet']),
      os: z.string().optional(),
      browser: z.string().optional(),
      screenSize: z.string().optional()
    }).optional(),
    location: z.object({
      country: z.string(),
      region: z.string().optional(),
      city: z.string().optional()
    }).optional(),
    timestamp: z.number()
  })
});

// GET - Retrieve user personalization profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = getProfileSchema.parse(body);

    // TODO: Get profile from Convex personalizationProfiles table
    // For now, return a mock profile or null
    const mockProfile = await getMockPersonalizationProfile(
      validatedData.userId,
      validatedData.sessionId
    );

    if (!mockProfile) {
      return NextResponse.json({
        success: true,
        data: {
          profile: null,
          isNew: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: mockProfile,
        isNew: false,
        lastUpdated: mockProfile.lastUpdated,
        confidence: calculateProfileConfidence(mockProfile)
      }
    });

  } catch (error) {
    console.error('Profile retrieval error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve personalization profile'
    }, { status: 500 });
  }
}

// PUT - Update user personalization profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const profile = validatedData.profile;

    // TODO: Save profile to Convex personalizationProfiles table
    console.log('Saving personalization profile:', {
      userId: profile.userId,
      sessionId: profile.sessionId,
      categoriesCount: profile.preferences.categories.length,
      tagsCount: profile.preferences.tags.length,
      lastUpdated: profile.lastUpdated
    });

    // Generate fresh recommendations if profile changed significantly
    let recommendations = profile.recommendations;
    if (!recommendations || isProfileSignificantlyChanged(profile)) {
      try {
        const recs = await PersonalizationService.generatePersonalizedRecommendations(
          profile,
          {
            timeOfDay: getTimeOfDay(),
            dayOfWeek: getDayOfWeek(),
            season: getCurrentSeason()
          }
        );

        recommendations = {
          products: recs.products.map(p => p.productId),
          collections: recs.collections.map(c => c.collectionId),
          promotions: recs.promotions.map(p => p.promotionId),
          lastGenerated: Date.now(),
          score: recs.confidence
        };
      } catch (error) {
        console.warn('Recommendation generation failed:', error);
      }
    }

    const updatedProfile = {
      ...profile,
      recommendations,
      lastUpdated: Date.now()
    };

    // Track profile update event
    await trackProfileEvent('profile_updated', {
      userId: profile.userId,
      sessionId: profile.sessionId,
      changesCount: calculateProfileChanges(profile),
      confidence: calculateProfileConfidence(updatedProfile)
    });

    return NextResponse.json({
      success: true,
      data: {
        profile: updatedProfile,
        updated: true,
        confidence: calculateProfileConfidence(updatedProfile),
        recommendationsRefreshed: !!recommendations
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid profile data',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update personalization profile'
    }, { status: 500 });
  }
}

// Helper functions
async function getMockPersonalizationProfile(userId?: string, sessionId?: string) {
  // Mock implementation - in real app, this would query the database
  if (!userId && Math.random() > 0.3) {
    // 70% chance of returning a profile for anonymous users
    return null;
  }

  return {
    userId,
    sessionId: sessionId || 'mock_session',
    preferences: {
      categories: [
        { categoryId: 'electronics', score: 0.8, lastUpdated: Date.now() - 86400000 },
        { categoryId: 'fashion', score: 0.6, lastUpdated: Date.now() - 172800000 },
        { categoryId: 'home', score: 0.4, lastUpdated: Date.now() - 259200000 }
      ],
      priceRange: {
        min: 10000,
        max: 200000,
        preferred: 75000
      },
      brands: [
        { brand: 'Samsung', score: 0.7 },
        { brand: 'Nike', score: 0.5 }
      ],
      tags: [
        { tag: 'smartphone', score: 0.9 },
        { tag: 'wireless', score: 0.7 },
        { tag: 'gaming', score: 0.6 }
      ]
    },
    patterns: {
      sessionDuration: 450000, // 7.5 minutes
      pageViewsPerSession: 8,
      conversionRate: 0.15,
      averageOrderValue: 85000,
      purchaseFrequency: 14 // days
    },
    recommendations: {
      products: ['prod_1', 'prod_2', 'prod_3'],
      collections: ['col_1', 'col_2'],
      promotions: ['promo_1'],
      lastGenerated: Date.now() - 3600000, // 1 hour ago
      score: 0.75
    },
    lastUpdated: Date.now() - 3600000
  };
}

function calculateProfileConfidence(profile: any): number {
  const dataPoints = [
    profile.preferences.categories.length * 0.3,
    profile.preferences.tags.length * 0.2,
    profile.preferences.brands.length * 0.1,
    profile.patterns.pageViewsPerSession > 0 ? 0.2 : 0,
    profile.patterns.conversionRate > 0 ? 0.2 : 0
  ];

  const rawScore = dataPoints.reduce((sum, score) => sum + score, 0);
  return Math.min(1, rawScore);
}

function isProfileSignificantlyChanged(profile: any): boolean {
  // Check if profile has changed significantly enough to warrant new recommendations
  if (!profile.recommendations) return true;
  
  const timeSinceLastRecs = Date.now() - profile.recommendations.lastGenerated;
  const oneHour = 60 * 60 * 1000;
  
  // Refresh recommendations if:
  // - More than 1 hour since last generation
  // - Low confidence score
  // - New categories or tags added recently
  return timeSinceLastRecs > oneHour || 
         profile.recommendations.score < 0.5 ||
         profile.preferences.categories.some((cat: any) => 
           Date.now() - cat.lastUpdated < 30 * 60 * 1000 // 30 minutes
         );
}

function calculateProfileChanges(profile: any): number {
  // Mock implementation to count recent changes
  const recentChanges = profile.preferences.categories.filter((cat: any) => 
    Date.now() - cat.lastUpdated < 60 * 60 * 1000 // 1 hour
  ).length;
  
  return recentChanges;
}

async function trackProfileEvent(event: string, data: any) {
  try {
    // Track with Google Analytics
    if (process.env.GA_MEASUREMENT_ID) {
      await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: data.sessionId || data.userId || 'anonymous',
          events: [{
            name: event,
            parameters: {
              user_id: data.userId,
              confidence: data.confidence,
              changes_count: data.changesCount
            }
          }]
        })
      });
    }

    console.log(`Profile event tracked: ${event}`, data);

  } catch (error) {
    console.error('Profile event tracking failed:', error);
  }
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'early_morning';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  if (hour < 22) return 'evening';
  return 'night';
}

function getDayOfWeek(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
}

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1; // 1-12
  
  // Southern hemisphere seasons (Chile)
  if (month >= 12 || month <= 2) return 'summer';
  if (month >= 3 && month <= 5) return 'autumn';
  if (month >= 6 && month <= 8) return 'winter';
  return 'spring';
}