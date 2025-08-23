import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get or create cart for user/session
export const getOrCreateCart = mutation({
  args: {
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.userId && !args.sessionId) {
      throw new Error("Either userId or sessionId must be provided");
    }

    let cart;

    if (args.userId) {
      cart = await ctx.db
        .query("carts")
        .withIndex("byUser", (q) => q.eq("userId", args.userId))
        .first();
    } else if (args.sessionId) {
      cart = await ctx.db
        .query("carts")
        .withIndex("bySession", (q) => q.eq("sessionId", args.sessionId))
        .first();
    }

    if (cart) {
      return cart;
    }

    // Create new cart
    const now = Date.now();
    const expiresAt = args.sessionId ? now + (7 * 24 * 60 * 60 * 1000) : undefined; // 7 days for guest carts

    const cartId = await ctx.db.insert("carts", {
      userId: args.userId,
      sessionId: args.sessionId,
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      currency: "CLP",
      expiresAt,
      createdAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(cartId);
  },
});

// Add item to cart
export const addToCart = mutation({
  args: {
    cartId: v.id("carts"),
    productId: v.id("products"),
    quantity: v.number(),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    const { cartId, productId, quantity, price } = args;

    const cart = await ctx.db.get(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    const now = Date.now();

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...cart.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
        price,
        addedAt: now,
      };

      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.1; // 10% tax rate
      const total = subtotal + tax;

      await ctx.db.patch(cartId, {
        items: updatedItems,
        subtotal,
        tax,
        total,
        updatedAt: now,
      });
    } else {
      // Add new item
      const newItem = {
        productId,
        quantity,
        price,
        addedAt: now,
      };

      const updatedItems = [...cart.items, newItem];
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      await ctx.db.patch(cartId, {
        items: updatedItems,
        subtotal,
        tax,
        total,
        updatedAt: now,
      });
    }

    return await ctx.db.get(cartId);
  },
});

// Remove item from cart
export const removeFromCart = mutation({
  args: {
    cartId: v.id("carts"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const { cartId, productId } = args;

    const cart = await ctx.db.get(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const updatedItems = cart.items.filter(
      (item) => item.productId !== productId
    );

    const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    await ctx.db.patch(cartId, {
      items: updatedItems,
      subtotal,
      tax,
      total,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(cartId);
  },
});

// Update cart item quantity
export const updateCartItemQuantity = mutation({
  args: {
    cartId: v.id("carts"),
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const { cartId, productId, quantity } = args;

    if (quantity <= 0) {
      return await ctx.runMutation("carts:removeFromCart", {
        cartId,
        productId,
      });
    }

    const cart = await ctx.db.get(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const updatedItems = cart.items.map((item) => {
      if (item.productId === productId) {
        return {
          ...item,
          quantity,
          addedAt: Date.now(),
        };
      }
      return item;
    });

    const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    await ctx.db.patch(cartId, {
      items: updatedItems,
      subtotal,
      tax,
      total,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(cartId);
  },
});

// Clear cart
export const clearCart = mutation({
  args: { cartId: v.id("carts") },
  handler: async (ctx, args) => {
    const now = Date.now();

    await ctx.db.patch(args.cartId, {
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      updatedAt: now,
    });

    return await ctx.db.get(args.cartId);
  },
});

// Get cart with product details
export const getCartWithDetails = query({
  args: { cartId: v.id("carts") },
  handler: async (ctx, args) => {
    const cart = await ctx.db.get(args.cartId);
    if (!cart) {
      return null;
    }

    // Get product details for each item
    const itemsWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product: product ? {
            id: product._id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            images: product.images,
            inventory: product.inventory,
          } : null,
        };
      })
    );

    return {
      ...cart,
      items: itemsWithDetails,
    };
  },
});