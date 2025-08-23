/**
 * Advanced Ecommerce Calendar Backend
 * Convex implementation with SEO optimization and ecommerce features
 */

import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// Ecommerce-specific event categories
const ecommerceCategories = [
  "PROMOTION",
  "SALE",
  "PRODUCT_LAUNCH",
  "INVENTORY",
  "SHIPPING",
  "CUSTOMER_SERVICE",
  "MAINTENANCE",
  "HOLIDAY",
  "TRAINING",
  "MARKETING",
  "SEO_UPDATE",
  "CONTENT",
  "TECHNOLOGY",
  "SECURITY",
  "COMPLIANCE",
  "OPERATIONS",
  "WEATHER",
  "COMMUNITY"
] as const;

// Get calendar events with ecommerce filtering
export const getEvents = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    categories: v.optional(v.array(v.string())),
    priority: v.optional(
      v.union(
        v.literal("LOW"),
        v.literal("MEDIUM"),
        v.literal("HIGH"),
        v.literal("CRITICAL")
      )
    ),
    status: v.optional(
      v.union(
        v.literal("DRAFT"),
        v.literal("SCHEDULED"),
        v.literal("ACTIVE"),
        v.literal("COMPLETED"),
        v.literal("CANCELLED"),
        v.literal("POSTPONED")
      )
    ),
    productIds: v.optional(v.array(v.string())),
    collectionIds: v.optional(v.array(v.string())),
    isPublic: v.optional(v.boolean()),
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const {
      startDate,
      endDate,
      categories,
      priority,
      status,
      productIds,
      collectionIds,
      isPublic,
      search,
      limit = 1000,
    } = args;

    let query = ctx.db.query("calendarEvents");

    // Date range filter
    if (startDate) {
      query = query.filter((q) => q.gte(q.field("startDate"), startDate));
    }
    if (endDate) {
      query = query.filter((q) => q.lte(q.field("endDate"), endDate));
    }

    // Category filter
    if (categories && categories.length > 0) {
      query = query.filter((q) =>
        q.or(
          ...categories.map((category) => q.eq(q.field("category"), category))
        )
      );
    }

    // Priority filter
    if (priority) {
      query = query.filter((q) => q.eq(q.field("priority"), priority));
    }

    // Status filter
    if (status) {
      query = query.filter((q) => q.eq(q.field("status"), status));
    }

    // Public filter for SEO
    if (isPublic !== undefined) {
      query = query.filter((q) => q.eq(q.field("isPublic"), isPublic));
    }

    // Product filter
    if (productIds && productIds.length > 0) {
      query = query.filter((q) =>
        q.or(
          ...productIds.map((productId) =>
            q.arrayContains(q.field("productIds"), productId)
          )
        )
      );
    }

    // Collection filter
    if (collectionIds && collectionIds.length > 0) {
      query = query.filter((q) =>
        q.or(
          ...collectionIds.map((collectionId) =>
            q.arrayContains(q.field("collectionIds"), collectionId)
          )
        )
      );
    }

    let events = await query.order("asc").take(limit);

    // Search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      events = events.filter(
        (event) =>
          event.title?.toLowerCase().includes(searchTerm) ||
          event.description?.toLowerCase().includes(searchTerm) ||
          event.shortDescription?.toLowerCase().includes(searchTerm) ||
          event.location?.toLowerCase().includes(searchTerm)
      );
    }

    return events;
  },
});

// Get upcoming events for homepage widgets
export const getUpcomingEvents = query({
  args: {
    limit: v.optional(v.number()),
    publicOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { limit = 5, publicOnly = true } = args;
    const now = Date.now();

    let query = ctx.db
      .query("calendarEvents")
      .filter((q) => q.gte(q.field("startDate"), now))
      .order("asc")
      .take(limit);

    if (publicOnly) {
      query = ctx.db
        .query("calendarEvents")
        .filter((q) => q.gte(q.field("startDate"), now))
        .filter((q) => q.eq(q.field("isPublic"), true))
        .order("asc")
        .take(limit);
    }

    return await query.collect();
  },
});

