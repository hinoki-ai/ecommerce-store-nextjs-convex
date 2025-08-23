import { BaseError, ERROR_CODES } from './base-error';

// Application Layer Errors
export class ApplicationError extends BaseError {
  constructor(message: string, code: string, details?: Record<string, unknown>) {
    super(message, code, 500, details);
  }
}

// Use Case Errors
export class UseCaseError extends ApplicationError {
  constructor(message: string, code: string, details?: Record<string, unknown>) {
    super(message, code, details);
  }
}

export class ProductNotFoundInUseCaseError extends UseCaseError {
  constructor(productId: string) {
    super(
      `Product with ID ${productId} not found`,
      ERROR_CODES.PRODUCT_NOT_FOUND,
      { productId }
    );
  }
}

export class InsufficientInventoryError extends UseCaseError {
  constructor(productId: string, requested: number, available: number) {
    super(
      `Insufficient inventory for product ${productId}. Requested: ${requested}, Available: ${available}`,
      'INSUFFICIENT_INVENTORY',
      { productId, requested, available }
    );
  }
}

export class InvalidCartStateError extends UseCaseError {
  constructor(cartId: string, reason: string) {
    super(
      `Invalid cart state for cart ${cartId}: ${reason}`,
      'INVALID_CART_STATE',
      { cartId, reason }
    );
  }
}

export class OrderProcessingError extends UseCaseError {
  constructor(orderId: string, reason: string) {
    super(
      `Order processing failed for order ${orderId}: ${reason}`,
      'ORDER_PROCESSING_ERROR',
      { orderId, reason }
    );
  }
}

export class PaymentProcessingError extends UseCaseError {
  constructor(paymentIntentId: string, reason: string) {
    super(
      `Payment processing failed for payment ${paymentIntentId}: ${reason}`,
      ERROR_CODES.PAYMENT_PROCESSING_ERROR,
      { paymentIntentId, reason }
    );
  }
}

// Service Errors
export class ServiceError extends ApplicationError {
  constructor(message: string, code: string, details?: Record<string, unknown>) {
    super(message, code, details);
  }
}

export class EmailServiceError extends ServiceError {
  constructor(originalError?: Error) {
    super(
      'Email service error',
      ERROR_CODES.EMAIL_SEND_ERROR,
      { originalError: originalError?.message }
    );
  }
}

export class PaymentServiceError extends ServiceError {
  constructor(provider: string, originalError?: Error) {
    super(
      `Payment service error with ${provider}`,
      ERROR_CODES.PAYMENT_PROCESSING_ERROR,
      { provider, originalError: originalError?.message }
    );
  }
}

export class FileUploadError extends ServiceError {
  constructor(fileName: string, originalError?: Error) {
    super(
      `File upload failed for ${fileName}`,
      ERROR_CODES.FILE_UPLOAD_ERROR,
      { fileName, originalError: originalError?.message }
    );
  }
}

export class CacheServiceError extends ServiceError {
  constructor(operation: string, originalError?: Error) {
    super(
      `Cache service error during ${operation}`,
      'CACHE_ERROR',
      { operation, originalError: originalError?.message }
    );
  }
}

export class QueueServiceError extends ServiceError {
  constructor(operation: string, originalError?: Error) {
    super(
      `Queue service error during ${operation}`,
      'QUEUE_ERROR',
      { operation, originalError: originalError?.message }
    );
  }
}

// Configuration Errors
export class ConfigurationError extends ApplicationError {
  constructor(setting: string) {
    super(
      `Configuration error: ${setting} is not properly configured`,
      'CONFIGURATION_ERROR',
      { setting }
    );
  }
}

// Authorization and Authentication Errors
export class AuthenticationError extends ApplicationError {
  constructor(reason: string = 'Authentication failed') {
    super(reason, ERROR_CODES.AUTHENTICATION_ERROR, 401, { reason });
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(resource: string, action: string) {
    super(
      `Not authorized to ${action} ${resource}`,
      ERROR_CODES.AUTHORIZATION_ERROR,
      403,
      { resource, action }
    );
  }
}

export class TokenExpiredError extends AuthenticationError {
  constructor() {
    super('Access token has expired');
  }
}

export class InvalidTokenError extends AuthenticationError {
  constructor() {
    super('Invalid access token');
  }
}

// Validation Errors
export class ValidationError extends ApplicationError {
  constructor(field: string, reason: string) {
    super(
      `Validation failed for ${field}: ${reason}`,
      ERROR_CODES.VALIDATION_ERROR,
      400,
      { field, reason }
    );
  }
}

export class FormValidationError extends ApplicationError {
  constructor(errors: Record<string, string[]>) {
    super(
      'Form validation failed',
      ERROR_CODES.VALIDATION_ERROR,
      400,
      { errors }
    );
  }
}

// Rate Limiting Errors
export class RateLimitError extends ApplicationError {
  constructor(limit: string, resetTime?: number) {
    super(
      `Rate limit exceeded: ${limit}`,
      ERROR_CODES.TOO_MANY_REQUESTS,
      429,
      { limit, resetTime }
    );
  }
}

// External Service Errors
export class ExternalServiceError extends ApplicationError {
  constructor(service: string, originalError?: Error) {
    super(
      `External service error: ${service}`,
      ERROR_CODES.EXTERNAL_SERVICE_ERROR,
      { service, originalError: originalError?.message }
    );
  }
}

export class DatabaseConnectionError extends ExternalServiceError {
  constructor() {
    super('Database');
  }
}

export class ConvexServiceError extends ExternalServiceError {
  constructor(operation: string, originalError?: Error) {
    super('Convex', originalError);
    this.details = { ...this.details, operation };
  }
}