import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { UserJSON } from "@clerk/backend";

// Get current user or create if doesn't exist
export const getOrCreateUser = mutation({
  args: {
    externalId: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", args.externalId))
      .first();

    if (existing) {
      // Update last login
      await ctx.db.patch(existing._id, {
        lastLoginAt: Date.now(),
      });
      return existing;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      externalId: args.externalId,
      name: args.name,
      email: args.email,
      phone: args.phone,
      role: "customer",
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    });

    return await ctx.db.get(userId);
  },
});

// Get current user
export const getCurrentUser = query({
  args: { externalId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", args.externalId))
      .first();
  },
});

// Get all users (admin only)
export const getAllUsers = query({
  args: { role: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let query = ctx.db.query("users");

    if (args.role) {
      query = query.filter((q) => q.eq(q.field("role"), args.role));
    }

    return await query.order("desc").collect();
  },
});

// Update user role (admin only)
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.userId, {
      role: args.role,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(args.userId);
  },
});

// Check if user is admin
export const isUserAdmin = query({
  args: { externalId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", args.externalId))
      .first();

    return user?.role === "admin";
  },
});

// Create admin user (for initial setup)
export const createAdminUser = mutation({
  args: {
    externalId: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", args.externalId))
      .first();

    if (existing) {
      // Update to admin role if not already admin
      if (existing.role !== "admin") {
        await ctx.db.patch(existing._id, {
          role: "admin",
          lastLoginAt: Date.now(),
        });
      }
      return existing;
    }

    // Create new admin user
    const userId = await ctx.db.insert("users", {
      externalId: args.externalId,
      name: args.name,
      email: args.email,
      role: "admin",
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    });

    return await ctx.db.get(userId);
  },
});

// Update user profile
export const updateUser = mutation({
  args: {
    externalId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      region: v.string(),
      postalCode: v.string(),
      country: v.string(),
    })),
    preferences: v.optional(v.object({
      language: v.string(),
      currency: v.string(),
      notifications: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", args.externalId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const updates: any = {};
    if (args.name) updates.name = args.name;
    if (args.email) updates.email = args.email;
    if (args.phone) updates.phone = args.phone;
    if (args.address) updates.address = args.address;
    if (args.preferences) updates.preferences = args.preferences;

    await ctx.db.patch(user._id, updates);
    return await ctx.db.get(user._id);
  },
});

// Internal mutations for Clerk webhooks
export const upsertFromClerk = internalMutation({
  args: { data: v.any() as any }, // no runtime validation, trust Clerk
  handler: async (ctx, { data }: { data: UserJSON }) => {
    const userAttributes = {
      name: `${data.first_name} ${data.last_name}`,
      email: data.email_addresses?.[0]?.email_address || "",
      phone: data.phone_numbers?.[0]?.phone_number || "",
      externalId: data.id,
      isEmailVerified: data.email_addresses?.[0]?.verification?.status === "verified",
      isPhoneVerified: data.phone_numbers?.[0]?.verification?.status === "verified",
      emailVerifiedAt: data.email_addresses?.[0]?.verification?.status === "verified" ? Date.now() : undefined,
      phoneVerifiedAt: data.phone_numbers?.[0]?.verification?.status === "verified" ? Date.now() : undefined,
      lastLoginAt: Date.now(),
      updatedAt: Date.now(),
    };

    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", data.id))
      .first();

    if (user === null) {
      await ctx.db.insert("users", {
        ...userAttributes,
        role: "customer",
        createdAt: Date.now(),
      });
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", clerkUserId))
      .first();

    if (user !== null) {
      // Instead of deleting, mark as inactive to maintain data integrity
      await ctx.db.patch(user._id, {
        isActive: false,
        updatedAt: Date.now(),
      });
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});