import { Promotion, PromotionCondition, PromotionAction } from '../entities/promotion';
import { Cart } from '../entities/cart';
import { Product } from '../entities/product';
import { User } from '../entities/user';
import { Money } from '../value-objects/money';
import { ID } from '../types';
import { CartItem } from '../types/cart';

export interface PromotionCartItem {
  productId: string;
  quantity: number;
  price: Money;
  categoryId?: string;
  tags?: string[];
}

export interface CartAnalysis {
  subtotal: Money;
  items: PromotionCartItem[];
  categories: string[];
  productIds: string[];
  quantities: Record<string, number>;
  shippingCost: Money;
  userSegment: string;
  isFirstPurchase: boolean;
}



export interface PromotionResult {
  promotion: Promotion;
  discount: Money;
  description: string;
  applied: boolean;
  reason?: string;
}

export interface OptimalPromotionSet {
  promotions: PromotionResult[];
  totalDiscount: Money;
  finalPrice: Money;
  savings: Money;
  savingsPercentage: number;
}

export class PromotionService {
  
  /**
   * Find all applicable promotions for a cart
   */
  static findApplicablePromotions(
    cart: Cart, 
    user: User | null, 
    availablePromotions: Promotion[]
  ): PromotionResult[] {
    const cartAnalysis = this.analyzeCart(cart, user);
    const results: PromotionResult[] = [];

    for (const promotion of availablePromotions) {
      if (!promotion.isValidNow()) {
        results.push({
          promotion,
          discount: Money.zero(),
          description: 'Promotion expired or inactive',
          applied: false,
          reason: 'expired'
        });
        continue;
      }

      if (user && !promotion.canUserUse(user.id)) {
        results.push({
          promotion,
          discount: Money.zero(),
          description: 'User has exceeded usage limit',
          applied: false,
          reason: 'usage_limit'
        });
        continue;
      }

      const discount = this.calculatePromotionDiscount(promotion, cartAnalysis);
      
      if (discount.isGreaterThan(Money.zero())) {
        results.push({
          promotion,
          discount,
          description: this.generatePromotionDescription(promotion, discount),
          applied: true
        });
      } else {
        results.push({
          promotion,
          discount: Money.zero(),
          description: 'Conditions not met',
          applied: false,
          reason: 'conditions_not_met'
        });
      }
    }

    return results;
  }

  /**
   * Find the optimal combination of promotions (non-stackable logic)
   */
  static findOptimalPromotions(
    cart: Cart,
    user: User | null,
    availablePromotions: Promotion[]
  ): OptimalPromotionSet {
    const applicableResults = this.findApplicablePromotions(cart, user, availablePromotions);
    const applicablePromotions = applicableResults.filter(result => result.applied);

    // Separate stackable and non-stackable promotions
    const stackablePromotions = applicablePromotions.filter(
      result => result.promotion.stackable
    );
    const nonStackablePromotions = applicablePromotions.filter(
      result => !result.promotion.stackable
    );

    // Sort non-stackable by discount amount (highest first)
    nonStackablePromotions.sort((a, b) => 
      b.discount.amount - a.discount.amount
    );

    let selectedPromotions: PromotionResult[] = [];
    let totalDiscount = Money.zero();

    // Strategy 1: Best single non-stackable promotion + all stackable
    if (nonStackablePromotions.length > 0) {
      const bestNonStackable = nonStackablePromotions[0];
      selectedPromotions = [bestNonStackable, ...stackablePromotions];
      totalDiscount = selectedPromotions.reduce(
        (sum, result) => sum.add(result.discount),
        Money.zero()
      );
    } 
    // Strategy 2: Only stackable promotions
    else if (stackablePromotions.length > 0) {
      selectedPromotions = stackablePromotions;
      totalDiscount = stackablePromotions.reduce(
        (sum, result) => sum.add(result.discount),
        Money.zero()
      );
    }

    // Strategy 3: Compare with stackable-only combination
    if (nonStackablePromotions.length > 0 && stackablePromotions.length > 0) {
      const stackableOnlyDiscount = stackablePromotions.reduce(
        (sum, result) => sum.add(result.discount),
        Money.zero()
      );

      if (stackableOnlyDiscount.isGreaterThan(totalDiscount)) {
        selectedPromotions = stackablePromotions;
        totalDiscount = stackableOnlyDiscount;
      }
    }

    const originalPrice = cart.pricing.total;
    const finalPrice = originalPrice.subtract(totalDiscount);
    const savingsPercentage = originalPrice.isGreaterThan(Money.zero())
      ? (totalDiscount.amount / originalPrice.amount) * 100
      : 0;

    return {
      promotions: selectedPromotions,
      totalDiscount,
      finalPrice: Money.max(finalPrice, Money.zero()), // Ensure non-negative
      savings: totalDiscount,
      savingsPercentage
    };
  }

  /**
   * Apply promotions to cart and update user usage
   */
  static applyPromotionsToCart(
    cart: Cart,
    promotionResults: PromotionResult[],
    userId?: string
  ): Cart {
    const discountedCart = new Cart(
      `discounted_${Date.now()}`,
      { ...cart.pricing }
    );

    // Add all items
    cart.items.forEach(item => {
      discountedCart.addItem(item.productId, item.quantity, item.price);
    });

    // Apply total discount
    const totalDiscount = promotionResults.reduce(
      (sum, result) => sum.add(result.discount),
      Money.zero()
    );

    const originalTotal = cart.pricing.total;
    const newTotal = originalTotal.subtract(totalDiscount);
    discountedCart.updatePricing({
      total: Money.max(newTotal, Money.zero()),
      discount: totalDiscount
    });

    // Update promotion usage (this would typically be done in infrastructure layer)
    if (userId) {
      promotionResults.forEach(result => {
        if (result.applied) {
          result.promotion.incrementUsage(userId, result.discount);
        }
      });
    }

    return discountedCart;
  }

