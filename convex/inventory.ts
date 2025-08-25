import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Check for low stock products and notify wishlist users
export const checkLowStockAlerts = mutation({
  args: {},
  handler: async (ctx, args) => {
    // Get all products with low stock
    const lowStockProducts = await ctx.db
      .query("products")
      .filter((q) => q.and(
        q.eq(q.field("isActive"), true),
        q.lte(q.field("inventory.quantity"), q.field("inventory.lowStockThreshold"))
      ))
      .collect();

    const notificationsCreated = [];

    for (const product of lowStockProducts) {
      // Find users who have this product in their wishlists
      const wishlistItems = await ctx.db
        .query("wishlists")
        .filter((q) => q.eq(q.field("productId"), product._id))
        .collect();

      for (const item of wishlistItems) {
        // Check if we already sent a low stock notification recently
        const recentNotifications = await ctx.db
          .query("notifications")
          .withIndex("byUserType", (q) =>
            q.eq("userId", item.userId).eq("type", "low_stock_alert")
          )
          .filter((q) => q.exists(q.field("data.productId")))
          .filter((q) => q.eq(q.field("data.productId"), product._id))
          .collect();

        const lastNotification = recentNotifications
          .sort((a, b) => b.createdAt - a.createdAt)[0];

        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);

        if (!lastNotification || lastNotification.createdAt < oneDayAgo) {
          await ctx.db.insert("notifications", {
            userId: item.userId,
            type: "low_stock_alert",
            title: `Low Stock Alert: ${product.name}`,
            message: `The ${product.name} you have in your wishlist is running low. Only ${product.inventory.quantity} items left in stock. Act fast before it's gone!`,
            data: {
              productId: product._id,
              currentStock: product.inventory.quantity,
              lowStockThreshold: product.inventory.lowStockThreshold,
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
            stock: product.inventory.quantity
          });
        }
      }
    }

    return notificationsCreated;
  },
});



// Update low stock threshold for a product
export const updateLowStockThreshold = mutation({
  args: {
    productId: v.id("products"),
    threshold: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.threshold < 0) {
      throw new Error("Threshold must be non-negative");
    }

    await ctx.db.patch(args.productId, {
      "inventory.lowStockThreshold": args.threshold,
      updatedAt: Date.now(),
    });

    return args.productId;
  },
});

// Get inventory summary report
export const getInventoryReport = query({
  args: {},
  handler: async (ctx, args) => {
    const allProducts = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const totalProducts = allProducts.length;
    const inStockProducts = allProducts.filter(p => p.inventory.quantity > 0).length;
    const lowStockProducts = allProducts.filter(p =>
      p.inventory.quantity <= p.inventory.lowStockThreshold && p.inventory.quantity > 0
    ).length;
    const outOfStockProducts = allProducts.filter(p => p.inventory.quantity === 0).length;

    const totalValue = allProducts.reduce((sum, product) =>
      sum + (product.inventory.quantity * product.price), 0
    );

    const averageStockLevel = allProducts.length > 0
      ? allProducts.reduce((sum, product) => sum + product.inventory.quantity, 0) / allProducts.length
      : 0;

    // Get top selling products (based on recent orders)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentOrders = await ctx.db
      .query("orders")
      .filter((q) => q.gte(q.field("createdAt"), thirtyDaysAgo))
      .collect();

    const productSales = new Map();
    recentOrders.forEach(order => {
      order.items.forEach(item => {
        const current = productSales.get(item.productId) || 0;
        productSales.set(item.productId, current + item.quantity);
      });
    });

    const topSellingProducts = Array.from(productSales.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(async ([productId, sales]) => {
        const product = await ctx.db.get(productId);
        return {
          product: product ? {
            _id: product._id,
            name: product.name,
            sku: product.sku
          } : null,
          sales,
        };
      });

    return {
      summary: {
        totalProducts,
        inStockProducts,
        lowStockProducts,
        outOfStockProducts,
        totalValue,
        averageStockLevel,
      },
      topSellingProducts: await Promise.all(topSellingProducts),
      lowStockItems: await ctx.runQuery("inventory:getLowStockProducts", {}),
    };
  },
});

// Get stock alerts for dashboard
export const getStockAlerts = query({
  args: {},
  handler: async (ctx, args) => {
    const criticalStock = await ctx.db
      .query("products")
      .filter((q) => q.and(
        q.eq(q.field("isActive"), true),
        q.lte(q.field("inventory.quantity"), 2) // Critical: 2 or fewer items
      ))
      .collect();

    const lowStock = await ctx.db
      .query("products")
      .filter((q) => q.and(
        q.eq(q.field("isActive"), true),
        q.gt(q.field("inventory.quantity"), 2),
        q.lte(q.field("inventory.quantity"), q.field("inventory.lowStockThreshold"))
      ))
      .collect();

    const outOfStock = await ctx.db
      .query("products")
      .filter((q) => q.and(
        q.eq(q.field("isActive"), true),
        q.eq(q.field("inventory.quantity"), 0)
      ))
      .collect();

    return {
      critical: criticalStock.length,
      low: lowStock.length,
      outOfStock: outOfStock.length,
      criticalItems: criticalStock.slice(0, 5), // Show first 5
      lowStockItems: lowStock.slice(0, 5),
      outOfStockItems: outOfStock.slice(0, 5),
    };
  },
});

// Get inventory logs for a product
export const getInventoryLogs = query({
  args: {
    productId: v.id("products"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx
      .query("inventoryLogs")
      .withIndex("byProduct", (q) => q.eq("productId", args.productId))
      .order("desc")
      .take(args.limit || 50);
  },
});

// Adjust inventory (add or remove stock)
export const adjustInventory = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.number(),
    type: v.union(
      v.literal("stock_in"),
      v.literal("stock_out"),
      v.literal("adjustment")
    ),
    reason: v.optional(v.string()),
    previousQuantity: v.number(),
    newQuantity: v.number(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { productId, quantity, type, reason, previousQuantity, newQuantity, userId } = args;

    // Update product inventory
    await ctx.db.patch(productId, {
      "inventory.quantity": newQuantity,
      updatedAt: Date.now(),
    });

    // Create inventory log
    const logId = await ctx.db.insert("inventoryLogs", {
      productId,
      type,
      quantity: Math.abs(quantity),
      previousQuantity,
      newQuantity,
      reason: reason || "Ajuste manual",
      userId,
      createdAt: Date.now(),
    });

    return logId;
  },
});

