import { ID } from '../types';

export interface SocialShareRequest {
  entityId: ID;
  entityType: 'product' | 'collection' | 'blog' | 'wishlist' | 'review';
  platform: 'facebook' | 'twitter' | 'instagram' | 'whatsapp' | 'telegram' | 'email';
  shareType: 'direct_share' | 'wishlist_share' | 'review_share';
  customMessage?: string;
  userId?: ID;
  metadata?: Record<string, any>;
}

export interface SocialShareContent {
  title: string;
  description: string;
  imageUrl?: string;
  url: string;
  hashtags?: string[];
  price?: string;
  discount?: string;
}

export interface SocialPlatformConfig {
  appId?: string;
  appSecret?: string;
  apiVersion?: string;
  accessToken?: string;
  webhookSecret?: string;
  enabled: boolean;
}

export interface SocialAnalytics {
  platform: string;
  shares: number;
  clicks: number;
  engagement: number;
  conversions: number;
  revenue: number;
  topContent: Array<{
    entityId: string;
    entityType: string;
    shares: number;
    engagement: number;
  }>;
}

export class SocialMediaService {
  
  /**
   * Generate optimized share content for different platforms
   */
  static async generateShareContent(
    shareRequest: SocialShareRequest,
    entityData: any
  ): Promise<SocialShareContent> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tu-tienda.cl';
    
