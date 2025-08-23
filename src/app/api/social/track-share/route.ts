import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const trackShareSchema = z.object({
  entityId: z.string().min(1),
  entityType: z.enum(['product', 'collection', 'blog', 'wishlist', 'review']),
  platform: z.enum(['facebook', 'twitter', 'instagram', 'whatsapp', 'telegram', 'email']),
  shareType: z.enum(['direct_share', 'wishlist_share', 'review_share']),
  userId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.number()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = trackShareSchema.parse(body);

    // Get user information from headers if available
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Extract additional context
    const deviceInfo = extractDeviceInfo(userAgent);
    const sessionId = request.cookies.get('aramac-session-id')?.value || generateSessionId();

    // Create share tracking record
    const shareData = {
      ...validatedData,
      sessionId,
      deviceInfo,
      userAgent,
      referer,
      ip: ip.split(',')[0].trim(), // Take first IP if multiple
      timestamp: validatedData.createdAt
    };

    // Store in Convex socialShares table - implementation pending
    // For now, we'll just log and return success
    console.log('Social share tracked:', shareData);

    // Track with external analytics if configured
    await trackExternalAnalytics(shareData);

    // Update share statistics
    await updateShareStatistics(validatedData);

    // Generate sharing insights for later use
    const insights = await generateSharingInsights(validatedData);

    return NextResponse.json({
      success: true,
      data: {
        shareId: generateShareId(),
        tracked: true,
        timestamp: validatedData.createdAt,
        insights: {
          popularPlatform: insights.popularPlatform,
          engagementScore: insights.engagementScore,
          virality: insights.viralityScore
        }
      }
    });

  } catch (error) {
    console.error('Share tracking error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid share tracking data',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to track social share'
    }, { status: 500 });
  }
}

// Helper functions
function extractDeviceInfo(userAgent: string) {
  let deviceType: 'mobile' | 'desktop' | 'tablet' = 'desktop';
  let os: string | undefined;
  let browser: string | undefined;

  // Detect device type
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    deviceType = /iPad/i.test(userAgent) ? 'tablet' : 'mobile';
  }

  // Detect OS
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS')) os = 'iOS';

  // Detect browser
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';

  return { type: deviceType, os, browser };
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

function generateShareId(): string {
  return `share_${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

async function trackExternalAnalytics(shareData: any) {
  try {
    // Google Analytics 4 tracking
    if (process.env.GA_MEASUREMENT_ID) {
      await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: shareData.sessionId,
          events: [{
            name: 'share',
            parameters: {
              method: shareData.platform,
              content_type: shareData.entityType,
              content_id: shareData.entityId,
              share_type: shareData.shareType
            }
          }]
        })
      });
    }

    // Facebook Pixel tracking
    if (process.env.FACEBOOK_PIXEL_ID) {
      // Implementation would depend on Facebook Conversions API
      console.log('Facebook Pixel tracking would be implemented here');
    }

    // Custom analytics endpoint
    if (process.env.CUSTOM_ANALYTICS_ENDPOINT) {
      await fetch(process.env.CUSTOM_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'social_share',
          data: shareData
        })
      });
    }
  } catch (error) {
    console.error('External analytics tracking failed:', error);
    // Don't throw error to avoid failing the main request
  }
}

async function updateShareStatistics(shareData: any) {
  try {
    // Update statistics in database - implementation pending
    // This would increment counters for:
    // - Total shares per entity
    // - Shares per platform
    // - Daily/weekly/monthly share counts
    // - User sharing patterns
    
    console.log('Updating share statistics for:', {
      entityId: shareData.entityId,
      entityType: shareData.entityType,
      platform: shareData.platform
    });

    // Mock implementation - in real app, this would be database operations
    const stats = {
      totalShares: 1,
      platformShares: { [shareData.platform]: 1 },
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay()
    };

    return stats;
  } catch (error) {
    console.error('Statistics update failed:', error);
  }
}

async function generateSharingInsights(shareData: any) {
  try {
    // Generate insights based on sharing patterns
    // This would analyze historical data to provide insights
    
    const insights = {
      popularPlatform: getPopularPlatform(shareData.entityType),
      engagementScore: calculateEngagementScore(shareData),
      viralityScore: calculateViralityScore(shareData),
      recommendedTiming: getRecommendedShareTiming(),
      audience: getTargetAudience(shareData.platform)
    };

    return insights;
  } catch (error) {
    console.error('Insights generation failed:', error);
    return {
      popularPlatform: 'whatsapp', // Default for Chilean market
      engagementScore: 0.5,
      viralityScore: 0.3
    };
  }
}

// Mock insight generation functions
function getPopularPlatform(entityType: string): string {
  // Based on Chilean market research
  const popularityByType = {
    product: 'whatsapp',
    collection: 'instagram',
    blog: 'facebook',
    wishlist: 'whatsapp',
    review: 'facebook'
  };
  
  return popularityByType[entityType as keyof typeof popularityByType] || 'whatsapp';
}

function calculateEngagementScore(shareData: any): number {
  // Mock engagement calculation based on platform and time
  const platformScores = {
    whatsapp: 0.8,
    instagram: 0.7,
    facebook: 0.6,
    twitter: 0.5,
    telegram: 0.4,
    email: 0.3
  };
  
  const baseScore = platformScores[shareData.platform as keyof typeof platformScores] || 0.5;
  const timeBonus = getTimeOfDayBonus();
  
  return Math.min(1.0, baseScore + timeBonus);
}

function calculateViralityScore(shareData: any): number {
  // Mock virality calculation
  const viralityByPlatform = {
    whatsapp: 0.9, // High virality in Chile
    instagram: 0.6,
    facebook: 0.5,
    twitter: 0.4,
    telegram: 0.3,
    email: 0.2
  };
  
  return viralityByPlatform[shareData.platform as keyof typeof viralityByPlatform] || 0.3;
}

function getTimeOfDayBonus(): number {
  const hour = new Date().getHours();
  
  // Peak sharing times in Chile (UTC-3)
  if (hour >= 19 && hour <= 22) return 0.2; // Evening peak
  if (hour >= 12 && hour <= 14) return 0.1; // Lunch peak
  if (hour >= 20 && hour <= 21) return 0.15; // Prime time
  
  return 0;
}

function getRecommendedShareTiming(): string {
  const hour = new Date().getHours();
  const day = new Date().getDay();
  
  // Chilean market insights
  if (day >= 1 && day <= 5) { // Weekdays
    if (hour >= 19 && hour <= 21) return 'optimal';
    if (hour >= 12 && hour <= 14) return 'good';
  } else { // Weekends
    if (hour >= 10 && hour <= 12) return 'optimal';
    if (hour >= 15 && hour <= 18) return 'good';
  }
  
  return 'average';
}

function getTargetAudience(platform: string): string {
  const audienceByPlatform = {
    whatsapp: 'broad_chilean',
    instagram: 'young_urban',
    facebook: 'middle_aged_family',
    twitter: 'professional_urban',
    telegram: 'tech_savvy',
    email: 'professional_contacts'
  };
  
  return audienceByPlatform[platform as keyof typeof audienceByPlatform] || 'general';
}