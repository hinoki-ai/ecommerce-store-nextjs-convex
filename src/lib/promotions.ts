export interface Promotion {
  id: string
  name: string
  description: string
  type: PromotionType
  discountType: DiscountType
  discountValue: number
  conditions: PromotionConditions
  usage: PromotionUsage
  scheduling: PromotionScheduling
  targeting: PromotionTargeting
  status: PromotionStatus
  priority: number
  stackable: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string
  metadata?: Record<string, any>
}

export type PromotionType = 
  | 'coupon'           // Código de cupón
  | 'automatic'        // Descuento automático  
  | 'bogo'            // Buy One Get One
  | 'bulk'            // Descuento por cantidad
  | 'membership'      // Descuentos para miembros
  | 'first_purchase'  // Primera compra
  | 'abandoned_cart'  // Carrito abandonado
  | 'loyalty'         // Programa de lealtad
  | 'seasonal'        // Descuentos estacionales
  | 'flash_sale'      // Venta flash

export type DiscountType =
  | 'percentage'      // Porcentaje (%)
  | 'fixed_amount'    // Monto fijo ($)
  | 'free_shipping'   // Envío gratis
  | 'free_gift'       // Regalo gratis
  | 'price_override'  // Precio fijo

export interface PromotionConditions {
  minOrderValue?: number
  maxOrderValue?: number
  minQuantity?: number
  maxQuantity?: number
  requiredProducts?: string[]        // IDs de productos requeridos
  excludedProducts?: string[]        // IDs de productos excluidos  
  requiredCategories?: string[]      // Categorías requeridas
  excludedCategories?: string[]      // Categorías excluidas
  requiredCollections?: string[]     // Colecciones requeridas
  firstTimeCustomer?: boolean        // Solo primeros compradores
  customerGroups?: string[]          // Grupos de clientes específicos
  geographicRestrictions?: {         // Restricciones geográficas
    includedCountries?: string[]
    excludedCountries?: string[]
    includedRegions?: string[]
    excludedRegions?: string[]
  }
  paymentMethods?: string[]          // Métodos de pago específicos
  deviceTypes?: ('mobile' | 'desktop' | 'tablet')[]
  customRules?: PromotionRule[]      // Reglas personalizadas
}

export interface PromotionRule {
  field: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains'
  value: any
  logic?: 'AND' | 'OR'
}

export interface PromotionUsage {
  totalLimit?: number               // Límite total de usos
  perCustomerLimit?: number         // Límite por cliente
  usedCount: number                // Veces usada
  remainingUses?: number           // Usos restantes
  oneTimeUse?: boolean             // Solo un uso
  uniqueCustomersOnly?: boolean    // Solo clientes únicos
}

export interface PromotionScheduling {
  startDate: Date
  endDate?: Date
  timeZone?: string
  activeHours?: {                  // Horarios activos
    days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[]
    startTime: string             // HH:mm format
    endTime: string               // HH:mm format
  }
  recurrence?: {                   // Promociones recurrentes
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    endAfter?: number
  }
}

export interface PromotionTargeting {
  customerTiers?: string[]         // Niveles de cliente
  newCustomersOnly?: boolean       // Solo nuevos clientes
  returningCustomersOnly?: boolean // Solo clientes recurrentes
  vipCustomersOnly?: boolean       // Solo clientes VIP
  emailSubscribersOnly?: boolean   // Solo suscriptores de email
  mobileAppOnly?: boolean         // Solo app móvil
  trafficSources?: string[]       // Fuentes de tráfico específicas
  referralSources?: string[]      // Fuentes de referencia
  utmParameters?: {               // Parámetros UTM
    source?: string
    medium?: string
    campaign?: string
    term?: string
    content?: string
  }
}

export type PromotionStatus = 
  | 'draft'     // Borrador
  | 'scheduled' // Programado
  | 'active'    // Activo
  | 'paused'    // Pausado
  | 'expired'   // Expirado
  | 'disabled'  // Deshabilitado

