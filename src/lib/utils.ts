import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Slug generation utility
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

// Enhanced price formatting utility with multi-currency support
export function formatPrice(price: number, options?: {
  currency?: string
  locale?: string
  showCode?: boolean
  compact?: boolean
}): string {
  const {
    currency = 'CLP',
    locale,
    showCode = false,
    compact = false
  } = options || {}

  try {
    // Handle Chilean peso special formatting
    if (currency === 'CLP') {
      const integerPart = Math.round(price).toString()
      const formatted = '$' + integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      return showCode ? `${formatted} CLP` : formatted
    }

    // Use appropriate locale for currency
    const currencyLocaleMap: Record<string, string> = {
      'USD': 'en-US',
      'EUR': 'de-DE', 
      'GBP': 'en-GB',
      'BRL': 'pt-BR',
      'ARS': 'es-AR',
      'PEN': 'es-PE'
    }

    const formatLocale = locale || currencyLocaleMap[currency] || 'en-US'
    
    const formatOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currency,
    }

    if (compact) {
      formatOptions.notation = 'compact'
      formatOptions.minimumFractionDigits = 0
      formatOptions.maximumFractionDigits = 1
    }

    const formatter = new Intl.NumberFormat(formatLocale, formatOptions)
    const formatted = formatter.format(price)
    
    return showCode && !formatted.includes(currency) ? `${formatted} ${currency}` : formatted
    
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails
    console.warn('Price formatting failed, using fallback:', error)
    return `${currency === 'CLP' ? '$' : currency + ' '}${price.toFixed(2)}`
  }
}

// Legacy support - keep the original signature
export function formatPriceLegacy(price: number, currency: string = 'CLP'): string {
  return formatPrice(price, { currency })
}

// Date formatting utility
export function formatDate(date: number | Date): string {
  const d = typeof date === 'number' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}