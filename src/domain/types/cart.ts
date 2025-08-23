import { ID, Timestamp, Currency } from './common';
import { Money } from '../value-objects/money';

export interface CartItem {
  id: ID;
  productId: ID;
  quantity: number;
  price: Money;
  addedAt: Timestamp;
  variantSelections?: Record<string, string>;
  metadata?: {
    categoryId?: string;
    tags?: string[];
  };
}

export interface CartPricing {
  subtotal: Money;
  tax: Money;
  total: Money;
  currency: Currency;
  discount?: Money;
}

export interface Cart {
  id: ID;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  pricing: CartPricing;
  expiresAt?: Timestamp;
  audit: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
}