// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: number;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiRequest {
  id?: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Product endpoints
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id: string) => `/api/products/${id}`,
  PRODUCT_BY_SLUG: (slug: string) => `/api/products/slug/${slug}`,

  // Category endpoints
  CATEGORIES: '/api/categories',
  CATEGORY_BY_ID: (id: string) => `/api/categories/${id}`,
  CATEGORY_BY_SLUG: (slug: string) => `/api/categories/slug/${slug}`,

  // Cart endpoints
  CART: '/api/cart',
  CART_ITEM: (productId: string) => `/api/cart/items/${productId}`,

  // Order endpoints
  ORDERS: '/api/orders',
  ORDER_BY_ID: (id: string) => `/api/orders/${id}`,
  ORDER_BY_NUMBER: (number: string) => `/api/orders/number/${number}`,

  // User endpoints
  USER_PROFILE: '/api/user/profile',
  USER_ORDERS: '/api/user/orders',
  USER_WISHLIST: '/api/user/wishlist',

  // Auth endpoints
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REGISTER: '/api/auth/register',
  REFRESH_TOKEN: '/api/auth/refresh',

  // Admin endpoints
  ADMIN_DASHBOARD: '/api/admin/dashboard',
  ADMIN_PRODUCTS: '/api/admin/products',
  ADMIN_ORDERS: '/api/admin/orders',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_ANALYTICS: '/api/admin/analytics',

  // SEO endpoints
  SEO_GENERATE_BLOG: '/api/seo/generate-blog',
  SEO_OPTIMIZE_PRODUCT: '/api/seo/optimize-product',
} as const;