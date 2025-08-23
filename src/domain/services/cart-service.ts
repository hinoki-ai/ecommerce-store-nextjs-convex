import { Cart } from '../entities/cart';
import { Product } from '../entities/product';
import { Money } from '../value-objects/money';

export interface CartValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CartSummary {
  itemCount: number;
  uniqueItems: number;
  totalWeight?: number;
  requiresShipping: boolean;
  hasDigitalProducts: boolean;
  hasPhysicalProducts: boolean;
}

export class CartService {
  // Business logic for cart operations

  static validateCart(cart: Cart): CartValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if cart is empty
    if (cart.isEmpty()) {
      errors.push('Cart is empty');
      return { isValid: false, errors, warnings };
    }

    // Check for expired cart
    if (cart.isExpired()) {
      errors.push('Cart has expired');
    }

    // Validate cart business rules
    const validationErrors = cart.getBusinessRules();
    errors.push(...validationErrors);

    // Check for items with zero quantity
    cart.items.forEach((item, index) => {
      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1} has invalid quantity`);
      }
      if (item.price.isZero() || item.price.isNegative()) {
        errors.push(`Item ${index + 1} has invalid price`);
      }
    });

    // Warnings for potential issues
    const highValueItems = cart.items.filter(item => item.price.isGreaterThan(new Money(1000)));
    if (highValueItems.length > 0) {
      warnings.push('Cart contains high-value items');
    }

    const lowStockItems = cart.items.filter(item => item.quantity > 5);
    if (lowStockItems.length > 0) {
      warnings.push('Cart contains items with high quantities');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static calculateCartSummary(cart: Cart): CartSummary {
    const items = cart.items;

    return {
      itemCount: cart.getTotalQuantity(),
      uniqueItems: items.length,
      requiresShipping: items.some(item => {
        // In a real implementation, this would check product properties
        return true; // Placeholder logic
      }),
      hasDigitalProducts: items.some(item => {
        // In a real implementation, this would check product.isDigital
        return false; // Placeholder logic
      }),
      hasPhysicalProducts: items.some(item => {
        // In a real implementation, this would check !product.isDigital
        return true; // Placeholder logic
      })
    };
  }

  static canAddToCart(cart: Cart, product: Product, quantity: number): { canAdd: boolean; reason?: string } {
    // Check if product is available
    if (!product.isActive) {
      return { canAdd: false, reason: 'Product is not available' };
    }

    if (!product.isInStock()) {
      return { canAdd: false, reason: 'Product is out of stock' };
    }

    // Check inventory
    if (product.inventory.trackInventory) {
      const currentQuantity = cart.getItemByProductId(product.id)?.quantity || 0;
      if (currentQuantity + quantity > product.inventory.quantity) {
        return {
          canAdd: false,
          reason: `Only ${product.inventory.quantity - currentQuantity} items available`
        };
      }
    }

    // Check maximum quantity per customer (business rule)
    const currentQuantity = cart.getItemByProductId(product.id)?.quantity || 0;
    const maxQuantity = 10; // Business rule
    if (currentQuantity + quantity > maxQuantity) {
      return {
        canAdd: false,
        reason: `Maximum ${maxQuantity} items allowed per customer`
      };
    }

    return { canAdd: true };
  }

  static mergeCarts(sourceCart: Cart, targetCart: Cart): Cart {
    // Create a new cart with merged items
    const mergedCart = new Cart(
      `merged_${Date.now()}`,
      targetCart.pricing
    );

    // Add all items from target cart
    targetCart.items.forEach(item => {
      mergedCart.addItem(
        item.productId,
        item.quantity,
        item.price.amount
      );
    });

    // Add items from source cart
    sourceCart.items.forEach(sourceItem => {
      const existingItem = mergedCart.getItemByProductId(sourceItem.productId);
      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = existingItem.quantity + sourceItem.quantity;
        mergedCart.updateItemQuantity(sourceItem.productId, newQuantity);
      } else {
        // Add new item
        mergedCart.addItem(
          sourceItem.productId,
          sourceItem.quantity,
          sourceItem.price.amount
        );
      }
    });

    return mergedCart;
  }

  static splitCart(cart: Cart, productIds: string[]): { kept: Cart; removed: Cart } {
    const keptCart = new Cart(`kept_${Date.now()}`, cart.pricing);
    const removedCart = new Cart(`removed_${Date.now()}`, cart.pricing);

    cart.items.forEach(item => {
      if (productIds.includes(item.productId)) {
        removedCart.addItem(item.productId, item.quantity, item.price.amount);
      } else {
        keptCart.addItem(item.productId, item.quantity, item.price.amount);
      }
    });

    return { kept: keptCart, removed: removedCart };
  }

  static calculateShippingCost(cart: Cart, region: string = 'CL'): Money {
    const summary = this.calculateCartSummary(cart);

    if (!summary.requiresShipping || summary.hasDigitalProducts && !summary.hasPhysicalProducts) {
      return Money.zero();
    }

    // Simplified shipping cost calculation
    const baseCost = new Money(5.00); // Base shipping cost
    const perItemCost = new Money(1.00); // Cost per item
    const itemCost = perItemCost.multiply(summary.itemCount);

    return baseCost.add(itemCost);
  }

  static applyDiscount(cart: Cart, discountPercentage: number): Cart {
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error('Discount percentage must be between 0 and 100');
    }

    const newCart = new Cart(`discounted_${Date.now()}`, { ...cart.pricing });

    // Add all items
    cart.items.forEach(item => {
      newCart.addItem(item.productId, item.quantity, item.price.amount);
    });

    // Apply discount to total
    const discountMultiplier = 1 - (discountPercentage / 100);
    const newTotal = cart.pricing.total.multiply(discountMultiplier);

    newCart.updatePricing({
      total: newTotal
    });

    return newCart;
  }

  static getCartAnalytics(cart: Cart): {
    averageItemPrice: Money;
    highestPricedItem: { productId: string; price: Money; quantity: number };
    lowestPricedItem: { productId: string; price: Money; quantity: number };
    priceDistribution: { low: number; medium: number; high: number };
  } {
    if (cart.isEmpty()) {
      throw new Error('Cannot analyze empty cart');
    }

    const items = cart.items;
    const totalValue = items.reduce((sum, item) =>
      sum.add(item.price.multiply(item.quantity)), Money.zero());

    const averageItemPrice = totalValue.divide(items.length);

    const sortedByPrice = [...items].sort((a, b) => b.price.amount - a.price.amount);
    const highestPricedItem = {
      productId: sortedByPrice[0].productId,
      price: sortedByPrice[0].price,
      quantity: sortedByPrice[0].quantity
    };

    const lowestPricedItem = {
      productId: sortedByPrice[sortedByPrice.length - 1].productId,
      price: sortedByPrice[sortedByPrice.length - 1].price,
      quantity: sortedByPrice[sortedByPrice.length - 1].quantity
    };

    // Price distribution
    const priceDistribution = items.reduce(
      (dist, item) => {
        if (item.price.isLessThan(new Money(10))) dist.low++;
        else if (item.price.isLessThan(new Money(100))) dist.medium++;
        else dist.high++;
        return dist;
      },
      { low: 0, medium: 0, high: 0 }
    );

    return {
      averageItemPrice,
      highestPricedItem,
      lowestPricedItem,
      priceDistribution
    };
  }
}