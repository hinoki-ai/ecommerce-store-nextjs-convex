export interface SocialPlatform {
  id: string
  name: string
  displayName: string
  icon: string
  color: string
  isActive: boolean
  features: SocialFeature[]
  apiConfig?: {
    clientId?: string
    clientSecret?: string
    accessToken?: string
    refreshToken?: string
    expiresAt?: Date
  }
}

export type SocialFeature = 
  | 'share'           // Compartir productos
  | 'login'           // Login social
  | 'catalog_sync'    // Sincronización de catálogo
  | 'advertising'     // Publicidad
  | 'messaging'       // Mensajería
  | 'reviews'         // Reseñas sociales
  | 'live_shopping'   // Compras en vivo
  | 'stories'         // Historias/Stories
  | 'ugc'            // User Generated Content

export interface SocialPost {
  id: string
  platform: string
  postId?: string     // ID en la plataforma
  productId: string
  content: string
  media: SocialMedia[]
  hashtags: string[]
  mentions: string[]
  scheduledAt?: Date
  publishedAt?: Date
  status: PostStatus
  engagement: SocialEngagement
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export type PostStatus = 
  | 'draft'     // Borrador
  | 'scheduled' // Programado
  | 'published' // Publicado
  | 'failed'    // Error al publicar
  | 'archived'  // Archivado

export interface SocialMedia {
  type: 'image' | 'video' | 'carousel'
  url: string
  thumbnail?: string
  alt: string
  order: number
}

export interface SocialEngagement {
  likes: number
  comments: number
  shares: number
  clicks: number
  impressions: number
  reach: number
  saves: number
  lastUpdated: Date
}

export interface SocialShare {
  id: string
  productId: string
  platform: string
  sharedBy: string
  shareUrl: string
  customMessage?: string
  clicks: number
  conversions: number
  revenue: number
  sharedAt: Date
  utmParameters: {
    source: string
    medium: string
    campaign?: string
    content?: string
  }
}

export interface SocialReview {
  id: string
  platform: string
  platformReviewId: string
  productId: string
  customerId: string
  customerName: string
  customerAvatar?: string
  rating: number
  title: string
  content: string
  images?: string[]
  verified: boolean
  helpful: number
  reported: number
  response?: {
    content: string
    respondedBy: string
    respondedAt: Date
  }
  createdAt: Date
  updatedAt: Date
}

export interface UGCContent {
  id: string
  platform: string
  contentType: 'image' | 'video' | 'story' | 'reel' | 'tiktok'
  originalUrl: string
  mediaUrl: string
  thumbnail?: string
  caption: string
  author: {
    username: string
    displayName: string
    avatar?: string
    verified: boolean
    followers: number
  }
  productTags: string[]
  hashtags: string[]
  mentions: string[]
  engagement: SocialEngagement
  isApproved: boolean
  isRightsCleared: boolean
  usage: {
    canUseInAds: boolean
    canUseOnWebsite: boolean
    canUseInEmail: boolean
    expiresAt?: Date
  }
  createdAt: Date
  discoveredAt: Date
}

export interface SocialCampaign {
  id: string
  name: string
  description: string
  platforms: string[]
  objectives: CampaignObjective[]
  budget: {
    total: number
    spent: number
    currency: string
  }
  targeting: {
    demographics: {
      ageMin?: number
      ageMax?: number
      gender?: 'male' | 'female' | 'all'
      locations: string[]
    }
    interests: string[]
    behaviors: string[]
    customAudiences: string[]
    lookalikes: string[]
  }
  products: string[]
  startDate: Date
  endDate: Date
  status: CampaignStatus
  metrics: CampaignMetrics
  createdAt: Date
  updatedAt: Date
}

export type CampaignObjective =
  | 'awareness'      // Conocimiento de marca
  | 'traffic'        // Tráfico al sitio
  | 'engagement'     // Interacción
  | 'leads'          // Generación de leads
  | 'sales'          // Ventas directas
  | 'retargeting'    // Remarketing

export type CampaignStatus =
  | 'draft'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled'

export interface CampaignMetrics {
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  cpm: number
  conversions: number
  conversionRate: number
  revenue: number
  roas: number
  lastUpdated: Date
}

export interface SocialAnalytics {
  platform: string
  period: {
    startDate: Date
    endDate: Date
  }
  followers: {
    count: number
    growth: number
    growthRate: number
  }
  engagement: {
    rate: number
    likes: number
    comments: number
    shares: number
    saves: number
  }
  reach: {
    organic: number
    paid: number
    total: number
  }
  traffic: {
    clicks: number
    sessions: number
    conversions: number
    revenue: number
  }
  topPosts: SocialPost[]
  demographics: {
    ageGroups: Record<string, number>
    genders: Record<string, number>
    locations: Record<string, number>
  }
}

// Predefined social platforms
export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'facebook',
    name: 'facebook',
    displayName: 'Facebook',
    icon: '📘',
    color: '#1877F2',
    isActive: true,
    features: ['share', 'login', 'catalog_sync', 'advertising', 'messaging', 'reviews']
  },
  {
    id: 'instagram',
    name: 'instagram', 
    displayName: 'Instagram',
    icon: '📸',
    color: '#E4405F',
    isActive: true,
    features: ['share', 'catalog_sync', 'advertising', 'stories', 'ugc', 'live_shopping']
  },
  {
    id: 'tiktok',
    name: 'tiktok',
    displayName: 'TikTok',
    icon: '🎵',
    color: '#000000',
    isActive: true,
    features: ['share', 'advertising', 'ugc', 'live_shopping']
  },
  {
    id: 'twitter',
    name: 'twitter',
    displayName: 'X (Twitter)',
    icon: '🐦',
    color: '#1DA1F2',
    isActive: true,
    features: ['share', 'login', 'advertising', 'ugc']
  },
  {
    id: 'pinterest',
    name: 'pinterest',
    displayName: 'Pinterest',
    icon: '📌',
    color: '#BD081C',
    isActive: true,
    features: ['share', 'catalog_sync', 'advertising']
  },
  {
    id: 'youtube',
    name: 'youtube',
    displayName: 'YouTube',
    icon: '📺',
    color: '#FF0000',
    isActive: true,
    features: ['share', 'advertising', 'ugc']
  },
  {
    id: 'linkedin',
    name: 'linkedin',
    displayName: 'LinkedIn',
    icon: '💼',
    color: '#0A66C2',
    isActive: false,
    features: ['share', 'login', 'advertising']
  },
  {
    id: 'snapchat',
    name: 'snapchat',
    displayName: 'Snapchat',
    icon: '👻',
    color: '#FFFC00',
    isActive: false,
    features: ['share', 'advertising', 'stories']
  }
]

