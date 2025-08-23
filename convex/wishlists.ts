import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Check for wishlist notifications (price drops, back in stock, etc.)
export const checkWishlistNotifications = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const wishlistItems = await ctx.db
      .query("wishlists")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .collect();

    const notifications = [];

    for (const item of wishlistItems) {
      const product = await ctx.db.get(item.productId);
      if (!product || !product.isActive) continue;

      // Check for price drop
      const recentNotifications = await ctx.db
        .query("notifications")
        .withIndex("byUserType", (q) =>
          q.eq("userId", args.userId).eq("type", "wishlist_price_drop")
        )
        .filter((q) => q.exists(q.field("data.productId")))
        .filter((q) => q.eq(q.field("data.productId"), product._id))
        .collect();

      // Only notify if we haven't notified about this product recently (within 7 days)
      const lastNotification = recentNotifications
        .sort((a, b) => b.createdAt - a.createdAt)[0];

      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

      // Price drop notification
      if (product.compareAtPrice && product.compareAtPrice > product.price &&
          (!lastNotification || lastNotification.createdAt < sevenDaysAgo)) {
        const discount = ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100;

        await ctx.db.insert("notifications", {
          userId: args.userId,
          type: "wishlist_price_drop",
          title: `Price Drop: ${product.name}`,
          message: `${product.name} is now ${product.price.toFixed(2)} (was ${product.compareAtPrice.toFixed(2)}) - ${discount.toFixed(0)}% off!`,
          data: {
            productId: product._id,
            oldPrice: product.compareAtPrice,
            newPrice: product.price,
            discount: discount
          },
          isRead: false,
          priority: "high",
          expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
          createdAt: Date.now(),
        });

        notifications.push("price_drop");
      }

      // Back in stock notification (if we had low stock tracking)
      const lowStockNotifications = await ctx.db
        .query("notifications")
        .withIndex("byUserType", (q) =>
          q.eq("userId", args.userId).eq("type", "wishlist_back_in_stock")
        )
        .filter((q) => q.exists(q.field("data.productId")))
        .filter((q) => q.eq(q.field("data.productId"), product._id))
        .collect();

      const lastStockNotification = lowStockNotifications
        .sort((a, b) => b.createdAt - a.createdAt)[0];

      // If product has good stock and we had a low stock notification recently
      if (product.inventory.quantity > product.inventory.lowStockThreshold &&
          lastStockNotification && lastStockNotification.createdAt > sevenDaysAgo) {

        await ctx.db.insert("notifications", {
          userId: args.userId,
          type: "wishlist_back_in_stock",
          title: `Back in Stock: ${product.name}`,
          message: `${product.name} is back in stock! Only ${product.inventory.quantity} left.`,
          data: {
            productId: product._id,
            quantity: product.inventory.quantity
          },
          isRead: false,
          priority: "medium",
          expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
          createdAt: Date.now(),
        });

        notifications.push("back_in_stock");
      }
    }

    return notifications;
  },
});

