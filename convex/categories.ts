import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all active categories
export const getCategories = query({
  args: { includeInactive: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const categories = await ctx.db
      .query("categories")
      .filter((q) =>
        args.includeInactive ? true : q.eq(q.field("isActive"), true)
      )
      .order("asc")
      .collect();

    return categories;
  },
});

// Get category by slug
export const getCategoryBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("bySlug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Create new category (admin only)
export const createCategory = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    parentId: v.optional(v.id("categories")),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    sortOrder: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const categoryId = await ctx.db.insert("categories", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    return categoryId;
  },
});

// Update category
export const updateCategory = mutation({
  args: {
    categoryId: v.id("categories"),
    updates: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      icon: v.optional(v.string()),
      color: v.optional(v.string()),
      sortOrder: v.optional(v.number()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const { categoryId, updates } = args;

    await ctx.db.patch(categoryId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return categoryId;
  },
});