// Bulk update inventory for multiple products
export const bulkUpdateInventory = mutation({
  args: {
    updates: v.array(v.object({
      productId: v.id("products"),
      newQuantity: v.number(),
      reason: v.optional(v.string()),
    })),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const results = [];

    for (const update of args.updates) {
      const product = await ctx.db.get(update.productId);
      if (!product) continue;

      const previousQuantity = product.inventory.quantity;

      // Update product inventory
      await ctx.db.patch(update.productId, {
        "inventory.quantity": update.newQuantity,
        updatedAt: Date.now(),
      });

      // Create inventory log
      const logId = await ctx.db.insert("inventoryLogs", {
        productId: update.productId,
        type: "adjustment",
        quantity: Math.abs(update.newQuantity - previousQuantity),
        previousQuantity,
        newQuantity: update.newQuantity,
        reason: update.reason || "Ajuste masivo",
        userId: args.userId,
        createdAt: Date.now(),
      });

      results.push({ productId: update.productId, logId });
    }

    return results;
  },
});

// Get low stock products
export const getLowStockProducts = query({
  args: {
    threshold: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const threshold = args.threshold || 5;
    const limit = args.limit || 50;

    const products = await ctx
      .query("products")
      .filter((q) =>
        q.and(
          q.eq(q.field("isActive"), true),
          q.eq(q.field("inventory.trackInventory"), true),
          q.lte(q.field("inventory.quantity"), threshold),
          q.gt(q.field("inventory.quantity"), 0)
        )
      )
      .take(limit);

    return products;
  },
});

// Get out of stock products
export const getOutOfStockProducts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    return await ctx
      .query("products")
      .filter((q) =>
        q.and(
          q.eq(q.field("isActive"), true),
          q.eq(q.field("inventory.trackInventory"), true),
          q.lte(q.field("inventory.quantity"), 0)
        )
      )
      .take(limit);
  },
});

// Get inventory summary
export const getInventorySummary = query({
  handler: async (ctx) => {
    const products = await ctx.query("products").collect();

    const summary = {
      totalProducts: products.length,
      inStock: 0,
      lowStock: 0,
      outOfStock: 0,
      totalValue: 0,
      lowStockProducts: [] as Array<{
        _id: string;
        name: string;
        quantity: number;
        lowStockThreshold: number;
      }>,
      outOfStockProducts: [] as Array<{
        _id: string;
        name: string;
        allowBackorder: boolean;
      }>,
    };

    for (const product of products) {
      if (!product.isActive) continue;

      const quantity = product.inventory.quantity;
      const lowStockThreshold = product.inventory.lowStockThreshold;

      summary.totalValue += product.price * quantity;

      if (!product.inventory.trackInventory) {
        summary.inStock++;
      } else if (quantity <= 0) {
        summary.outOfStock++;
        summary.outOfStockProducts.push({
          _id: product._id,
          name: product.name,
          allowBackorder: product.inventory.allowBackorder,
        });
      } else if (quantity <= lowStockThreshold) {
        summary.lowStock++;
        summary.lowStockProducts.push({
          _id: product._id,
          name: product.name,
          quantity,
          lowStockThreshold,
        });
      } else {
        summary.inStock++;
      }
    }

    return summary;
  },
});

// Reserve inventory for an order
export const reserveInventory = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.number(),
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.inventory.trackInventory) {
      return { success: true, message: "Inventory not tracked" };
    }

    if (product.inventory.quantity < args.quantity) {
      throw new Error("Insufficient inventory");
    }

    const newQuantity = product.inventory.quantity - args.quantity;

    // Update product inventory
    await ctx.db.patch(args.productId, {
      "inventory.quantity": newQuantity,
      updatedAt: Date.now(),
    });

    // Create inventory log
    await ctx.db.insert("inventoryLogs", {
      productId: args.productId,
      type: "reserved",
      quantity: args.quantity,
      previousQuantity: product.inventory.quantity,
      newQuantity,
      orderId: args.orderId,
      reason: `Reservado para orden ${args.orderId}`,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Release reserved inventory
export const releaseInventory = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.number(),
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.inventory.trackInventory) {
      return { success: true, message: "Inventory not tracked" };
    }

    const newQuantity = product.inventory.quantity + args.quantity;

    // Update product inventory
    await ctx.db.patch(args.productId, {
      "inventory.quantity": newQuantity,
      updatedAt: Date.now(),
    });

    // Create inventory log
    await ctx.db.insert("inventoryLogs", {
      productId: args.productId,
      type: "released",
      quantity: args.quantity,
      previousQuantity: product.inventory.quantity,
      newQuantity,
      orderId: args.orderId,
      reason: `Liberado de orden ${args.orderId}`,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});