// Get active promotions for homepage
export const getActivePromotions = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    return await ctx.db
      .query("calendarEvents")
      .filter((q) => q.gte(q.field("startDate"), now))
      .filter((q) => q.lte(q.field("endDate"), now))
      .filter((q) =>
        q.or(
          q.eq(q.field("category"), "PROMOTION"),
          q.eq(q.field("category"), "SALE")
        )
      )
      .filter((q) => q.eq(q.field("isPublic"), true))
      .filter((q) => q.eq(q.field("status"), "ACTIVE"))
      .order("asc")
      .collect();
  },
});

// Get events related to specific product
export const getProductEvents = query({
  args: {
    productId: v.string(),
    includePast: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { productId, includePast = false } = args;
    const now = Date.now();

    let query = ctx.db
      .query("calendarEvents")
      .filter((q) => q.arrayContains(q.field("productIds"), productId));

    if (!includePast) {
      query = query.filter((q) => q.gte(q.field("endDate"), now));
    }

    return await query.order("asc").collect();
  },
});

// Create new calendar event
export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    category: v.union(...ecommerceCategories.map(cat => v.literal(cat))),
    priority: v.optional(
      v.union(
        v.literal("LOW"),
        v.literal("MEDIUM"),
        v.literal("HIGH"),
        v.literal("CRITICAL")
      )
    ),
    location: v.optional(v.string()),
    productIds: v.optional(v.array(v.string())),
    collectionIds: v.optional(v.array(v.string())),
    isAllDay: v.optional(v.boolean()),
    isPublic: v.optional(v.boolean()),
    status: v.optional(
      v.union(
        v.literal("DRAFT"),
        v.literal("SCHEDULED"),
        v.literal("ACTIVE"),
        v.literal("COMPLETED"),
        v.literal("CANCELLED"),
        v.literal("POSTPONED")
      )
    ),
    metadata: v.optional(v.object({})),
    seo: v.optional(v.object({
      metaTitle: v.optional(v.string()),
      metaDescription: v.optional(v.string()),
      keywords: v.optional(v.array(v.string())),
      canonicalUrl: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { auth } = ctx;
    const identity = await auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const now = Date.now();

    // Generate SEO-optimized data if not provided
    const seoOptimized = {
      ...args.seo,
      metaTitle: args.seo?.metaTitle || args.title,
      metaDescription: args.seo?.metaDescription || args.shortDescription || args.description,
      keywords: args.seo?.keywords || [args.category.toLowerCase(), "evento"],
    };

    const eventId = await ctx.db.insert("calendarEvents", {
      ...args,
      seo: seoOptimized,
      createdBy: identity.tokenIdentifier as Id<"users">,
      createdAt: now,
      updatedAt: now,
      source: "DATABASE",
      version: 1,
      isPublic: args.isPublic !== false, // Default to public for SEO
      status: args.status || "DRAFT",
    });

    return eventId;
  },
});

