import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Vote on review helpfulness
export const voteReviewHelpful = mutation({
  args: {
    reviewId: v.id("reviews"),
    userId: v.string(),
    voteType: v.union(v.literal("helpful"), v.literal("not_helpful")),
  },
  handler: async (ctx, args) => {
    // Check if user already voted on this review
    const existingVote = await ctx.db
      .query("reviewHelpfulVotes")
      .withIndex("byReview", (q) =>
        q.eq("reviewId", args.reviewId).eq("userId", args.userId)
      )
      .first();

    if (existingVote) {
      // If same vote type, remove the vote
      if (existingVote.voteType === args.voteType) {
        await ctx.db.delete(existingVote._id);

        // Update review vote counts
        const review = await ctx.db.get(args.reviewId);
        if (review) {
          const newTotalHelpful = args.voteType === "helpful"
            ? review.totalHelpful - 1
            : review.totalHelpful;
          const newHelpfulVotes = args.voteType === "helpful"
            ? review.helpfulVotes - 1
            : review.helpfulVotes;

          await ctx.db.patch(args.reviewId, {
            totalHelpful: newTotalHelpful,
            helpfulVotes: newHelpfulVotes,
            updatedAt: Date.now(),
          });
        }

        return { action: "removed", voteType: args.voteType };
      } else {
        // Change vote type
        await ctx.db.patch(existingVote._id, {
          voteType: args.voteType,
          createdAt: Date.now(),
        });

        // Update review vote counts
        const review = await ctx.db.get(args.reviewId);
        if (review) {
          let newTotalHelpful = review.totalHelpful;
          let newHelpfulVotes = review.helpfulVotes;

          if (existingVote.voteType === "helpful") {
            newTotalHelpful -= 1;
            newHelpfulVotes -= 1;
          }
          if (args.voteType === "helpful") {
            newTotalHelpful += 1;
            newHelpfulVotes += 1;
          }

          await ctx.db.patch(args.reviewId, {
            totalHelpful: newTotalHelpful,
            helpfulVotes: newHelpfulVotes,
            updatedAt: Date.now(),
          });
        }

        return { action: "changed", voteType: args.voteType };
      }
    } else {
      // Create new vote
      await ctx.db.insert("reviewHelpfulVotes", {
        reviewId: args.reviewId,
        userId: args.userId,
        voteType: args.voteType,
        createdAt: Date.now(),
      });

      // Update review vote counts
      const review = await ctx.db.get(args.reviewId);
      if (review) {
        const newTotalHelpful = args.voteType === "helpful"
          ? review.totalHelpful + 1
          : review.totalHelpful;
        const newHelpfulVotes = args.voteType === "helpful"
          ? review.helpfulVotes + 1
          : review.helpfulVotes;

        await ctx.db.patch(args.reviewId, {
          totalHelpful: newTotalHelpful,
          helpfulVotes: newHelpfulVotes,
          updatedAt: Date.now(),
        });
      }

      return { action: "added", voteType: args.voteType };
    }
  },
});

