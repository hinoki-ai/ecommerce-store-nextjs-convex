import Stripe from 'stripe'

// Subscription types and interfaces
export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'day' | 'week' | 'month' | 'year'
  intervalCount: number
  trialDays?: number
  features: string[]
  isPopular?: boolean
  isActive: boolean
  stripePriceId?: string
  metadata?: Record<string, string>
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  stripeSubscriptionId?: string
  status: SubscriptionStatus
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  trialEnd?: Date
  createdAt: Date
  updatedAt: Date
  metadata?: Record<string, string>
}

export type SubscriptionStatus = 
  | 'trialing'
  | 'active' 
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'
  | 'paused'

export interface SubscriptionUsage {
  subscriptionId: string
  feature: string
  usage: number
  limit: number
  period: Date
  resetDate: Date
}

// Pre-defined subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for individuals and small businesses',
    price: 9990, // $99.90 in CLP cents
    currency: 'CLP',
    interval: 'month',
    intervalCount: 1,
    trialDays: 14,
    features: [
      'Up to 100 products',
      'Basic analytics',
      'Email support',
      '1 GB storage',
      'Basic themes'
    ],
    isActive: true
  },
  {
    id: 'professional',
    name: 'Professional', 
    description: 'For growing businesses with advanced needs',
    price: 29990, // $299.90 in CLP cents
    currency: 'CLP',
    interval: 'month',
    intervalCount: 1,
    trialDays: 14,
    features: [
      'Up to 1,000 products',
      'Advanced analytics',
      'Priority support',
      '10 GB storage',
      'Premium themes',
      'Multi-currency support',
      'Advanced SEO tools'
    ],
    isPopular: true,
    isActive: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with custom requirements',
    price: 99990, // $999.90 in CLP cents
    currency: 'CLP', 
    interval: 'month',
    intervalCount: 1,
    features: [
      'Unlimited products',
      'Custom analytics',
      'Dedicated support',
      '100 GB storage',
      'Custom themes',
      'White-label solution',
      'API access',
      'Advanced integrations',
      'Custom domains'
    ],
    isActive: true
  }
]

// Subscription service class
export class SubscriptionService {
  private stripe: Stripe

  constructor(stripeSecretKey: string) {
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia'
    })
  }

  // Create Stripe customer
  async createCustomer(userId: string, email: string, name?: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata: {
          userId
        }
      })
      return customer
    } catch (error) {
      console.error('Failed to create Stripe customer:', error)
      throw new Error('Failed to create customer')
    }
  }

  // Create subscription
  async createSubscription(
    customerId: string,
    priceId: string,
    paymentMethodId?: string,
    trialDays?: number
  ): Promise<Stripe.Subscription> {
    try {
      const subscriptionParams: Stripe.SubscriptionCreateParams = {
        customer: customerId,
        items: [{ price: priceId }],
        expand: ['latest_invoice.payment_intent']
      }

      if (paymentMethodId) {
        subscriptionParams.default_payment_method = paymentMethodId
      }

      if (trialDays) {
        subscriptionParams.trial_period_days = trialDays
      }

      const subscription = await this.stripe.subscriptions.create(subscriptionParams)
      return subscription
    } catch (error) {
      console.error('Failed to create subscription:', error)
      throw new Error('Failed to create subscription')
    }
  }

  // Update subscription
  async updateSubscription(
    subscriptionId: string,
    updates: {
      priceId?: string
      quantity?: number
      prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice'
    }
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId)
      
      const updateParams: Stripe.SubscriptionUpdateParams = {
        proration_behavior: updates.prorationBehavior || 'create_prorations'
      }

      if (updates.priceId) {
        updateParams.items = [{
          id: subscription.items.data[0].id,
          price: updates.priceId,
          quantity: updates.quantity || 1
        }]
      }

      return await this.stripe.subscriptions.update(subscriptionId, updateParams)
    } catch (error) {
      console.error('Failed to update subscription:', error)
      throw new Error('Failed to update subscription')
    }
  }

  // Cancel subscription
  async cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd: boolean = true
  ): Promise<Stripe.Subscription> {
    try {
      if (cancelAtPeriodEnd) {
        return await this.stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true
        })
      } else {
        return await this.stripe.subscriptions.cancel(subscriptionId)
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error)
      throw new Error('Failed to cancel subscription')
    }
  }

  // Resume subscription
  async resumeSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      })
    } catch (error) {
      console.error('Failed to resume subscription:', error)
      throw new Error('Failed to resume subscription')
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['customer', 'default_payment_method']
      })
    } catch (error) {
      console.error('Failed to get subscription:', error)
      throw new Error('Failed to get subscription')
    }
  }

  // Get customer subscriptions
  async getCustomerSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
    try {
      const subscriptions = await this.stripe.subscriptions.list({
        customer: customerId,
        expand: ['data.default_payment_method']
      })
      return subscriptions.data
    } catch (error) {
      console.error('Failed to get customer subscriptions:', error)
      throw new Error('Failed to get customer subscriptions')
    }
  }

  // Create payment method
  async createPaymentMethod(
    type: 'card',
    card: {
      number: string
      exp_month: number
      exp_year: number
      cvc: string
    },
    billing_details?: {
      name?: string
      email?: string
      address?: {
        line1?: string
        city?: string
        country?: string
        postal_code?: string
      }
    }
  ): Promise<Stripe.PaymentMethod> {
    try {
      return await this.stripe.paymentMethods.create({
        type,
        card,
        billing_details
      })
    } catch (error) {
      console.error('Failed to create payment method:', error)
      throw new Error('Failed to create payment method')
    }
  }

  // Attach payment method to customer
  async attachPaymentMethod(
    paymentMethodId: string,
    customerId: string
  ): Promise<Stripe.PaymentMethod> {
    try {
      return await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      })
    } catch (error) {
      console.error('Failed to attach payment method:', error)
      throw new Error('Failed to attach payment method')
    }
  }

  // Get upcoming invoice
  async getUpcomingInvoice(customerId: string): Promise<Stripe.Invoice> {
    try {
      return await this.stripe.invoices.retrieveUpcoming({
        customer: customerId
      })
    } catch (error) {
      console.error('Failed to get upcoming invoice:', error)
      throw new Error('Failed to get upcoming invoice')
    }
  }

  // Get billing history
  async getBillingHistory(customerId: string, limit: number = 10): Promise<Stripe.Invoice[]> {
    try {
      const invoices = await this.stripe.invoices.list({
        customer: customerId,
        limit
      })
      return invoices.data
    } catch (error) {
      console.error('Failed to get billing history:', error)
      throw new Error('Failed to get billing history')
    }
  }

  // Handle webhook events
  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription)
          break
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
          break
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
          break
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice)
          break
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice)
          break
        default:
          console.log(`Unhandled event type: ${event.type}`)
      }
    } catch (error) {
      console.error('Error handling webhook event:', error)
      throw error
    }
  }

  private async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    // Implement database update logic
    console.log('Subscription created:', subscription.id)
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    // Implement database update logic
    console.log('Subscription updated:', subscription.id)
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    // Implement database update logic
    console.log('Subscription deleted:', subscription.id)
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    // Implement payment success logic
    console.log('Payment succeeded for invoice:', invoice.id)
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    // Implement payment failure logic
    console.log('Payment failed for invoice:', invoice.id)
  }
}