// Notify users about price drops on wishlist items
export const notifyPriceDrops = mutation({
  args: {},
  handler: async (ctx, args) => {
    // Get all active products with price drops
    const products = await ctx.db
      .query("products")
      .filter((q) => q.and(
        q.eq(q.field("isActive"), true),
        q.exists(q.field("compareAtPrice")),
        q.gt(q.field("compareAtPrice"), q.field("price"))
      ))
      .collect();

    const notificationsCreated = [];

    for (const product of products) {
      // Find users who have this product in their wishlist
      const wishlistItems = await ctx.db
        .query("wishlists")
        .filter((q) => q.eq(q.field("productId"), product._id))
        .collect();

      for (const item of wishlistItems) {
        // Check if we already notified this user about this product recently
        const recentNotifications = await ctx.db
          .query("notifications")
          .withIndex("byUserType", (q) =>
            q.eq("userId", item.userId).eq("type", "wishlist_price_drop")
          )
          .filter((q) => q.exists(q.field("data.productId")))
          .filter((q) => q.eq(q.field("data.productId"), product._id))
          .collect();

        const lastNotification = recentNotifications
          .sort((a, b) => b.createdAt - a.createdAt)[0];

        const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);

        if (!lastNotification || lastNotification.createdAt < threeDaysAgo) {
          const discount = ((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100;

          await ctx.db.insert("notifications", {
            userId: item.userId,
            type: "wishlist_price_drop",
            title: `Price Drop Alert: ${product.name}`,
            message: `Great news! ${product.name} is now on sale for $${product.price.toFixed(2)} (was $${product.compareAtPrice!.toFixed(2)}) - ${discount.toFixed(0)}% off!`,
            data: {
              productId: product._id,
              oldPrice: product.compareAtPrice,
              newPrice: product.price,
              discount: discount,
              wishlistItemId: item._id
            },
            isRead: false,
            priority: "high",
            expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
            createdAt: Date.now(),
          });

          notificationsCreated.push({
            userId: item.userId,
            productId: product._id,
            discount: discount
          });
        }
      }
    }

    return notificationsCreated;
  },
});

// Notify users when wishlist items are back in stock
export const notifyBackInStock = mutation({
  args: {},
  handler: async (ctx, args) => {
    // Get products that recently came back in stock (high quantity now)
    const products = await ctx.db
      .query("products")
      .filter((q) => q.and(
        q.eq(q.field("isActive"), true),
        q.gt(q.field("inventory.quantity"), q.field("inventory.lowStockThreshold"))
      ))
      .collect();

    const notificationsCreated = [];

    for (const product of products) {
      // Find users who have this product in their wishlist
      const wishlistItems = await ctx.db
        .query("wishlists")
        .filter((q) => q.eq(q.field("productId"), product._id))
        .collect();

      for (const item of wishlistItems) {
        // Check if we recently sent a low stock notification
        const recentLowStockNotifications = await ctx.db
          .query("notifications")
          .withIndex("byUserType", (q) =>
            q.eq("userId", item.userId).eq("type", "low_stock_alert")
          )
          .filter((q) => q.exists(q.field("data.productId")))
          .filter((q) => q.eq(q.field("data.productId"), product._id))
          .collect();

        const lastLowStockNotification = recentLowStockNotifications
          .sort((a, b) => b.createdAt - a.createdAt)[0];

        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

        if (lastLowStockNotification && lastLowStockNotification.createdAt > oneWeekAgo) {
          // Check if we already sent a back in stock notification
          const backInStockNotifications = await ctx.db
            .query("notifications")
            .withIndex("byUserType", (q) =>
              q.eq("userId", item.userId).eq("type", "wishlist_back_in_stock")
            )
            .filter((q) => q.exists(q.field("data.productId")))
            .filter((q) => q.eq(q.field("data.productId"), product._id))
            .collect();

          const lastBackInStockNotification = backInStockNotifications
            .sort((a, b) => b.createdAt - a.createdAt)[0];

          if (!lastBackInStockNotification || lastBackInStockNotification.createdAt < oneWeekAgo) {
            await ctx.db.insert("notifications", {
              userId: item.userId,
              type: "wishlist_back_in_stock",
              title: `Back in Stock: ${product.name}`,
              message: `Good news! ${product.name} is back in stock. There are currently ${product.inventory.quantity} items available.`,
              data: {
                productId: product._id,
                quantity: product.inventory.quantity,
                wishlistItemId: item._id
              },
              isRead: false,
              priority: "medium",
              expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
              createdAt: Date.now(),
            });

            notificationsCreated.push({
              userId: item.userId,
              productId: product._id,
              quantity: product.inventory.quantity
            });
          }
        }
      }
    }

    return notificationsCreated;
  },
});

// Get wishlist notification settings for user
export const getWishlistNotificationSettings = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // This would typically be stored in user preferences
    // For now, return default settings
    return {
      priceDropEnabled: true,
      backInStockEnabled: true,
      saleAlertEnabled: true,
      notificationFrequency: "immediate", // immediate, daily, weekly
    };
  },
});

// Create default wishlist for user if they don't have one
export const createDefaultWishlist = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();

    const wishlistListId = await ctx.db.insert("wishlistLists", {
      userId: args.userId,
      name: "My Wishlist",
      description: "My default wishlist",
      isPublic: false,
      isDefault: true,
      createdAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(wishlistListId);
  },
});

// Get or create default wishlist for user
export const getOrCreateDefaultWishlist = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    let defaultWishlist = await ctx.db
      .query("wishlistLists")
      .withIndex("byUserDefault", (q) =>
        q.eq("userId", args.userId).eq("isDefault", true)
      )
      .first();

    if (!defaultWishlist) {
      defaultWishlist = await ctx.runMutation("wishlists:createDefaultWishlist", {
        userId: args.userId,
      });
    }

    return defaultWishlist;
  },
});

// Create new wishlist
export const createWishlist = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const wishlistListId = await ctx.db.insert("wishlistLists", {
      userId: args.userId,
      name: args.name,
      description: args.description,
      isPublic: args.isPublic || false,
      isDefault: false,
      color: args.color,
      icon: args.icon,
      createdAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(wishlistListId);
  },
});

