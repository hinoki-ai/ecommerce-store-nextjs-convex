import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const subscribeSchema = z.object({
  subscription: z.object({
    endpoint: z.string().url(),
    expirationTime: z.number().nullable(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string()
    })
  }),
  preferences: z.object({
    orderUpdates: z.boolean().default(true),
    promotions: z.boolean().default(true),
    newArrivals: z.boolean().default(false),
    priceDrops: z.boolean().default(false),
    backInStock: z.boolean().default(false)
  }).optional(),
  userId: z.string().optional(),
  userAgent: z.string().optional(),
  timestamp: z.number()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = subscribeSchema.parse(body);

    // Extract device and session information
    const userAgent = request.headers.get('user-agent') || validatedData.userAgent || '';
    const sessionId = request.cookies.get('aramac-session-id')?.value || generateSessionId();
    const deviceInfo = extractDeviceInfo(userAgent);

    // Create subscription record
    const subscriptionData = {
      userId: validatedData.userId,
      sessionId,
      endpoint: validatedData.subscription.endpoint,
      keys: validatedData.subscription.keys,
      deviceInfo,
      preferences: validatedData.preferences || {
        orderUpdates: true,
        promotions: true,
        newArrivals: false,
        priceDrops: false,
        backInStock: false
      },
      isActive: true,
      createdAt: validatedData.timestamp,
      lastUsed: validatedData.timestamp
    };

    // TODO: Store in Convex pushSubscriptions table
    console.log('Push subscription created:', {
      endpoint: subscriptionData.endpoint,
      userId: subscriptionData.userId,
      sessionId: subscriptionData.sessionId,
      preferences: subscriptionData.preferences
    });

    // Validate the subscription by sending a welcome notification
    const welcomeNotification = {
      title: '¡Bienvenido a las notificaciones!',
      body: 'Recibirás actualizaciones importantes de tu tienda favorita.',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: {
        type: 'welcome',
        timestamp: Date.now()
      }
    };

    try {
      await sendPushNotification(subscriptionData, welcomeNotification);
    } catch (error) {
      console.warn('Welcome notification failed:', error);
      // Don't fail the subscription if welcome notification fails
    }

    // Track subscription with analytics
    await trackSubscriptionEvent('subscribe', {
      userId: validatedData.userId,
      sessionId,
      deviceType: deviceInfo.type,
      preferences: subscriptionData.preferences
    });

    return NextResponse.json({
      success: true,
      data: {
        subscriptionId: generateSubscriptionId(),
        preferences: subscriptionData.preferences,
        status: 'active',
        welcomeNotificationSent: true
      }
    });

  } catch (error) {
    console.error('Push subscription error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid subscription data',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create push subscription'
    }, { status: 500 });
  }
}

// Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const endpoint = url.searchParams.get('endpoint');
    const userId = url.searchParams.get('userId');

    if (!endpoint) {
      return NextResponse.json({
        success: false,
        error: 'Endpoint parameter is required'
      }, { status: 400 });
    }

    // TODO: Update subscription status in database
    console.log('Push subscription removed:', { endpoint, userId });

    // Track unsubscription
    await trackSubscriptionEvent('unsubscribe', {
      userId,
      endpoint,
      timestamp: Date.now()
    });

    return NextResponse.json({
      success: true,
      data: {
        status: 'unsubscribed',
        timestamp: Date.now()
      }
    });

  } catch (error) {
    console.error('Push unsubscription error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to unsubscribe from push notifications'
    }, { status: 500 });
  }
}

// Helper functions
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

function generateSubscriptionId(): string {
  return `sub_${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

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

async function sendPushNotification(subscription: any, notification: any) {
  const webpush = await import('web-push');
  
  // Configure web-push (these should be set in environment variables)
  webpush.setVapidDetails(
    'mailto:support@aramac-store.cl',
    process.env.VAPID_PUBLIC_KEY || '',
    process.env.VAPID_PRIVATE_KEY || ''
  );

  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: subscription.keys
  };

  try {
    const result = await webpush.sendNotification(
      pushSubscription,
      JSON.stringify(notification),
      {
        TTL: 24 * 60 * 60, // 24 hours
        urgency: 'normal',
        headers: {
          'Topic': notification.data?.type || 'general'
        }
      }
    );

    console.log('Push notification sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Push notification failed:', error);
    throw error;
  }
}

async function trackSubscriptionEvent(event: string, data: any) {
  try {
    // Track with Google Analytics
    if (process.env.GA_MEASUREMENT_ID) {
      await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: data.sessionId || data.userId || 'anonymous',
          events: [{
            name: `notification_${event}`,
            parameters: {
              device_type: data.deviceType,
              user_id: data.userId,
              ...(data.preferences && { preferences: JSON.stringify(data.preferences) })
            }
          }]
        })
      });
    }

    // Track with internal analytics
    console.log(`Subscription event tracked: ${event}`, data);

  } catch (error) {
    console.error('Subscription event tracking failed:', error);
  }
}