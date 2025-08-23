// Application constants
export const APP_CONFIG = {
  NAME: 'Store',
  DESCRIPTION: 'Premium e-commerce platform with AI-powered SEO optimization',
  VERSION: '1.0.0',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;

// Default settings
export const DEFAULTS = {
  CURRENCY: 'CLP',
  LANGUAGE: 'es-CL',
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  CACHE_TTL: 300, // 5 minutes
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  CART_EXPIRATION_HOURS: 24,
  PASSWORD_MIN_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 5,
} as const;

// File upload limits
export const UPLOAD_LIMITS = {
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  DOCUMENT_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain'],
} as const;

// SEO constants
export const SEO_LIMITS = {
  META_TITLE_MAX_LENGTH: 60,
  META_DESCRIPTION_MAX_LENGTH: 160,
  TITLE_MIN_LENGTH: 30,
  TITLE_MAX_LENGTH: 60,
  DESCRIPTION_MIN_LENGTH: 120,
  DESCRIPTION_MAX_LENGTH: 160,
  MAX_TAGS: 10,
  MIN_KEYWORDS: 3,
} as const;

// Rate limiting
export const RATE_LIMITS = {
  API_REQUESTS_PER_MINUTE: 100,
  LOGIN_ATTEMPTS_PER_HOUR: 5,
  ORDER_CREATION_PER_HOUR: 10,
  REVIEW_CREATION_PER_DAY: 3,
} as const;