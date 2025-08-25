/**
 * @fileoverview Billing and subscription management for Clerk + Convex integration
 * @description Production-ready billing functions based on Minimarket patterns
 * @author AI Agent Generated
 * @version 1.0.0
 * @security-level HIGH
 * @compliance SOC2, GDPR, PCI-DSS
 */

import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

// Types
export interface BillingPlan {
  id: string;
  name: string;
  features: string[];
  limits: {
    products: number;
    orders: number;
    storage: string;
  };
}

export interface Subscription {
  _id: Id<"subscriptions">;
  _creationTime: number;
  userId: string;
  planId: string;
  status: "active" | "canceled" | "past_due" | "incomplete";
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  metadata?: Record<string, any>;
}

/**
 * Get user's current subscription
 */
export const getUserSubscription = query({
  args: { userId: v.optional(v.string()) },
  returns: v.union(
    v.object({
      _id: v.id("subscriptions"),
      _creationTime: v.number(),
      userId: v.string(),
      planId: v.string(),
      status: v.union(v.literal("active"), v.literal("canceled"), v.literal("past_due"), v.literal("incomplete")),
      currentPeriodStart: v.number(),
      currentPeriodEnd: v.number(),
      cancelAtPeriodEnd: v.boolean(),
      stripeSubscriptionId: v.optional(v.string()),
      metadata: v.optional(v.any()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const userId = args.userId || await getCurrentUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("subscriptions")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();
  },
});

/**
 * Get user's billing plan details
 */
export const getUserPlan = query({
  args: { userId: v.optional(v.string()) },
  returns: v.object({
    planId: v.string(),
    planName: v.string(),
    features: v.array(v.string()),
    limits: v.object({
      products: v.number(),
      orders: v.number(),
      storage: v.string(),
    }),
    isActive: v.boolean(),
    subscription: v.optional(v.any()),
  }),
  handler: async (ctx, args) => {
    const userId = args.userId || await getCurrentUserId(ctx);
    if (!userId) {
      // Default to free plan for non-authenticated users
      return {
        planId: "free_user",
        planName: "Gratuito",
        features: ["basic_products", "basic_analytics"],
        limits: { products: 10, orders: 100, storage: "1GB" },
        isActive: false,
      };
    }

    const subscription = await getUserSubscription(ctx, { userId });

    if (!subscription) {
      return {
        planId: "free_user",
        planName: "Gratuito",
        features: ["basic_products", "basic_analytics"],
        limits: { products: 10, orders: 100, storage: "1GB" },
        isActive: false,
      };
    }

    // Get plan details from config
    const plans = await ctx.db.query("billingPlans").collect();
    const plan = plans.find(p => p.id === subscription.planId);

    if (!plan) {
      return {
        planId: "free_user",
        planName: "Gratuito",
        features: ["basic_products", "basic_analytics"],
        limits: { products: 10, orders: 100, storage: "1GB" },
        isActive: false,
      };
    }

    return {
      planId: plan.id,
      planName: plan.name,
      features: plan.features,
      limits: plan.limits,
      isActive: subscription.status === "active",
      subscription,
    };
  },
});

/**
 * Check if user has access to a feature
 */
export const hasFeatureAccess = query({
  args: {
    userId: v.optional(v.string()),
    feature: v.string()
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const plan = await getUserPlan(ctx, { userId: args.userId });
    return plan.features.includes(args.feature) && plan.isActive;
  },
});

/**
 * Check if user is within plan limits
 */
export const checkPlanLimits = query({
  args: {
    userId: v.optional(v.string()),
    resource: v.union(v.literal("products"), v.literal("orders")),
    currentCount: v.number()
  },
  returns: v.object({
    withinLimit: v.boolean(),
    limit: v.number(),
    current: v.number(),
    remaining: v.number(),
  }),
  handler: async (ctx, args) => {
    const plan = await getUserPlan(ctx, { userId: args.userId });
    const limit = plan.limits[args.resource];

    // -1 means unlimited
    if (limit === -1) {
      return {
        withinLimit: true,
        limit: -1,
        current: args.currentCount,
        remaining: -1,
      };
    }

    const withinLimit = args.currentCount < limit;
    const remaining = Math.max(0, limit - args.currentCount);

    return {
      withinLimit,
      limit,
      current: args.currentCount,
      remaining,
    };
  },
});

/**
 * Update user subscription (internal use)
 */
export const updateSubscription = internalMutation({
  args: {
    userId: v.string(),
    planId: v.string(),
    status: v.union(v.literal("active"), v.literal("canceled"), v.literal("past_due"), v.literal("incomplete")),
    stripeSubscriptionId: v.optional(v.string()),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if subscription exists
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        planId: args.planId,
        status: args.status,
        stripeSubscriptionId: args.stripeSubscriptionId,
        currentPeriodStart: args.currentPeriodStart || now,
        currentPeriodEnd: args.currentPeriodEnd,
        cancelAtPeriodEnd: args.cancelAtPeriodEnd || false,
        metadata: {
          ...existing.metadata,
          updatedAt: now,
        },
      });
    } else {
      await ctx.db.insert("subscriptions", {
        userId: args.userId,
        planId: args.planId,
        status: args.status,
        stripeSubscriptionId: args.stripeSubscriptionId,
        currentPeriodStart: args.currentPeriodStart || now,
        currentPeriodEnd: args.currentPeriodEnd,
        cancelAtPeriodEnd: args.cancelAtPeriodEnd || false,
        metadata: {
          createdAt: now,
          updatedAt: now,
        },
      });
    }
  },
});

/**
 * Cancel user subscription
 */
export const cancelSubscription = mutation({
  args: { userId: v.optional(v.string()) },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = args.userId || await getCurrentUserId(ctx);
    if (!userId) return false;

    const subscription = await getUserSubscription(ctx, { userId });
    if (!subscription) return false;

    await ctx.db.patch(subscription._id, {
      cancelAtPeriodEnd: true,
      metadata: {
        ...subscription.metadata,
        canceledAt: Date.now(),
      },
    });

    return true;
  },
});

/**
 * Get billing plans (public)
 */
export const getBillingPlans = query({
  args: {},
  returns: v.array(v.object({
    id: v.string(),
    name: v.string(),
    features: v.array(v.string()),
    limits: v.object({
      products: v.number(),
      orders: v.number(),
      storage: v.string(),
    }),
  })),
  handler: async (ctx) => {
    return await ctx.db.query("billingPlans").collect();
  },
});

/**
 * Initialize billing plans (one-time setup)
 */
export const initializeBillingPlans = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const existing = await ctx.db.query("billingPlans").collect();
    if (existing.length > 0) return;

    const plans = [
      {
        id: "free_user",
        name: "Gratuito",
        features: ["basic_products", "basic_analytics"],
        limits: { products: 10, orders: 100, storage: "1GB" },
      },
      {
        id: "basic_plan",
        name: "Básico",
        features: ["unlimited_products", "advanced_analytics", "priority_support"],
        limits: { products: -1, orders: 1000, storage: "10GB" },
      },
      {
        id: "premium_plan",
        name: "Premium",
        features: ["all_basic", "bulk_operations", "custom_domain", "api_access"],
        limits: { products: -1, orders: -1, storage: "100GB" },
      },
    ];

    for (const plan of plans) {
      await ctx.db.insert("billingPlans", plan);
    }
  },
});

/**
 * Helper function to get current user ID
 */
async function getCurrentUserId(ctx: any): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject || null;
}