export interface PromotionApplication {
  promotionId: string
  orderId: string
  customerId: string
  discountAmount: number
  originalTotal: number
  finalTotal: number
  appliedAt: Date
  couponCode?: string
  metadata?: Record<string, any>
}

export interface CouponCode {
  id: string
  promotionId: string
  code: string
  isActive: boolean
  usageCount: number
  maxUses?: number
  expiresAt?: Date
  createdAt: Date
}

export interface PromotionMetrics {
  promotionId: string
  totalApplications: number
  totalDiscount: number
  totalRevenue: number
  uniqueCustomers: number
  conversionRate: number
  averageOrderValue: number
  customerAcquisition: number
  returnCustomers: number
  period: {
    startDate: Date
    endDate: Date
  }
}

// Predefined promotion templates
export const PROMOTION_TEMPLATES = [
  {
    id: 'welcome10',
    name: 'Bienvenida 10% OFF',
    description: 'Descuento de bienvenida para nuevos clientes',
    type: 'coupon' as PromotionType,
    discountType: 'percentage' as DiscountType,
    discountValue: 10,
    conditions: {
      firstTimeCustomer: true,
      minOrderValue: 50
    }
  },
  {
    id: 'free_shipping_50',
    name: 'Envío Gratis $50+',
    description: 'Envío gratuito en pedidos superiores a $50',
    type: 'automatic' as PromotionType,
    discountType: 'free_shipping' as DiscountType,
    discountValue: 0,
    conditions: {
      minOrderValue: 50
    }
  },
  {
    id: 'buy2get1',
    name: 'Compra 2 Lleva 3',
    description: 'Compra 2 productos y llévate el 3ro gratis',
    type: 'bogo' as PromotionType,
    discountType: 'percentage' as DiscountType,
    discountValue: 100,
    conditions: {
      minQuantity: 3
    }
  },
  {
    id: 'bulk_discount',
    name: 'Descuento por Volumen',
    description: '15% off en pedidos de 5+ productos',
    type: 'bulk' as PromotionType,
    discountType: 'percentage' as DiscountType,
    discountValue: 15,
    conditions: {
      minQuantity: 5
    }
  }
]

// Mock promotion data
export const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    name: 'Black Friday Mega Sale',
    description: 'Descuento del 30% en toda la tienda',
    type: 'automatic',
    discountType: 'percentage',
    discountValue: 30,
    conditions: {
      minOrderValue: 100
    },
    usage: {
      totalLimit: 1000,
      usedCount: 245,
      remainingUses: 755
    },
    scheduling: {
      startDate: new Date('2024-11-25'),
      endDate: new Date('2024-11-30')
    },
    targeting: {
      emailSubscribersOnly: false
    },
    status: 'active',
    priority: 10,
    stackable: false,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-25'),
    createdBy: 'admin-1'
  },
  {
    id: 'promo-2', 
    name: 'Nuevos Clientes 15% OFF',
    description: 'Descuento especial para primeros compradores',
    type: 'coupon',
    discountType: 'percentage', 
    discountValue: 15,
    conditions: {
      firstTimeCustomer: true,
      minOrderValue: 75
    },
    usage: {
      perCustomerLimit: 1,
      usedCount: 89
    },
    scheduling: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31')
    },
    targeting: {
      newCustomersOnly: true
    },
    status: 'active',
    priority: 5,
    stackable: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin-1'
  }
]

// Advanced Promotion Service
export class PromotionService {
  private promotions: Map<string, Promotion> = new Map()
  private applications: PromotionApplication[] = []
  private coupons: Map<string, CouponCode> = new Map()

