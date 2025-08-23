import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Type definitions for SEO analysis
interface SEOAnalysis {
  title: {
    length: number;
    optimal: boolean;
    hasKeywords: boolean;
  };
  description: {
    length: number;
    optimal: boolean;
    hasKeywords: boolean;
  };
  metaTitle: {
    exists: boolean;
    length: number;
    optimal: boolean;
  };
  metaDescription: {
    exists: boolean;
    length: number;
    optimal: boolean;
  };
  tags: {
    count: number;
    relevant: boolean;
  };
  images: {
    hasImages: boolean;
    withAlt: boolean;
  };
  slug: {
    length: number;
    optimal: boolean;
    hasKeywords: boolean;
  };
}

// Advanced SEO Analysis Functions
export const analyzeProductSEO = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) return null;

    // Basic SEO analysis
    const analysis = {
      title: {
        length: product.name.length,
        optimal: product.name.length >= 30 && product.name.length <= 60,
        hasKeywords: product.name.toLowerCase().includes(product.name.split(' ')[0].toLowerCase()),
      },
      description: {
        length: product.description.length,
        optimal: product.description.length >= 120 && product.description.length <= 160,
        hasKeywords: product.description.toLowerCase().includes(product.name.split(' ')[0].toLowerCase()),
      },
      metaTitle: {
        exists: !!product.metaTitle,
        length: product.metaTitle?.length || 0,
        optimal: (product.metaTitle?.length || 0) >= 30 && (product.metaTitle?.length || 0) <= 60,
      },
      metaDescription: {
        exists: !!product.metaDescription,
        length: product.metaDescription?.length || 0,
        optimal: (product.metaDescription?.length || 0) >= 120 && (product.metaDescription?.length || 0) <= 160,
      },
      tags: {
        count: product.tags.length,
        relevant: product.tags.length >= 3 && product.tags.length <= 10,
      },
      images: {
        hasImages: product.images.length > 0,
        withAlt: product.images.filter(img => img.alt).length === product.images.length,
      },
      slug: {
        length: product.slug.length,
        optimal: product.slug.length >= 3 && product.slug.length <= 50,
        hasKeywords: product.slug.includes(product.name.split(' ')[0].toLowerCase()),
      },
    };

    // Calculate overall SEO score
    let score = 0;
    let maxScore = 0;

    // Title analysis (20 points)
    maxScore += 20;
    if (analysis.title.optimal) score += 20;
    else if (analysis.title.length >= 20) score += 10;

    // Description analysis (15 points)
    maxScore += 15;
    if (analysis.description.optimal) score += 15;
    else if (analysis.description.length >= 100) score += 7;

    // Meta title (15 points)
    maxScore += 15;
    if (analysis.metaTitle.exists && analysis.metaTitle.optimal) score += 15;
    else if (analysis.metaTitle.exists) score += 7;

    // Meta description (15 points)
    maxScore += 15;
    if (analysis.metaDescription.exists && analysis.metaDescription.optimal) score += 15;
    else if (analysis.metaDescription.exists) score += 7;

    // Tags (10 points)
    maxScore += 10;
    if (analysis.tags.relevant) score += 10;
    else if (analysis.tags.count > 0) score += 5;

    // Images (10 points)
    maxScore += 10;
    if (analysis.images.hasImages && analysis.images.withAlt) score += 10;
    else if (analysis.images.hasImages) score += 5;

    // Slug (10 points)
    maxScore += 10;
    if (analysis.slug.optimal && analysis.slug.hasKeywords) score += 10;
    else if (analysis.slug.optimal) score += 5;

    // Keyword presence (5 points)
    maxScore += 5;
    if (analysis.title.hasKeywords && analysis.description.hasKeywords) score += 5;
    else if (analysis.title.hasKeywords || analysis.description.hasKeywords) score += 2;

    const seoScore = Math.round((score / maxScore) * 100);

    return {
      ...analysis,
      score,
      maxScore,
      seoScore,
      recommendations: generateSEORecommendations(analysis),
    };
  },
});

