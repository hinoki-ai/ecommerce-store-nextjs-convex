/**
 * Comprehensive TypeScript interfaces for Divine Parsing Oracle system
 * Provides type-safe translation keys and autoloop multi-completion
 */

export interface LanguageMetadata {
  siteName: string;
  description: string;
  keywords: string[];
  metaTags: Record<string, string>;
}

export interface NavigationTranslations {
  home: string;
  products: string;
  categories: string;
  collections: string;
  blog: string;
  about: string;
  contact: string;
  cart: string;
  wishlist: string;
  account: string;
  search: string;
  signIn: string;
  signUp: string;
  signOut: string;
  dashboard: string;
  orders: string;
  profile: string;
  settings: string;
}

export interface CommonUITranslations {
  loading: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  cancel: string;
  confirm: string;
  save: string;
  delete: string;
  edit: string;
  add: string;
  remove: string;
  back: string;
  next: string;
  previous: string;
  close: string;
  open: string;
  submit: string;
  reset: string;
  clear: string;
  filter: string;
  sort: string;
  view: string;
  hide: string;
  show: string;
  more: string;
  less: string;
  expand: string;
  collapse: string;
  select: string;
  selected: string;
  available: string;
  unavailable: string;
  required: string;
  optional: string;
}

export interface ProductTranslations {
  addToCart: string;
  buyNow: string;
  outOfStock: string;
  inStock: string;
  lowStock: string;
  price: string;
  originalPrice: string;
  salePrice: string;
  discount: string;
  freeShipping: string;
  shippingCost: string;
  estimatedDelivery: string;
  reviews: string;
  rating: string;
  noReviews: string;
  writeReview: string;
  relatedProducts: string;
  productDetails: string;
  specifications: string;
  description: string;
  features: string;
  dimensions: string;
  weight: string;
  materials: string;
  careInstructions: string;
  warranty: string;
  returnPolicy: string;
  sizeGuide: string;
  color: string;
  size: string;
  quantity: string;
  sku: string;
  brand: string;
  category: string;
  tags: string;
  share: string;
  wishlistAdd: string;
  wishlistRemove: string;
  compare: string;
  recentlyViewed: string;
  bestSellers: string;
  newArrivals: string;
  featured: string;
  onSale: string;
  limitedStock: string;
}

export interface CartTranslations {
  cartEmpty: string;
  cartTitle: string;
  subtotal: string;
  tax: string;
  shipping: string;
  total: string;
  checkout: string;
  continueShopping: string;
  removeItem: string;
  updateQuantity: string;
  couponCode: string;
  applyCoupon: string;
  couponApplied: string;
  couponInvalid: string;
  estimatedShipping: string;
  freeShippingThreshold: string;
  cartUpdated: string;
  itemRemoved: string;
  quantityUpdated: string;
  maximumQuantity: string;
  minimumQuantity: string;
  outOfStockInCart: string;
  proceedToCheckout: string;
  guestCheckout: string;
  signInToCheckout: string;
}

export interface CheckoutTranslations {
  checkoutTitle: string;
  billingAddress: string;
  shippingAddress: string;
  paymentMethod: string;
  orderSummary: string;
  placeOrder: string;
  orderProcessing: string;
  orderSuccess: string;
  orderFailed: string;
  paymentProcessing: string;
  paymentFailed: string;
  paymentSuccess: string;
  shippingMethod: string;
  deliveryDate: string;
  trackingNumber: string;
  orderNumber: string;
  orderDate: string;
  orderStatus: string;
  orderDetails: string;
  customerInfo: string;
  contactInfo: string;
  deliveryInfo: string;
  billingInfo: string;
  paymentInfo: string;
  orderConfirmation: string;
  thankYou: string;
  orderReceived: string;
  emailConfirmation: string;
  continueShopping: string;
  printReceipt: string;
  downloadInvoice: string;
}

export interface UserAccountTranslations {
  accountTitle: string;
  personalInfo: string;
  security: string;
  preferences: string;
  addresses: string;
  paymentMethods: string;
  orderHistory: string;
  wishlist: string;
  notifications: string;
  privacy: string;
  deleteAccount: string;
  updateProfile: string;
  changePassword: string;
  twoFactorAuth: string;
  emailPreferences: string;
  marketingEmails: string;
  orderUpdates: string;
  securityAlerts: string;
  language: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  addAddress: string;
  editAddress: string;
  removeAddress: string;
  defaultAddress: string;
  billingAddress: string;
  shippingAddress: string;
}