    switch (shareRequest.entityType) {
      case 'product':
        return this.generateProductShareContent(entityData, shareRequest, baseUrl);
      
      case 'collection':
        return this.generateCollectionShareContent(entityData, shareRequest, baseUrl);
      
      case 'blog':
        return this.generateBlogShareContent(entityData, shareRequest, baseUrl);
      
      case 'wishlist':
        return this.generateWishlistShareContent(entityData, shareRequest, baseUrl);
      
      case 'review':
        return this.generateReviewShareContent(entityData, shareRequest, baseUrl);
      
      default:
        throw new Error(`Unsupported entity type: ${shareRequest.entityType}`);
    }
  }

  /**
   * Get platform-specific share URL
   */
  static getPlatformShareUrl(
    platform: string,
    shareContent: SocialShareContent,
    customMessage?: string
  ): string {
    const encodedUrl = encodeURIComponent(shareContent.url);
    const encodedTitle = encodeURIComponent(shareContent.title);
    const encodedDescription = encodeURIComponent(shareContent.description);
    const message = customMessage || `${shareContent.title} - ${shareContent.description}`;
    const encodedMessage = encodeURIComponent(message);

    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
      
      case 'twitter':
        const hashtags = shareContent.hashtags?.join(',') || 'ecommerce,chile';
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtags}`;
      
      case 'whatsapp':
        return `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`;
      
      case 'telegram':
        return `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`;
      
      case 'email':
        const subject = encodeURIComponent(shareContent.title);
        const body = encodeURIComponent(`${shareContent.description}\n\n${shareContent.url}`);
        return `mailto:?subject=${subject}&body=${body}`;
      
      default:
        return shareContent.url;
    }
  }

  /**
   * Track social share event
   */
  static async trackSocialShare(shareRequest: SocialShareRequest): Promise<void> {
    // This would integrate with analytics service
    try {
      // Log to database (Convex socialShares table)
      const shareData = {
        userId: shareRequest.userId,
        entityId: shareRequest.entityId,
        entityType: shareRequest.entityType,
        platform: shareRequest.platform,
        shareType: shareRequest.shareType,
        metadata: shareRequest.metadata,
        createdAt: Date.now()
      };

      // In real implementation, this would call Convex mutation
      console.log('Social share tracked:', shareData);
      
      // Also track with external analytics (Google Analytics, Facebook Pixel, etc.)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'share', {
          method: shareRequest.platform,
          content_type: shareRequest.entityType,
          content_id: shareRequest.entityId
        });
      }
      
    } catch (error) {
      console.error('Failed to track social share:', error);
    }
  }

  /**
   * Generate social media post using AI
   */
  static async generateAISocialPost(
    entityData: any,
    platform: string,
    audience: 'chilean' | 'general' = 'chilean'
  ): Promise<{
    title: string;
    description: string;
    hashtags: string[];
    callToAction: string;
  }> {
    // This would integrate with OpenAI API
    const prompt = `
    Create an engaging social media post for ${platform} promoting this product:
    
    Product: ${entityData.name}
    Description: ${entityData.description}
    Price: $${entityData.price} CLP
    Category: ${entityData.category}
    
    Requirements:
    - Write in Spanish for Chilean audience
    - Use informal, engaging tone
    - Include relevant hashtags
    - Add compelling call-to-action
    - Optimize for ${platform} format
    - Highlight value proposition
    
    Platform-specific requirements:
    ${this.getPlatformRequirements(platform)}
    `;

    try {
      // In real implementation, call OpenAI API
      // For now, return template-based content
      return this.generateTemplatePost(entityData, platform, audience);
    } catch (error) {
      console.error('AI post generation failed:', error);
      return this.generateTemplatePost(entityData, platform, audience);
    }
  }

  /**
   * Get social analytics for dashboard
   */
  static async getSocialAnalytics(
    dateRange: { start: Date; end: Date },
    entityType?: string
  ): Promise<SocialAnalytics[]> {
    // This would query the socialShares table and aggregate data
    const platforms = ['facebook', 'twitter', 'instagram', 'whatsapp', 'telegram', 'email'];
    
    return platforms.map(platform => ({
      platform,
      shares: Math.floor(Math.random() * 100), // Mock data
      clicks: Math.floor(Math.random() * 500),
      engagement: Math.random() * 10,
      conversions: Math.floor(Math.random() * 20),
      revenue: Math.random() * 10000,
      topContent: [] // Would be populated from real data
    }));
  }

  /**
   * Setup social media webhooks for tracking
   */
  static async setupWebhooks(): Promise<void> {
    // Setup Facebook/Instagram webhooks for tracking shares and engagement
    // This would be called during application initialization
  }

  // Private helper methods
  private static generateProductShareContent(
    product: any,
    shareRequest: SocialShareRequest,
    baseUrl: string
  ): SocialShareContent {
    const discount = product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

    const price = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(product.price);

    const title = discount > 0 
      ? `¡${discount}% OFF! ${product.name}`
      : product.name;

    const description = discount > 0
      ? `¡Increíble oferta! ${product.name} con ${discount}% de descuento. Solo ${price}. ¡Aprovecha antes de que se acabe!`
      : `Descubre ${product.name} - calidad premium a excelente precio. Solo ${price}.`;

    return {
      title,
      description,
      imageUrl: product.images?.[0]?.url,
      url: `${baseUrl}/products/${product.slug}?ref=social_${shareRequest.platform}`,
      hashtags: ['oferta', 'chile', 'ecommerce', ...product.seo?.tags?.slice(0, 3) || []],
      price,
      discount: discount > 0 ? `${discount}%` : undefined
    };
  }

  private static generateCollectionShareContent(
    collection: any,
    shareRequest: SocialShareRequest,
    baseUrl: string
  ): SocialShareContent {
    return {
      title: `Colección: ${collection.name}`,
      description: collection.description || `Descubre nuestra increíble colección ${collection.name}. Productos seleccionados especialmente para ti.`,
      imageUrl: collection.imageUrl,
      url: `${baseUrl}/collections/${collection.slug}?ref=social_${shareRequest.platform}`,
      hashtags: ['coleccion', 'chile', 'moda', 'estilo']
    };
  }

  private static generateBlogShareContent(
    blog: any,
    shareRequest: SocialShareRequest,
    baseUrl: string
  ): SocialShareContent {
    return {
      title: blog.title,
      description: blog.excerpt || blog.content?.substring(0, 160) + '...',
      imageUrl: blog.imageUrl,
      url: `${baseUrl}/blog/${blog.slug}?ref=social_${shareRequest.platform}`,
      hashtags: blog.tags?.slice(0, 5) || ['blog', 'consejos', 'chile']
    };
  }

  private static generateWishlistShareContent(
    wishlist: any,
    shareRequest: SocialShareRequest,
    baseUrl: string
  ): SocialShareContent {
    return {
      title: `Mi Lista de Deseos: ${wishlist.name}`,
      description: `Echa un vistazo a mi lista de deseos "${wishlist.name}". ¡Hay productos increíbles que me encantan!`,
      imageUrl: wishlist.imageUrl,
      url: `${baseUrl}/wishlist/shared/${wishlist.id}?ref=social_${shareRequest.platform}`,
      hashtags: ['wishlist', 'deseos', 'chile', 'regalos']
    };
  }

  private static generateReviewShareContent(
    review: any,
    shareRequest: SocialShareRequest,
    baseUrl: string
  ): SocialShareContent {
    const stars = '⭐'.repeat(review.rating);
    
    return {
      title: `Mi reseña: ${review.productName}`,
      description: `${stars} "${review.content?.substring(0, 100) || 'Excelente producto'}" - Mi experiencia comprando en nuestra tienda.`,
      imageUrl: review.productImage,
      url: `${baseUrl}/products/${review.productSlug}?ref=social_${shareRequest.platform}#review-${review.id}`,
      hashtags: ['review', 'experiencia', 'cliente', 'chile']
    };
  }

  private static getPlatformRequirements(platform: string): string {
    switch (platform) {
      case 'facebook':
        return '- Max 240 characters\n- Focus on emotional connection\n- Use emojis sparingly';
      case 'twitter':
        return '- Max 280 characters\n- Include 2-3 relevant hashtags\n- Create urgency';
      case 'instagram':
        return '- Longer form content allowed\n- Use 5-10 hashtags\n- Visual storytelling focus';
      case 'whatsapp':
        return '- Conversational tone\n- Personal recommendation style\n- Include direct link';
      default:
        return '- Engaging and conversational\n- Clear call-to-action';
    }
  }

  private static generateTemplatePost(
    entityData: any,
    platform: string,
    audience: 'chilean' | 'general'
  ) {
    const templates = {
      chilean: {
        title: `¡Mira esto! ${entityData.name}`,
        description: `¡Hola! Encontré este producto increíble que te puede interesar. ${entityData.name} a solo $${entityData.price}. ¡Es una ganga!`,
        hashtags: ['chile', 'oferta', 'ecommerce', 'compras'],
        callToAction: '¡Compralo ahora antes de que se acabe!'
      },
      general: {
        title: `Check this out: ${entityData.name}`,
        description: `Amazing product at a great price! ${entityData.name} for only $${entityData.price}.`,
        hashtags: ['shopping', 'deals', 'ecommerce'],
        callToAction: 'Shop now while supplies last!'
      }
    };

    return templates[audience];
  }
}