// Usage tracking utilities
export class UsageTracker {
  private subscriptionLimits: Map<string, Record<string, number>> = new Map()

  constructor() {
    // Initialize plan limits
    this.subscriptionLimits.set('basic', {
      products: 100,
      storage: 1000, // MB
      apiCalls: 1000
    })
    
    this.subscriptionLimits.set('professional', {
      products: 1000,
      storage: 10000, // MB
      apiCalls: 10000
    })
    
    this.subscriptionLimits.set('enterprise', {
      products: -1, // Unlimited
      storage: 100000, // MB
      apiCalls: -1 // Unlimited
    })
  }

  async trackUsage(
    subscriptionId: string,
    feature: string,
    usage: number
  ): Promise<void> {
    // Implement usage tracking logic
    console.log(`Tracking usage for ${subscriptionId}: ${feature} = ${usage}`)
  }

  async checkLimit(
    planId: string,
    feature: string,
    currentUsage: number
  ): Promise<{ allowed: boolean; limit: number; remaining: number }> {
    const limits = this.subscriptionLimits.get(planId) || {}
    const limit = limits[feature] || 0
    
    if (limit === -1) {
      return { allowed: true, limit: -1, remaining: -1 }
    }
    
    return {
      allowed: currentUsage < limit,
      limit,
      remaining: Math.max(0, limit - currentUsage)
    }
  }

  async getUsageSummary(subscriptionId: string): Promise<Record<string, SubscriptionUsage>> {
    // Implement usage summary retrieval
    // This would typically query your database
    return {}
  }
}

// Utility functions
export function formatSubscriptionPrice(plan: SubscriptionPlan): string {
  const price = plan.price / 100 // Convert from cents
  const currency = plan.currency.toUpperCase()
  const interval = plan.intervalCount > 1 ? 
    `${plan.intervalCount} ${plan.interval}s` : 
    plan.interval

  if (plan.currency === 'CLP') {
    return `$${price.toLocaleString('es-CL')} CLP / ${interval}`
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: plan.currency
  }).format(price) + ` / ${interval}`
}

export function getSubscriptionStatusColor(status: SubscriptionStatus): string {
  switch (status) {
    case 'active':
    case 'trialing':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'past_due':
    case 'unpaid':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'canceled':
    case 'incomplete_expired':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'incomplete':
    case 'paused':
      return 'text-gray-600 bg-gray-50 border-gray-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getSubscriptionStatusText(status: SubscriptionStatus): string {
  switch (status) {
    case 'active':
      return 'Active'
    case 'trialing':
      return 'Trial'
    case 'past_due':
      return 'Past Due'
    case 'canceled':
      return 'Canceled'
    case 'unpaid':
      return 'Unpaid'
    case 'incomplete':
      return 'Incomplete'
    case 'incomplete_expired':
      return 'Expired'
    case 'paused':
      return 'Paused'
    default:
      return 'Unknown'
  }
}

// Export singleton instance
let subscriptionServiceInstance: SubscriptionService | null = null

export function getSubscriptionService(): SubscriptionService {
  if (!subscriptionServiceInstance) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required')
    }
    subscriptionServiceInstance = new SubscriptionService(stripeSecretKey)
  }
  return subscriptionServiceInstance
}