// Generate SEO recommendations based on analysis
function generateSEORecommendations(analysis: SEOAnalysis) {
  const recommendations = [];

  if (!analysis.title.optimal) {
    if (analysis.title.length < 30) {
      recommendations.push("Title is too short. Aim for 30-60 characters.");
    } else if (analysis.title.length > 60) {
      recommendations.push("Title is too long. Consider shortening to 30-60 characters.");
    }
  }

  if (!analysis.description.optimal) {
    if (analysis.description.length < 120) {
      recommendations.push("Description is too short. Aim for 120-160 characters.");
    } else if (analysis.description.length > 160) {
      recommendations.push("Description is too long. Consider shortening to 120-160 characters.");
    }
  }

  if (!analysis.metaTitle.exists) {
    recommendations.push("Add a meta title for better search visibility.");
  } else if (!analysis.metaTitle.optimal) {
    if (analysis.metaTitle.length < 30) {
      recommendations.push("Meta title is too short. Aim for 30-60 characters.");
    } else if (analysis.metaTitle.length > 60) {
      recommendations.push("Meta title is too long. Consider shortening to 30-60 characters.");
    }
  }

  if (!analysis.metaDescription.exists) {
    recommendations.push("Add a meta description for better search visibility.");
  } else if (!analysis.metaDescription.optimal) {
    if (analysis.metaDescription.length < 120) {
      recommendations.push("Meta description is too short. Aim for 120-160 characters.");
    } else if (analysis.metaDescription.length > 160) {
      recommendations.push("Meta description is too long. Consider shortening to 120-160 characters.");
    }
  }

  if (!analysis.tags.relevant) {
    if (analysis.tags.count < 3) {
      recommendations.push("Add more relevant tags (aim for 3-10 tags).");
    } else if (analysis.tags.count > 10) {
      recommendations.push("Consider reducing the number of tags to focus on the most relevant ones.");
    }
  }

  if (!analysis.images.withAlt) {
    recommendations.push("Add alt text to all product images for better accessibility and SEO.");
  }

  if (!analysis.slug.optimal) {
    if (analysis.slug.length < 3) {
      recommendations.push("URL slug is too short. Consider making it more descriptive.");
    } else if (analysis.slug.length > 50) {
      recommendations.push("URL slug is too long. Consider shortening for better readability.");
    }
  }

  return recommendations;
}

// Auto-generate SEO-optimized content
export const generateSEOContent = mutation({
  args: {
    productId: v.id("products"),
    contentType: v.union(v.literal("metaTitle"), v.literal("metaDescription"), v.literal("optimizedTitle"), v.literal("optimizedDescription")),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Get category information for better context
    const category = await ctx.db.get(product.categoryId);
    const categoryName = category?.name || "Product";

    // Get similar products for keyword research
    const similarProducts = await ctx.db
      .query("products")
      .filter((q) => q.and(
        q.eq(q.field("categoryId"), product.categoryId),
        q.neq(q.field("_id"), args.productId),
        q.eq(q.field("isActive"), true)
      ))
      .take(5);

    // Extract common keywords from similar products
    const keywords = new Set();
    [product, ...similarProducts].forEach(p => {
      if (p) {
        p.tags.forEach(tag => keywords.add(tag));
        // Extract keywords from name
        p.name.split(' ').forEach(word => {
          if (word.length > 3) keywords.add(word.toLowerCase());
        });
      }
    });

    const keywordList = Array.from(keywords).slice(0, 5);

    // Generate content based on type
    let generatedContent = "";

    switch (args.contentType) {
      case "metaTitle":
        generatedContent = generateMetaTitle(product.name, categoryName, keywordList);
        break;
      case "metaDescription":
        generatedContent = generateMetaDescription(product.name, product.shortDescription || product.description, categoryName, keywordList);
        break;
      case "optimizedTitle":
        generatedContent = generateOptimizedTitle(product.name, categoryName, keywordList);
        break;
      case "optimizedDescription":
        generatedContent = generateOptimizedDescription(product.name, product.description, categoryName, keywordList);
        break;
    }

    // Update product with generated content
    const updates: {
      metaTitle?: string;
      metaDescription?: string;
      optimizedTitle?: string;
      optimizedDescription?: string;
      seoScore?: number;
    } = {};
    updates[args.contentType] = generatedContent;

    // Calculate new SEO score after optimization
    const analysis = await ctx.runQuery("seo:analyzeProductSEO", { productId: args.productId });
    if (analysis) {
      updates.seoScore = analysis.seoScore;
    }

    await ctx.db.patch(args.productId, {
      ...updates,
      updatedAt: Date.now(),
    });

    // Log the content generation
    await ctx.db.insert("seoLogs", {
      action: "generate_seo_content",
      entityId: args.productId,
      entityType: "product",
      details: {
        contentType: args.contentType,
        generatedContent: generatedContent.substring(0, 100) + "...",
        keywords: keywordList,
      },
      createdAt: Date.now(),
    });

    return {
      contentType: args.contentType,
      generatedContent,
      keywords: keywordList,
    };
  },
});

