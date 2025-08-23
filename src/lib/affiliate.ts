export interface Affiliate {
  id: string
  userId: string
  code: string
  status: AffiliateStatus
  tier: AffiliateTier
  commissionRate: number
  totalEarnings: number
  pendingEarnings: number
  paidEarnings: number
  totalReferrals: number
  activeReferrals: number
  clickCount: number
  conversionRate: number
  joinedAt: Date
  lastActiveAt: Date
  payoutMethod: PayoutMethod
  taxInfo?: TaxInfo
  metadata?: Record<string, string>
}

export type AffiliateStatus = 
  | 'pending' // Awaiting approval
  | 'active' // Active affiliate
  | 'suspended' // Temporarily suspended
  | 'banned' // Permanently banned
  | 'inactive' // Inactive by choice

export interface AffiliateTier {
  id: string
  name: string
  minReferrals: number
  commissionRate: number
  bonusRate: number
  perks: string[]
  color: string
}

export interface AffiliateClick {
  id: string
  affiliateId: string
  affiliateCode: string
  ipAddress: string
  userAgent: string
  referrerUrl?: string
  landingUrl: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  sessionId?: string
  userId?: string // If user is logged in
  convertedAt?: Date
  orderId?: string
  createdAt: Date
}

export interface AffiliateCommission {
  id: string
  affiliateId: string
  orderId: string
  customerId: string
  orderAmount: number
  commissionAmount: number
  commissionRate: number
  tier: string
  status: CommissionStatus
  payoutDate?: Date
  payoutId?: string
  createdAt: Date
  metadata?: Record<string, string>
}

export type CommissionStatus =
  | 'pending' // Order received
  | 'approved' // Commission approved
  | 'paid' // Commission paid out
  | 'cancelled' // Order cancelled/returned
  | 'disputed' // Under dispute

export interface AffiliatePayout {
  id: string
  affiliateId: string
  amount: number
  method: PayoutMethod
  status: PayoutStatus
  commissionIds: string[]
  requestedAt: Date
  processedAt?: Date
  paidAt?: Date
  reference?: string
  fees?: number
  netAmount: number
  notes?: string
}

export type PayoutMethod =
  | 'paypal'
  | 'bank'
  | 'stripe'

export type PayoutStatus =
  | 'requested'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'

export interface TaxInfo {
  taxId?: string
  businessName?: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  taxFormSubmitted: boolean
  taxFormType?: 'W9' | '1099' | 'Other'
}

export interface AffiliateLink {
  id: string
  affiliateId: string
  name: string
  url: string
  shortUrl: string
  description?: string
  category?: string
  clicks: number
  conversions: number
  revenue: number
  isActive: boolean
  createdAt: Date
  expiresAt?: Date
}

export interface AffiliateAnalytics {
  affiliateId: string
  period: 'day' | 'week' | 'month' | 'year'
  startDate: Date
  endDate: Date
  clicks: number
  conversions: number
  conversionRate: number
  revenue: number
  commission: number
  topCountries: Array<{country: string; clicks: number}>
  topSources: Array<{source: string; clicks: number}>
  dailyStats: Array<{date: Date; clicks: number; conversions: number}>
}

// Predefined affiliate tiers
export const AFFILIATE_TIERS: AffiliateTier[] = [
  {
    id: 'bronze',
    name: 'Bronce',
    minReferrals: 0,
    commissionRate: 0.05, // 5%
    bonusRate: 0,
    perks: ['Acceso básico', 'Materiales de marketing'],
    color: 'bg-amber-600'
  },
  {
    id: 'silver', 
    name: 'Plata',
    minReferrals: 10,
    commissionRate: 0.08, // 8%
    bonusRate: 0.02,
    perks: ['Materiales premium', 'Soporte prioritario', 'Bonificación por volumen'],
    color: 'bg-gray-400'
  },
  {
    id: 'gold',
    name: 'Oro', 
    minReferrals: 50,
    commissionRate: 0.12, // 12%
    bonusRate: 0.05,
    perks: ['Acceso a productos exclusivos', 'Manager dedicado', 'Pagos semanales'],
    color: 'bg-yellow-500'
  },
  {
    id: 'platinum',
    name: 'Platino',
    minReferrals: 100,
    commissionRate: 0.15, // 15%  
    bonusRate: 0.08,
    perks: ['Comisiones más altas', 'Acceso early access', 'Eventos exclusivos', 'Programa VIP'],
    color: 'bg-purple-600'
  }
]

