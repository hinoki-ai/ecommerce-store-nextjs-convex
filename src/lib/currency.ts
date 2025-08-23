export interface Currency {
  code: string
  name: string
  symbol: string
  decimals: number
  rate: number // Exchange rate relative to base currency
  locale: string
  isBase?: boolean
}

export interface CurrencyConfig {
  baseCurrency: string
  supportedCurrencies: Currency[]
  autoDetect: boolean
  fallbackCurrency: string
}

// Supported currencies with locale information
export const SUPPORTED_CURRENCIES: Currency[] = [
  // Base currency
  {
    code: 'CLP',
    name: 'Peso Chileno',
    symbol: '$',
    decimals: 0,
    rate: 1,
    locale: 'es-CL',
    isBase: true
  },
  // International currencies
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    decimals: 2,
    rate: 0.001, // 1000 CLP = 1 USD approximately
    locale: 'en-US'
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    decimals: 2,
    rate: 0.00095, // 1050 CLP = 1 EUR approximately
    locale: 'de-DE'
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    decimals: 2,
    rate: 0.0008, // 1250 CLP = 1 GBP approximately
    locale: 'en-GB'
  },
  {
    code: 'BRL',
    name: 'Real Brasileiro',
    symbol: 'R$',
    decimals: 2,
    rate: 0.006, // 167 CLP = 1 BRL approximately
    locale: 'pt-BR'
  },
  {
    code: 'ARS',
    name: 'Peso Argentino',
    symbol: '$',
    decimals: 2,
    rate: 1.2, // 1 CLP = 1.2 ARS approximately
    locale: 'es-AR'
  },
  {
    code: 'PEN',
    name: 'Sol Peruano',
    symbol: 'S/',
    decimals: 2,
    rate: 0.0037, // 270 CLP = 1 PEN approximately
    locale: 'es-PE'
  }
]

export const DEFAULT_CURRENCY_CONFIG: CurrencyConfig = {
  baseCurrency: 'CLP',
  supportedCurrencies: SUPPORTED_CURRENCIES,
  autoDetect: true,
  fallbackCurrency: 'CLP'
}

// Currency formatting utility
export class CurrencyFormatter {
  private currency: Currency
  private locale: string

  constructor(currency: Currency, locale?: string) {
    this.currency = currency
    this.locale = locale || currency.locale
  }

  format(amount: number): string {
    const convertedAmount = this.convertFromBase(amount)
    
    try {
      return new Intl.NumberFormat(this.locale, {
        style: 'currency',
        currency: this.currency.code,
        minimumFractionDigits: this.currency.decimals,
        maximumFractionDigits: this.currency.decimals
      }).format(convertedAmount)
    } catch (error) {
      // Fallback formatting if Intl.NumberFormat fails
      return `${this.currency.symbol}${convertedAmount.toFixed(this.currency.decimals)}`
    }
  }

  formatCompact(amount: number): string {
    const convertedAmount = this.convertFromBase(amount)
    
    try {
      return new Intl.NumberFormat(this.locale, {
        style: 'currency',
        currency: this.currency.code,
        notation: 'compact',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
      }).format(convertedAmount)
    } catch (error) {
      return this.format(amount)
    }
  }

  private convertFromBase(amount: number): number {
    return amount * this.currency.rate
  }
}

// Currency converter utility
export class CurrencyConverter {
  private currencies: Map<string, Currency>

  constructor(currencies: Currency[]) {
    this.currencies = new Map(currencies.map(c => [c.code, c]))
  }

  convert(amount: number, fromCurrency: string, toCurrency: string): number {
    const from = this.currencies.get(fromCurrency)
    const to = this.currencies.get(toCurrency)

    if (!from || !to) {
      throw new Error(`Unsupported currency: ${!from ? fromCurrency : toCurrency}`)
    }

    // Convert to base currency first, then to target currency
    const baseAmount = from.isBase ? amount : amount / from.rate
    const convertedAmount = to.isBase ? baseAmount : baseAmount * to.rate

    return convertedAmount
  }

  getRate(fromCurrency: string, toCurrency: string): number {
    const from = this.currencies.get(fromCurrency)
    const to = this.currencies.get(toCurrency)

    if (!from || !to) {
      throw new Error(`Unsupported currency: ${!from ? fromCurrency : toCurrency}`)
    }

    if (from.isBase) return to.rate
    if (to.isBase) return 1 / from.rate
    
    return to.rate / from.rate
  }

  getSupportedCurrencies(): Currency[] {
    return Array.from(this.currencies.values())
  }

  getCurrency(code: string): Currency | undefined {
    return this.currencies.get(code)
  }
}