export interface AdminTranslations {
  dashboard: string;
  analytics: string;
  products: string;
  categories: string;
  orders: string;
  customers: string;
  content: string;
  seo: string;
  settings: string;
  reports: string;
  inventory: string;
  promotions: string;
  shipping: string;
  taxes: string;
  users: string;
  roles: string;
  permissions: string;
  logs: string;
  backups: string;
  maintenance: string;
  performance: string;
  security: string;
  integrations: string;
  api: string;
  webhooks: string;
  notifications: string;
  email: string;
  sms: string;
  pushNotifications: string;
  marketing: string;
  campaigns: string;
  coupons: string;
  reviews: string;
  ratings: string;
  comments: string;
  media: string;
  files: string;
  images: string;
  documents: string;
  pages: string;
  blog: string;
  faq: string;
  help: string;
  support: string;
}

export interface ErrorTranslations {
  pageNotFound: string;
  accessDenied: string;
  serverError: string;
  networkError: string;
  timeoutError: string;
  validationError: string;
  authenticationError: string;
  authorizationError: string;
  paymentError: string;
  shippingError: string;
  inventoryError: string;
  cartError: string;
  wishlistError: string;
  searchError: string;
  formError: string;
  fileError: string;
  uploadError: string;
  downloadError: string;
  connectionError: string;
  maintenanceError: string;
  quotaExceeded: string;
  rateLimited: string;
  serviceUnavailable: string;
  unexpectedError: string;
  tryAgain: string;
  contactSupport: string;
  goBack: string;
  refreshPage: string;
}

export interface SEOMetadataTranslations {
  homeTitle: string;
  homeDescription: string;
  productsTitle: string;
  productsDescription: string;
  categoriesTitle: string;
  categoriesDescription: string;
  cartTitle: string;
  cartDescription: string;
  checkoutTitle: string;
  checkoutDescription: string;
  accountTitle: string;
  accountDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  contactTitle: string;
  contactDescription: string;
  blogTitle: string;
  blogDescription: string;
  searchTitle: string;
  searchDescription: string;
  privacyTitle: string;
  privacyDescription: string;
  termsTitle: string;
  termsDescription: string;
  returnsTitle: string;
  returnsDescription: string;
  shippingTitle: string;
  shippingDescription: string;
}

export interface FooterTranslations {
  aboutUs: string;
  customerService: string;
  help: string;
  contact: string;
  shipping: string;
  returns: string;
  sizeGuide: string;
  faq: string;
  privacyPolicy: string;
  termsOfService: string;
  cookiePolicy: string;
  accessibility: string;
  sitemap: string;
  followUs: string;
  newsletter: string;
  subscribe: string;
  emailPlaceholder: string;
  copyright: string;
  allRightsReserved: string;
  paymentMethods: string;
  securePayment: string;
  sslSecured: string;
}

export interface CompleteTranslationSchema {
  metadata: LanguageMetadata;
  nav: NavigationTranslations;
  common: CommonUITranslations;
  product: ProductTranslations;
  cart: CartTranslations;
  checkout: CheckoutTranslations;
  account: UserAccountTranslations;
  admin: AdminTranslations;
  errors: ErrorTranslations;
  seo: SEOMetadataTranslations;
  footer: FooterTranslations;
}

// Utility types for autoloop multi-completion
export type TranslationKey = keyof CompleteTranslationSchema;
export type NestedTranslationKey<T extends TranslationKey> = keyof CompleteTranslationSchema[T];

// Type-safe translation function
export type TranslateFunction = <T extends TranslationKey>(
  key: T
) => <K extends keyof CompleteTranslationSchema[T]>(
  subKey: K
) => Promise<CompleteTranslationSchema[T][K]>;

// Hook return types
export interface UseTranslationReturn {
  t: TranslateFunction;
  language: string;
  isLoading: boolean;
  error: string | null;
}

export interface UseLanguageSwitcherReturn {
  currentLanguage: string;
  supportedLanguages: Array<{
    code: string;
    name: string;
    flag: string;
    direction?: 'ltr' | 'rtl';
  }>;
  setLanguage: (language: string) => Promise<void>;
  isLoading: boolean;
}

export interface UseLanguageLoaderReturn {
  loadLanguage: (language: string) => Promise<void>;
  preloadLanguages: (languages: string[]) => Promise<void>;
  isLoading: boolean;
  loadedLanguages: string[];
}