// Helper functions for content generation
function generateMetaTitle(productName: string, categoryName: string, keywords: string[]): string {
  const primaryKeyword = keywords[0] || productName.split(' ')[0];
  const title = `${productName} - Premium ${categoryName} | ${primaryKeyword}`;
  return title.length > 60 ? title.substring(0, 57) + "..." : title;
}

function generateMetaDescription(productName: string, description: string, categoryName: string, keywords: string[]): string {
  const cleanDescription = description.replace(/[^\w\s]/g, ' ').substring(0, 100);
  const primaryKeyword = keywords[0] || productName.split(' ')[0];
  const metaDesc = `${productName} - Premium ${categoryName} featuring ${primaryKeyword}. ${cleanDescription}... Shop now for the best quality and prices.`;
  return metaDesc.length > 160 ? metaDesc.substring(0, 157) + "..." : metaDesc;
}

function generateOptimizedTitle(productName: string, categoryName: string, keywords: string[]): string {
  const primaryKeyword = keywords[0] || categoryName;
  return `${primaryKeyword} ${productName} - Premium Quality`;
}

function generateOptimizedDescription(productName: string, description: string, categoryName: string, keywords: string[]): string {
  const keywordString = keywords.slice(0, 3).join(", ");
  const optimizedDesc = `Discover our premium ${productName}, featuring ${keywordString}. As part of our ${categoryName} collection, this product offers exceptional quality and value. ${description.substring(0, 200)}...`;
  return optimizedDesc;
}

// Bulk SEO optimization for multiple products
export const bulkOptimizeSEO = mutation({
  args: {
    productIds: v.array(v.id("products")),
    optimizeTypes: v.array(v.union(
      v.literal("metaTitle"),
      v.literal("metaDescription"),
      v.literal("optimizedTitle"),
      v.literal("optimizedDescription")
    )),
  },
  handler: async (ctx, args) => {
    const results = [];

    for (const productId of args.productIds) {
      try {
        for (const contentType of args.optimizeTypes) {
          const result = await ctx.runMutation("seo:generateSEOContent", {
            productId,
            contentType,
          });
          results.push({
            productId,
            contentType,
            success: true,
            result,
          });
        }
      } catch (error) {
        results.push({
          productId,
          success: false,
          error: error.message,
        });
      }
    }

    // Log bulk operation
    await ctx.db.insert("seoLogs", {
      action: "bulk_seo_optimization",
      entityId: "bulk",
      entityType: "products",
      details: {
        productCount: args.productIds.length,
        optimizeTypes: args.optimizeTypes,
        results: results.length,
      },
      createdAt: Date.now(),
    });

    return results;
  },
});

// Get SEO optimization suggestions
export const getSEOOptimizationSuggestions = query({
  args: {},
  handler: async (ctx, args) => {
    // Get products with poor SEO scores
    const products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const productsNeedingOptimization = products
      .filter(p => !p.seoScore || p.seoScore < 70)
      .sort((a, b) => (a.seoScore || 0) - (b.seoScore || 0))
      .slice(0, 10);

    const suggestions = [];

    // Analyze products and generate suggestions
    for (const product of productsNeedingOptimization) {
      const analysis = await ctx.runQuery("seo:analyzeProductSEO", { productId: product._id });
      if (analysis) {
        suggestions.push({
          productId: product._id,
          productName: product.name,
          currentScore: analysis.seoScore,
          recommendations: analysis.recommendations,
          priority: analysis.seoScore < 50 ? "high" : analysis.seoScore < 70 ? "medium" : "low",
        });
      }
    }

    return suggestions;
  },
});

// SEO Performance Analytics
export const getSEOPerformanceAnalytics = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const startDate = Date.now() - (days * 24 * 60 * 60 * 1000);

    // Get SEO logs for the period
    const seoLogs = await ctx.db
      .query("seoLogs")
      .filter((q) => q.gte(q.field("createdAt"), startDate))
      .collect();

    // Analyze optimization trends
    const optimizationTrends = seoLogs.reduce((acc, log) => {
      const date = new Date(log.createdAt).toDateString();
      if (!acc[date]) {
        acc[date] = { optimizations: 0, score: 0 };
      }
      acc[date].optimizations++;

      // Extract score if available in details
      if (log.details && typeof log.details === 'object' && log.details.seoScore) {
        acc[date].score = log.details.seoScore;
      }

      return acc;
    }, {} as Record<string, { optimizations: number; score: number }>);

    // Get top optimized products
    const productOptimizations = seoLogs
      .filter(log => log.entityType === "product")
      .reduce((acc, log) => {
        if (!acc[log.entityId]) {
          acc[log.entityId] = 0;
        }
        acc[log.entityId]++;
        return acc;
      }, {} as Record<string, number>);

    const topOptimizedProducts = Object.entries(productOptimizations)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Get product details for top optimized
    const topProductDetails = await Promise.all(
      topOptimizedProducts.map(async ([productId, optimizations]) => {
        const product = await ctx.db.get(productId);
        return {
          productId,
          productName: product?.name || "Unknown",
          optimizations,
          currentScore: product?.seoScore || 0,
        };
      })
    );

    return {
      period: `${days} days`,
      totalOptimizations: seoLogs.length,
      optimizationTrends,
      topOptimizedProducts: topProductDetails,
      optimizationTypes: seoLogs.reduce((acc, log) => {
        const type = log.action;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  },
});

