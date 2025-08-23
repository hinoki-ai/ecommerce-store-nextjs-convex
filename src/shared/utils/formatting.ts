import { DEFAULTS } from '../constants/app';
import { Money } from '../../domain/value-objects/money';

// Chilean CLP price formatting
export function formatPrice(amount: number, currency: string = DEFAULTS.CURRENCY): string {
  if (currency === 'CLP') {
    // Chilean format: $X.XXX.XXX (dots as separators, no decimals)
    const integerPart = Math.round(amount).toString();
    return '$' + integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Fallback for other currencies using standard Intl formatting
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatPriceCompact(amount: number, currency: string = DEFAULTS.CURRENCY): string {
  if (currency === 'CLP') {
    // Chilean format for compact: $X.XXX.XXX (dots as separators, no decimals)
    const integerPart = Math.round(amount).toString();
    const formatted = '$' + integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // For compact notation, use 'K' for thousands, 'M' for millions
    if (amount >= 1000000) {
      return '$' + Math.round(amount / 1000000) + 'M';
    } else if (amount >= 1000) {
      return '$' + Math.round(amount / 1000) + 'K';
    }
    return formatted;
  }

  // Fallback for other currencies
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  });
  return formatter.format(amount);
}

export function formatMoney(money: Money): string {
  return money.format('en-US');
}

// Number formatting
export function formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('en-US', options).format(num);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

// Text formatting
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function titleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Phone formatting
export function formatPhoneNumber(phone: string, countryCode: string = '+56'): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Chilean phone number formatting
  if (countryCode === '+56' && cleaned.length === 9) {
    return `+56 9 ${cleaned.slice(1, 5)} ${cleaned.slice(5)}`;
  }

  // International formatting fallback
  return `${countryCode} ${cleaned}`;
}

// Address formatting
export function formatAddress(address: {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}): string {
  return `${address.street}, ${address.city}, ${address.region} ${address.postalCode}, ${address.country}`;
}

export function formatAddressMultiline(address: {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}): string {
  return [
    address.street,
    `${address.city}, ${address.region} ${address.postalCode}`,
    address.country,
  ].join('\n');
}

// Order number formatting
export function formatOrderNumber(orderNumber: string): string {
  // Add hyphens for readability (e.g., ORD-2024-001234)
  if (orderNumber.length === 12) {
    return `ORD-${orderNumber.slice(0, 4)}-${orderNumber.slice(4)}`;
  }
  return orderNumber;
}

// SKU formatting
export function formatSku(sku: string): string {
  return sku.toUpperCase();
}

// SEO formatting
export function formatMetaTitle(title: string): string {
  return truncate(title, 60);
}

export function formatMetaDescription(description: string): string {
  return truncate(description, 160);
}

// Color and style formatting
export function getContrastColor(hexColor: string): string {
  // Remove # if present
  const color = hexColor.replace('#', '');

  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}