import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get published blogs
export const getBlogs = query({
  args: {
    limit: v.optional(v.number()),
    publishedOnly: v.optional(v.boolean()),
    tag: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("blogs");

    if (args.publishedOnly !== false) {
      query = query.filter((q) => q.eq(q.field("published"), true));
    }

    if (args.tag) {
      query = query.filter((q) => q.neq(q.field("tags"), null));
    }

    const blogs = await query.order("desc").take(args.limit || 20);

    // Filter by tag if specified
    if (args.tag) {
      return blogs.filter((blog) => blog.tags.includes(args.tag!));
    }

    return blogs;
  },
});

// Get blog by slug
export const getBlogBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blogs")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();
  },
});

// Create AI-generated blog
export const createBlog = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    internalLinks: v.optional(v.array(v.object({
      productId: v.id("products"),
      anchorText: v.string(),
      url: v.string(),
    }))),
    tags: v.array(v.string()),
    published: v.boolean(),
    seoScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const blogId = await ctx.db.insert("blogs", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    // Log SEO activity
    await ctx.db.insert("seoLogs", {
      action: "create_blog",
      entityId: blogId,
      entityType: "blog",
      details: {
        title: args.title,
        tags: args.tags,
        published: args.published,
      },
      createdAt: now,
    });

    return blogId;
  },
});

// Update blog
export const updateBlog = mutation({
  args: {
    blogId: v.id("blogs"),
    updates: v.object({
      title: v.optional(v.string()),
      content: v.optional(v.string()),
      excerpt: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      internalLinks: v.optional(v.array(v.object({
        productId: v.id("products"),
        anchorText: v.string(),
        url: v.string(),
      }))),
      tags: v.optional(v.array(v.string())),
      published: v.optional(v.boolean()),
      seoScore: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const { blogId, updates } = args;

    await ctx.db.patch(blogId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return blogId;
  },
});

// Get blog tags
export const getBlogTags = query({
  handler: async (ctx) => {
    const blogs = await ctx.db.query("blogs").collect();

    const tags = new Set<string>();
    blogs.forEach((blog) => {
      blog.tags.forEach((tag) => tags.add(tag));
    });

    return Array.from(tags).sort();
  },
});