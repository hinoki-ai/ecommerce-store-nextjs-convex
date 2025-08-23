// Form Types - Form-related types and interfaces
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'date' | 'datetime-local' | 'file';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  defaultValue?: string | number | boolean | string[] | null;
  validation?: ValidationRule[];
  options?: FormOption[];
  min?: number;
  max?: number;
  step?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  accept?: string;
  multiple?: boolean;
  rows?: number;
}

export interface FormOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: string;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'custom';
  value?: string | number | boolean | RegExp;
  message?: string;
  validator?: (value: unknown) => boolean | string;
}

export interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  submitCount: number;
}

export interface FormActions {
  setValue: (name: string, value: unknown) => void;
  setError: (name: string, error: string) => void;
  setTouched: (name: string, touched: boolean) => void;
  setValues: (values: Record<string, unknown>) => void;
  setErrors: (errors: Record<string, string>) => void;
  reset: (values?: Record<string, unknown>) => void;
  validate: () => boolean;
  handleSubmit: (onSubmit: (values: Record<string, unknown>) => void | Promise<void>) => (e: React.FormEvent) => void;
}

export interface FormConfig {
  fields: FormField[];
  initialValues?: Record<string, unknown>;
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
  submitMode?: 'onValid' | 'always';
  onSubmit?: (values: Record<string, unknown>) => void | Promise<void>;
  onError?: (errors: Record<string, string>) => void;
  onChange?: (values: Record<string, unknown>) => void;
  onBlur?: (field: string) => void;
}

export interface FieldState {
  value: unknown;
  error?: string;
  touched: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export interface FieldActions {
  setValue: (value: unknown) => void;
  setError: (error: string) => void;
  setTouched: (touched: boolean) => void;
  reset: () => void;
  validate: () => boolean;
}

// Product Form Types
export interface ProductFormData {
  name: string;
  nameJA?: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  barcode?: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  taxRate: number;
  inventory: {
    quantity: number;
    lowStockThreshold: number;
    trackInventory: boolean;
    allowBackorder: boolean;
  };
  images: Array<{
    url: string;
    alt: string;
  }>;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  freshness?: {
    expiryDate?: number;
    isFresh: boolean;
    isNew: boolean;
    isPopular: boolean;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    tags: string[];
  };
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  requiresShipping: boolean;
  variants?: Array<{
    name: string;
    type: 'select' | 'radio' | 'checkbox';
    required: boolean;
    options: Array<{
      value: string;
      label: string;
      priceAdjustment?: number;
    }>;
  }>;
}

// Cart Form Types
export interface AddToCartFormData {
  productId: string;
  quantity: number;
  variantSelections?: Record<string, string>;
}

// Checkout Form Types
export interface CheckoutFormData {
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    additionalInfo?: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'stripe' | 'paypal' | 'bank_transfer';
  shippingMethod?: string;
  specialInstructions?: string;
  acceptTerms: boolean;
  subscribeNewsletter?: boolean;
}

// User Form Types
export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  preferences?: {
    language: 'es-CL' | 'en-US' | 'ja-JP';
    currency: 'CLP' | 'USD' | 'EUR' | 'GBP' | 'JPY';
    notifications: boolean;
    marketingEmails?: boolean;
    smsNotifications?: boolean;
  };
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  subscribeNewsletter?: boolean;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordFormData {
  email: string;
}

// Search Form Types
export interface SearchFormData {
  query: string;
  category?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  department?: 'general' | 'sales' | 'support' | 'billing';
}

// Review Form Types
export interface ReviewFormData {
  productId: string;
  rating: number;
  title?: string;
  content?: string;
  recommend?: boolean;
  images?: File[];
}