// Add product to wishlist
export const addToWishlist = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
    wishlistId: v.optional(v.id("wishlistLists")),
  },
  handler: async (ctx, args) => {
    let wishlistId = args.wishlistId;

    // If no wishlist specified, use default
    if (!wishlistId) {
      const defaultWishlist = await ctx.runMutation("wishlists:getOrCreateDefaultWishlist", {
        userId: args.userId,
      });
      wishlistId = defaultWishlist._id;
    }

    // Check if already in this specific wishlist
    const existing = await ctx.db
      .query("wishlists")
      .withIndex("byWishlist", (q) =>
        q.eq("wishlistId", wishlistId).eq("productId", args.productId)
      )
      .first();

    if (existing) {
      // Already in wishlist, just return it
      return existing;
    }

    const wishlistItemId = await ctx.db.insert("wishlists", {
      userId: args.userId,
      wishlistId,
      productId: args.productId,
      addedAt: Date.now(),
    });

    return await ctx.db.get(wishlistItemId);
  },
});

// Remove product from wishlist
export const removeFromWishlist = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
    wishlistId: v.optional(v.id("wishlistLists")),
  },
  handler: async (ctx, args) => {
    let wishlistId = args.wishlistId;

    // If no wishlist specified, find the item in any of user's wishlists
    if (!wishlistId) {
      const wishlistItem = await ctx.db
        .query("wishlists")
        .withIndex("byUserProduct", (q) =>
          q.eq("userId", args.userId).eq("productId", args.productId)
        )
        .first();

      if (wishlistItem) {
        await ctx.db.delete(wishlistItem._id);
        return true;
      }
    } else {
      // Remove from specific wishlist
      const wishlistItem = await ctx.db
        .query("wishlists")
        .withIndex("byWishlist", (q) =>
          q.eq("wishlistId", wishlistId).eq("productId", args.productId)
        )
        .first();

      if (wishlistItem) {
        await ctx.db.delete(wishlistItem._id);
        return true;
      }
    }

    return false;
  },
});

// Get user's wishlist lists
export const getWishlistLists = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("wishlistLists")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get specific wishlist with product details
export const getWishlistById = query({
  args: {
    userId: v.string(),
    wishlistId: v.id("wishlistLists")
  },
  handler: async (ctx, args) => {
    // Verify the wishlist belongs to the user
    const wishlistList = await ctx.db.get(args.wishlistId);
    if (!wishlistList || wishlistList.userId !== args.userId) {
      return null;
    }

    const wishlistItems = await ctx.db
      .query("wishlists")
      .withIndex("byWishlist", (q) => q.eq("wishlistId", args.wishlistId))
      .order("desc")
      .collect();

    // Get product details for each wishlist item
    const wishlistWithProducts = await Promise.all(
      wishlistItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product: product ? {
            id: product._id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            images: product.images,
            isActive: product.isActive,
            isFeatured: product.isFeatured,
            freshness: product.freshness
          } : null,
        };
      })
    );

    // Filter out items with inactive/deleted products
    const activeItems = wishlistWithProducts.filter(item => item.product && item.product.isActive);

    return {
      list: wishlistList,
      items: activeItems,
      totalItems: activeItems.length,
      totalValue: activeItems.reduce((sum, item) => sum + (item.product?.price || 0), 0)
    };
  },
});

// Get user's default wishlist (for backward compatibility)
export const getWishlist = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // First get the default wishlist list
    const defaultWishlistList = await ctx.db
      .query("wishlistLists")
      .withIndex("byUserDefault", (q) =>
        q.eq("userId", args.userId).eq("isDefault", true)
      )
      .first();

    if (!defaultWishlistList) {
      return [];
    }

    const wishlistItems = await ctx.db
      .query("wishlists")
      .withIndex("byWishlist", (q) => q.eq("wishlistId", defaultWishlistList._id))
      .order("desc")
      .collect();

    // Get product details for each wishlist item
    const wishlistWithProducts = await Promise.all(
      wishlistItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product: product ? {
            id: product._id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            images: product.images,
            isActive: product.isActive,
            isFeatured: product.isFeatured,
            freshness: product.freshness
          } : null,
        };
      })
    );

    // Filter out items with inactive/deleted products
    return wishlistWithProducts.filter(item => item.product && item.product.isActive);
  },
});

// Get wishlist count for user
export const getWishlistCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const wishlistItems = await ctx.db
      .query("wishlists")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .collect();

    // Count only items with active products
    const activeItems = await Promise.all(
      wishlistItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return product && product.isActive;
      })
    );

    return activeItems.filter(Boolean).length;
  },
});

