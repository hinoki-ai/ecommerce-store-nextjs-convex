import { ID } from '../../domain/types';

// Type definitions for external service data
export interface PaymentMetadata {
  orderId?: string;
  customerId?: string;
  userId?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface EmailTemplateData {
  [key: string]: string | number | boolean | undefined;
}

export interface AnalyticsEventProperties {
  [key: string]: string | number | boolean | undefined;
}

export interface NotificationData {
  [key: string]: string | number | boolean | undefined;
}

export interface EmailNotificationData {
  [key: string]: string | number | boolean | undefined;
}

export interface LogMetadata {
  [key: string]: string | number | boolean | undefined;
}

// Payment service interface
export interface IPaymentService {
  createPaymentIntent(amount: number, currency: string, metadata: PaymentMetadata): Promise<PaymentIntent>;
  confirmPayment(paymentIntentId: string): Promise<PaymentResult>;
  refundPayment(paymentIntentId: string, amount?: number): Promise<RefundResult>;
  getPaymentStatus(paymentIntentId: string): Promise<PaymentStatus>;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'processing' | 'succeeded' | 'canceled';
  metadata: PaymentMetadata;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId: string;
  error?: string;
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  error?: string;
}

export interface PaymentStatus {
  status: string;
  amount: number;
  currency: string;
  captured: boolean;
}

// Email service interface
export interface IEmailService {
  sendEmail(to: string, subject: string, template: string, data: EmailTemplateData): Promise<boolean>;
  sendOrderConfirmation(orderId: ID, customerEmail: string): Promise<boolean>;
  sendOrderStatusUpdate(orderId: ID, customerEmail: string): Promise<boolean>;
  sendPasswordReset(email: string, resetToken: string): Promise<boolean>;
  sendWelcomeEmail(email: string, userName: string): Promise<boolean>;
}

// SMS service interface
export interface ISmsService {
  sendSms(phoneNumber: string, message: string): Promise<boolean>;
  sendOrderConfirmation(phoneNumber: string, orderNumber: string): Promise<boolean>;
  sendOrderStatusUpdate(phoneNumber: string, orderNumber: string, status: string): Promise<boolean>;
  sendVerificationCode(phoneNumber: string, code: string): Promise<boolean>;
}

// File upload service interface
export interface IFileUploadService {
  uploadFile(file: File, folder: string): Promise<UploadResult>;
  deleteFile(fileUrl: string): Promise<boolean>;
  getFileUrl(filePath: string): string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// SEO service interface
export interface ISeoService {
  generateMetaTitle(content: string): Promise<string>;
  generateMetaDescription(content: string): Promise<string>;
  analyzeSeoScore(content: string, keywords: string[]): Promise<number>;
  generateBlogPost(topic: string, keywords: string[]): Promise<BlogPostGeneration>;
  optimizeProductSeo(productId: ID): Promise<SeoOptimizationResult>;
}

export interface BlogPostGeneration {
  title: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  seoScore: number;
}

export interface SeoOptimizationResult {
  optimizedTitle: string;
  optimizedDescription: string;
  tags: string[];
  seoScore: number;
  improvements: string[];
}

// Analytics service interface
export interface IAnalyticsService {
  trackEvent(event: string, properties: AnalyticsEventProperties): Promise<void>;
  trackPurchase(orderId: ID, amount: number, currency: string): Promise<void>;
  trackProductView(productId: ID, userId?: ID): Promise<void>;
  trackCartAction(action: string, productId: ID, userId?: ID): Promise<void>;
  getProductAnalytics(productId: ID, dateRange: { start: Date; end: Date }): Promise<ProductAnalytics>;
}

export interface ProductAnalytics {
  views: number;
  purchases: number;
  conversionRate: number;
  revenue: number;
  popularTimes: string[];
}

// Notification service interface
export interface INotificationService {
  sendPushNotification(userId: ID, title: string, message: string, data?: NotificationData): Promise<boolean>;
  sendInAppNotification(userId: ID, type: string, title: string, message: string, data?: NotificationData): Promise<void>;
  sendEmailNotification(email: string, subject: string, template: string, data: EmailNotificationData): Promise<boolean>;
  sendSmsNotification(phoneNumber: string, message: string): Promise<boolean>;
}

// Shipping service interface
export interface IShippingService {
  calculateShippingRate(origin: Address, destination: Address, weight: number, dimensions?: Dimensions): Promise<ShippingRate[]>;
  createShipment(orderId: ID, rate: ShippingRate): Promise<Shipment>;
  trackShipment(trackingNumber: string): Promise<ShipmentTracking>;
  getShippingLabel(shipmentId: string): Promise<string>;
}

export interface Address {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface ShippingRate {
  id: string;
  carrier: string;
  service: string;
  cost: number;
  currency: string;
  estimatedDays: number;
  guaranteedService: boolean;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  carrier: string;
  service: string;
  cost: number;
  labelUrl?: string;
  createdAt: number;
}

export interface ShipmentTracking {
  trackingNumber: string;
  status: 'pre_transit' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failure' | 'unknown';
  statusDetails?: string;
  carrierStatus?: string;
  estimatedDeliveryDate?: number;
  actualDeliveryDate?: number;
  trackingHistory: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: number;
  status: string;
  location?: string;
  message: string;
  carrierStatus?: string;
}

// Cache service interface
export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  clear(): Promise<void>;
}

// Queue service interface
export interface IQueueService {
  enqueue<T>(queueName: string, data: T): Promise<void>;
  dequeue<T>(queueName: string): Promise<T | null>;
  getQueueLength(queueName: string): Promise<number>;
}

// Logging service interface
export interface ILoggingService {
  info(message: string, meta?: LogMetadata): void;
  warn(message: string, meta?: LogMetadata): void;
  error(message: string, error?: Error, meta?: LogMetadata): void;
  debug(message: string, meta?: LogMetadata): void;
}