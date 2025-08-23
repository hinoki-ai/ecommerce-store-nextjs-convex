import { ID, Timestamp, Address, ContactInfo, OrderStatus, PaymentStatus, Currency, AuditInfo } from './common';

export interface OrderItem {
  id: ID;
  productId: ID;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variantSelections?: Record<string, string>;
}

export interface OrderPricing {
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  shippingCost: number;
  discountAmount?: number;
  totalAmount: number;
  currency: Currency;
}

export interface Order {
  id: ID;
  orderNumber: string;
  userId?: ID;
  customerInfo: ContactInfo;
  shippingAddress: Address;
  billingAddress?: Address;

  // Order items
  items: OrderItem[];

  // Pricing breakdown
  pricing: OrderPricing;

  // Status
  status: OrderStatus;
  paymentStatus: PaymentStatus;

  // Payment info
  paymentMethod?: string;
  paymentIntentId?: string;

  // Shipping info
  shippingMethod?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: Timestamp;
  shippedAt?: Timestamp;
  deliveredAt?: Timestamp;

  // Audit info
  audit: AuditInfo;
}