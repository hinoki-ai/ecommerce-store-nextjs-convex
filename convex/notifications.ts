import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create notification
export const createNotification = mutation({
  args: {
    userId: v.string(),
    type: v.union(
      v.literal("wishlist_price_drop"),
      v.literal("wishlist_back_in_stock"),
      v.literal("wishlist_sale_alert"),
      v.literal("order_update"),
      v.literal("review_approved"),
      v.literal("low_stock_alert")
    ),
    title: v.string(),
    message: v.string(),
    data: v.optional(v.any()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,
      data: args.data,
      isRead: false,
      priority: args.priority || "medium",
      expiresAt: args.expiresAt,
      createdAt: now,
    });

    return notificationId;
  },
});

// Get user notifications
export const getUserNotifications = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
    unreadOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("notifications");

    if (args.unreadOnly) {
      query = query.withIndex("byUserUnread", (q) =>
        q.eq("userId", args.userId).eq("isRead", false)
      );
    } else {
      query = query.withIndex("byUser", (q) => q.eq("userId", args.userId));
    }

    const notifications = await query
      .order("desc")
      .take(args.limit || 20);

    return notifications;
  },
});

// Mark notification as read
export const markAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, { isRead: true });
    return args.notificationId;
  },
});

// Mark all user notifications as read
export const markAllAsRead = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("byUserUnread", (q) =>
        q.eq("userId", args.userId).eq("isRead", false)
      )
      .collect();

    await Promise.all(
      unreadNotifications.map(notification =>
        ctx.db.patch(notification._id, { isRead: true })
      )
    );

    return unreadNotifications.length;
  },
});

// Get notification count
export const getNotificationCount = query({
  args: {
    userId: v.string(),
    unreadOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("notifications");

    if (args.unreadOnly) {
      query = query.withIndex("byUserUnread", (q) =>
        q.eq("userId", args.userId).eq("isRead", false)
      );
    } else {
      query = query.withIndex("byUser", (q) => q.eq("userId", args.userId));
    }

    const count = await query.collect();
    return count.length;
  },
});

// Delete notification
export const deleteNotification = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.notificationId);
    return args.notificationId;
  },
});

// Clean up expired notifications
export const cleanupExpiredNotifications = mutation({
  args: {},
  handler: async (ctx, args) => {
    const now = Date.now();

    const expiredNotifications = await ctx.db
      .query("notifications")
      .filter((q) => q.and(
        q.exists(q.field("expiresAt")),
        q.lt(q.field("expiresAt"), now)
      ))
      .collect();

    await Promise.all(
      expiredNotifications.map(notification =>
        ctx.db.delete(notification._id)
      )
    );

    return expiredNotifications.length;
  },
});