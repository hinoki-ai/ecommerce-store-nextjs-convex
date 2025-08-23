import { BaseEntity } from './base-entity';
import { Cart as CartType, CartItem, CartPricing } from '../types';
import { Money } from '../value-objects/money';

export class Cart extends BaseEntity implements CartType {
  private _userId?: string;
  private _sessionId?: string;
  private _items: CartItem[];
  private _pricing: CartPricing;
  private _expiresAt?: number;

  constructor(id: string, pricing: CartPricing) {
    super(id);
    this._items = [];
    this._pricing = pricing;
  }

  // Getters
  get userId(): string | undefined { return this._userId; }
  get sessionId(): string | undefined { return this._sessionId; }
  get items(): CartItem[] { return [...this._items]; }
  get pricing(): CartPricing { return { ...this._pricing }; }
  get expiresAt(): number | undefined { return this._expiresAt; }

  // Business logic methods
  isEmpty(): boolean {
    return this._items.length === 0;
  }

  getTotalQuantity(): number {
    return this._items.reduce((total, item) => total + item.quantity, 0);
  }

  getItemByProductId(productId: string): CartItem | undefined {
    return this._items.find(item => item.productId === productId);
  }

  hasItem(productId: string): boolean {
    return this._items.some(item => item.productId === productId);
  }

  isExpired(): boolean {
    return this._expiresAt ? Date.now() > this._expiresAt : false;
  }

  // Business rules validation
  validate(): boolean {
    const rules = this.getBusinessRules();
    return rules.length === 0;
  }

  getBusinessRules(): string[] {
    const errors: string[] = [];

    if (!this._userId && !this._sessionId) {
      errors.push('Cart must have either userId or sessionId');
    }

    // Check for duplicate products
    const productIds = this._items.map(item => item.productId);
    const uniqueProductIds = new Set(productIds);
    if (productIds.length !== uniqueProductIds.size) {
      errors.push('Cart cannot have duplicate products');
    }

    // Check for valid quantities
    this._items.forEach((item, index) => {
      if (item.quantity <= 0) {
        errors.push(`Item at index ${index} must have quantity > 0`);
      }
      if (item.price.isNegative()) {
        errors.push(`Item at index ${index} cannot have negative price`);
      }
    });

    return errors;
  }

  // Mutation methods
  setUserId(userId: string): void {
    this._userId = userId;
    this.setUpdatedBy('system');
  }

  setSessionId(sessionId: string): void {
    this._sessionId = sessionId;
    this.setUpdatedBy('system');
  }

  setExpiration(hours: number = 24): void {
    this._expiresAt = Date.now() + (hours * 60 * 60 * 1000);
    this.setUpdatedBy('system');
  }

  clearExpiration(): void {
    this._expiresAt = undefined;
    this.setUpdatedBy('system');
  }

  addItem(productId: string, quantity: number, price: Money): void {
    if (quantity <= 0) throw new Error('Quantity must be greater than 0');
    if (price.isNegative()) throw new Error('Price cannot be negative');

    const existingItem = this._items.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.addedAt = Date.now();
    } else {
      const newItem: CartItem = {
        id: `cart_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId,
        quantity,
        price,
        addedAt: Date.now(),
      };
      this._items.push(newItem);
    }

    this.recalculatePricing();
    this.setUpdatedBy('system');
  }

  removeItem(productId: string): void {
    const index = this._items.findIndex(item => item.productId === productId);
    if (index !== -1) {
      this._items.splice(index, 1);
      this.recalculatePricing();
      this.setUpdatedBy('system');
    }
  }

  updateItemQuantity(productId: string, quantity: number): void {
    if (quantity < 0) throw new Error('Quantity cannot be negative');

    const item = this._items.find(item => item.productId === productId);
    if (item) {
      if (quantity === 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        item.addedAt = Date.now();
        this.recalculatePricing();
        this.setUpdatedBy('system');
      }
    }
  }

  updateItemPrice(productId: string, price: Money): void {
    if (price.isNegative()) throw new Error('Price cannot be negative');

    const item = this._items.find(item => item.productId === productId);
    if (item) {
      item.price = price;
      this.recalculatePricing();
      this.setUpdatedBy('system');
    }
  }

  clear(): void {
    this._items = [];
    this.recalculatePricing();
    this.setUpdatedBy('system');
  }

  private recalculatePricing(): void {
    const subtotal = this._items.reduce((total, item) =>
      total.add(item.price.multiply(item.quantity)), Money.zero());
    const taxRate = 0.19; // Assuming 19% tax rate, this should be configurable
    const tax = subtotal.multiply(taxRate);

    this._pricing.subtotal = subtotal;
    this._pricing.tax = tax;
    this._pricing.total = subtotal.add(tax);
  }

  updatePricing(pricing: Partial<CartPricing>): void {
    this._pricing = { ...this._pricing, ...pricing };
    this.setUpdatedBy('system');
  }

  merge(otherCart: Cart): void {
    otherCart.items.forEach(otherItem => {
      const existingItem = this._items.find(item => item.productId === otherItem.productId);
      if (existingItem) {
        existingItem.quantity += otherItem.quantity;
        existingItem.addedAt = Math.max(existingItem.addedAt, otherItem.addedAt);
      } else {
        this._items.push({ ...otherItem });
      }
    });

    this.recalculatePricing();
    this.setUpdatedBy('system');
  }

  toJSON(): Record<string, any> {
    return {
      id: this._id,
      userId: this._userId,
      sessionId: this._sessionId,
      items: this._items,
      pricing: this._pricing,
      expiresAt: this._expiresAt,
      audit: this._audit,
    };
  }
}