import { ID, Timestamp, Currency } from './common';

export interface CartItem {
  id: ID;
  productId: ID;
  quantity: number;
  price: number;
  addedAt: Timestamp;
  variantSelections?: Record<string, string>;
}

export interface CartPricing {
  subtotal: number;
  tax: number;
  total: number;
  currency: Currency;
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