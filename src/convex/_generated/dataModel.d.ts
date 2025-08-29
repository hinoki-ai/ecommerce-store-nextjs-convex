/* eslint-disable */
// Generated Convex Data Model Types

export interface Doc {
  _id: string;
  _creationTime: number;
}

export type Id<T extends string = string> = string & { __tableName: T };

// Users table (from Clerk integration)
export interface User extends Doc {
  name: string;
  externalId: string;
  email?: string;
  phone?: string;
  role?: "super_admin" | "admin" | "moderator" | "affiliate" | "customer" | "viewer";
  permissions?: string[];
  isActive?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  emailVerifiedAt?: number;
  phoneVerifiedAt?: number;
  lastLoginAt?: number;
  lastActiveAt?: number;
  loginCount?: number;
  failedLoginAttempts?: number;
  lastFailedLoginAt?: number;
  affiliateData?: {
    referralCode: string;
    commissionRate: number;
    totalEarnings: number;
    payoutMethod: "paypal" | "bank" | "stripe";
    isActive: boolean;
  };
  metadata?: {
    timezone?: string;
    deviceInfo?: {
      lastDevice: string;
      lastIpAddress: string;
      lastUserAgent: string;
    };
    marketingOptIn?: boolean;
    privacySettings?: {
      shareData: boolean;
      allowTracking: boolean;
      allowPersonalization: boolean;
    };
  };
  createdAt?: number;
  updatedAt?: number;
}

// Products table
export interface Product extends Doc {
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
  slug?: string;
  seoScore?: number;
  excerpt?: string;
  imageUrl?: string;
  published: boolean;
  createdAt?: number;
  updatedAt?: number;
}

// Categories table
export interface Category extends Doc {
  name: string;
  nameJA?: string;
  slug: string;
  description?: string;
  parentId?: Id<"categories">;
  sortOrder: number;
  isActive: boolean;
  icon?: string;
  color?: string;
  createdAt?: number;
  updatedAt?: number;
}

// Carts table
export interface Cart extends Doc {
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  pricing: {
    subtotal: Money;
    tax: Money;
    total: Money;
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
  price: Money;
  addedAt: number;
  variantSelections?: Record<string, string>;
  metadata?: {
    categoryId?: string;
    tags?: string[];
  };
}

// Orders table
export interface Order extends Doc {
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  pricing: {
    subtotal: Money;
    tax: Money;
    shipping: Money;
    total: Money;
    currency: string;
  };
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress: Address;
  billingAddress?: Address;
  shippingMethod?: string;
  paymentMethod?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface OrderItem {
  id: string;
  productId: Id<"products">;
  productName: string;
  productImage: string;
  quantity: number;
  price: Money;
  total: Money;
  variantSelections?: Record<string, string>;
}

// Billing/Subscriptions
export interface Subscription extends Doc {
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  metadata?: any;
}

// Notifications
export interface Notification extends Doc {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  expiresAt?: number;
  createdAt: number;
}

// Supporting types
export interface Money {
  amount: number;
  currency: string;
}

export interface Address {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "returned";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "incomplete"
  | "trialing";

export type NotificationType =
  | "wishlist_price_drop"
  | "wishlist_back_in_stock"
  | "wishlist_sale_alert"
  | "order_update"
  | "review_approved"
  | "low_stock_alert";