  constructor() {
    // Initialize with mock data
    MOCK_PROMOTIONS.forEach(promotion => {
      this.promotions.set(promotion.id, promotion)
    })
    
    // Create some mock coupon codes
    this.coupons.set('WELCOME15', {
      id: 'coupon-1',
      promotionId: 'promo-2',
      code: 'WELCOME15',
      isActive: true,
      usageCount: 25,
      maxUses: 100,
      createdAt: new Date('2024-01-01')
    })
  }

  // Promotion management
  async createPromotion(data: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'>): Promise<Promotion> {
    const promotion: Promotion = {
      ...data,
      id: `promo-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usage: {
        usedCount: 0,
        ...data.usage
      }
    }

    this.promotions.set(promotion.id, promotion)
    return promotion
  }

  async getPromotion(promotionId: string): Promise<Promotion | null> {
    return this.promotions.get(promotionId) || null
  }

  async getAllPromotions(status?: PromotionStatus): Promise<Promotion[]> {
    const promotions = Array.from(this.promotions.values())
    
    if (status) {
      return promotions.filter(p => p.status === status)
    }
    
    return promotions.sort((a, b) => b.priority - a.priority)
  }

  async updatePromotion(promotionId: string, updates: Partial<Promotion>): Promise<Promotion | null> {
    const promotion = this.promotions.get(promotionId)
    if (!promotion) return null

    const updated = {
      ...promotion,
      ...updates,
      updatedAt: new Date()
    }

    this.promotions.set(promotionId, updated)
    return updated
  }

  async deletePromotion(promotionId: string): Promise<boolean> {
    return this.promotions.delete(promotionId)
  }

  // Coupon code management
  async createCouponCode(promotionId: string, code?: string, maxUses?: number): Promise<CouponCode> {
    const promotion = await this.getPromotion(promotionId)
    if (!promotion) throw new Error('Promotion not found')

    const couponCode = code || this.generateCouponCode()
    
    // Check if code already exists
    if (this.coupons.has(couponCode)) {
      throw new Error('Coupon code already exists')
    }

    const coupon: CouponCode = {
      id: `coupon-${Date.now()}`,
      promotionId,
      code: couponCode,
      isActive: true,
      usageCount: 0,
      maxUses,
      createdAt: new Date()
    }

    this.coupons.set(couponCode, coupon)
    return coupon
  }

  async getCouponCode(code: string): Promise<CouponCode | null> {
    return this.coupons.get(code.toUpperCase()) || null
  }

  private generateCouponCode(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Promotion eligibility checking
  async checkEligibility(
    customerId: string,
    orderData: {
      items: Array<{productId: string; quantity: number; price: number}>
      subtotal: number
      customerData: any
    },
    couponCode?: string
  ): Promise<{
    eligiblePromotions: Promotion[]
    bestDiscount: {promotion: Promotion; discountAmount: number} | null
    errors: string[]
  }> {
    const eligiblePromotions: Promotion[] = []
    const errors: string[] = []
    
    // Get active promotions
    const activePromotions = await this.getAllPromotions('active')
    
    // If coupon code is provided, validate it first
    if (couponCode) {
      const coupon = await this.getCouponCode(couponCode)
      if (!coupon || !coupon.isActive) {
        errors.push('Código de cupón no válido o expirado')
        return { eligiblePromotions: [], bestDiscount: null, errors }
      }
      
      if (coupon.maxUses && coupon.usageCount >= coupon.maxUses) {
        errors.push('Este cupón ya no tiene usos disponibles')
        return { eligiblePromotions: [], bestDiscount: null, errors }
      }

      const promotion = await this.getPromotion(coupon.promotionId)
      if (promotion) {
        activePromotions.push(promotion)
      }
    }

    // Check each promotion for eligibility
    for (const promotion of activePromotions) {
      const isEligible = await this.checkPromotionEligibility(
        promotion,
        customerId,
        orderData
      )

      if (isEligible.eligible) {
        eligiblePromotions.push(promotion)
      } else {
        errors.push(...isEligible.reasons)
      }
    }

    // Calculate best discount
    let bestDiscount: {promotion: Promotion; discountAmount: number} | null = null
    
    for (const promotion of eligiblePromotions) {
      const discountAmount = this.calculateDiscount(promotion, orderData)
      
      if (!bestDiscount || discountAmount > bestDiscount.discountAmount) {
        bestDiscount = { promotion, discountAmount }
      }
    }

    return { eligiblePromotions, bestDiscount, errors }
  }

  private async checkPromotionEligibility(
    promotion: Promotion,
    customerId: string,
    orderData: any
  ): Promise<{eligible: boolean; reasons: string[]}> {
    const reasons: string[] = []

    // Check scheduling
    const now = new Date()
    if (promotion.scheduling.startDate > now) {
      reasons.push('La promoción aún no ha comenzado')
    }
    
    if (promotion.scheduling.endDate && promotion.scheduling.endDate < now) {
      reasons.push('La promoción ha expirado')
    }

    // Check usage limits
    if (promotion.usage.totalLimit && promotion.usage.usedCount >= promotion.usage.totalLimit) {
      reasons.push('Se ha alcanzado el límite de uso de esta promoción')
    }

    // Check order conditions
    const conditions = promotion.conditions
    
    if (conditions.minOrderValue && orderData.subtotal < conditions.minOrderValue) {
      reasons.push(`Pedido mínimo requerido: $${conditions.minOrderValue}`)
    }
    
    if (conditions.maxOrderValue && orderData.subtotal > conditions.maxOrderValue) {
      reasons.push(`Pedido máximo permitido: $${conditions.maxOrderValue}`)
    }

    const totalQuantity = orderData.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
    
    if (conditions.minQuantity && totalQuantity < conditions.minQuantity) {
      reasons.push(`Cantidad mínima requerida: ${conditions.minQuantity} productos`)
    }

    // Check customer eligibility
    if (conditions.firstTimeCustomer && !this.isFirstTimeCustomer(customerId)) {
      reasons.push('Esta promoción es solo para nuevos clientes')
    }

    return {
      eligible: reasons.length === 0,
      reasons
    }
  }

  private isFirstTimeCustomer(customerId: string): boolean {
    // Mock implementation - in reality check order history
    return Math.random() > 0.7 // 30% chance of being first time customer
  }

  private calculateDiscount(promotion: Promotion, orderData: any): number {
    switch (promotion.discountType) {
      case 'percentage':
        return (orderData.subtotal * promotion.discountValue) / 100
      
      case 'fixed_amount':
        return Math.min(promotion.discountValue, orderData.subtotal)
      
      case 'free_shipping':
        // Return shipping cost (mock value)
        return 15 // Assuming $15 shipping cost
      
      case 'free_gift':
        // Return value of free gift
        return 25 // Assuming $25 gift value
      
      default:
        return 0
    }
  }

  // Apply promotion to order
  async applyPromotion(
    promotionId: string,
    orderId: string,
    customerId: string,
    orderData: any,
    couponCode?: string
  ): Promise<PromotionApplication> {
    const promotion = await this.getPromotion(promotionId)
    if (!promotion) throw new Error('Promotion not found')

    const discountAmount = this.calculateDiscount(promotion, orderData)
    
    const application: PromotionApplication = {
      promotionId,
      orderId,
      customerId,
      discountAmount,
      originalTotal: orderData.subtotal,
      finalTotal: orderData.subtotal - discountAmount,
      appliedAt: new Date(),
      couponCode
    }

    this.applications.push(application)

    // Update promotion usage
    promotion.usage.usedCount++
    if (promotion.usage.remainingUses) {
      promotion.usage.remainingUses--
    }
    
    // Update coupon usage if applicable
    if (couponCode) {
      const coupon = await this.getCouponCode(couponCode)
      if (coupon) {
        coupon.usageCount++
      }
    }

    return application
  }

  // Analytics and reporting
  async getPromotionMetrics(
    promotionId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PromotionMetrics> {
    const applications = this.applications.filter(app =>
      app.promotionId === promotionId &&
      app.appliedAt >= startDate &&
      app.appliedAt <= endDate
    )

    const uniqueCustomers = new Set(applications.map(app => app.customerId)).size
    const totalApplications = applications.length
    const totalDiscount = applications.reduce((sum, app) => sum + app.discountAmount, 0)
    const totalRevenue = applications.reduce((sum, app) => sum + app.finalTotal, 0)

    return {
      promotionId,
      totalApplications,
      totalDiscount,
      totalRevenue,
      uniqueCustomers,
      conversionRate: 0, // Would calculate based on traffic data
      averageOrderValue: totalApplications > 0 ? totalRevenue / totalApplications : 0,
      customerAcquisition: 0, // Would calculate new customers acquired
      returnCustomers: 0, // Would calculate returning customers
      period: { startDate, endDate }
    }
  }

  // Bulk operations
  async createBulkCoupons(
    promotionId: string,
    count: number,
    prefix?: string,
    maxUsesPerCoupon?: number
  ): Promise<CouponCode[]> {
    const coupons: CouponCode[] = []
    
    for (let i = 0; i < count; i++) {
      const code = prefix ? 
        `${prefix}${this.generateCouponCode(4)}` : 
        this.generateCouponCode()
        
      try {
        const coupon = await this.createCouponCode(promotionId, code, maxUsesPerCoupon)
        coupons.push(coupon)
      } catch (error) {
        // Skip if code already exists and continue
        continue
      }
    }
    
    return coupons
  }

  // A/B testing support
  async createABTest(
    name: string,
    promotionA: Partial<Promotion>,
    promotionB: Partial<Promotion>,
    trafficSplit: number = 0.5 // 50/50 split by default
  ): Promise<{promotionA: Promotion; promotionB: Promotion}> {
    const promoA = await this.createPromotion({
      ...promotionA,
      name: `${name} - Variant A`,
      metadata: { 
        abTest: true, 
        variant: 'A', 
        testName: name,
        trafficSplit
      }
    } as Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'>)

    const promoB = await this.createPromotion({
      ...promotionB,
      name: `${name} - Variant B`,
      metadata: { 
        abTest: true, 
        variant: 'B', 
        testName: name,
        trafficSplit: 1 - trafficSplit
      }
    } as Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'>)

    return { promotionA: promoA, promotionB: promoB }
  }
}

// Utility functions
export function getPromotionStatusColor(status: PromotionStatus): string {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'scheduled':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'paused':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'expired':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'disabled':
      return 'text-gray-600 bg-gray-50 border-gray-200'
    case 'draft':
      return 'text-gray-600 bg-gray-50 border-gray-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getPromotionStatusText(status: PromotionStatus): string {
  switch (status) {
    case 'active':
      return 'Activa'
    case 'scheduled':
      return 'Programada'
    case 'paused':
      return 'Pausada'
    case 'expired':
      return 'Expirada'
    case 'disabled':
      return 'Deshabilitada'
    case 'draft':
      return 'Borrador'
    default:
      return 'Desconocido'
  }
}

export function formatDiscountDisplay(type: DiscountType, value: number): string {
  switch (type) {
    case 'percentage':
      return `${value}% OFF`
    case 'fixed_amount':
      return `-$${value}`
    case 'free_shipping':
      return 'Envío GRATIS'
    case 'free_gift':
      return 'Regalo GRATIS'
    case 'price_override':
      return `Solo $${value}`
    default:
      return 'Descuento'
  }
}

// Singleton service instance
let promotionServiceInstance: PromotionService | null = null

export function getPromotionService(): PromotionService {
  if (!promotionServiceInstance) {
    promotionServiceInstance = new PromotionService()
  }
  return promotionServiceInstance
}