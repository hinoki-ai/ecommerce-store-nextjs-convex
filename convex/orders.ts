import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create new order from cart
export const createOrderFromCart = mutation({
  args: {
    cartId: v.id("carts"),
    customerInfo: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
    }),
    shippingAddress: v.object({
      street: v.string(),
      city: v.string(),
      region: v.string(),
      postalCode: v.string(),
      country: v.string(),
      additionalInfo: v.optional(v.string()),
    }),
    billingAddress: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      region: v.string(),
      postalCode: v.string(),
      country: v.string(),
    })),
    paymentMethod: v.optional(v.string()),
    shippingMethod: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cart = await ctx.db.get(args.cartId);
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty or not found");
    }

    // Get product details and check inventory
    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.inventory.quantity < item.quantity) {
          throw new Error(`Insufficient inventory for ${product.name}`);
        }

        return {
          productId: item.productId,
          name: product.name,
          sku: product.sku,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        };
      })
    );

    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = subtotal * 0.1; // 10% tax
    const shippingCost = args.shippingMethod === "express" ? 15.00 : 5.00;
    const totalAmount = subtotal + taxAmount + shippingCost;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const now = Date.now();

    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      userId: args.userId,
      customerInfo: args.customerInfo,
      shippingAddress: args.shippingAddress,
      billingAddress: args.billingAddress,
      items: orderItems,
      subtotal,
      taxAmount,
      taxRate: 0.1,
      shippingCost,
      totalAmount,
      currency: cart.currency,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: args.paymentMethod,
      shippingMethod: args.shippingMethod,
      createdAt: now,
      updatedAt: now,
    });

    // Update inventory
    for (const item of cart.items) {
      const product = await ctx.db.get(item.productId);
      if (product) {
        const newQuantity = product.inventory.quantity - item.quantity;

        await ctx.db.patch(item.productId, {
          inventory: {
            ...product.inventory,
            quantity: newQuantity,
          },
          updatedAt: now,
        });

        // Log inventory change
        await ctx.db.insert("inventoryLogs", {
          productId: item.productId,
          type: "stock_out",
          quantity: item.quantity,
          previousQuantity: product.inventory.quantity,
          newQuantity,
          reason: `Order ${orderNumber}`,
          orderId,
          createdAt: now,
        });
      }
    }

    // Clear the cart
    await ctx.db.patch(args.cartId, {
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      updatedAt: now,
    });

    return await ctx.db.get(orderId);
  },
});

// Get order by ID
export const getOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

// Get orders by user
export const getUserOrders = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit || 20);
  },
});

// Update order status
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
    paymentStatus: v.optional(v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("paid"),
      v.literal("failed"),
      v.literal("cancelled"),
      v.literal("refunded")
    )),
    trackingNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { orderId, status, paymentStatus, trackingNumber } = args;

    const updates: {
      status: typeof status;
      updatedAt: number;
      paymentStatus?: typeof paymentStatus;
      trackingNumber?: string;
      shippedAt?: number;
      deliveredAt?: number;
    } = {
      status,
      updatedAt: Date.now(),
    };

    if (paymentStatus) {
      updates.paymentStatus = paymentStatus;
    }

    if (trackingNumber) {
      updates.trackingNumber = trackingNumber;
    }

    // Set timestamps based on status
    if (status === "shipped") {
      updates.shippedAt = Date.now();
    } else if (status === "delivered") {
      updates.deliveredAt = Date.now();
    }

    await ctx.db.patch(orderId, updates);
    return await ctx.db.get(orderId);
  },
});

// Get order by order number
export const getOrderByNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("byOrderNumber", (q) => q.eq("orderNumber", args.orderNumber))
      .first();
  },
});

// Get order statistics for dashboard
export const getOrderStats = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let query = ctx.db.query("orders");

    if (args.userId) {
      query = query.filter((q) => q.eq(q.field("userId"), args.userId));
    }

    const orders = await query.collect();

    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === "pending").length,
      paid: orders.filter(o => o.paymentStatus === "paid").length,
      shipped: orders.filter(o => o.status === "shipped").length,
      delivered: orders.filter(o => o.status === "delivered").length,
      cancelled: orders.filter(o => o.status === "cancelled").length,
      totalRevenue: orders
        .filter(o => o.paymentStatus === "paid")
        .reduce((sum, o) => sum + o.totalAmount, 0),
    };

    return stats;
  },
});