// Check if product is in user's wishlist
export const isInWishlist = query({
  args: {
    userId: v.string(),
    productId: v.id("products"),
    wishlistId: v.optional(v.id("wishlistLists")),
  },
  handler: async (ctx, args) => {
    if (args.wishlistId) {
      // Check specific wishlist
      const wishlistItem = await ctx.db
        .query("wishlists")
        .withIndex("byWishlist", (q) =>
          q.eq("wishlistId", args.wishlistId).eq("productId", args.productId)
        )
        .first();
      return !!wishlistItem;
    } else {
      // Check any of user's wishlists
      const wishlistItem = await ctx.db
        .query("wishlists")
        .withIndex("byUserProduct", (q) =>
          q.eq("userId", args.userId).eq("productId", args.productId)
        )
        .first();
      return !!wishlistItem;
    }
  },
});

// Move item between wishlists
export const moveWishlistItem = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
    fromWishlistId: v.id("wishlistLists"),
    toWishlistId: v.id("wishlistLists"),
  },
  handler: async (ctx, args) => {
    // Verify both wishlists belong to user
    const [fromWishlist, toWishlist] = await Promise.all([
      ctx.db.get(args.fromWishlistId),
      ctx.db.get(args.toWishlistId)
    ]);

    if (!fromWishlist || !toWishlist ||
        fromWishlist.userId !== args.userId ||
        toWishlist.userId !== args.userId) {
      throw new Error("Invalid wishlist access");
    }

    // Remove from old wishlist
    const existingItem = await ctx.db
      .query("wishlists")
      .withIndex("byWishlist", (q) =>
        q.eq("wishlistId", args.fromWishlistId).eq("productId", args.productId)
      )
      .first();

    if (!existingItem) {
      throw new Error("Item not found in source wishlist");
    }

    await ctx.db.delete(existingItem._id);

    // Add to new wishlist (check if already exists)
    const alreadyExists = await ctx.db
      .query("wishlists")
      .withIndex("byWishlist", (q) =>
        q.eq("wishlistId", args.toWishlistId).eq("productId", args.productId)
      )
      .first();

    if (!alreadyExists) {
      await ctx.db.insert("wishlists", {
        userId: args.userId,
        wishlistId: args.toWishlistId,
        productId: args.productId,
        addedAt: Date.now(),
      });
    }

    return true;
  },
});

// Delete wishlist
export const deleteWishlist = mutation({
  args: {
    userId: v.string(),
    wishlistId: v.id("wishlistLists"),
  },
  handler: async (ctx, args) => {
    const wishlist = await ctx.db.get(args.wishlistId);

    if (!wishlist || wishlist.userId !== args.userId || wishlist.isDefault) {
      throw new Error("Cannot delete this wishlist");
    }

    // Delete all items in the wishlist
    const wishlistItems = await ctx.db
      .query("wishlists")
      .withIndex("byWishlist", (q) => q.eq("wishlistId", args.wishlistId))
      .collect();

    await Promise.all(
      wishlistItems.map(item => ctx.db.delete(item._id))
    );

    // Delete the wishlist list
    await ctx.db.delete(args.wishlistId);

    return true;
  },
});

// Get wishlist statistics
export const getWishlistStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const wishlistItems = await ctx.db
      .query("wishlists")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .collect();

    const products = await Promise.all(
      wishlistItems.map(item => ctx.db.get(item.productId))
    );

    const activeProducts = products.filter(p => p && p.isActive);
    const totalValue = activeProducts.reduce((sum, product) => sum + (product?.price || 0), 0);
    const averagePrice = activeProducts.length > 0 ? totalValue / activeProducts.length : 0;

    const featuredCount = activeProducts.filter(p => p?.isFeatured).length;
    const popularCount = activeProducts.filter(p => p?.freshness?.isPopular).length;

    // Get wishlist lists count
    const wishlistLists = await ctx.db
      .query("wishlistLists")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .collect();

    return {
      totalItems: activeProducts.length,
      totalValue,
      averagePrice,
      featuredCount,
      popularCount,
      categories: [...new Set(activeProducts.map(p => p?.categoryId).filter(Boolean))].length,
      wishlistCount: wishlistLists.length
    };
  },
});

// Get all user's wishlists with stats
export const getAllWishlistsWithStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const wishlistLists = await ctx.db
      .query("wishlistLists")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    const wishlistsWithStats = await Promise.all(
      wishlistLists.map(async (wishlistList) => {
        const wishlistItems = await ctx.db
          .query("wishlists")
          .withIndex("byWishlist", (q) => q.eq("wishlistId", wishlistList._id))
          .collect();

        const products = await Promise.all(
          wishlistItems.map(item => ctx.db.get(item.productId))
        );

        const activeProducts = products.filter(p => p && p.isActive);
        const totalValue = activeProducts.reduce((sum, product) => sum + (product?.price || 0), 0);

        return {
          list: wishlistList,
          totalItems: activeProducts.length,
          totalValue,
          items: activeProducts.slice(0, 3), // Preview first 3 items
        };
      })
    );

    return wishlistsWithStats;
  },
});