// Get user's vote on a review
export const getUserVoteOnReview = query({
  args: {
    reviewId: v.id("reviews"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const vote = await ctx.db
      .query("reviewHelpfulVotes")
      .withIndex("byReview", (q) =>
        q.eq("reviewId", args.reviewId).eq("userId", args.userId)
      )
      .first();

    return vote ? vote.voteType : null;
  },
});

// Get reviews with user votes (for a specific user)
export const getReviewsWithUserVotes = query({
  args: {
    productId: v.id("products"),
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("byProduct", (q) => q.eq("productId", args.productId))
      .filter((q) => q.eq(q.field("isApproved"), true))
      .order("desc")
      .take(args.limit || 10);

    // Get user's votes for these reviews
    const userVotes = await Promise.all(
      reviews.map(async (review) => {
        const vote = await ctx.db
          .query("reviewHelpfulVotes")
          .withIndex("byReview", (q) =>
            q.eq("reviewId", review._id).eq("userId", args.userId)
          )
          .first();
        return { reviewId: review._id, voteType: vote?.voteType || null };
      })
    );

    const voteMap = Object.fromEntries(
      userVotes.map(v => [v.reviewId, v.voteType])
    );

    return reviews.map(review => ({
      ...review,
      userVote: voteMap[review._id] || null,
    }));
  },
});

// Add response to review (admin/vendor only)
export const addReviewResponse = mutation({
  args: {
    reviewId: v.id("reviews"),
    userId: v.string(),
    userName: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const responseId = await ctx.db.insert("reviewResponses", {
      reviewId: args.reviewId,
      userId: args.userId,
      userName: args.userName,
      content: args.content,
      isApproved: true, // Auto-approve for now, could add moderation
      createdAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(responseId);
  },
});

// Get review responses
export const getReviewResponses = query({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviewResponses")
      .withIndex("byReview", (q) => q.eq("reviewId", args.reviewId))
      .filter((q) => q.eq(q.field("isApproved"), true))
      .order("asc")
      .collect();
  },
});

// Get reviews for a product with filtering and sorting
export const getProductReviews = query({
  args: {
    productId: v.id("products"),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    sortBy: v.optional(v.string()),
    filterBy: v.optional(v.object({
      rating: v.optional(v.number()),
      verifiedOnly: v.optional(v.boolean()),
      withPhotos: v.optional(v.boolean()),
    })),
    approvedOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("reviews")
      .withIndex("byProduct", (q) => q.eq("productId", args.productId));

    if (args.approvedOnly !== false) {
      query = query.filter((q) => q.eq(q.field("isApproved"), true));
    }

    // Apply filters
    if (args.filterBy?.rating) {
      query = query.filter((q) => q.eq(q.field("rating"), args.filterBy!.rating!));
    }

    if (args.filterBy?.verifiedOnly) {
      query = query.filter((q) => q.eq(q.field("isVerifiedPurchase"), true));
    }

    // Note: withPhotos filter would require storing image URLs in reviews
    // For now, we'll skip this filter

    // Apply sorting
    switch (args.sortBy) {
      case "newest":
        query = query.order("desc");
        break;
      case "oldest":
        query = query.order("asc");
        break;
      case "highest_rating":
        query = query.withIndex("byRating", (q) => q.eq("rating", 5))
          .filter((q) => q.eq(q.field("productId"), args.productId));
        break;
      case "lowest_rating":
        query = query.withIndex("byRating", (q) => q.eq("rating", 1))
          .filter((q) => q.eq(q.field("productId"), args.productId));
        break;
      case "most_helpful":
        query = query.withIndex("byHelpful", (q) => q.eq("totalHelpful", 0))
          .filter((q) => q.eq(q.field("productId"), args.productId));
        break;
      default:
        query = query.order("desc");
    }

    const offset = args.offset || 0;
    const limit = args.limit || 10;

    // Get reviews
    const reviews = await query.take(offset + limit);

    // Get responses for each review
    const reviewsWithResponses = await Promise.all(
      reviews.slice(offset).map(async (review) => {
        const responses = await ctx.db
          .query("reviewResponses")
          .withIndex("byReview", (q) => q.eq("reviewId", review._id))
          .filter((q) => q.eq(q.field("isApproved"), true))
          .order("asc")
          .collect();

        return {
          ...review,
          responses,
        };
      })
    );

    return reviewsWithResponses;
  },
});

// Create new review
export const createReview = mutation({
  args: {
    productId: v.id("products"),
    userId: v.optional(v.string()),
    orderId: v.optional(v.id("orders")),
    customerName: v.string(),
    rating: v.number(),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const now = Date.now();

    const reviewId = await ctx.db.insert("reviews", {
      ...args,
      isVerifiedPurchase: !!args.orderId,
      isApproved: false, // Reviews need approval by default
      helpfulVotes: 0,
      totalHelpful: 0,
      createdAt: now,
      updatedAt: now,
    });

    return reviewId;
  },
});

// Approve review (admin only)
export const approveReview = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reviewId, {
      isApproved: true,
      updatedAt: Date.now(),
    });

    return args.reviewId;
  },
});

// Get review statistics for a product
export const getProductReviewStats = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("byProduct", (q) => q.eq("productId", args.productId))
      .filter((q) => q.eq(q.field("isApproved"), true))
      .collect();

    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        verifiedPurchases: 0,
        helpfulVotes: 0,
        totalHelpful: 0,
      };
    }

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    const verifiedPurchases = reviews.filter(r => r.isVerifiedPurchase).length;
    const helpfulVotes = reviews.reduce((sum, review) => sum + review.helpfulVotes, 0);
    const totalHelpful = reviews.reduce((sum, review) => sum + review.totalHelpful, 0);

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      verifiedPurchases,
      helpfulVotes,
      totalHelpful,
    };
  },
});

// Get user's review for a product (if exists)
export const getUserReviewForProduct = query({
  args: {
    productId: v.id("products"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const review = await ctx.db
      .query("reviews")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();

    if (!review) return null;

    // Get responses for this review
    const responses = await ctx.db
      .query("reviewResponses")
      .withIndex("byReview", (q) => q.eq("reviewId", review._id))
      .filter((q) => q.eq(q.field("isApproved"), true))
      .order("asc")
      .collect();

    return {
      ...review,
      responses,
    };
  },
});

// Check if user can review product (hasn't reviewed and has purchased)
export const canUserReviewProduct = query({
  args: {
    productId: v.id("products"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already reviewed this product
    const existingReview = await ctx.db
      .query("reviews")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();

    if (existingReview) {
      return { canReview: false, reason: "already_reviewed" };
    }

    // Check if user has purchased this product
    const userOrders = await ctx.db
      .query("orders")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .collect();

    const hasPurchased = userOrders.some(order =>
      order.items.some(item => item.productId === args.productId)
    );

    if (!hasPurchased) {
      return { canReview: false, reason: "not_purchased" };
    }

    return { canReview: true };
  },
});