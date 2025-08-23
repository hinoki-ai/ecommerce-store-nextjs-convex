// Common domain types
export type ID = string;

export type Timestamp = number;

export type Currency = 'CLP' | 'USD' | 'EUR' | 'GBP' | 'JPY';

export type Language = 'es-CL' | 'en-US' | 'ja-JP';

export type UserRole = 'customer' | 'admin' | 'moderator';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type InventoryType =
  | 'stock_in'
  | 'stock_out'
  | 'reserved'
  | 'released'
  | 'adjustment';

export interface Address {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  additionalInfo?: string;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface AuditInfo {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: ID;
  updatedBy?: ID;
}

export interface Image {
  url: string;
  alt: string;
  sortOrder: number;
  width?: number;
  height?: number;
}

export interface SEOData {
  metaTitle?: string;
  metaDescription?: string;
  tags: string[];
  seoScore?: number;
  optimizedTitle?: string;
  optimizedDescription?: string;
  originalTitle?: string;
  originalDescription?: string;
}