// Update calendar event
export const updateEvent = mutation({
  args: {
    id: v.id("calendarEvents"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    category: v.optional(v.union(...ecommerceCategories.map(cat => v.literal(cat)))),
    priority: v.optional(
      v.union(
        v.literal("LOW"),
        v.literal("MEDIUM"),
        v.literal("HIGH"),
        v.literal("CRITICAL")
      )
    ),
    location: v.optional(v.string()),
    productIds: v.optional(v.array(v.string())),
    collectionIds: v.optional(v.array(v.string())),
    isAllDay: v.optional(v.boolean()),
    isPublic: v.optional(v.boolean()),
    status: v.optional(
      v.union(
        v.literal("DRAFT"),
        v.literal("SCHEDULED"),
        v.literal("ACTIVE"),
        v.literal("COMPLETED"),
        v.literal("CANCELLED"),
        v.literal("POSTPONED")
      )
    ),
    metadata: v.optional(v.object({})),
    seo: v.optional(v.object({
      metaTitle: v.optional(v.string()),
      metaDescription: v.optional(v.string()),
      keywords: v.optional(v.array(v.string())),
      canonicalUrl: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { auth } = ctx;
    const identity = await auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const { id, ...updates } = args;
    const existingEvent = await ctx.db.get(id);

    if (!existingEvent) {
      throw new Error("Event not found");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
      version: (existingEvent.version || 1) + 1,
    });

    return id;
  },
});

// Get calendar statistics for dashboard
export const getStatistics = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { startDate, endDate } = args;

    let query = ctx.db.query("calendarEvents");

    if (startDate) {
      query = query.filter((q) => q.gte(q.field("startDate"), startDate));
    }
    if (endDate) {
      query = query.filter((q) => q.lte(q.field("endDate"), endDate));
    }

    const events = await query.collect();

    const now = Date.now();
    const upcomingEvents = events.filter(e => e.startDate > now);
    const activePromotions = events.filter(e =>
      (e.category === "PROMOTION" || e.category === "SALE") &&
      e.status === "ACTIVE" &&
      e.startDate <= now &&
      e.endDate >= now
    );

    const totalDuration = events.reduce((sum, event) => {
      return sum + (event.endDate - event.startDate);
    }, 0);

    const avgEventDuration = events.length > 0 ? totalDuration / events.length : 0;

    return {
      totalEvents: events.length,
      eventsByCategory: events.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      eventsByStatus: events.reduce((acc, event) => {
        acc[event.status || "SCHEDULED"] = (acc[event.status || "SCHEDULED"] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      eventsByPriority: events.reduce((acc, event) => {
        acc[event.priority || "MEDIUM"] = (acc[event.priority || "MEDIUM"] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      upcomingEvents: upcomingEvents.length,
      activePromotions: activePromotions.length,
      completedEvents: events.filter(e => e.status === "COMPLETED").length,
      avgEventDuration: Math.round(avgEventDuration / (1000 * 60)), // in minutes
    };
  },
});

// Get events for sitemap generation
export const getPublicEventsForSEO = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const oneYearFromNow = now + (365 * 24 * 60 * 60 * 1000);

    return await ctx.db
      .query("calendarEvents")
      .filter((q) => q.eq(q.field("isPublic"), true))
      .filter((q) => q.lte(q.field("startDate"), oneYearFromNow))
      .filter((q) => q.gte(q.field("endDate"), now - (30 * 24 * 60 * 60 * 1000))) // Include recent past events
      .order("asc")
      .collect();
  },
});

// Real-time subscription for calendar updates
export const subscribeToEvents = query({
  args: {
    categories: v.optional(v.array(v.string())),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { categories, isPublic } = args;

    let query = ctx.db.query("calendarEvents");

    if (categories && categories.length > 0) {
      query = query.filter((q) =>
        q.or(
          ...categories.map((category) => q.eq(q.field("category"), category))
        )
      );
    }

    if (isPublic !== undefined) {
      query = query.filter((q) => q.eq(q.field("isPublic"), isPublic));
    }

    return await query.order("asc").collect();
  },
});

// Bulk operations for event management
export const bulkUpdateEvents = mutation({
  args: {
    eventIds: v.array(v.id("calendarEvents")),
    updates: v.object({
      status: v.optional(
        v.union(
          v.literal("DRAFT"),
          v.literal("SCHEDULED"),
          v.literal("ACTIVE"),
          v.literal("COMPLETED"),
          v.literal("CANCELLED"),
          v.literal("POSTPONED")
        )
      ),
      isPublic: v.optional(v.boolean()),
      priority: v.optional(
        v.union(
          v.literal("LOW"),
          v.literal("MEDIUM"),
          v.literal("HIGH"),
          v.literal("CRITICAL")
        )
      ),
    }),
  },
  handler: async (ctx, args) => {
    const { auth } = ctx;
    const identity = await auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const { eventIds, updates } = args;
    const updatedIds: Id<"calendarEvents">[] = [];
    const errors: string[] = [];

    for (const eventId of eventIds) {
      try {
        const existingEvent = await ctx.db.get(eventId);
        if (!existingEvent) {
          errors.push(`Event ${eventId} not found`);
          continue;
        }

        await ctx.db.patch(eventId, {
          ...updates,
          updatedAt: Date.now(),
          version: (existingEvent.version || 1) + 1,
        });

        updatedIds.push(eventId);
      } catch (error) {
        errors.push(`Failed to update event ${eventId}: ${error}`);
      }
    }

    return {
      updatedIds,
      errors,
      success: updatedIds.length,
      failed: errors.length,
    };
  },
});

// Delete event
export const deleteEvent = mutation({
  args: { id: v.id("calendarEvents") },
  handler: async (ctx, args) => {
    const { auth } = ctx;
    const identity = await auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existingEvent = await ctx.db.get(args.id);
    if (!existingEvent) {
      throw new Error("Event not found");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});