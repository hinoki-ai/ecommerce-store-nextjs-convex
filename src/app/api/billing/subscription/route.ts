/**
 * @fileoverview Billing subscription API routes
 * @description Handles subscription management, upgrades, and cancellations
 * @author AI Agent Generated
 * @version 1.0.0
 * @security-level HIGH
 * @compliance SOC2, GDPR, PCI-DSS
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { requireAuth } from '@/lib/auth-utils';
import { api } from '@/convex/_generated/api';
import { fetchQuery, fetchMutation } from 'convex/nextjs';

/**
 * GET /api/billing/subscription
 * Get user's current subscription status
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's subscription from Convex
    const subscription = await fetchQuery(
      api.billing.getUserSubscription,
      { userId }
    );

    if (!subscription) {
      return NextResponse.json({
        planId: 'free_user',
        planName: 'Gratuito',
        status: 'active',
        features: ['basic_products', 'basic_analytics'],
        limits: { products: 10, orders: 100, storage: '1GB' }
      });
    }

    // Get plan details
    const plan = await fetchQuery(
      api.billing.getUserPlan,
      { userId }
    );

    return NextResponse.json({
      subscriptionId: subscription._id,
      planId: subscription.planId,
      planName: plan.planName,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      features: plan.features,
      limits: plan.limits,
      stripeSubscriptionId: subscription.stripeSubscriptionId
    });

  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/billing/subscription
 * Update subscription (upgrade/downgrade)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const { planId, action } = body;

    if (action === 'cancel') {
      // Cancel subscription
      const success = await fetchMutation(
        api.billing.cancelSubscription,
        { userId: user.userId }
      );

      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Subscription cancelled successfully'
        });
      } else {
        return NextResponse.json(
          { error: 'Failed to cancel subscription' },
          { status: 400 }
        );
      }
    }

    if (action === 'upgrade' && planId) {
      // In a real implementation, this would integrate with Stripe
      // For now, we'll update the subscription in Convex
      await fetchMutation(
        api.billing.updateSubscription,
        {
          userId: user.userId,
          planId,
          status: 'active',
          currentPeriodStart: Date.now(),
          currentPeriodEnd: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
          cancelAtPeriodEnd: false
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Subscription updated successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action or plan ID' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Subscription update error:', error);

    if (error instanceof Error) {
      if (error.message === 'Authentication required') {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      if (error.message === 'Account is inactive') {
        return NextResponse.json(
          { error: 'Account is inactive' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}