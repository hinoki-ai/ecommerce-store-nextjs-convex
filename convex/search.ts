/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-expect-error Convex generated files not available
import { query } from "./_generated/server";
import { v } from "convex/values";

type QueryCtx = any;

// Get search suggestions for products and categories
export const getSearchSuggestions = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx: QueryCtx, args: { query: string; limit?: number }) => {
    const limit = args.limit || 6
    const suggestions: Array<{
      _id: string
      name: string
      slug: string
      description?: string
      price?: number
      images: Array<{ url: string; alt: string }>
      categoryName?: string
      type: 'product' | 'category'
    }> = []

    // Search products if query is not empty
    if (args.query.trim()) {
      const products = await ctx.db
        .query("products")
        .filter((q: any) => q.eq("isActive", true))
        .collect()

      // Filter products by name match
      const matchingProducts = products
        .filter((product: any) =>
          product.name.toLowerCase().includes(args.query.toLowerCase()) ||
          product.tags.some((tag: string) => tag.toLowerCase().includes(args.query.toLowerCase()))
        )
        .slice(0, Math.floor(limit / 2))
        .map((product: any) => ({
          _id: product._id,
          name: product.name,
          slug: product.slug,
          description: product.shortDescription,
          price: product.price,
          images: product.images,
          categoryName: "Product",
          type: 'product' as const
        }))

      suggestions.push(...matchingProducts)
    }

    // Search categories
    const categories = await ctx.db
      .query("categories")
      .filter((q: any) => q.eq("isActive", true))
      .collect()

    const matchingCategories = categories
      .filter((category: any) =>
        category.name.toLowerCase().includes(args.query.toLowerCase()) ||
        category.slug.toLowerCase().includes(args.query.toLowerCase())
      )
      .slice(0, Math.floor(limit / 2))
      .map((category: any) => ({
        _id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        images: [],
        categoryName: "Category",
        type: 'category' as const
      }))

    suggestions.push(...matchingCategories)

    // Limit total suggestions
    return suggestions.slice(0, limit)
  },
});

// Advanced search with filters
export const searchProducts = query({
  args: {
    query: v.optional(v.string()),
    category: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    sortBy: v.optional(v.string()),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx: QueryCtx, args: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    limit?: number;
    offset?: number;
  }) => {
    let query = ctx.db.query("products").filter((q: any) => q.eq("isActive", true))

    // Text search
    if (args.query) {
      const products = await query.collect()
      const filtered = products.filter((product: any) =>
        product.name.toLowerCase().includes(args.query!.toLowerCase()) ||
        product.tags.some((tag: string) => tag.toLowerCase().includes(args.query!.toLowerCase())) ||
        product.description?.toLowerCase().includes(args.query!.toLowerCase()) ||
        product.shortDescription?.toLowerCase().includes(args.query!.toLowerCase())
      )
      query = ctx.db.query("products").filter((q: any) =>
        q.or(
          ...filtered.map((product: any) => q.eq("_id", product._id))
        )
      )
    }

    // Category filter
    if (args.category) {
      const category = await ctx.db
        .query("categories")
        .withIndex("bySlug", (q: any) => q.eq("slug", args.category!))
        .first()

      if (category) {
        query = query.filter((q: any) => q.eq("categoryId", category._id))
      }
    }

    // Price filters
    if (args.minPrice !== undefined) {
      query = query.filter((q: any) => q.gte("price", args.minPrice!))
    }
    if (args.maxPrice !== undefined) {
      query = query.filter((q: any) => q.lte("price", args.maxPrice!))
    }

    const products = await query.collect()

    // Sorting
    switch (args.sortBy) {
      case "price-low":
        products.sort((a: any, b: any) => a.price - b.price)
        break
      case "price-high":
        products.sort((a: any, b: any) => b.price - a.price)
        break
      case "newest":
        products.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0))
        break
      case "oldest":
        products.sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0))
        break
      case "name":
        products.sort((a: any, b: any) => a.name.localeCompare(b.name))
        break
      case "relevance":
      default:
        if (args.query) {
          products.sort((a: any, b: any) => {
            // Prioritize exact matches
            const aExact = a.name.toLowerCase().includes(args.query!.toLowerCase())
            const bExact = b.name.toLowerCase().includes(args.query!.toLowerCase())
            if (aExact && !bExact) return -1
            if (!aExact && bExact) return 1
            return a.name.localeCompare(b.name)
          })
        }
        break
    }

    // Pagination
    const offset = args.offset || 0
    const limit = args.limit || 20
    const paginatedProducts = products.slice(offset, offset + limit)

    return {
      products: paginatedProducts,
      total: products.length,
      hasMore: offset + limit < products.length
    }
  },
});

// Track search analytics
export const trackSearchAnalytics = query({
  args: {
    query: v.string(),
    resultsCount: v.number(),
    filters: v.optional(v.object({
      category: v.optional(v.string()),
      minPrice: v.optional(v.number()),
      maxPrice: v.optional(v.number()),
      sortBy: v.optional(v.string())
    }))
  },
  handler: async (ctx: QueryCtx, args) => {
    // In a real implementation, you would store this in a search_analytics table
    // For now, we'll just log it
    console.log('Search Analytics:', {
      query: args.query,
      resultsCount: args.resultsCount,
      filters: args.filters,
      timestamp: new Date().toISOString()
    })

    return { success: true }
  }
})