import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all active products
export const getProducts = query({
  args: {
    limit: v.optional(v.number()),
    categoryId: v.optional(v.id("categories")),
    featured: v.optional(v.boolean()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("products").filter((q) => q.eq(q.field("isActive"), true));

    if (args.categoryId) {
      query = query.filter((q) => q.eq(q.field("categoryId"), args.categoryId));
    }

    if (args.featured) {
      query = query.filter((q) => q.eq(q.field("isFeatured"), true));
    }

    if (args.search) {
      const searchResults = await ctx.db
        .query("products")
        .withSearchIndex("search_products", (q) => q.search("name", args.search!))
        .take(50);
      return searchResults.slice(0, args.limit || 20);
    }

    const products = await query.order("desc").take(args.limit || 20);
    return products;
  },
});

// Get single product by slug
export const getProductBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("bySlug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Get products by category
export const getProductsByCategory = query({
  args: { categoryId: v.id("categories"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("byCategory", (q) => q.eq("categoryId", args.categoryId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(args.limit || 20);
  },
});

// Create new product (admin only)
export const createProduct = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    shortDescription: v.optional(v.string()),
    sku: v.string(),
    categoryId: v.id("categories"),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    cost: v.optional(v.number()),
    taxRate: v.number(),
    inventory: v.object({
      quantity: v.number(),
      lowStockThreshold: v.number(),
      trackInventory: v.boolean(),
      allowBackorder: v.boolean(),
    }),
    images: v.array(v.object({
      url: v.string(),
      alt: v.string(),
      sortOrder: v.number(),
    })),
    tags: v.array(v.string()),
    isActive: v.boolean(),
    isFeatured: v.boolean(),
    requiresShipping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const productId = await ctx.db.insert("products", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    // Log SEO activity
    await ctx.db.insert("seoLogs", {
      action: "create_product",
      entityId: productId,
      entityType: "product",
      createdAt: now,
    });

    return productId;
  },
});

// Update product with AI optimization
export const updateProduct = mutation({
  args: {
    productId: v.id("products"),
    updates: v.object({
      name: v.optional(v.string()),
      optimizedTitle: v.optional(v.string()),
      optimizedDescription: v.optional(v.string()),
      description: v.optional(v.string()),
      price: v.optional(v.number()),
      compareAtPrice: v.optional(v.number()),
      inventory: v.optional(v.object({
        quantity: v.number(),
        lowStockThreshold: v.number(),
        trackInventory: v.boolean(),
        allowBackorder: v.boolean(),
      })),
      images: v.optional(v.array(v.object({
        url: v.string(),
        alt: v.string(),
        sortOrder: v.number(),
      }))),
      tags: v.optional(v.array(v.string())),
      seoScore: v.optional(v.number()),
      isActive: v.optional(v.boolean()),
      isFeatured: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const { productId, updates } = args;

    await ctx.db.patch(productId, {
      ...updates,
      updatedAt: Date.now(),
    });

    // Log optimization if SEO score was updated
    if (updates.seoScore) {
      await ctx.db.insert("seoLogs", {
        action: "optimize_product",
        entityId: productId,
        entityType: "product",
        details: {
          seoScore: updates.seoScore,
          optimizedTitle: updates.optimizedTitle,
        },
        createdAt: Date.now(),
      });
    }

    return productId;
  },
});

// Get featured products
export const getFeaturedProducts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("byFeatured", (q) => q.eq("isFeatured", true))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(args.limit || 10);
  },
});

// Get popular products
export const getPopularProducts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("byPopular", (q) => q.eq("freshness.isPopular", true))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(args.limit || 10);
  },
});