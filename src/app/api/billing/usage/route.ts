/**
 * @fileoverview Billing usage API routes
 * @description Tracks and validates resource usage against plan limits
 * @author AI Agent Generated
 * @version 1.0.0
 * @security-level HIGH
 * @compliance SOC2, GDPR
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { requireAuth } from '@/lib/auth-utils';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

/**
 * GET /api/billing/usage
 * Get user's current resource usage and limits
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

    // Get user's plan and limits
    const plan = await fetchQuery(
      api.billing.getUserPlan,
      { userId }
    );

    // In a real implementation, you would query actual usage
    // For now, we'll return mock usage data
    const usage = await getMockUsage(userId, plan);

    return NextResponse.json({
      plan: {
        id: plan.planId,
        name: plan.planName,
        limits: plan.limits
      },
      usage: {
        products: usage.products,
        orders: usage.orders,
        storage: usage.storage,
        api_calls: usage.api_calls
      },
      limits: {
        products: {
          used: usage.products.current,
          limit: plan.limits.products,
          remaining: calculateRemaining(plan.limits.products, usage.products.current),
          percentage: calculatePercentage(plan.limits.products, usage.products.current)
        },
        orders: {
          used: usage.orders.current,
          limit: plan.limits.orders,
          remaining: calculateRemaining(plan.limits.orders, usage.orders.current),
          percentage: calculatePercentage(plan.limits.orders, usage.orders.current)
        }
      },
      period: {
        start: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
        end: Date.now()
      }
    });

  } catch (error) {
    console.error('Usage fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/billing/usage
 * Check if user can perform an action based on their plan limits
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const { resource, action = 'check' } = body;

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource type required' },
        { status: 400 }
      );
    }

    // Get user's current usage and limits
    const plan = await fetchQuery(
      api.billing.getUserPlan,
      { userId: user.userId }
    );

    const usage = await getMockUsage(user.userId, plan);
    const currentUsage = usage[resource as keyof typeof usage];

    if (!currentUsage) {
      return NextResponse.json(
        { error: 'Invalid resource type' },
        { status: 400 }
      );
    }

    const limit = plan.limits[resource as keyof typeof plan.limits];
    const canProceed = canPerformAction(limit, currentUsage.current, action);

    return NextResponse.json({
      resource,
      canProceed,
      currentUsage: currentUsage.current,
      limit,
      remaining: calculateRemaining(limit, currentUsage.current),
      upgradeRequired: !canProceed
    });

  } catch (error) {
    console.error('Usage check error:', error);

    if (error instanceof Error) {
      if (error.message === 'Authentication required') {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to check usage limits' },
      { status: 500 }
    );
  }
}

/**
 * Mock usage data - replace with real queries in production
 */
async function getMockUsage(userId: string, plan: any) {
  // In production, query actual usage from database
  // For now, return mock data based on plan
  const baseUsage = {
    products: { current: 5, period: 30 },
    orders: { current: 25, period: 30 },
    storage: { current: 0.5, period: 30 }, // GB
    api_calls: { current: 1500, period: 30 }
  };

  // Adjust based on plan
  if (plan.planId === 'premium_plan') {
    baseUsage.products.current = 150;
    baseUsage.orders.current = 500;
    baseUsage.api_calls.current = 15000;
  } else if (plan.planId === 'basic_plan') {
    baseUsage.products.current = 50;
    baseUsage.orders.current = 100;
    baseUsage.api_calls.current = 5000;
  }

  return baseUsage;
}

/**
 * Calculate remaining usage
 */
function calculateRemaining(limit: number, current: number): number {
  if (limit === -1) return -1; // Unlimited
  return Math.max(0, limit - current);
}

/**
 * Calculate usage percentage
 */
function calculatePercentage(limit: number, current: number): number {
  if (limit === -1) return 0; // Unlimited
  if (limit === 0) return 100;
  return Math.min(100, Math.round((current / limit) * 100));
}

/**
 * Check if user can perform an action
 */
function canPerformAction(limit: number, current: number, action: string): boolean {
  if (limit === -1) return true; // Unlimited plan

  const remaining = calculateRemaining(limit, current);

  switch (action) {
    case 'create':
      return remaining > 0;
    case 'check':
      return remaining >= 0;
    case 'warning':
      return remaining <= 5; // Warn when approaching limit
    default:
      return remaining >= 0;
  }
}