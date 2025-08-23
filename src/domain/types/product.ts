import { ID, Timestamp, Image, SEOData, AuditInfo } from './common';

export interface ProductVariant {
  id: ID;
  name: string;
  type: 'select' | 'radio' | 'checkbox';
  options: ProductVariantOption[];
  required: boolean;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductVariantOption {
  value: string;
  label: string;
  priceAdjustment?: number;
  imageUrl?: string;
  stockQuantity?: number;
  sku?: string;
}

export interface ProductInventory {
  quantity: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
}

export interface ProductFreshness {
  expiryDate?: Timestamp;
  isFresh: boolean;
  isNew: boolean;
  isPopular: boolean;
}

export interface ProductNutrition {
  calories?: number;
  allergens?: string[];
  ingredients?: string[];
}

export interface Product {
  id: ID;
  name: string;
  nameJA?: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  barcode?: string;
  categoryId: ID;

  // Pricing
  price: number;
  compareAtPrice?: number;
  cost?: number;
  taxRate: number;

  // Inventory
  inventory: ProductInventory;

  // Attributes
  images: Image[];
  weight?: number;
  dimensions?: ProductDimensions;

  // Japanese-style freshness
  freshness?: ProductFreshness;

  // Nutritional info
  nutrition?: ProductNutrition;

  // SEO and metadata
  seo: SEOData;

  // Status flags
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  requiresShipping: boolean;

  // Variants
  variants?: ProductVariant[];

  // Audit info
  audit: AuditInfo;
}