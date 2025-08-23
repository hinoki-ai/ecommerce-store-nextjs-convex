import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Enhanced User management with Clerk integration and comprehensive security
    users: defineTable({
      name: v.string(),
      // This the Clerk ID, stored in the subject JWT field
      externalId: v.string(),
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
        language: v.string(), // "es-CL", "en", etc.
        currency: v.string(), // "CLP", "USD", "EUR", etc.
        notifications: v.boolean(),
      })),
      
      // Enhanced role and permission system
      role: v.optional(v.union(
        v.literal("super_admin"),
        v.literal("admin"),
        v.literal("moderator"),
        v.literal("affiliate"),
        v.literal("customer"),
        v.literal("viewer")
      )),
      permissions: v.optional(v.array(v.string())), // Granular permissions
      
      // Security and compliance
      isActive: v.optional(v.boolean()),
      isEmailVerified: v.optional(v.boolean()),
      isPhoneVerified: v.optional(v.boolean()),
      emailVerifiedAt: v.optional(v.number()),
      phoneVerifiedAt: v.optional(v.number()),
      
      // Enhanced tracking
      lastLoginAt: v.optional(v.number()),
      lastActiveAt: v.optional(v.number()),
      loginCount: v.optional(v.number()),
      failedLoginAttempts: v.optional(v.number()),
      lastFailedLoginAt: v.optional(v.number()),
      accountLockedUntil: v.optional(v.number()),
      
      // Affiliate system integration
      affiliateData: v.optional(v.object({
        referralCode: v.string(),
        commissionRate: v.number(),
        totalEarnings: v.number(),
        payoutMethod: v.union(
          v.literal("paypal"),
          v.literal("bank"),
          v.literal("stripe")
        ),
        isActive: v.boolean(),
      })),
      
      // User metadata and preferences
      metadata: v.optional(v.object({
        timezone: v.optional(v.string()),
        deviceInfo: v.optional(v.object({
          lastDevice: v.string(),
          lastIpAddress: v.string(),
          lastUserAgent: v.string(),
        })),
        marketingOptIn: v.optional(v.boolean()),
        privacySettings: v.optional(v.object({
          shareData: v.boolean(),
          allowTracking: v.boolean(),
          allowPersonalization: v.boolean(),
        })),
      })),
      
      createdAt: v.optional(v.number()),
      updatedAt: v.optional(v.number()),
    }).index("byExternalId", ["externalId"])
      .index("byEmail", ["email"])
      .index("byRole", ["role", "isActive"])
      .index("byActive", ["isActive", "lastActiveAt"])
      .index("byAffiliate", ["affiliateData.referralCode"])
      .index("byEmailVerified", ["isEmailVerified", "email"]),

    // Enhanced categories with SEO optimization
    categories: defineTable({
      name: v.string(),
      nameJA: v.optional(v.string()),
      slug: v.string(),
      description: v.optional(v.string()),
      parentId: v.optional(v.id("categories")),
      sortOrder: v.number(),
      isActive: v.boolean(),
      icon: v.optional(v.string()),
      color: v.optional(v.string()),

      // SEO fields
      metaTitle: v.optional(v.string()),
      metaDescription: v.optional(v.string()),
      seoScore: v.optional(v.number()),

      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("bySlug", ["slug"])
      .index("byParent", ["parentId"])
      .index("byActive", ["isActive", "sortOrder"])
      .searchIndex("search_categories", {
        searchField: "name",
        filterFields: ["isActive"]
      }),

    // Comprehensive products with AI-SEO integration
    products: defineTable({
      name: v.string(),
      nameJA: v.optional(v.string()),
      slug: v.string(),
      description: v.string(),
      shortDescription: v.optional(v.string()),
      sku: v.string(),
      barcode: v.optional(v.string()),
      categoryId: v.id("categories"),

      // Pricing
      price: v.number(),
      compareAtPrice: v.optional(v.number()),
      cost: v.optional(v.number()),
      taxRate: v.number(),

      // Inventory
      inventory: v.object({
        quantity: v.number(),
        lowStockThreshold: v.number(),
        trackInventory: v.boolean(),
        allowBackorder: v.boolean(),
      }),

      // Product attributes
      images: v.array(v.object({
        url: v.string(),
        alt: v.string(),
        sortOrder: v.number(),
      })),
      weight: v.optional(v.number()),
      dimensions: v.optional(v.object({
        length: v.number(),
        width: v.number(),
        height: v.number(),
      })),

      // Japanese-style freshness and quality indicators
      freshness: v.optional(v.object({
        expiryDate: v.optional(v.number()),
        isFresh: v.boolean(),
        isNew: v.boolean(),
        isPopular: v.boolean(),
      })),

      // Nutritional info for food products
      nutrition: v.optional(v.object({
        calories: v.optional(v.number()),
        allergens: v.optional(v.array(v.string())),
        ingredients: v.optional(v.array(v.string())),
      })),

      // SEO and metadata (enhanced with AI)
      metaTitle: v.optional(v.string()),
      metaDescription: v.optional(v.string()),
      tags: v.array(v.string()),
      seoScore: v.optional(v.number()),

      // AI-optimized fields
      optimizedTitle: v.optional(v.string()),
      optimizedDescription: v.optional(v.string()),
      originalTitle: v.optional(v.string()),
      originalDescription: v.optional(v.string()),

      // Status flags
      isActive: v.boolean(),
      isFeatured: v.boolean(),
      isDigital: v.boolean(),
      requiresShipping: v.boolean(),

      // Timestamps
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("bySlug", ["slug"])
      .index("bySku", ["sku"])
      .index("byBarcode", ["barcode"])
      .index("byCategory", ["categoryId", "isActive"])
      .index("byActive", ["isActive", "createdAt"])
      .index("byFeatured", ["isFeatured", "isActive"])
      .index("byPopular", ["freshness.isPopular", "isActive"])
      .index("byPrice", ["price", "isActive"])
      .searchIndex("search_products", {
        searchField: "name",
        filterFields: ["categoryId", "isActive", "tags"]
      }),

    // Shopping cart with real-time sync
    carts: defineTable({
      userId: v.optional(v.string()), // Optional for guest carts
      sessionId: v.optional(v.string()), // For guest cart persistence
      items: v.array(v.object({
        productId: v.id("products"),
        quantity: v.number(),
        price: v.number(), // Price at time of adding
        addedAt: v.number(),
      })),
      subtotal: v.number(),
      tax: v.number(),
      total: v.number(),
      currency: v.string(),
      expiresAt: v.optional(v.number()), // For guest cart cleanup
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("byUser", ["userId"])
      .index("bySession", ["sessionId"])
      .index("byExpiry", ["expiresAt"]),

    // Orders with comprehensive tracking
    orders: defineTable({
      orderNumber: v.string(),
      userId: v.optional(v.string()),
      customerInfo: v.object({
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
      }),

      // Shipping address
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

      // Order items snapshot
      items: v.array(v.object({
        productId: v.id("products"),
        name: v.string(),
        sku: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        totalPrice: v.number(),
      })),

      // Pricing breakdown
      subtotal: v.number(),
      taxAmount: v.number(),
      taxRate: v.number(),
      shippingCost: v.number(),
      discountAmount: v.optional(v.number()),
      totalAmount: v.number(),
      currency: v.string(),

      // Order status
      status: v.union(
        v.literal("pending"),
        v.literal("paid"),
        v.literal("processing"),
        v.literal("shipped"),
        v.literal("delivered"),
        v.literal("cancelled"),
        v.literal("refunded")
      ),

      // Payment info
      paymentStatus: v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("paid"),
        v.literal("failed"),
        v.literal("cancelled"),
        v.literal("refunded")
      ),
      paymentMethod: v.optional(v.string()),
      paymentIntentId: v.optional(v.string()),

      // Shipping info
      shippingMethod: v.optional(v.string()),
      trackingNumber: v.optional(v.string()),
      estimatedDeliveryDate: v.optional(v.number()),

      // Timestamps
      createdAt: v.number(),
      updatedAt: v.number(),
      shippedAt: v.optional(v.number()),
      deliveredAt: v.optional(v.number()),
    }).index("byOrderNumber", ["orderNumber"])
      .index("byUser", ["userId"])
      .index("byStatus", ["status", "createdAt"])
      .index("byPaymentStatus", ["paymentStatus"]),

    // Inventory tracking
    inventoryLogs: defineTable({
      productId: v.id("products"),
      type: v.union(
        v.literal("stock_in"),
        v.literal("stock_out"),
        v.literal("reserved"),
        v.literal("released"),
        v.literal("adjustment")
      ),
      quantity: v.number(),
      previousQuantity: v.number(),
      newQuantity: v.number(),
      reason: v.optional(v.string()),
      orderId: v.optional(v.id("orders")),
      userId: v.optional(v.string()),
      createdAt: v.number(),
    }).index("byProduct", ["productId", "createdAt"])
      .index("byType", ["type", "createdAt"])
      .index("byOrder", ["orderId"]),

    // Reviews and ratings
    reviews: defineTable({
      productId: v.id("products"),
      userId: v.optional(v.string()),
      orderId: v.optional(v.id("orders")),
      customerName: v.string(),
      rating: v.number(),
      title: v.optional(v.string()),
      content: v.optional(v.string()),
      isVerifiedPurchase: v.boolean(),
      isApproved: v.boolean(),
      helpfulVotes: v.number(),
      totalHelpful: v.number(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("byProduct", ["productId", "isApproved"])
      .index("byUser", ["userId"])
      .index("byRating", ["rating", "isApproved"])
      .index("byHelpful", ["totalHelpful", "isApproved"]),

    // Review helpful votes (separate table for tracking individual votes)
    reviewHelpfulVotes: defineTable({
      reviewId: v.id("reviews"),
      userId: v.string(),
      voteType: v.union(v.literal("helpful"), v.literal("not_helpful")),
      createdAt: v.number(),
    }).index("byReview", ["reviewId", "userId"])
      .index("byUser", ["userId", "createdAt"]),

    // Review responses (admin/vendor responses to reviews)
    reviewResponses: defineTable({
      reviewId: v.id("reviews"),
      userId: v.string(), // Admin or vendor user ID
      userName: v.string(),
      content: v.string(),
      isApproved: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("byReview", ["reviewId", "createdAt"])

    // Wishlist lists (user can have multiple wishlists)
    wishlistLists: defineTable({
      userId: v.string(),
      name: v.string(),
      description: v.optional(v.string()),
      isPublic: v.boolean(),
      isDefault: v.boolean(),
      color: v.optional(v.string()),
      icon: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("byUser", ["userId", "createdAt"])
      .index("byUserDefault", ["userId", "isDefault"]),

    // Wishlist items
    wishlists: defineTable({
      userId: v.string(),
      wishlistId: v.id("wishlistLists"),
      productId: v.id("products"),
      addedAt: v.number(),
    }).index("byWishlist", ["wishlistId", "addedAt"])
      .index("byUserProduct", ["userId", "productId"])
      .index("byUser", ["userId", "addedAt"]),

    // AI-generated blog posts for SEO
    blogs: defineTable({
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
      metaTitle: v.optional(v.string()),
      metaDescription: v.optional(v.string()),
      tags: v.array(v.string()),
      published: v.boolean(),
      seoScore: v.optional(v.number()),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("bySlug", ["slug"])
      .index("byPublished", ["published", "createdAt"])
      .searchIndex("search_blogs", {
        searchField: "title",
        filterFields: ["published", "tags"]
      }),

    // AI collections for SEO optimization
    collections: defineTable({
      name: v.string(),
      slug: v.string(),
      description: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      tags: v.array(v.string()),
      products: v.array(v.id("products")),
      isHoliday: v.boolean(),
      holidayDate: v.optional(v.number()),
      isActive: v.boolean(),
      metaTitle: v.optional(v.string()),
      metaDescription: v.optional(v.string()),
      seoScore: v.optional(v.number()),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("bySlug", ["slug"])
      .index("byHoliday", ["isHoliday", "holidayDate"])
      .index("byActive", ["isActive"])
      .searchIndex("search_collections", {
        searchField: "name",
        filterFields: ["isActive", "tags"]
      }),

    // SEO activity logs
    seoLogs: defineTable({
      action: v.string(),
      entityId: v.string(),
      entityType: v.string(),
      details: v.optional(v.any()),
      userId: v.optional(v.string()),
      createdAt: v.number(),
    }).index("byEntity", ["entityType", "entityId"])
      .index("byAction", ["action", "createdAt"])
      .index("byUser", ["userId"]),

    // Product variants (sizes, colors, etc.)
    productVariants: defineTable({
      productId: v.id("products"),
      name: v.string(), // e.g., "Size", "Color"
      type: v.union(v.literal("select"), v.literal("radio"), v.literal("checkbox")),
      options: v.array(v.object({
        value: v.string(), // e.g., "S", "M", "L" or "Red", "Blue", "Green"
        label: v.string(), // e.g., "Small", "Medium", "Large" or "Rojo", "Azul", "Verde"
        priceAdjustment: v.optional(v.number()), // Additional cost for this variant
        imageUrl: v.optional(v.string()), // Optional image for this variant
        stockQuantity: v.optional(v.number()), // Stock specific to this variant
        sku: v.optional(v.string()), // SKU specific to this variant
      })),
      required: v.boolean(),
      sortOrder: v.number(),
      isActive: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("byProduct", ["productId", "sortOrder"])
      .index("byActive", ["isActive"]),

    // Payment attempts tracking
    paymentAttempts: defineTable({
      payment_id: v.string(),
      userId: v.optional(v.string()),
      payer: v.object({
        user_id: v.optional(v.string()),
        email: v.optional(v.string()),
        name: v.optional(v.string()),
      }),
      amount: v.number(),
      currency: v.string(),
      status: v.string(),
      description: v.optional(v.string()),
      created_at: v.number(),
      updated_at: v.number(),
    }).index("byPaymentId", ["payment_id"])
      .index("byUserId", ["userId"])
      .index("byPayerUserId", ["payer.user_id"]),

    // User notifications
    notifications: defineTable({
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
      data: v.optional(v.any()), // Additional data specific to notification type
      isRead: v.boolean(),
      priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
      expiresAt: v.optional(v.number()),
      createdAt: v.number(),
    }).index("byUser", ["userId", "createdAt"])
      .index("byUserUnread", ["userId", "isRead", "createdAt"])
      .index("byType", ["type", "createdAt"])
      .index("byUserType", ["userId", "type", "createdAt"]),

    // Advanced promotions system
    promotions: defineTable({
      name: v.string(),
      description: v.string(),
      code: v.string(), // Coupon code for manual entry
      type: v.union(
        v.literal("coupon"),      // User enters code
        v.literal("automatic"),   // Auto-applied based on conditions
        v.literal("campaign")     // Marketing campaign promotion
      ),

      // Promotion conditions (JSON array)
      conditions: v.array(v.object({
        type: v.union(
          v.literal("min_purchase"),
          v.literal("category_purchase"),
          v.literal("product_specific"),
          v.literal("quantity_threshold"),
          v.literal("user_segment"),
          v.literal("first_purchase"),
          v.literal("location_based")
        ),
        value: v.any(), // Can be string, number, or array
        operator: v.union(
          v.literal("gt"),
          v.literal("gte"),
          v.literal("lt"),
          v.literal("lte"),
          v.literal("eq"),
          v.literal("in"),
          v.literal("not_in")
        ),
        metadata: v.optional(v.any())
      })),

      // Promotion actions (JSON array)
      actions: v.array(v.object({
        type: v.union(
          v.literal("percentage_discount"),
          v.literal("fixed_discount"),
          v.literal("free_shipping"),
          v.literal("buy_x_get_y"),
          v.literal("bundle_discount"),
          v.literal("cashback"),
          v.literal("points_reward")
        ),
        value: v.number(),
        target: v.optional(v.union(
          v.literal("cart_total"),
          v.literal("product"),
          v.literal("category"),
          v.literal("shipping")
        )),
        metadata: v.optional(v.any())
      })),

      // Promotion settings
      priority: v.number(), // Higher numbers = higher priority
      startDate: v.number(),
      endDate: v.number(),
      maxUses: v.number(), // -1 for unlimited
      maxUsesPerUser: v.number(), // -1 for unlimited
      stackable: v.boolean(), // Can be combined with other promotions
      isActive: v.boolean(),

      // Usage tracking
      usage: v.object({
        totalUses: v.number(),
        userUses: v.any(), // Record<userId, count>
        lastUsed: v.number(),
        revenue: v.number() // Total revenue from this promotion
      }),

      // Additional metadata
      metadata: v.optional(v.any()),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("byCode", ["code"])
      .index("byType", ["type", "isActive"])
      .index("byActive", ["isActive", "priority"])
      .index("byDateRange", ["startDate", "endDate", "isActive"])
      .searchIndex("search_promotions", {
        searchField: "name",
        filterFields: ["type", "isActive"]
      }),

    // Promotion usage history
    promotionUsages: defineTable({
      promotionId: v.id("promotions"),
      userId: v.optional(v.string()),
      orderId: v.optional(v.id("orders")),
      discountAmount: v.number(),
      originalAmount: v.number(),
      finalAmount: v.number(),
      context: v.optional(v.any()), // Cart details when promotion was applied
      createdAt: v.number(),
    }).index("byPromotion", ["promotionId", "createdAt"])
      .index("byUser", ["userId", "createdAt"])
      .index("byOrder", ["orderId"])
      .index("byDate", ["createdAt"]),

    // Coupon redemptions (for tracking coupon usage)
    couponRedemptions: defineTable({
      promotionId: v.id("promotions"),
      code: v.string(),
      userId: v.optional(v.string()),
      sessionId: v.optional(v.string()), // For guest users
      status: v.union(
        v.literal("pending"),    // Code entered but not yet applied
        v.literal("applied"),    // Successfully applied to cart
        v.literal("used"),       // Order completed with this code
        v.literal("expired"),    // Code expired before use
        v.literal("invalid")     // Code was invalid
      ),
      discountAmount: v.optional(v.number()),
      metadata: v.optional(v.any()),
      createdAt: v.number(),
      usedAt: v.optional(v.number()),
    }).index("byCode", ["code", "status"])
      .index("byUser", ["userId", "status"])
      .index("byPromotion", ["promotionId", "status"])
      .index("bySession", ["sessionId", "status"]),

    // User behavior tracking for personalization
    userBehavior: defineTable({
      userId: v.optional(v.string()),
      sessionId: v.string(), // For anonymous users
      eventType: v.union(
        v.literal("page_view"),
        v.literal("product_view"),
        v.literal("add_to_cart"),
        v.literal("remove_from_cart"),
        v.literal("wishlist_add"),
        v.literal("search"),
        v.literal("category_browse"),
        v.literal("checkout_start"),
        v.literal("checkout_abandon"),
        v.literal("purchase"),
        v.literal("review_submit")
      ),
      entityId: v.optional(v.string()), // Product ID, Category ID, etc.
      entityType: v.optional(v.string()), // "product", "category", etc.
      metadata: v.optional(v.any()), // Additional event data
      deviceInfo: v.optional(v.object({
        type: v.string(), // "mobile", "desktop", "tablet"
        os: v.optional(v.string()),
        browser: v.optional(v.string()),
        screenSize: v.optional(v.string())
      })),
      location: v.optional(v.object({
        country: v.string(),
        region: v.optional(v.string()),
        city: v.optional(v.string())
      })),
      createdAt: v.number(),
    }).index("byUser", ["userId", "eventType", "createdAt"])
      .index("bySession", ["sessionId", "eventType", "createdAt"])
      .index("byEntity", ["entityId", "entityType", "createdAt"])
      .index("byEvent", ["eventType", "createdAt"])
      .index("byDate", ["createdAt"]),

    // Personalization profiles
    personalizationProfiles: defineTable({
      userId: v.optional(v.string()),
      sessionId: v.string(),
      
      // User preferences inferred from behavior
      preferences: v.object({
        categories: v.array(v.object({
          categoryId: v.string(),
          score: v.number(), // 0-1 interest score
          lastUpdated: v.number()
        })),
        priceRange: v.object({
          min: v.number(),
          max: v.number(),
          preferred: v.number()
        }),
        brands: v.array(v.object({
          brand: v.string(),
          score: v.number()
        })),
        tags: v.array(v.object({
          tag: v.string(),
          score: v.number()
        }))
      }),

      // Behavioral patterns
      patterns: v.object({
        sessionDuration: v.number(), // Average session time
        pageViewsPerSession: v.number(),
        conversionRate: v.number(),
        averageOrderValue: v.number(),
        purchaseFrequency: v.number(), // Days between purchases
        seasonalPatterns: v.optional(v.any()),
        timePatterns: v.optional(v.any()) // Preferred shopping times
      }),

      // Recommendation cache
      recommendations: v.optional(v.object({
        products: v.array(v.string()), // Product IDs
        collections: v.array(v.string()), // Collection IDs
        promotions: v.array(v.string()), // Promotion IDs
        lastGenerated: v.number(),
        score: v.number() // Confidence score
      })),

      lastUpdated: v.number(),
      createdAt: v.number(),
    }).index("byUser", ["userId"])
      .index("bySession", ["sessionId"])
      .index("byLastUpdated", ["lastUpdated"]),

    // Social media integration
    socialShares: defineTable({
      userId: v.optional(v.string()),
      entityId: v.string(), // Product ID, Collection ID, etc.
      entityType: v.string(), // "product", "collection", "blog"
      platform: v.union(
        v.literal("facebook"),
        v.literal("twitter"),
        v.literal("instagram"),
        v.literal("whatsapp"),
        v.literal("telegram"),
        v.literal("email")
      ),
      shareType: v.union(
        v.literal("direct_share"),
        v.literal("wishlist_share"),
        v.literal("review_share")
      ),
      metadata: v.optional(v.any()),
      createdAt: v.number(),
    }).index("byEntity", ["entityId", "entityType"])
      .index("byUser", ["userId", "createdAt"])
      .index("byPlatform", ["platform", "createdAt"])
      .index("byDate", ["createdAt"]),

    // PWA push notifications
    pushSubscriptions: defineTable({
      userId: v.optional(v.string()),
      sessionId: v.string(),
      endpoint: v.string(),
      keys: v.object({
        p256dh: v.string(),
        auth: v.string()
      }),
      deviceInfo: v.optional(v.object({
        type: v.string(),
        os: v.optional(v.string()),
        browser: v.optional(v.string())
      })),
      preferences: v.object({
        orderUpdates: v.boolean(),
        promotions: v.boolean(),
        newArrivals: v.boolean(),
        priceDrops: v.boolean(),
        backInStock: v.boolean()
      }),
      isActive: v.boolean(),
      createdAt: v.number(),
      lastUsed: v.optional(v.number()),
    }).index("byUser", ["userId", "isActive"])
      .index("bySession", ["sessionId", "isActive"])
      .index("byEndpoint", ["endpoint"])
      .index("byActive", ["isActive", "createdAt"]),

    // Push notification history
    pushNotifications: defineTable({
      subscriptionId: v.id("pushSubscriptions"),
      userId: v.optional(v.string()),
      type: v.union(
        v.literal("order_update"),
        v.literal("promotion"),
        v.literal("new_arrival"),
        v.literal("price_drop"),
        v.literal("back_in_stock"),
        v.literal("cart_abandonment"),
        v.literal("review_reminder")
      ),
      title: v.string(),
      body: v.string(),
      icon: v.optional(v.string()),
      badge: v.optional(v.string()),
      data: v.optional(v.any()),
      status: v.union(
        v.literal("sent"),
        v.literal("delivered"),
        v.literal("clicked"),
        v.literal("dismissed"),
        v.literal("failed")
      ),
      sentAt: v.number(),
      deliveredAt: v.optional(v.number()),
      clickedAt: v.optional(v.number()),
    }).index("bySubscription", ["subscriptionId", "sentAt"])
      .index("byUser", ["userId", "type", "sentAt"])
      .index("byType", ["type", "status", "sentAt"])
      .index("byDate", ["sentAt"]),

    // Enhanced Security and Audit Logging (based on proven patterns)
    securityLogs: defineTable({
      userId: v.optional(v.string()),
      sessionId: v.optional(v.string()),
      action: v.union(
        v.literal("login_success"),
        v.literal("login_failure"),
        v.literal("logout"),
        v.literal("password_change"),
        v.literal("email_change"),
        v.literal("role_change"),
        v.literal("permission_change"),
        v.literal("account_lock"),
        v.literal("account_unlock"),
        v.literal("data_access"),
        v.literal("data_modification"),
        v.literal("suspicious_activity"),
        v.literal("api_abuse"),
        v.literal("admin_action")
      ),
      severity: v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("critical")
      ),
      resource: v.optional(v.string()), // Table/API endpoint accessed
      resourceId: v.optional(v.string()), // Specific record ID if applicable
      
      // Request context
      metadata: v.object({
        ipAddress: v.optional(v.string()),
        userAgent: v.optional(v.string()),
        requestId: v.optional(v.string()),
        endpoint: v.optional(v.string()),
        method: v.optional(v.string()),
        statusCode: v.optional(v.number()),
        responseTime: v.optional(v.number()),
        errorMessage: v.optional(v.string()),
        stackTrace: v.optional(v.string()),
        additionalData: v.optional(v.any()),
      }),
      
      // Geolocation for security analysis
      location: v.optional(v.object({
        country: v.string(),
        region: v.optional(v.string()),
        city: v.optional(v.string()),
        coordinates: v.optional(v.object({
          lat: v.number(),
          lng: v.number(),
        })),
      })),
      
      createdAt: v.number(),
    }).index("byUser", ["userId", "action", "createdAt"])
      .index("byAction", ["action", "severity", "createdAt"])
      .index("bySeverity", ["severity", "createdAt"])
      .index("byResource", ["resource", "resourceId", "createdAt"])
      .index("byDate", ["createdAt"])
      .index("byIpAddress", ["metadata.ipAddress", "createdAt"]),

    // Data change audit trail
    auditLogs: defineTable({
      userId: v.optional(v.string()),
      sessionId: v.optional(v.string()),
      entityType: v.string(), // Table name
      entityId: v.string(), // Record ID
      action: v.union(
        v.literal("create"),
        v.literal("read"),
        v.literal("update"),
        v.literal("delete"),
        v.literal("bulk_update"),
        v.literal("bulk_delete")
      ),
      
      // Change tracking
      changes: v.optional(v.object({
        before: v.optional(v.any()), // Previous values
        after: v.optional(v.any()), // New values
        changedFields: v.array(v.string()), // List of changed field names
      })),
      
      // Context information
      context: v.object({
        ipAddress: v.optional(v.string()),
        userAgent: v.optional(v.string()),
        requestId: v.optional(v.string()),
        source: v.optional(v.string()), // "web", "api", "admin", "system"
        reason: v.optional(v.string()), // Reason for the change
      }),
      
      createdAt: v.number(),
    }).index("byEntity", ["entityType", "entityId", "createdAt"])
      .index("byUser", ["userId", "action", "createdAt"])
      .index("byAction", ["action", "createdAt"])
      .index("byDate", ["createdAt"])
      .index("byContext", ["context.source", "createdAt"]),

    // System health and performance monitoring
    systemMetrics: defineTable({
      metricType: v.union(
        v.literal("api_performance"),
        v.literal("database_performance"),
        v.literal("error_rate"),
        v.literal("user_activity"),
        v.literal("security_events"),
        v.literal("resource_usage"),
        v.literal("business_metrics")
      ),
      name: v.string(), // Specific metric name
      value: v.number(), // Metric value
      unit: v.string(), // "ms", "count", "percent", etc.
      
      // Metric dimensions for filtering/grouping
      dimensions: v.optional(v.object({
        endpoint: v.optional(v.string()),
        userId: v.optional(v.string()),
        region: v.optional(v.string()),
        device: v.optional(v.string()),
        version: v.optional(v.string()),
      })),
      
      // Additional metadata
      metadata: v.optional(v.any()),
      timestamp: v.number(),
      createdAt: v.number(),
    }).index("byType", ["metricType", "timestamp"])
      .index("byName", ["name", "timestamp"])
      .index("byTimestamp", ["timestamp"])
      .index("byTypeAndName", ["metricType", "name", "timestamp"]),

    // Feature flags and configuration management
    featureFlags: defineTable({
      name: v.string(),
      description: v.string(),
      isEnabled: v.boolean(),
      
      // Targeting rules
      targeting: v.object({
        percentage: v.number(), // 0-100, percentage of users to enable for
        userIds: v.optional(v.array(v.string())), // Specific user IDs
        roles: v.optional(v.array(v.string())), // Specific roles
        segments: v.optional(v.array(v.string())), // User segments
        countries: v.optional(v.array(v.string())), // Geographic targeting
        platforms: v.optional(v.array(v.string())), // Platform targeting
      }),
      
      // Configuration values
      config: v.optional(v.any()), // Feature-specific configuration
      
      // Rollout management
      rolloutStartedAt: v.optional(v.number()),
      rolloutCompletedAt: v.optional(v.number()),
      rolloutStrategy: v.union(
        v.literal("instant"),
        v.literal("gradual"),
        v.literal("scheduled")
      ),
      
      // Monitoring
      usageCount: v.number(),
      lastUsedAt: v.optional(v.number()),
      
      // Metadata
      tags: v.array(v.string()),
      category: v.string(),
      priority: v.number(),
      
      createdBy: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("byName", ["name"])
      .index("byEnabled", ["isEnabled"])
      .index("byCategory", ["category", "isEnabled"])
      .index("byPriority", ["priority", "isEnabled"])
      .index("byCreatedBy", ["createdBy"]),

    // API rate limiting and quota management
    apiQuotas: defineTable({
      userId: v.optional(v.string()),
      ipAddress: v.optional(v.string()),
      apiKey: v.optional(v.string()),
      
      // Quota configuration
      quotaType: v.union(
        v.literal("requests_per_minute"),
        v.literal("requests_per_hour"),
        v.literal("requests_per_day"),
        v.literal("bandwidth_per_day"),
        v.literal("ai_operations_per_day")
      ),
      limit: v.number(),
      
      // Current usage
      currentUsage: v.number(),
      resetAt: v.number(), // When the quota resets
      
      // Status
      isBlocked: v.boolean(),
      blockedUntil: v.optional(v.number()),
      warnings: v.number(), // Warning count before blocking
      
      // Metadata
      metadata: v.optional(v.any()),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("byUser", ["userId", "quotaType"])
      .index("byIpAddress", ["ipAddress", "quotaType"])
      .index("byApiKey", ["apiKey", "quotaType"])
      .index("byBlocked", ["isBlocked", "blockedUntil"])
      .index("byResetTime", ["resetAt"]),

    // Affiliate system (enhanced from proven patterns)
    affiliateCommissions: defineTable({
      affiliateId: v.string(), // User ID of affiliate
      orderId: v.id("orders"),
      customerId: v.optional(v.string()),
      
      // Commission details
      orderTotal: v.number(),
      commissionRate: v.number(), // Percentage
      commissionAmount: v.number(),
      currency: v.string(),
      
      // Status tracking
      status: v.union(
        v.literal("pending"), // Order placed, commission calculated
        v.literal("approved"), // Order confirmed, commission approved
        v.literal("paid"), // Commission paid to affiliate
        v.literal("cancelled"), // Order cancelled or returned
        v.literal("disputed") // Commission disputed
      ),
      
      // Payment information
      approvedAt: v.optional(v.number()),
      paidAt: v.optional(v.number()),
      paymentMethod: v.optional(v.string()),
      transactionId: v.optional(v.string()),
      
      // Metadata
      metadata: v.optional(v.object({
        clickId: v.optional(v.string()),
        referrerUrl: v.optional(v.string()),
        conversionType: v.optional(v.string()),
        campaignId: v.optional(v.string()),
      })),
      
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("byAffiliate", ["affiliateId", "status", "createdAt"])
      .index("byOrder", ["orderId"])
      .index("byStatus", ["status", "createdAt"])
      .index("byCustomer", ["customerId", "createdAt"])
      .index("byPaymentDue", ["status", "approvedAt"]),

    // Affiliate referral tracking
    affiliateReferrals: defineTable({
      affiliateId: v.string(),
      referralCode: v.string(),
      visitedAt: v.number(),
      
      // Visitor information
      visitorId: v.optional(v.string()), // Anonymous visitor ID
      userId: v.optional(v.string()), // If user signs up/logs in
      sessionId: v.string(),
      
      // Tracking data
      referrerUrl: v.optional(v.string()),
      landingPage: v.string(),
      
      // Visitor context
      deviceInfo: v.optional(v.object({
        type: v.string(), // "mobile", "desktop", "tablet"
        os: v.optional(v.string()),
        browser: v.optional(v.string()),
      })),
      location: v.optional(v.object({
        country: v.string(),
        region: v.optional(v.string()),
        city: v.optional(v.string()),
      })),
      
      // Conversion tracking
      converted: v.boolean(),
      convertedAt: v.optional(v.number()),
      conversionValue: v.optional(v.number()),
      
      createdAt: v.number(),
    }).index("byAffiliate", ["affiliateId", "createdAt"])
      .index("byReferralCode", ["referralCode", "createdAt"])
      .index("byVisitor", ["visitedAt"])
      .index("bySession", ["sessionId"])
      .index("byConverted", ["converted", "convertedAt"]),

    // Workflow automation system (inspired by ParkingLot patterns)
    workflows: defineTable({
      name: v.string(),
      description: v.optional(v.string()),
      category: v.union(
        v.literal("marketing"),
        v.literal("customer_service"),
        v.literal("inventory"),
        v.literal("orders"),
        v.literal("security"),
        v.literal("analytics"),
        v.literal("maintenance")
      ),
      
      // Trigger configuration
      triggerType: v.union(
        v.literal("schedule"), // Time-based
        v.literal("event"), // Event-driven
        v.literal("condition"), // Condition-based
        v.literal("manual") // Manual execution
      ),
      triggerConfig: v.object({
        // Event triggers
        eventType: v.optional(v.string()), // "order_placed", "user_registered", etc.
        conditions: v.optional(v.array(v.object({
          field: v.string(),
          operator: v.string(),
          value: v.any(),
        }))),
        
        // Schedule triggers
        schedule: v.optional(v.object({
          frequency: v.string(), // "daily", "weekly", "monthly"
          time: v.optional(v.string()), // "14:30"
          daysOfWeek: v.optional(v.array(v.number())),
        })),
      }),
      
      // Actions to execute
      actions: v.array(v.object({
        type: v.string(), // "send_email", "update_inventory", "create_order", etc.
        config: v.any(), // Action-specific configuration
        order: v.number(), // Execution order
        enabled: v.boolean(),
      })),
      
      // Status and execution tracking
      isActive: v.boolean(),
      executionCount: v.number(),
      lastExecuted: v.optional(v.number()),
      nextExecution: v.optional(v.number()),
      successRate: v.number(), // 0-1
      
      createdBy: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("byCategory", ["category", "isActive"])
      .index("byTriggerType", ["triggerType", "isActive"])
      .index("byActive", ["isActive"])
      .index("byNextExecution", ["nextExecution"])
      .index("byCreatedBy", ["createdBy"]),

    // Workflow execution history
    workflowExecutions: defineTable({
      workflowId: v.id("workflows"),
      status: v.union(
        v.literal("pending"),
        v.literal("running"),
        v.literal("completed"),
        v.literal("failed"),
        v.literal("cancelled")
      ),
      
      // Execution details
      startedAt: v.number(),
      completedAt: v.optional(v.number()),
      executionTime: v.optional(v.number()), // milliseconds
      
      // Action results
      actionsExecuted: v.array(v.object({
        actionType: v.string(),
        status: v.string(),
        result: v.optional(v.any()),
        error: v.optional(v.string()),
        executionTime: v.number(),
      })),
      
      // Overall results
      totalActions: v.number(),
      successfulActions: v.number(),
      failedActions: v.number(),
      
      // Trigger data
      triggerData: v.optional(v.any()),
      
      // Error information
      error: v.optional(v.string()),
      
      createdAt: v.number(),
    }).index("byWorkflow", ["workflowId", "createdAt"])
      .index("byStatus", ["status", "createdAt"])
      .index("byDate", ["createdAt"]),
  });