// Mock affiliate data
export const MOCK_AFFILIATES: Affiliate[] = [
  {
    id: 'aff-1',
    userId: 'user-123',
    code: 'JUAN2024',
    status: 'active',
    tier: AFFILIATE_TIERS[1], // Silver
    commissionRate: 0.08,
    totalEarnings: 15750,
    pendingEarnings: 3250,
    paidEarnings: 12500,
    totalReferrals: 25,
    activeReferrals: 18,
    clickCount: 450,
    conversionRate: 5.6,
    joinedAt: new Date('2024-01-15'),
    lastActiveAt: new Date(),
    payoutMethod: 'paypal'
  }
]

// Advanced Affiliate Service
export class AffiliateService {
  private affiliates: Map<string, Affiliate> = new Map()
  private clicks: AffiliateClick[] = []
  private commissions: AffiliateCommission[] = []
  private payouts: AffiliatePayout[] = []
  private links: AffiliateLink[] = []

  constructor() {
    // Initialize with mock data
    MOCK_AFFILIATES.forEach(affiliate => {
      this.affiliates.set(affiliate.id, affiliate)
    })
  }

  // Affiliate management
  async createAffiliate(userId: string, data: Partial<Affiliate>): Promise<Affiliate> {
    const code = await this.generateUniqueCode(data.code)
    const tier = this.getTierForReferrals(0)
    
    const affiliate: Affiliate = {
      id: `aff-${Date.now()}`,
      userId,
      code,
      status: 'pending',
      tier,
      commissionRate: tier.commissionRate,
      totalEarnings: 0,
      pendingEarnings: 0,
      paidEarnings: 0,
      totalReferrals: 0,
      activeReferrals: 0,
      clickCount: 0,
      conversionRate: 0,
      joinedAt: new Date(),
      lastActiveAt: new Date(),
      payoutMethod: 'paypal',
      ...data
    }

    this.affiliates.set(affiliate.id, affiliate)
    return affiliate
  }

  async getAffiliate(affiliateId: string): Promise<Affiliate | null> {
    return this.affiliates.get(affiliateId) || null
  }

  async getAffiliateByCode(code: string): Promise<Affiliate | null> {
    return Array.from(this.affiliates.values()).find(a => a.code === code) || null
  }

  async getAffiliateByUserId(userId: string): Promise<Affiliate | null> {
    return Array.from(this.affiliates.values()).find(a => a.userId === userId) || null
  }

  // Code generation
  private async generateUniqueCode(preferredCode?: string): Promise<string> {
    if (preferredCode && !await this.getAffiliateByCode(preferredCode)) {
      return preferredCode.toUpperCase()
    }
    
    // Generate random code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code: string
    let attempts = 0
    
    do {
      code = ''
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      attempts++
    } while (await this.getAffiliateByCode(code) && attempts < 10)
    
    return code
  }

  // Click tracking
  async trackClick(affiliateCode: string, clickData: Partial<AffiliateClick>): Promise<AffiliateClick | null> {
    const affiliate = await this.getAffiliateByCode(affiliateCode)
    if (!affiliate || affiliate.status !== 'active') return null

    const click: AffiliateClick = {
      id: `click-${Date.now()}`,
      affiliateId: affiliate.id,
      affiliateCode,
      ipAddress: clickData.ipAddress || '127.0.0.1',
      userAgent: clickData.userAgent || '',
      landingUrl: clickData.landingUrl || '',
      createdAt: new Date(),
      ...clickData
    }

    this.clicks.push(click)
    
    // Update affiliate stats
    affiliate.clickCount++
    affiliate.lastActiveAt = new Date()
    
    return click
  }

