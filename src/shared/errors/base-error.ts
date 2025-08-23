// Base Error Class
export abstract class BaseError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly timestamp: number;
  public readonly details?: Record<string, any>;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = Date.now();
    this.details = details;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      details: this.details,
      stack: this.stack,
    };
  }
}

// Error codes constants
export const ERROR_CODES = {
  // Domain errors
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  PRODUCT_OUT_OF_STOCK: 'PRODUCT_OUT_OF_STOCK',
  INVALID_PRODUCT_DATA: 'INVALID_PRODUCT_DATA',
  CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_USER_DATA: 'INVALID_USER_DATA',
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  INVALID_ORDER_DATA: 'INVALID_ORDER_DATA',
  CART_EMPTY: 'CART_EMPTY',
  CART_EXPIRED: 'CART_EXPIRED',

  // Application errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',

  // Infrastructure errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
  EMAIL_SEND_ERROR: 'EMAIL_SEND_ERROR',
  PAYMENT_PROCESSING_ERROR: 'PAYMENT_PROCESSING_ERROR',

  // Generic errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
} as const;