// Validation Utilities - Input validation functions
import { Email } from '../../domain/value-objects/email';
import { Phone } from '../../domain/value-objects/phone';
import { Slug } from '../../domain/value-objects/slug';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

// Email validation
export function validateEmail(email: string): FieldValidationResult {
  try {
    new Email(email);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }
}

// Phone validation
export function validatePhone(phone: string): FieldValidationResult {
  try {
    new Phone(phone);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: 'Please enter a valid phone number'
    };
  }
}

// Slug validation
export function validateSlug(slug: string): FieldValidationResult {
  try {
    new Slug(slug);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: 'Slug can only contain lowercase letters, numbers, and hyphens'
    };
  }
}

// String validation
export function validateRequired(value: string, fieldName: string): FieldValidationResult {
  if (!value || value.trim().length === 0) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }
  return { isValid: true };
}

export function validateMinLength(value: string, minLength: number, fieldName: string): FieldValidationResult {
  if (value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`
    };
  }
  return { isValid: true };
}

export function validateMaxLength(value: string, maxLength: number, fieldName: string): FieldValidationResult {
  if (value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} cannot exceed ${maxLength} characters`
    };
  }
  return { isValid: true };
}

export function validateExactLength(value: string, length: number, fieldName: string): FieldValidationResult {
  if (value.length !== length) {
    return {
      isValid: false,
      error: `${fieldName} must be exactly ${length} characters`
    };
  }
  return { isValid: true };
}

// Number validation
export function validateMin(value: number, min: number, fieldName: string): FieldValidationResult {
  if (value < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min}`
    };
  }
  return { isValid: true };
}

export function validateMax(value: number, max: number, fieldName: string): FieldValidationResult {
  if (value > max) {
    return {
      isValid: false,
      error: `${fieldName} cannot exceed ${max}`
    };
  }
  return { isValid: true };
}

export function validateRange(value: number, min: number, max: number, fieldName: string): FieldValidationResult {
  if (value < min || value > max) {
    return {
      isValid: false,
      error: `${fieldName} must be between ${min} and ${max}`
    };
  }
  return { isValid: true };
}

// URL validation
export function validateUrl(url: string): FieldValidationResult {
  try {
    new URL(url);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: 'Please enter a valid URL'
    };
  }
}

// Password validation
export function validatePassword(password: string): FieldValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('one special character');
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      error: `Password must contain ${errors.join(', ')}`
    };
  }

  return { isValid: true };
}

// Generic form validation
export function validateForm<T extends Record<string, any>>(
  data: T,
  rules: Record<keyof T, ValidationRule[]>
): ValidationResult {
  const errors: string[] = [];

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];
    const fieldName = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

    for (const rule of fieldRules) {
      const result = rule(value, fieldName);
      if (!result.isValid) {
        errors.push(result.error!);
        break; // Stop at first error for this field
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validation rule type
export type ValidationRule = (value: any, fieldName: string) => FieldValidationResult;

// Common validation rules
export const validationRules = {
  required: (value: string, fieldName: string) => validateRequired(value, fieldName),
  email: (value: string) => validateEmail(value),
  phone: (value: string) => validatePhone(value),
  slug: (value: string) => validateSlug(value),
  url: (value: string) => validateUrl(value),
  password: (value: string) => validatePassword(value),
  minLength: (min: number) => (value: string, fieldName: string) => validateMinLength(value, min, fieldName),
  maxLength: (max: number) => (value: string, fieldName: string) => validateMaxLength(value, max, fieldName),
  exactLength: (length: number) => (value: string, fieldName: string) => validateExactLength(value, length, fieldName),
  min: (min: number) => (value: number, fieldName: string) => validateMin(value, min, fieldName),
  max: (max: number) => (value: number, fieldName: string) => validateMax(value, max, fieldName),
  range: (min: number, max: number) => (value: number, fieldName: string) => validateRange(value, min, max, fieldName),
} as const;