// Log SEO activity
export const logSEOActivity = mutation({
  args: {
    action: v.string(),
    entityId: v.string(),
    entityType: v.string(),
    details: v.optional(v.any()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const logId = await ctx.db.insert("seoLogs", {
      ...args,
      createdAt: Date.now(),
    });

    return logId;
  },
});

// Get SEO logs
export const getSEOLogs = query({
  args: {
    limit: v.optional(v.number()),
    entityType: v.optional(v.string()),
    action: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("seoLogs");

    if (args.entityType) {
      query = query.filter((q) => q.eq(q.field("entityType"), args.entityType));
    }

    if (args.action) {
      query = query.filter((q) => q.eq(q.field("action"), args.action));
    }

    return await query.order("desc").take(args.limit || 50);
  },
});

// Get SEO statistics
export const getSEOStats = query({
  handler: async (ctx) => {
    const [products, blogs, collections] = await Promise.all([
      ctx.db.query("products").collect(),
      ctx.db.query("blogs").collect(),
      ctx.db.query("collections").collect(),
    ]);

    const totalProducts = products.length;
    const optimizedProducts = products.filter(p => p.seoScore && p.seoScore > 0).length;
    const averageProductScore = products
      .filter(p => p.seoScore)
      .reduce((sum, p) => sum + (p.seoScore || 0), 0) / Math.max(1, optimizedProducts);

    const totalBlogs = blogs.length;
    const publishedBlogs = blogs.filter(b => b.published).length;
    const averageBlogScore = blogs
      .filter(b => b.seoScore)
      .reduce((sum, b) => sum + (b.seoScore || 0), 0) / Math.max(1, blogs.filter(b => b.seoScore).length);

    const totalCollections = collections.length;
    const activeCollections = collections.filter(c => c.isActive).length;
    const averageCollectionScore = collections
      .filter(c => c.seoScore)
      .reduce((sum, c) => sum + (c.seoScore || 0), 0) / Math.max(1, collections.filter(c => c.seoScore).length);

    return {
      products: {
        total: totalProducts,
        optimized: optimizedProducts,
        averageScore: Math.round(averageProductScore * 10) / 10,
      },
      blogs: {
        total: totalBlogs,
        published: publishedBlogs,
        averageScore: Math.round(averageBlogScore * 10) / 10,
      },
      collections: {
        total: totalCollections,
        active: activeCollections,
        averageScore: Math.round(averageCollectionScore * 10) / 10,
      },
    };
  },
});

// Get products needing SEO optimization
export const getProductsNeedingSEO = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Sort by SEO score (nulls first, then lowest scores)
    const sortedProducts = products.sort((a, b) => {
      if (a.seoScore === null && b.seoScore === null) return 0;
      if (a.seoScore === null) return -1;
      if (b.seoScore === null) return 1;
      return (a.seoScore || 0) - (b.seoScore || 0);
    });

    return sortedProducts.slice(0, args.limit || 20);
  },
});

// Optimize product SEO (update scores and metadata)
export const optimizeProductSEO = mutation({
  args: {
    productId: v.id("products"),
    optimizedTitle: v.optional(v.string()),
    optimizedDescription: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    seoScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { productId, ...updates } = args;

    await ctx.db.patch(productId, {
      ...updates,
      updatedAt: Date.now(),
    });

    // Log the optimization
    await ctx.db.insert("seoLogs", {
      action: "optimize_product",
      entityId: productId,
      entityType: "product",
      details: {
        optimizedTitle: updates.optimizedTitle,
        seoScore: updates.seoScore,
      },
      createdAt: Date.now(),
    });

    return productId;
  },
});