  /**
   * Validate promotion before creation/update
   */
  static validatePromotion(promotion: Promotion): string[] {
    const errors = promotion.getBusinessRules();

    // Additional business validations
    if (promotion.priority < 0) {
      errors.push('Priority must be non-negative');
    }

    // Validate conditions
    for (const condition of promotion.conditions) {
      const conditionErrors = this.validateCondition(condition);
      errors.push(...conditionErrors);
    }

    // Validate actions
    for (const action of promotion.actions) {
      const actionErrors = this.validateAction(action);
      errors.push(...actionErrors);
    }

    return errors;
  }

  /**
   * Generate promotion suggestions using AI
   */
  static async generatePromotionSuggestions(
    salesData: Record<string, any>,
    seasonalData: Record<string, any>,
    competitorData?: Record<string, any>
  ): Promise<Partial<Promotion>[]> {
    // This would integrate with AI service for promotion recommendations
    // Based on sales patterns, seasonal trends, and competitive analysis
    
    const suggestions: Partial<Promotion>[] = [];

    // Example: Low-performing category boost
    if (salesData.lowPerformingCategories) {
      suggestions.push({
        name: `${salesData.lowPerformingCategories[0]} Category Boost`,
        description: 'Increase sales in underperforming category',
        type: 'automatic',
        conditions: [
          {
            type: 'category_purchase',
            value: salesData.lowPerformingCategories[0],
            operator: 'eq'
          }
        ],
        actions: [
          {
            type: 'percentage_discount',
            value: 15,
            target: 'category'
          }
        ],
        priority: 1
      });
    }

    // Example: Seasonal promotion
    if (seasonalData.upcomingHoliday) {
      suggestions.push({
        name: `${seasonalData.upcomingHoliday} Special`,
        description: 'Holiday seasonal promotion',
        type: 'campaign',
        conditions: [
          {
            type: 'min_purchase',
            value: 50,
            operator: 'gte'
          }
        ],
        actions: [
          {
            type: 'percentage_discount',
            value: 20,
            target: 'cart_total'
          }
        ],
        priority: 2
      });
    }

    return suggestions;
  }

  // Private helper methods
  private static analyzeCart(cart: Cart, user: User | null): CartAnalysis {
    const items = cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      categoryId: item.metadata?.categoryId,
      tags: item.metadata?.tags
    }));

    const categories = [...new Set(items.map(item => item.categoryId).filter((id): id is string => Boolean(id)))];
    const productIds = items.map(item => item.productId);
    const quantities = items.reduce((acc, item) => {
      acc[item.productId] = item.quantity;
      return acc;
    }, {} as Record<string, number>);

    return {
      subtotal: cart.pricing.subtotal,
      items,
      categories,
      productIds,
      quantities,
      shippingCost: Money.zero(), // Would be calculated elsewhere
      userSegment: user?.metadata?.segment || 'regular',
      isFirstPurchase: user ? (user.metadata?.orderCount || 0) === 0 : false
    };
  }

  private static calculatePromotionDiscount(
    promotion: Promotion,
    cartAnalysis: CartAnalysis
  ): Money {
    const conditionContext = {
      min_purchase: cartAnalysis.subtotal.amount,
      category_purchase: cartAnalysis.categories,
      product_specific: cartAnalysis.productIds,
      quantity_threshold: Object.values(cartAnalysis.quantities).reduce((a, b) => a + b, 0),
      user_segment: cartAnalysis.userSegment,
      first_purchase: cartAnalysis.isFirstPurchase,
      location_based: 'CL' // Default to Chile
    };

    const actionContext = {
      cartItems: cartAnalysis.items,
      shippingCost: cartAnalysis.shippingCost.amount,
      categories: cartAnalysis.categories,
      productIds: cartAnalysis.productIds
    };

    return promotion.calculateDiscount(cartAnalysis.subtotal, {
      ...conditionContext,
      ...actionContext
    });
  }

  private static generatePromotionDescription(promotion: Promotion, discount: Money): string {
    const action = promotion.actions[0]; // Simplified for primary action
    
    switch (action?.type) {
      case 'percentage_discount':
        return `${action.value}% de descuento - Ahorras $${discount.amount.toFixed(2)}`;
      case 'fixed_discount':
        return `Descuento fijo de $${discount.amount.toFixed(2)}`;
      case 'free_shipping':
        return `Envío gratuito - Ahorras $${discount.amount.toFixed(2)}`;
      case 'buy_x_get_y':
        return `Promoción especial - Ahorras $${discount.amount.toFixed(2)}`;
      default:
        return `Descuento aplicado - Ahorras $${discount.amount.toFixed(2)}`;
    }
  }

  private static validateCondition(condition: PromotionCondition): string[] {
    const errors: string[] = [];

    if (!condition.type) {
      errors.push('Condition type is required');
    }

    if (condition.value === undefined || condition.value === null) {
      errors.push('Condition value is required');
    }

    if (!condition.operator) {
      errors.push('Condition operator is required');
    }

    return errors;
  }

  private static validateAction(action: PromotionAction): string[] {
    const errors: string[] = [];

    if (!action.type) {
      errors.push('Action type is required');
    }

    if (action.value === undefined || action.value === null) {
      errors.push('Action value is required');
    }

    if (action.type === 'percentage_discount' && (action.value < 0 || action.value > 100)) {
      errors.push('Percentage discount must be between 0 and 100');
    }

    if (action.type === 'fixed_discount' && action.value < 0) {
      errors.push('Fixed discount must be non-negative');
    }

    return errors;
  }
}