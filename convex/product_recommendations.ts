import { query } from "./_generated/server";
import { v } from "convex/values";

// Get products similar to a given product (same category, tags, etc.)
export const getSimilarProducts = query({
  args: {
    productId: v.id("products"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) return [];

    const limit = args.limit || 8;

    // Get products from same category
    const sameCategoryProducts = await ctx.db
      .query("products")
      .withIndex("byCategory", (q) => q.eq("categoryId", product.categoryId))
      .filter((q) => q.and(
        q.eq(q.field("isActive"), true),
        q.neq(q.field("_id"), args.productId)
      ))
      .order("desc")
      .take(limit * 2); // Get more to filter by tags

    // Get products with similar tags
    const tagMatches = await ctx.db
      .query("products")
      .filter((q) => q.and(
        q.eq(q.field("isActive"), true),
        q.neq(q.field("_id"), args.productId),
        q.neq(q.field("categoryId"), product.categoryId) // Different category to diversify
      ))
      .collect();

    // Score products based on tag similarity
    const scoredProducts = tagMatches.map(p => {
      const commonTags = product.tags.filter(tag => p.tags.includes(tag));
      const score = commonTags.length / Math.max(product.tags.length, p.tags.length);
      return { ...p, score };
    }).filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score);

    // Combine and deduplicate
    const allCandidates = [
      ...sameCategoryProducts,
      ...scoredProducts.slice(0, limit)
    ];

    // Remove duplicates and limit
    const uniqueProducts = allCandidates.filter((product, index, self) =>
      index === self.findIndex(p => p._id === product._id)
    );

    return uniqueProducts.slice(0, limit);
  },
});

// Get popular products (high ratings, many reviews)
export const getPopularProducts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    // Get products with high ratings and many reviews
    const products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(100); // Get more to analyze

    // Get review stats for each product
    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const reviews = await ctx.db
          .query("reviews")
          .withIndex("byProduct", (q) => q.eq("productId", product._id))
          .filter((q) => q.eq(q.field("isApproved"), true))
          .collect();

        const avgRating = reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

        const score = (avgRating * 0.7) + (Math.log(reviews.length + 1) * 0.3);

        return { ...product, avgRating, reviewCount: reviews.length, score };
      })
    );

    return productsWithStats
      .filter(p => p.reviewCount > 0 || p.freshness?.isPopular)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },
});

// Get products that are frequently bought together
export const getFrequentlyBoughtTogether = query({
  args: {
    productId: v.id("products"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 4;

    // Get orders that contain this product
    const ordersWithProduct = await ctx.db
      .query("orders")
      .filter((q) => q.neq(q.field("items"), undefined))
      .collect();

    const productOrders = ordersWithProduct.filter(order =>
      order.items.some((item: { productId: string }) => item.productId === args.productId)
    );

    // Count co-occurring products
    const coOccurrences: Record<string, number> = {};

    productOrders.forEach(order => {
      order.items.forEach((item: { productId: string }) => {
        if (item.productId !== args.productId) {
          coOccurrences[item.productId] = (coOccurrences[item.productId] || 0) + 1;
        }
      });
    });

    // Get the most co-occurring products
    const coProductIds = Object.entries(coOccurrences)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit * 2)
      .map(([id]) => id);

    // Fetch the actual products
    const coProducts = await Promise.all(
      coProductIds.map(id => ctx.db.get(id))
    );

    return coProducts
      .filter(p => p && p.isActive)
      .slice(0, limit);
  },
});

// Get recently viewed products (placeholder - would need session tracking)
export const getRecentlyViewed = query({
  args: {
    excludeProductId: v.optional(v.id("products")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 8;

    return await ctx.db
      .query("products")
      .filter((q) => q.and(
        q.eq(q.field("isActive"), true),
        args.excludeProductId ? q.neq(q.field("_id"), args.excludeProductId) : true
      ))
      .order("desc")
      .take(limit);
  },
});

// Get products with similar price range
export const getSimilarPriceProducts = query({
  args: {
    productId: v.id("products"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) return [];

    const limit = args.limit || 6;
    const priceRange = 0.3; // 30% price range

    const minPrice = product.price * (1 - priceRange);
    const maxPrice = product.price * (1 + priceRange);

    return await ctx.db
      .query("products")
      .withIndex("byPrice", (q) => q.gte("price", minPrice))
      .filter((q) => q.and(
        q.eq(q.field("isActive"), true),
        q.neq(q.field("_id"), args.productId),
        q.lte(q.field("price"), maxPrice)
      ))
      .order("desc")
      .take(limit);
  },
});