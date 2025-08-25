import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Save item for later (from cart)
export const saveForLater = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if item already saved
    const existing = await ctx.db
      .query("wishlists")
      .withIndex("byUserProduct", (q) => 
        q.eq("userId", args.userId).eq("productId", args.productId)
      )
      .first();

    if (existing) {
      // Update the note if provided
      if (args.note) {
        await ctx.db.patch(existing._id, {
          note: args.note,
          addedAt: Date.now(),
        });
      }
      return existing;
    }

    // Create new saved item
    return await ctx.db.insert("wishlists", {
      userId: args.userId,
      productId: args.productId,
      note: args.note,
      savedForLater: true,
      addedAt: Date.now(),
    });
  },
});

// Remove from saved items
export const removeFromSaved = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const saved = await ctx.db
      .query("wishlists")
      .withIndex("byUserProduct", (q) => 
        q.eq("userId", args.userId).eq("productId", args.productId)
      )
      .first();

    if (saved) {
      await ctx.db.delete(saved._id);
      return true;
    }
    return false;
  },
});

// Get saved for later items
export const getSavedForLater = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const savedItems = await ctx.db
      .query("wishlists")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("savedForLater"), true))
      .collect();

    // Get product details for each saved item
    const itemsWithProducts = await Promise.all(
      savedItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product,
        };
      })
    );

    return itemsWithProducts.filter((item) => item.product?.isActive);
  },
});

// Create or get wishlist collection
export const createWishlistCollection = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("wishlistLists", {
      userId: args.userId,
      name: args.name,
      description: args.description,
      isPublic: args.isPublic || false,
      isDefault: false,
      color: args.color,
      icon: args.icon,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get user's wishlist collections
export const getUserWishlistCollections = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const collections = await ctx.db
      .query("wishlistLists")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .collect();

    // Get item counts for each collection
    const collectionsWithCounts = await Promise.all(
      collections.map(async (collection) => {
        const items = await ctx.db
          .query("wishlists")
          .withIndex("byWishlist", (q) => q.eq("wishlistId", collection._id))
          .collect();

        return {
          ...collection,
          itemCount: items.length,
        };
      })
    );

    return collectionsWithCounts.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return b.createdAt - a.createdAt;
    });
  },
});

// Add product to specific wishlist collection
export const addToWishlistCollection = mutation({
  args: {
    userId: v.string(),
    wishlistId: v.id("wishlistLists"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    // Check if already in this wishlist
    const existing = await ctx.db
      .query("wishlists")
      .withIndex("byUserProduct", (q) => 
        q.eq("userId", args.userId).eq("productId", args.productId)
      )
      .filter((q) => q.eq(q.field("wishlistId"), args.wishlistId))
      .first();

    if (existing) {
      return existing;
    }

    return await ctx.db.insert("wishlists", {
      userId: args.userId,
      wishlistId: args.wishlistId,
      productId: args.productId,
      addedAt: Date.now(),
    });
  },
});

// Get wishlist collection with products
export const getWishlistCollection = query({
  args: { 
    wishlistId: v.id("wishlistLists"),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const wishlist = await ctx.db.get(args.wishlistId);
    
    if (!wishlist) return null;
    
    // Check if user has access (owner or public)
    if (!wishlist.isPublic && wishlist.userId !== args.userId) {
      return null;
    }

    const items = await ctx.db
      .query("wishlists")
      .withIndex("byWishlist", (q) => q.eq("wishlistId", args.wishlistId))
      .collect();

    // Get product details
    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product,
        };
      })
    );

    return {
      ...wishlist,
      items: itemsWithProducts.filter((item) => item.product?.isActive),
    };
  },
});

// Price drop tracking
export const trackPriceDrop = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
    targetPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found");

    // Create or update price alert
    const existing = await ctx.db
      .query("priceAlerts")
      .withIndex("byUserProduct", (q) => 
        q.eq("userId", args.userId).eq("productId", args.productId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        targetPrice: args.targetPrice,
        isActive: true,
        updatedAt: Date.now(),
      });
      return existing;
    }

    return await ctx.db.insert("priceAlerts", {
      userId: args.userId,
      productId: args.productId,
      originalPrice: product.price,
      targetPrice: args.targetPrice,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Share wishlist
export const shareWishlist = mutation({
  args: {
    wishlistId: v.id("wishlistLists"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const wishlist = await ctx.db.get(args.wishlistId);
    
    if (!wishlist || wishlist.userId !== args.userId) {
      throw new Error("Wishlist not found or access denied");
    }

    // Make wishlist public and return share URL
    await ctx.db.patch(args.wishlistId, {
      isPublic: true,
      updatedAt: Date.now(),
    });

    return {
      shareUrl: `/wishlist/${args.wishlistId}`,
      shareCode: args.wishlistId,
    };
  },
});

// Get price alerts for user
export const getUserPriceAlerts = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const alerts = await ctx.db
      .query("priceAlerts")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Get product details and check for price drops
    const alertsWithProducts = await Promise.all(
      alerts.map(async (alert) => {
        const product = await ctx.db.get(alert.productId);
        
        const hasPriceDrop = product && product.price <= alert.targetPrice;
        
        return {
          ...alert,
          product,
          hasPriceDrop,
          currentPrice: product?.price,
          savingsAmount: product ? alert.originalPrice - product.price : 0,
          savingsPercentage: product 
            ? Math.round(((alert.originalPrice - product.price) / alert.originalPrice) * 100)
            : 0,
        };
      })
    );

    return alertsWithProducts.filter((alert) => alert.product?.isActive);
  },
});

// Bulk operations for wishlist management
export const bulkAddToWishlist = mutation({
  args: {
    userId: v.string(),
    wishlistId: v.id("wishlistLists"),
    productIds: v.array(v.id("products")),
  },
  handler: async (ctx, args) => {
    const results = [];
    
    for (const productId of args.productIds) {
      try {
        const existing = await ctx.db
          .query("wishlists")
          .withIndex("byUserProduct", (q) => 
            q.eq("userId", args.userId).eq("productId", productId)
          )
          .filter((q) => q.eq(q.field("wishlistId"), args.wishlistId))
          .first();

        if (!existing) {
          const item = await ctx.db.insert("wishlists", {
            userId: args.userId,
            wishlistId: args.wishlistId,
            productId,
            addedAt: Date.now(),
          });
          results.push({ productId, success: true, item });
        } else {
          results.push({ productId, success: true, item: existing });
        }
      } catch (error) {
        results.push({ productId, success: false, error: error.message });
      }
    }
    
    return results;
  },
});

// Analytics for wishlist performance
export const getWishlistAnalytics = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const wishlists = await ctx.db
      .query("wishlistLists")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .collect();

    const analytics = await Promise.all(
      wishlists.map(async (wishlist) => {
        const items = await ctx.db
          .query("wishlists")
          .withIndex("byWishlist", (q) => q.eq("wishlistId", wishlist._id))
          .collect();

        const totalValue = await items.reduce(async (accPromise, item) => {
          const acc = await accPromise;
          const product = await ctx.db.get(item.productId);
          return acc + (product?.price || 0);
        }, Promise.resolve(0));

        return {
          wishlistId: wishlist._id,
          name: wishlist.name,
          itemCount: items.length,
          totalValue,
          lastUpdated: Math.max(...items.map(item => item.addedAt), wishlist.createdAt),
        };
      })
    );

    return {
      totalWishlists: wishlists.length,
      totalItems: analytics.reduce((sum, w) => sum + w.itemCount, 0),
      totalValue: analytics.reduce((sum, w) => sum + w.totalValue, 0),
      wishlists: analytics,
    };
  },
});