/**
 * @fileoverview Billing plans API routes
 * @description Provides available billing plans and pricing information
 * @author AI Agent Generated
 * @version 1.0.0
 * @security-level MEDIUM
 * @compliance SOC2, GDPR
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

/**
 * GET /api/billing/plans
 * Get all available billing plans
 */
export async function GET(request: NextRequest) {
  try {
    // Get billing plans from Convex
    const plans = await fetchQuery(api.billing.getBillingPlans, {});

    // Enhance plans with pricing information (in production, this would come from Stripe)
    const enhancedPlans = plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      features: plan.features,
      limits: plan.limits,
      price: getPlanPricing(plan.id),
      stripePriceId: getStripePriceId(plan.id),
      popular: plan.id === 'basic_plan', // Mark basic plan as popular
      sortOrder: getPlanSortOrder(plan.id)
    }));

    // Sort plans by popularity/price
    enhancedPlans.sort((a, b) => a.sortOrder - b.sortOrder);

    return NextResponse.json({
      plans: enhancedPlans,
      currency: 'CLP',
      interval: 'month'
    });

  } catch (error) {
    console.error('Plans fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch billing plans' },
      { status: 500 }
    );
  }
}

/**
 * Get pricing information for a plan
 * In production, this would be fetched from Stripe
 */
function getPlanPricing(planId: string) {
  const pricing = {
    free_user: {
      monthly: 0,
      yearly: 0,
      currency: 'CLP'
    },
    basic_plan: {
      monthly: 25000, // CLP
      yearly: 250000, // CLP (2 months free)
      currency: 'CLP'
    },
    premium_plan: {
      monthly: 50000, // CLP
      yearly: 500000, // CLP (2 months free)
      currency: 'CLP'
    }
  };

  return pricing[planId as keyof typeof pricing] || pricing.free_user;
}

/**
 * Get Stripe price ID for a plan
 * In production, these would be real Stripe price IDs
 */
function getStripePriceId(planId: string) {
  const priceIds = {
    free_user: null,
    basic_plan: process.env.STRIPE_BASIC_PRICE_ID || 'price_basic_placeholder',
    premium_plan: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_placeholder'
  };

  return priceIds[planId as keyof typeof priceIds];
}

/**
 * Get sort order for plans (for display)
 */
function getPlanSortOrder(planId: string) {
  const sortOrder = {
    free_user: 0,
    basic_plan: 1, // Popular plan shows first
    premium_plan: 2
  };

  return sortOrder[planId as keyof typeof sortOrder] || 3;
}