// Mock data
export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    platform: 'instagram',
    postId: 'ig_123456789',
    productId: 'prod-1',
    content: '¡Nuevos audífonos premium con 30 horas de batería! 🎧 Perfectos para tu rutina diaria. #TechLife #Wireless #Premium',
    media: [
      {
        type: 'image',
        url: '/api/placeholder/1080/1080',
        alt: 'Audífonos premium wireless',
        order: 0
      }
    ],
    hashtags: ['TechLife', 'Wireless', 'Premium', 'Audio'],
    mentions: [],
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'published',
    engagement: {
      likes: 1250,
      comments: 89,
      shares: 156,
      clicks: 432,
      impressions: 12500,
      reach: 8900,
      saves: 234,
      lastUpdated: new Date()
    },
    createdBy: 'admin-1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 'post-2',
    platform: 'facebook',
    productId: 'prod-2',
    content: 'Camiseta 100% algodón orgánico. Comodidad y estilo sostenible. ¿Ya tienes la tuya?',
    media: [
      {
        type: 'image',
        url: '/api/placeholder/1200/628',
        alt: 'Camiseta de algodón orgánico',
        order: 0
      }
    ],
    hashtags: ['Sustainable', 'Organic', 'Fashion', 'EcoFriendly'],
    mentions: [],
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: 'scheduled',
    engagement: {
      likes: 0,
      comments: 0,
      shares: 0,
      clicks: 0,
      impressions: 0,
      reach: 0,
      saves: 0,
      lastUpdated: new Date()
    },
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const MOCK_UGC_CONTENT: UGCContent[] = [
  {
    id: 'ugc-1',
    platform: 'instagram',
    contentType: 'image',
    originalUrl: 'https://instagram.com/p/abc123',
    mediaUrl: '/api/placeholder/400/400',
    caption: 'Loving my new headphones! Sound quality is amazing 🎧 @ourstore',
    author: {
      username: 'musiclover_sofia',
      displayName: 'Sofia Martinez',
      avatar: '/api/placeholder/50/50',
      verified: false,
      followers: 2500
    },
    productTags: ['prod-1'],
    hashtags: ['music', 'headphones', 'audiophile'],
    mentions: ['ourstore'],
    engagement: {
      likes: 156,
      comments: 12,
      shares: 8,
      clicks: 0,
      impressions: 850,
      reach: 720,
      saves: 23,
      lastUpdated: new Date()
    },
    isApproved: true,
    isRightsCleared: false,
    usage: {
      canUseInAds: false,
      canUseOnWebsite: true,
      canUseInEmail: true
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    discoveredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  }
]

// Advanced Social Media Service
export class SocialMediaService {
  private platforms: Map<string, SocialPlatform> = new Map()
  private posts: SocialPost[] = []
  private shares: SocialShare[] = []
  private reviews: SocialReview[] = []
  private ugcContent: UGCContent[] = []
  private campaigns: SocialCampaign[] = []

  constructor() {
    // Initialize platforms
    SOCIAL_PLATFORMS.forEach(platform => {
      this.platforms.set(platform.id, platform)
    })

    // Initialize with mock data
    this.posts = [...MOCK_SOCIAL_POSTS]
    this.ugcContent = [...MOCK_UGC_CONTENT]
  }

  // Platform management
  async getPlatforms(): Promise<SocialPlatform[]> {
    return Array.from(this.platforms.values())
  }

  async getPlatform(platformId: string): Promise<SocialPlatform | null> {
    return this.platforms.get(platformId) || null
  }

  async updatePlatform(platformId: string, updates: Partial<SocialPlatform>): Promise<SocialPlatform | null> {
    const platform = this.platforms.get(platformId)
    if (!platform) return null

    const updated = { ...platform, ...updates }
    this.platforms.set(platformId, updated)
    return updated
  }

  // Social sharing
  async shareProduct(
    productId: string,
    platform: string,
    customMessage?: string,
    userId?: string
  ): Promise<SocialShare> {
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/products/${productId}?utm_source=${platform}&utm_medium=social&utm_campaign=product_share`
    
    const share: SocialShare = {
      id: `share-${Date.now()}`,
      productId,
      platform,
      sharedBy: userId || 'anonymous',
      shareUrl,
      customMessage,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      sharedAt: new Date(),
      utmParameters: {
        source: platform,
        medium: 'social',
        campaign: 'product_share'
      }
    }

    this.shares.push(share)
    return share
  }

  async getShareAnalytics(productId?: string, platform?: string): Promise<{
    totalShares: number
    totalClicks: number
    totalConversions: number
    totalRevenue: number
    byPlatform: Record<string, {
      shares: number
      clicks: number
      conversions: number
      revenue: number
    }>
  }> {
    let filteredShares = this.shares

    if (productId) {
      filteredShares = filteredShares.filter(s => s.productId === productId)
    }
    
    if (platform) {
      filteredShares = filteredShares.filter(s => s.platform === platform)
    }

    const totalShares = filteredShares.length
    const totalClicks = filteredShares.reduce((sum, s) => sum + s.clicks, 0)
    const totalConversions = filteredShares.reduce((sum, s) => sum + s.conversions, 0)
    const totalRevenue = filteredShares.reduce((sum, s) => sum + s.revenue, 0)

    const byPlatform: Record<string, any> = {}
    
    for (const share of filteredShares) {
      if (!byPlatform[share.platform]) {
        byPlatform[share.platform] = {
          shares: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0
        }
      }
      
      byPlatform[share.platform].shares++
      byPlatform[share.platform].clicks += share.clicks
      byPlatform[share.platform].conversions += share.conversions
      byPlatform[share.platform].revenue += share.revenue
    }

    return {
      totalShares,
      totalClicks,
      totalConversions,
      totalRevenue,
      byPlatform
    }
  }

  // Content posting
  async createPost(postData: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<SocialPost> {
    const post: SocialPost = {
      ...postData,
      id: `post-${Date.now()}`,
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        clicks: 0,
        impressions: 0,
        reach: 0,
        saves: 0,
        lastUpdated: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.posts.push(post)
    return post
  }

  async getPosts(platform?: string, status?: PostStatus): Promise<SocialPost[]> {
    let filteredPosts = [...this.posts]

    if (platform) {
      filteredPosts = filteredPosts.filter(p => p.platform === platform)
    }

    if (status) {
      filteredPosts = filteredPosts.filter(p => p.status === status)
    }

    return filteredPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async publishPost(postId: string): Promise<SocialPost | null> {
    const postIndex = this.posts.findIndex(p => p.id === postId)
    if (postIndex === -1) return null

    this.posts[postIndex] = {
      ...this.posts[postIndex],
      status: 'published',
      publishedAt: new Date(),
      updatedAt: new Date()
    }

    // Simulate social platform publishing
    const platformId = `${this.posts[postIndex].platform}_${Date.now()}`
    this.posts[postIndex].postId = platformId

    return this.posts[postIndex]
  }

  async updatePostEngagement(postId: string, engagement: Partial<SocialEngagement>): Promise<void> {
    const postIndex = this.posts.findIndex(p => p.id === postId)
    if (postIndex !== -1) {
      this.posts[postIndex].engagement = {
        ...this.posts[postIndex].engagement,
        ...engagement,
        lastUpdated: new Date()
      }
    }
  }

  // UGC management
  async getUGCContent(approved?: boolean, platform?: string): Promise<UGCContent[]> {
    let content = [...this.ugcContent]

    if (approved !== undefined) {
      content = content.filter(c => c.isApproved === approved)
    }

    if (platform) {
      content = content.filter(c => c.platform === platform)
    }

    return content.sort((a, b) => b.discoveredAt.getTime() - a.discoveredAt.getTime())
  }

  async approveUGC(ugcId: string): Promise<UGCContent | null> {
    const ugcIndex = this.ugcContent.findIndex(c => c.id === ugcId)
    if (ugcIndex === -1) return null

    this.ugcContent[ugcIndex].isApproved = true
    return this.ugcContent[ugcIndex]
  }

  async requestUGCRights(ugcId: string, usage: Partial<UGCContent['usage']>): Promise<UGCContent | null> {
    const ugcIndex = this.ugcContent.findIndex(c => c.id === ugcId)
    if (ugcIndex === -1) return null

    this.ugcContent[ugcIndex].usage = {
      ...this.ugcContent[ugcIndex].usage,
      ...usage
    }
    
    this.ugcContent[ugcIndex].isRightsCleared = true
    return this.ugcContent[ugcIndex]
  }

  // Social reviews
  async importReviews(platform: string, productId: string): Promise<SocialReview[]> {
    // Mock implementation - in reality would call platform APIs
    const mockReviews: SocialReview[] = [
      {
        id: `review-${Date.now()}`,
        platform,
        platformReviewId: `${platform}_review_123`,
        productId,
        customerId: 'customer-123',
        customerName: 'María González',
        customerAvatar: '/api/placeholder/40/40',
        rating: 5,
        title: 'Excelente calidad',
        content: 'Superó mis expectativas. La calidad es increíble y llegó muy rápido.',
        verified: true,
        helpful: 12,
        reported: 0,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ]

    this.reviews.push(...mockReviews)
    return mockReviews
  }

  async respondToReview(reviewId: string, response: string, respondedBy: string): Promise<SocialReview | null> {
    const reviewIndex = this.reviews.findIndex(r => r.id === reviewId)
    if (reviewIndex === -1) return null

    this.reviews[reviewIndex].response = {
      content: response,
      respondedBy,
      respondedAt: new Date()
    }

    return this.reviews[reviewIndex]
  }

  // Analytics
  async getPlatformAnalytics(platform: string, startDate: Date, endDate: Date): Promise<SocialAnalytics> {
    const platformPosts = this.posts.filter(p => 
      p.platform === platform && 
      p.publishedAt &&
      p.publishedAt >= startDate && 
      p.publishedAt <= endDate
    )

    const totalLikes = platformPosts.reduce((sum, p) => sum + p.engagement.likes, 0)
    const totalComments = platformPosts.reduce((sum, p) => sum + p.engagement.comments, 0)
    const totalShares = platformPosts.reduce((sum, p) => sum + p.engagement.shares, 0)
    const totalClicks = platformPosts.reduce((sum, p) => sum + p.engagement.clicks, 0)
    const totalImpressions = platformPosts.reduce((sum, p) => sum + p.engagement.impressions, 0)
    const totalReach = platformPosts.reduce((sum, p) => sum + p.engagement.reach, 0)
    const totalSaves = platformPosts.reduce((sum, p) => sum + p.engagement.saves, 0)

    const engagementRate = totalImpressions > 0 ? 
      ((totalLikes + totalComments + totalShares) / totalImpressions) * 100 : 0

    return {
      platform,
      period: { startDate, endDate },
      followers: {
        count: 25000, // Mock data
        growth: 450,
        growthRate: 1.8
      },
      engagement: {
        rate: engagementRate,
        likes: totalLikes,
        comments: totalComments,
        shares: totalShares,
        saves: totalSaves
      },
      reach: {
        organic: totalReach * 0.7, // 70% organic
        paid: totalReach * 0.3,    // 30% paid
        total: totalReach
      },
      traffic: {
        clicks: totalClicks,
        sessions: Math.floor(totalClicks * 0.8), // 80% conversion to sessions
        conversions: Math.floor(totalClicks * 0.05), // 5% conversion rate
        revenue: Math.floor(totalClicks * 0.05) * 50 // $50 average order
      },
      topPosts: platformPosts
        .sort((a, b) => (b.engagement.likes + b.engagement.comments + b.engagement.shares) - 
                       (a.engagement.likes + a.engagement.comments + a.engagement.shares))
        .slice(0, 5),
      demographics: {
        ageGroups: {
          '18-24': 25,
          '25-34': 35,
          '35-44': 25,
          '45-54': 12,
          '55+': 3
        },
        genders: {
          'female': 60,
          'male': 38,
          'other': 2
        },
        locations: {
          'Chile': 70,
          'Argentina': 15,
          'Peru': 10,
          'Other': 5
        }
      }
    }
  }

  // Utility methods
  generateShareableContent(productId: string, platform: string): {
    text: string
    hashtags: string[]
    url: string
  } {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const url = `${baseUrl}/products/${productId}?utm_source=${platform}&utm_medium=social`
    
    const templates = {
      instagram: {
        text: '¡Descubre este increíble producto! 🛍️ Calidad premium a precio justo.',
        hashtags: ['shopping', 'quality', 'premium', 'deals', 'lifestyle']
      },
      facebook: {
        text: '🎉 ¡No te pierdas esta oportunidad! Producto de alta calidad con envío gratis.',
        hashtags: ['deals', 'shopping', 'freeshipping', 'quality']
      },
      twitter: {
        text: '⚡ Producto increíble que no puedes perderte. Calidad garantizada.',
        hashtags: ['deals', 'shopping', 'quality']
      },
      pinterest: {
        text: 'Inspiración para tu hogar ✨ Productos seleccionados con amor.',
        hashtags: ['home', 'inspiration', 'lifestyle', 'design']
      }
    }

    return {
      ...templates[platform as keyof typeof templates] || templates.instagram,
      url
    }
  }
}

// Utility functions
export function getSocialPlatformColor(platform: string): string {
  const platformData = SOCIAL_PLATFORMS.find(p => p.id === platform)
  return platformData?.color || '#666666'
}

export function formatEngagement(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

export function getPostStatusColor(status: PostStatus): string {
  switch (status) {
    case 'published':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'scheduled':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'draft':
      return 'text-gray-600 bg-gray-50 border-gray-200'
    case 'failed':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'archived':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getPostStatusText(status: PostStatus): string {
  switch (status) {
    case 'published':
      return 'Publicado'
    case 'scheduled':
      return 'Programado'
    case 'draft':
      return 'Borrador'
    case 'failed':
      return 'Error'
    case 'archived':
      return 'Archivado'
    default:
      return 'Desconocido'
  }
}

// Singleton service instance
let socialMediaServiceInstance: SocialMediaService | null = null

export function getSocialMediaService(): SocialMediaService {
  if (!socialMediaServiceInstance) {
    socialMediaServiceInstance = new SocialMediaService()
  }
  return socialMediaServiceInstance
}