import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get variants for a product
export const getProductVariants = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("productVariants")
      .withIndex("byProduct", (q) => q.eq("productId", args.productId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("asc")
      .collect();
  },
});

// Create product variant
export const createProductVariant = mutation({
  args: {
    productId: v.id("products"),
    name: v.string(),
    type: v.union(v.literal("select"), v.literal("radio"), v.literal("checkbox")),
    options: v.array(v.object({
      value: v.string(),
      label: v.string(),
      priceAdjustment: v.optional(v.number()),
      imageUrl: v.optional(v.string()),
      stockQuantity: v.optional(v.number()),
      sku: v.optional(v.string()),
    })),
    required: v.boolean(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const variantId = await ctx.db.insert("productVariants", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return variantId;
  },
});

// Update product variant
export const updateProductVariant = mutation({
  args: {
    variantId: v.id("productVariants"),
    updates: v.object({
      name: v.optional(v.string()),
      type: v.optional(v.union(v.literal("select"), v.literal("radio"), v.literal("checkbox"))),
      options: v.optional(v.array(v.object({
        value: v.string(),
        label: v.string(),
        priceAdjustment: v.optional(v.number()),
        imageUrl: v.optional(v.string()),
        stockQuantity: v.optional(v.number()),
        sku: v.optional(v.string()),
      }))),
      required: v.optional(v.boolean()),
      sortOrder: v.optional(v.number()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const { variantId, updates } = args;

    await ctx.db.patch(variantId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return variantId;
  },
});

// Delete product variant
export const deleteProductVariant = mutation({
  args: { variantId: v.id("productVariants") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.variantId);
    return args.variantId;
  },
});

// Get all active variants
export const getAllVariants = query({
  args: { includeInactive: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const variants = await ctx.db
      .query("productVariants")
      .filter((q) =>
        args.includeInactive ? true : q.eq(q.field("isActive"), true)
      )
      .order("asc")
      .collect();

    return variants;
  },
});