  // Conversion tracking
  async trackConversion(orderId: string, customerId: string, orderAmount: number, affiliateCode?: string): Promise<AffiliateCommission | null> {
    // Find the affiliate from recent clicks or provided code
    let affiliate: Affiliate | null = null
    
    if (affiliateCode) {
      affiliate = await this.getAffiliateByCode(affiliateCode)
    } else {
      // Find from recent clicks by customer
      const recentClick = this.clicks
        .filter(c => c.userId === customerId || c.sessionId === customerId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
      
      if (recentClick) {
        affiliate = await this.getAffiliate(recentClick.affiliateId)
      }
    }

    if (!affiliate || affiliate.status !== 'active') return null

    const commission: AffiliateCommission = {
      id: `comm-${Date.now()}`,
      affiliateId: affiliate.id,
      orderId,
      customerId,
      orderAmount,
      commissionAmount: orderAmount * affiliate.commissionRate,
      commissionRate: affiliate.commissionRate,
      tier: affiliate.tier.id,
      status: 'pending',
      createdAt: new Date()
    }

    this.commissions.push(commission)
    
    // Update affiliate stats
    affiliate.totalReferrals++
    affiliate.activeReferrals++
    affiliate.pendingEarnings += commission.commissionAmount
    affiliate.totalEarnings += commission.commissionAmount
    affiliate.conversionRate = (affiliate.totalReferrals / affiliate.clickCount) * 100

    // Check for tier upgrade
    await this.checkTierUpgrade(affiliate)

    return commission
  }

  // Tier management
  private getTierForReferrals(referralCount: number): AffiliateTier {
    const tiers = [...AFFILIATE_TIERS].reverse() // Start from highest tier
    return tiers.find(tier => referralCount >= tier.minReferrals) || AFFILIATE_TIERS[0]
  }

  private async checkTierUpgrade(affiliate: Affiliate): Promise<void> {
    const newTier = this.getTierForReferrals(affiliate.totalReferrals)
    
    if (newTier.id !== affiliate.tier.id) {
      const oldTier = affiliate.tier
      affiliate.tier = newTier
      affiliate.commissionRate = newTier.commissionRate
      
      // Trigger tier upgrade notification
      console.log(`Affiliate ${affiliate.code} upgraded from ${oldTier.name} to ${newTier.name}`)
    }
  }

  // Link management
  async createAffiliateLink(affiliateId: string, linkData: Partial<AffiliateLink>): Promise<AffiliateLink> {
    const affiliate = await this.getAffiliate(affiliateId)
    if (!affiliate) throw new Error('Affiliate not found')

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const url = linkData.url || `${baseUrl}/ref/${affiliate.code}`
    const shortUrl = this.generateShortUrl(url)

    const link: AffiliateLink = {
      id: `link-${Date.now()}`,
      affiliateId,
      name: linkData.name || 'Link Principal',
      url,
      shortUrl,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      isActive: true,
      createdAt: new Date(),
      ...linkData
    }

    this.links.push(link)
    return link
  }

  async getAffiliateLinks(affiliateId: string): Promise<AffiliateLink[]> {
    return this.links.filter(link => link.affiliateId === affiliateId)
  }

  private generateShortUrl(url: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const shortCode = Math.random().toString(36).substring(2, 8)
    return `${baseUrl}/s/${shortCode}`
  }

  // Analytics
  async getAffiliateAnalytics(affiliateId: string, period: 'day' | 'week' | 'month' | 'year'): Promise<AffiliateAnalytics> {
    const affiliate = await this.getAffiliate(affiliateId)
    if (!affiliate) throw new Error('Affiliate not found')

    const now = new Date()
    const startDate = new Date()
    
    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    const periodClicks = this.clicks.filter(c => 
      c.affiliateId === affiliateId && 
      c.createdAt >= startDate
    )

    const periodCommissions = this.commissions.filter(c =>
      c.affiliateId === affiliateId &&
      c.createdAt >= startDate
    )

    return {
      affiliateId,
      period,
      startDate,
      endDate: now,
      clicks: periodClicks.length,
      conversions: periodCommissions.length,
      conversionRate: periodClicks.length > 0 ? (periodCommissions.length / periodClicks.length) * 100 : 0,
      revenue: periodCommissions.reduce((sum, c) => sum + c.orderAmount, 0),
      commission: periodCommissions.reduce((sum, c) => sum + c.commissionAmount, 0),
      topCountries: [],
      topSources: [],
      dailyStats: []
    }
  }

  // Commission management
  async approveCommission(commissionId: string): Promise<void> {
    const commission = this.commissions.find(c => c.id === commissionId)
    if (!commission) throw new Error('Commission not found')

    commission.status = 'approved'
    
    const affiliate = await this.getAffiliate(commission.affiliateId)
    if (affiliate) {
      affiliate.pendingEarnings -= commission.commissionAmount
    }
  }

  async getCommissions(affiliateId: string, status?: CommissionStatus): Promise<AffiliateCommission[]> {
    let commissions = this.commissions.filter(c => c.affiliateId === affiliateId)
    
    if (status) {
      commissions = commissions.filter(c => c.status === status)
    }
    
    return commissions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Payout management
  async requestPayout(affiliateId: string, amount: number, method: PayoutMethod): Promise<AffiliatePayout> {
    const affiliate = await this.getAffiliate(affiliateId)
    if (!affiliate) throw new Error('Affiliate not found')

    const availableCommissions = this.commissions.filter(c =>
      c.affiliateId === affiliateId && 
      c.status === 'approved' &&
      !this.payouts.some(p => p.commissionIds.includes(c.id))
    )

    const availableAmount = availableCommissions.reduce((sum, c) => sum + c.commissionAmount, 0)
    
    if (amount > availableAmount) {
      throw new Error('Insufficient approved commissions')
    }

    const selectedCommissions = []
    let selectedAmount = 0
    
    for (const commission of availableCommissions) {
      if (selectedAmount + commission.commissionAmount <= amount) {
        selectedCommissions.push(commission)
        selectedAmount += commission.commissionAmount
        if (selectedAmount >= amount) break
      }
    }

    const fees = this.calculatePayoutFees(amount, method)
    
    const payout: AffiliatePayout = {
      id: `payout-${Date.now()}`,
      affiliateId,
      amount,
      method,
      status: 'requested',
      commissionIds: selectedCommissions.map(c => c.id),
      requestedAt: new Date(),
      fees,
      netAmount: amount - fees
    }

    this.payouts.push(payout)
    return payout
  }

  private calculatePayoutFees(amount: number, method: PayoutMethod): number {
    const feeRates = {
      paypal: 0.029, // 2.9%
      bank_transfer: 5, // Fixed $5 fee
      stripe: 0.029,
      crypto: 0.01, // 1%
      store_credit: 0 // No fees
    }

    const rate = feeRates[method] || 0
    return method === 'bank_transfer' ? rate : amount * rate
  }

  // Dashboard metrics
  async getAffiliateDashboard(affiliateId: string): Promise<{
    affiliate: Affiliate
    recentClicks: AffiliateClick[]
    recentCommissions: AffiliateCommission[]
    monthlyAnalytics: AffiliateAnalytics
    links: AffiliateLink[]
    pendingPayouts: AffiliatePayout[]
  }> {
    const affiliate = await this.getAffiliate(affiliateId)
    if (!affiliate) throw new Error('Affiliate not found')

    return {
      affiliate,
      recentClicks: this.clicks
        .filter(c => c.affiliateId === affiliateId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 10),
      recentCommissions: await this.getCommissions(affiliateId),
      monthlyAnalytics: await this.getAffiliateAnalytics(affiliateId, 'month'),
      links: await this.getAffiliateLinks(affiliateId),
      pendingPayouts: this.payouts.filter(p => 
        p.affiliateId === affiliateId && 
        p.status === 'requested'
      )
    }
  }
}

// Utility functions
export function getAffiliateStatusColor(status: AffiliateStatus): string {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'pending':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'suspended':
      return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'banned':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'inactive':
      return 'text-gray-600 bg-gray-50 border-gray-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getAffiliateStatusText(status: AffiliateStatus): string {
  switch (status) {
    case 'active':
      return 'Activo'
    case 'pending':
      return 'Pendiente'
    case 'suspended':
      return 'Suspendido'
    case 'banned':
      return 'Bloqueado'
    case 'inactive':
      return 'Inactivo'
    default:
      return 'Desconocido'
  }
}

export function getCommissionStatusColor(status: CommissionStatus): string {
  switch (status) {
    case 'approved':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'pending':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'paid':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'cancelled':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'disputed':
      return 'text-orange-600 bg-orange-50 border-orange-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function formatCommissionRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`
}

export function formatConversionRate(rate: number): string {
  return `${rate.toFixed(1)}%`
}

// Singleton service instance
let affiliateServiceInstance: AffiliateService | null = null

export function getAffiliateService(): AffiliateService {
  if (!affiliateServiceInstance) {
    affiliateServiceInstance = new AffiliateService()
  }
  return affiliateServiceInstance
}