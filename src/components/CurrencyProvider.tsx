"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { 
  Currency, 
  CurrencyContextValue, 
  DEFAULT_CURRENCY_CONTEXT,
  SUPPORTED_CURRENCIES,
  CurrencyConverter,
  CurrencyFormatter,
  detectUserCurrency,
  ExchangeRateService
} from "@/lib/currency"
import { toast } from "sonner"

const CurrencyContext = createContext<CurrencyContextValue>(DEFAULT_CURRENCY_CONTEXT)

interface CurrencyProviderProps {
  children: ReactNode
  defaultCurrency?: string
}

export function CurrencyProvider({ children, defaultCurrency }: CurrencyProviderProps) {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(
    SUPPORTED_CURRENCIES.find(c => c.code === (defaultCurrency || 'CLP')) || SUPPORTED_CURRENCIES[0]
  )
  const [supportedCurrencies, setSupportedCurrencies] = useState<Currency[]>(SUPPORTED_CURRENCIES)
  const [isLoading, setIsLoading] = useState(true)
  const [converter] = useState(new CurrencyConverter(SUPPORTED_CURRENCIES))

  // Initialize currency on mount
  useEffect(() => {
    const initializeCurrency = async () => {
      setIsLoading(true)
      
      try {
        // Update exchange rates
        const exchangeService = ExchangeRateService.getInstance()
        await exchangeService.updateRates()
        
        // Detect user's preferred currency
        const detectedCurrency = defaultCurrency || detectUserCurrency()
        const currency = SUPPORTED_CURRENCIES.find(c => c.code === detectedCurrency)
        
        if (currency) {
          setCurrentCurrency(currency)
        }
        
        // Update supported currencies with latest rates
        setSupportedCurrencies([...SUPPORTED_CURRENCIES])
        
        // Show success toast for rate updates
        const lastUpdated = exchangeService.getLastUpdated()
        if (lastUpdated) {
          console.log(`Exchange rates updated: ${lastUpdated.toLocaleTimeString()}`)
        }
        
      } catch (error) {
        console.error('Failed to initialize currency:', error)
        toast.error('Error al cargar las tasas de cambio')
      } finally {
        setIsLoading(false)
      }
    }

    initializeCurrency()
  }, [defaultCurrency])

  // Persist currency preference
  useEffect(() => {
    if (typeof window !== 'undefined' && currentCurrency) {
      localStorage.setItem('preferredCurrency', currentCurrency.code)
    }
  }, [currentCurrency])

  const setCurrency = (code: string) => {
    const currency = supportedCurrencies.find(c => c.code === code)
    if (currency) {
      setCurrentCurrency(currency)
      toast.success(`Moneda cambiada a ${currency.name}`)
    }
  }

  const convertAmount = (amount: number, fromCurrency?: string): number => {
    if (!fromCurrency || fromCurrency === currentCurrency.code) {
      return amount
    }
    
    try {
      return converter.convert(amount, fromCurrency, currentCurrency.code)
    } catch (error) {
      console.error('Currency conversion failed:', error)
      return amount
    }
  }

  const formatAmount = (amount: number, fromCurrency?: string): string => {
    const convertedAmount = convertAmount(amount, fromCurrency)
    const formatter = new CurrencyFormatter(currentCurrency)
    return formatter.format(convertedAmount)
  }

  const contextValue: CurrencyContextValue = {
    currentCurrency,
    supportedCurrencies,
    setCurrency,
    convertAmount,
    formatAmount,
    isLoading
  }

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}