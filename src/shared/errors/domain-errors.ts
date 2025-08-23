import { BaseError, ERROR_CODES } from './base-error';

// Domain Layer Errors
export class DomainError extends BaseError {
  constructor(message: string, code: string, details?: Record<string, unknown>) {
    super(message, code, 400, details);
  }
}

// Product Domain Errors
export class ProductNotFoundError extends DomainError {
  constructor(productId: string) {
    super(
      `Product with ID ${productId} not found`,
      ERROR_CODES.PRODUCT_NOT_FOUND,
      { productId }
    );
  }
}

export class ProductOutOfStockError extends DomainError {
  constructor(productId: string, availableStock: number) {
    super(
      `Product is out of stock. Available: ${availableStock}`,
      ERROR_CODES.PRODUCT_OUT_OF_STOCK,
      { productId, availableStock }
    );
  }
}

export class InvalidProductDataError extends DomainError {
  constructor(validationErrors: string[]) {
    super(
      'Product data validation failed',
      ERROR_CODES.INVALID_PRODUCT_DATA,
      { validationErrors }
    );
  }
}

export class ProductLowStockError extends DomainError {
  constructor(productId: string, currentStock: number, threshold: number) {
    super(
      `Product stock is low (${currentStock}). Threshold: ${threshold}`,
      'PRODUCT_LOW_STOCK',
      { productId, currentStock, threshold }
    );
  }
}

// User Domain Errors
export class UserNotFoundError extends DomainError {
  constructor(userId: string) {
    super(
      `User with ID ${userId} not found`,
      ERROR_CODES.USER_NOT_FOUND,
      { userId }
    );
  }
}

export class InvalidUserDataError extends DomainError {
  constructor(validationErrors: string[]) {
    super(
      'User data validation failed',
      ERROR_CODES.INVALID_USER_DATA,
      { validationErrors }
    );
  }
}

export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(
      `User with email ${email} already exists`,
      'USER_ALREADY_EXISTS',
      { email }
    );
  }
}

// Order Domain Errors
export class OrderNotFoundError extends DomainError {
  constructor(orderId: string) {
    super(
      `Order with ID ${orderId} not found`,
      ERROR_CODES.ORDER_NOT_FOUND,
      { orderId }
    );
  }
}

export class InvalidOrderDataError extends DomainError {
  constructor(validationErrors: string[]) {
    super(
      'Order data validation failed',
      ERROR_CODES.INVALID_ORDER_DATA,
      { validationErrors }
    );
  }
}

export class OrderCannotBeModifiedError extends DomainError {
  constructor(orderId: string, currentStatus: string) {
    super(
      `Order ${orderId} cannot be modified. Current status: ${currentStatus}`,
      'ORDER_CANNOT_BE_MODIFIED',
      { orderId, currentStatus }
    );
  }
}

// Cart Domain Errors
export class CartEmptyError extends DomainError {
  constructor() {
    super('Cart is empty', ERROR_CODES.CART_EMPTY);
  }
}

export class CartExpiredError extends DomainError {
  constructor(cartId: string) {
    super(
      `Cart ${cartId} has expired`,
      ERROR_CODES.CART_EXPIRED,
      { cartId }
    );
  }
}

export class CartItemNotFoundError extends DomainError {
  constructor(productId: string) {
    super(
      `Cart item for product ${productId} not found`,
      'CART_ITEM_NOT_FOUND',
      { productId }
    );
  }
}

export class InvalidCartQuantityError extends DomainError {
  constructor(productId: string, requested: number, available: number) {
    super(
      `Invalid quantity for product ${productId}. Requested: ${requested}, Available: ${available}`,
      'INVALID_CART_QUANTITY',
      { productId, requested, available }
    );
  }
}

// Category Domain Errors
export class CategoryNotFoundError extends DomainError {
  constructor(categoryId: string) {
    super(
      `Category with ID ${categoryId} not found`,
      ERROR_CODES.CATEGORY_NOT_FOUND,
      { categoryId }
    );
  }
}

export class CategoryHasChildrenError extends DomainError {
  constructor(categoryId: string, childrenCount: number) {
    super(
      `Cannot delete category ${categoryId}. It has ${childrenCount} child categories`,
      'CATEGORY_HAS_CHILDREN',
      { categoryId, childrenCount }
    );
  }
}

// Business Rule Violations
export class BusinessRuleViolationError extends DomainError {
  constructor(rule: string, details?: Record<string, unknown>) {
    super(
      `Business rule violation: ${rule}`,
      ERROR_CODES.BUSINESS_RULE_VIOLATION,
      details
    );
  }
}

// Value Object Errors
export class InvalidEmailError extends DomainError {
  constructor(email: string) {
    super(
      `Invalid email format: ${email}`,
      'INVALID_EMAIL',
      { email }
    );
  }
}

export class InvalidPhoneError extends DomainError {
  constructor(phone: string) {
    super(
      `Invalid phone format: ${phone}`,
      'INVALID_PHONE',
      { phone }
    );
  }
}

export class InvalidSlugError extends DomainError {
  constructor(slug: string) {
    super(
      `Invalid slug format: ${slug}`,
      'INVALID_SLUG',
      { slug }
    );
  }
}

export class InvalidMoneyError extends DomainError {
  constructor(amount: number, currency: string) {
    super(
      `Invalid money amount: ${amount} ${currency}`,
      'INVALID_MONEY',
      { amount, currency }
    );
  }
}