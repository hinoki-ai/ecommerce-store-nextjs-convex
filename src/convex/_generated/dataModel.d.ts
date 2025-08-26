// Mock TypeScript definitions for Convex data model
// This file provides type definitions when using mock data

export interface Doc {
  _id: string;
  _creationTime: number;
}

// Mock Id type for Convex
export type Id<T extends string = string> = string & { __tableName: T };

export interface Product extends Doc {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  inStock: boolean;
  stock: number;
  tags: string[];
  rating: number;
  reviews: number;
}

export interface Category extends Doc {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface User extends Doc {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  imageUrl: string;
}

export interface Cart extends Doc {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  pricing: {
    subtotal: { amount: number; currency: string };
    tax: { amount: number; currency: string };
    total: { amount: number; currency: string };
    currency: string;
  };
  audit: {
    createdAt: number;
    updatedAt: number;
  };
}

export interface CartItem {
  id: string;
  productId: Id<"products">;
  quantity: number;
  price: {
    amount: number;
    currency: string;
  };
  addedAt: number;
  variantSelections?: Record<string, string>;
  metadata?: {
    categoryId?: string;
    tags?: string[];
  };
}

export interface Order extends Doc {
  id: string;
  userId: string;
  items: OrderItem[];
  status: string;
  total: number;
  currency: string;
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Review extends Doc {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// Mock table definitions
export const products = null as any;
export const categories = null as any;
export const users = null as any;
export const carts = null as any;
export const orders = null as any;
export const reviews = null as any;