// Currency detection utilities
export function detectUserCurrency(): string {
  // Try to detect from browser/location
  if (typeof window !== 'undefined') {
    // Check if user has a preferred currency stored
    const stored = localStorage.getItem('preferredCurrency')
    if (stored && SUPPORTED_CURRENCIES.some(c => c.code === stored)) {
      return stored
    }

    // Try to detect from browser locale
    const locale = navigator.language || 'es-CL'
    const matchingCurrency = SUPPORTED_CURRENCIES.find(c => 
      c.locale.startsWith(locale.split('-')[0])
    )
    
    if (matchingCurrency) {
      return matchingCurrency.code
    }

    // Try to detect from timezone (basic heuristic)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const currencyByTimezone: Record<string, string> = {
      'America/Santiago': 'CLP',
      'America/New_York': 'USD',
      'America/Los_Angeles': 'USD',
      'Europe/London': 'GBP',
      'Europe/Berlin': 'EUR',
      'Europe/Paris': 'EUR',
      'Europe/Madrid': 'EUR',
      'America/Sao_Paulo': 'BRL',
      'America/Buenos_Aires': 'ARS',
      'America/Lima': 'PEN'
    }

    if (timezone && currencyByTimezone[timezone]) {
      return currencyByTimezone[timezone]
    }
  }

  // Default fallback
  return DEFAULT_CURRENCY_CONFIG.fallbackCurrency
}

// Exchange rate service (mock implementation)
export class ExchangeRateService {
  private static instance: ExchangeRateService
  private rates: Map<string, number> = new Map()
  private lastUpdated: Date | null = null
  private updateInterval = 60000 * 60 // 1 hour

  static getInstance(): ExchangeRateService {
    if (!ExchangeRateService.instance) {
      ExchangeRateService.instance = new ExchangeRateService()
    }
    return ExchangeRateService.instance
  }

  async updateRates(): Promise<void> {
    // In a real implementation, you would fetch from a real API like:
    // - https://api.exchangerate-api.com/v4/latest/CLP
    // - https://api.fixer.io/latest?base=CLP
    // - https://openexchangerates.org/api/latest.json
    
    try {
      // Mock API response - replace with real API call
      const mockRates = {
        'CLP': 1, // Base currency
        'USD': 0.001,
        'EUR': 0.00095,
        'GBP': 0.0008,
        'BRL': 0.006,
        'ARS': 1.2,
        'PEN': 0.0037
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Update internal rates
      Object.entries(mockRates).forEach(([code, rate]) => {
        this.rates.set(code, rate)
      })

      this.lastUpdated = new Date()
      
      // Update supported currencies with new rates
      SUPPORTED_CURRENCIES.forEach(currency => {
        const newRate = this.rates.get(currency.code)
        if (newRate !== undefined) {
          currency.rate = newRate
        }
      })

    } catch (error) {
      console.error('Failed to update exchange rates:', error)
      // Keep using cached rates
    }
  }

  async getRates(): Promise<Map<string, number>> {
    const now = new Date()
    const shouldUpdate = !this.lastUpdated || 
      (now.getTime() - this.lastUpdated.getTime()) > this.updateInterval

    if (shouldUpdate) {
      await this.updateRates()
    }

    return new Map(this.rates)
  }

  getLastUpdated(): Date | null {
    return this.lastUpdated
  }
}

// Utility functions for easy formatting
export function formatCurrency(
  amount: number, 
  currencyCode: string = 'CLP', 
  locale?: string
): string {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode)
  if (!currency) {
    return `${amount}`
  }
  
  const formatter = new CurrencyFormatter(currency, locale)
  return formatter.format(amount)
}

export function formatCurrencyCompact(
  amount: number, 
  currencyCode: string = 'CLP', 
  locale?: string
): string {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode)
  if (!currency) {
    return `${amount}`
  }
  
  const formatter = new CurrencyFormatter(currency, locale)
  return formatter.formatCompact(amount)
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  const converter = new CurrencyConverter(SUPPORTED_CURRENCIES)
  return converter.convert(amount, fromCurrency, toCurrency)
}

// Currency context for React components
export interface CurrencyContextValue {
  currentCurrency: Currency
  supportedCurrencies: Currency[]
  setCurrency: (code: string) => void
  convertAmount: (amount: number, fromCurrency?: string) => number
  formatAmount: (amount: number, fromCurrency?: string) => string
  isLoading: boolean
}

export const DEFAULT_CURRENCY_CONTEXT: CurrencyContextValue = {
  currentCurrency: SUPPORTED_CURRENCIES[0],
  supportedCurrencies: SUPPORTED_CURRENCIES,
  setCurrency: () => {},
  convertAmount: (amount: number) => amount,
  formatAmount: (amount: number) => formatCurrency(amount),
  isLoading: false
}