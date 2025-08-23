import { BaseEntity } from './base-entity';
import { ID } from '../types';
import { Money } from '../value-objects/money';

export interface PromotionCondition {
  type: 
    | 'min_purchase'
    | 'category_purchase'
    | 'product_specific'
    | 'quantity_threshold'
    | 'user_segment'
    | 'first_purchase'
    | 'location_based';
  value: string | number;
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'in' | 'not_in';
  metadata?: Record<string, any>;
}

export interface PromotionAction {
  type:
    | 'percentage_discount'
    | 'fixed_discount'
    | 'free_shipping'
    | 'buy_x_get_y'
    | 'bundle_discount'
    | 'cashback'
    | 'points_reward';
  value: number;
  target?: 'cart_total' | 'product' | 'category' | 'shipping';
  metadata?: Record<string, any>;
}

export interface PromotionUsage {
  totalUses: number;
  userUses: Record<string, number>;
  lastUsed: number;
  revenue: Money;
}

export class Promotion extends BaseEntity {
  constructor(
    id: ID,
    public readonly name: string,
    public readonly description: string,
    public readonly code: string,
    public readonly type: 'coupon' | 'automatic' | 'campaign',
    public readonly conditions: PromotionCondition[],
    public readonly actions: PromotionAction[],
    public readonly priority: number = 0,
    public readonly startDate: number,
    public readonly endDate: number,
    public readonly maxUses: number = -1, // -1 = unlimited
    public readonly maxUsesPerUser: number = -1,
    public readonly stackable: boolean = false,
    public readonly isActive: boolean = true,
    public readonly usage: PromotionUsage = {
      totalUses: 0,
      userUses: {},
      lastUsed: 0,
      revenue: Money.zero()
    },
    public readonly metadata: Record<string, any> = {},
    createdAt?: number,
    updatedAt?: number
  ) {
    super(id, createdAt, updatedAt);
  }

  // Validation methods
  isValidNow(): boolean {
    const now = Date.now();
    return this.isActive && 
           now >= this.startDate && 
           now <= this.endDate &&
           (this.maxUses === -1 || this.usage.totalUses < this.maxUses);
  }

  canUserUse(userId: string): boolean {
    if (!this.isValidNow()) return false;
    
    const userUses = this.usage.userUses[userId] || 0;
    return this.maxUsesPerUser === -1 || userUses < this.maxUsesPerUser;
  }

  getRemainingUses(): number {
    if (this.maxUses === -1) return -1;
    return Math.max(0, this.maxUses - this.usage.totalUses);
  }

  getUserRemainingUses(userId: string): number {
    if (this.maxUsesPerUser === -1) return -1;
    const userUses = this.usage.userUses[userId] || 0;
    return Math.max(0, this.maxUsesPerUser - userUses);
  }

  // Business methods
  incrementUsage(userId: string, orderValue: Money): void {
    this.usage.totalUses++;
    this.usage.userUses[userId] = (this.usage.userUses[userId] || 0) + 1;
    this.usage.lastUsed = Date.now();
    this.usage.revenue = this.usage.revenue.add(orderValue);
  }

  getBusinessRules(): string[] {
    const errors: string[] = [];

    if (!this.name?.trim()) {
      errors.push('Promotion name is required');
    }

    if (!this.code?.trim()) {
      errors.push('Promotion code is required');
    }

    if (this.startDate >= this.endDate) {
      errors.push('Start date must be before end date');
    }

    if (this.conditions.length === 0) {
      errors.push('At least one condition is required');
    }

    if (this.actions.length === 0) {
      errors.push('At least one action is required');
    }

    if (this.maxUses !== -1 && this.maxUses <= 0) {
      errors.push('Max uses must be positive or -1 for unlimited');
    }

    if (this.maxUsesPerUser !== -1 && this.maxUsesPerUser <= 0) {
      errors.push('Max uses per user must be positive or -1 for unlimited');
    }

    return errors;
  }

  // Discount calculation
  calculateDiscount(cartValue: Money, conditions: Record<string, any>): Money {
    if (!this.isValidNow()) return Money.zero();

    // Check if all conditions are met
    const conditionsMet = this.conditions.every(condition => 
      this.evaluateCondition(condition, conditions)
    );

    if (!conditionsMet) return Money.zero();

    // Calculate discount based on actions
    let totalDiscount = Money.zero();
    
    for (const action of this.actions) {
      const actionDiscount = this.calculateActionDiscount(action, cartValue, conditions);
      totalDiscount = totalDiscount.add(actionDiscount);
    }

    return totalDiscount;
  }

  private evaluateCondition(condition: PromotionCondition, context: Record<string, any>): boolean {
    const contextValue = context[condition.type];
    
    if (contextValue === undefined) return false;

    switch (condition.operator) {
      case 'gt':
        return Number(contextValue) > Number(condition.value);
      case 'gte':
        return Number(contextValue) >= Number(condition.value);
      case 'lt':
        return Number(contextValue) < Number(condition.value);
      case 'lte':
        return Number(contextValue) <= Number(condition.value);
      case 'eq':
        return contextValue === condition.value;
      case 'in':
        return Array.isArray(condition.value) && 
               condition.value.includes(contextValue);
      case 'not_in':
        return Array.isArray(condition.value) && 
               !condition.value.includes(contextValue);
      default:
        return false;
    }
  }

  private calculateActionDiscount(
    action: PromotionAction, 
    cartValue: Money, 
    context: Record<string, any>
  ): Money {
    switch (action.type) {
      case 'percentage_discount':
        return cartValue.multiply(action.value / 100);
      
      case 'fixed_discount':
        return new Money(action.value);
      
      case 'free_shipping':
        return new Money(context.shippingCost || 0);
      
      case 'buy_x_get_y':
        // Complex logic for buy X get Y promotions
        return this.calculateBuyXGetY(action, context);
      
      case 'bundle_discount':
        return this.calculateBundleDiscount(action, context);
      
      default:
        return Money.zero();
    }
  }

  private calculateBuyXGetY(action: PromotionAction, context: Record<string, any>): Money {
    const { buyQuantity, getQuantity, productIds } = action.metadata || {};
    const cartItems = context.cartItems || [];
    
    let discount = Money.zero();
    
    for (const productId of productIds || []) {
      const item = cartItems.find((item: any) => item.productId === productId);
      if (!item) continue;
      
      const eligibleSets = Math.floor(item.quantity / buyQuantity);
      const freeItems = Math.min(eligibleSets * getQuantity, item.quantity);
      const itemDiscount = new Money(item.price).multiply(freeItems);
      
      discount = discount.add(itemDiscount);
    }
    
    return discount;
  }

  private calculateBundleDiscount(action: PromotionAction, context: Record<string, any>): Money {
    const { bundleProducts, discountType } = action.metadata || {};
    const cartItems = context.cartItems || [];
    
    // Check if all bundle products are in cart
    const hasAllBundleProducts = bundleProducts?.every((bundleProductId: string) =>
      cartItems.some((item: any) => item.productId === bundleProductId)
    );
    
    if (!hasAllBundleProducts) return Money.zero();
    
    // Calculate bundle discount
    const bundleValue = bundleProducts.reduce((total: number, productId: string) => {
      const item = cartItems.find((item: any) => item.productId === productId);
      return total + (item ? item.price * item.quantity : 0);
    }, 0);
    
    if (discountType === 'percentage') {
      return new Money(bundleValue * (action.value / 100));
    } else {
      return new Money(Math.min(action.value, bundleValue));
    }
  }
}