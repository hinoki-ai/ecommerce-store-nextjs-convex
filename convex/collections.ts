import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all active collections
export const getCollections = query({
  args: { limit: v.optional(v.number()), featured: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let query = ctx.db.query("collections").filter((q) => q.eq(q.field("isActive"), true));

    if (args.featured) {
      // Could add a featured field to collections schema later
      query = query.order("desc");
    }

    const collections = await query.order("desc").take(args.limit || 20);
    return collections;
  },
});

// Get collection by slug
export const getCollectionBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("collections")
      .withIndex("bySlug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Get holiday collections
export const getHolidayCollections = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("collections")
      .withIndex("byHoliday", (q) => q.eq("isHoliday", true))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Create AI-generated collection (for admin/SEO)
export const createCollection = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    tags: v.array(v.string()),
    products: v.array(v.id("products")),
    isHoliday: v.boolean(),
    holidayDate: v.optional(v.number()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const collectionId = await ctx.db.insert("collections", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    // Log SEO activity
    await ctx.db.insert("seoLogs", {
      action: "create_collection",
      entityId: collectionId,
      entityType: "collection",
      details: {
        name: args.name,
        tags: args.tags,
        isHoliday: args.isHoliday,
      },
      createdAt: now,
    });

    return collectionId;
  },
});

// Update collection
export const updateCollection = mutation({
  args: {
    collectionId: v.id("collections"),
    updates: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      products: v.optional(v.array(v.id("products"))),
      isActive: v.optional(v.boolean()),
      seoScore: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const { collectionId, updates } = args;

    await ctx.db.patch(collectionId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return collectionId;
  },
});