"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ChevronDown, 
  DollarSign, 
  TrendingUp, 
  Globe, 
  Check,
  RefreshCw,
  AlertCircle
} from "lucide-react"
import { useCurrency } from "@/components/CurrencyProvider"
import { ExchangeRateService } from "@/lib/currency"
import { toast } from "sonner"
import { useLanguage } from "@/components/LanguageProvider"

interface CurrencySelectorProps {
  variant?: "compact" | "full" | "mobile"
  showFlag?: boolean
  showRates?: boolean
  className?: string
}

// Currency flag emojis
const CURRENCY_FLAGS: Record<string, string> = {
  CLP: "🇨🇱",
  USD: "🇺🇸", 
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  BRL: "🇧🇷",
  ARS: "🇦🇷",
  PEN: "🇵🇪"
}

export function CurrencySelector({ 
  variant = "compact", 
  showFlag = true, 
  showRates = false,
  className = "" 
}: CurrencySelectorProps) {
  const { 
    currentCurrency, 
    supportedCurrencies, 
    setCurrency, 
    isLoading 
  } = useCurrency()
  const { t } = useLanguage()
  const [isUpdatingRates, setIsUpdatingRates] = useState(false)

  const handleCurrencyChange = (currencyCode: string) => {
    setCurrency(currencyCode)
  }

  const handleUpdateRates = async () => {
    setIsUpdatingRates(true)
    try {
      const exchangeService = ExchangeRateService.getInstance()
      await exchangeService.updateRates()
      toast.success("Tasas de cambio actualizadas")
    } catch (error) {
      toast.error("Error al actualizar las tasas de cambio")
    } finally {
      setIsUpdatingRates(false)
    }
  }

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`relative ${className}`}
            disabled={isLoading}
          >
            {showFlag && (
              <span className="mr-1 text-sm">
                {CURRENCY_FLAGS[currentCurrency.code] || "💱"}
              </span>
            )}
            <span className="font-medium">{currentCurrency.code}</span>
            <ChevronDown className="ml-1 h-3 w-3" />
            {isLoading && (
              <RefreshCw className="ml-1 h-3 w-3 animate-spin" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>
            <div className="flex items-center justify-between">
              <span>Moneda</span>
              {showRates && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUpdateRates}
                  disabled={isUpdatingRates}
                  className="h-6 w-6 p-0"
                >
                  <RefreshCw className={`h-3 w-3 ${isUpdatingRates ? 'animate-spin' : ''}`} />
                </Button>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {supportedCurrencies.map((currency) => (
            <DropdownMenuItem
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                {showFlag && (
                  <span>{CURRENCY_FLAGS[currency.code] || "💱"}</span>
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{currency.code}</span>
                    {currency.code === currentCurrency.code && (
                      <Check className="h-3 w-3 text-green-600" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {currency.name}
                  </div>
                </div>
              </div>
              {showRates && !currency.isBase && (
                <div className="text-xs text-muted-foreground">
                  1 = {currency.rate.toFixed(currency.code === 'ARS' ? 2 : 4)}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (variant === "mobile") {
    return (
      <div className={`w-full ${className}`}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Moneda</span>
              </div>
              {showRates && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUpdateRates}
                  disabled={isUpdatingRates}
                >
                  <RefreshCw className={`h-4 w-4 ${isUpdatingRates ? 'animate-spin' : ''}`} />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2">
              {supportedCurrencies.map((currency) => (
                <Button
                  key={currency.code}
                  variant={currency.code === currentCurrency.code ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCurrencyChange(currency.code)}
                  className="flex items-center justify-start space-x-2 h-auto p-3"
                  disabled={isLoading}
                >
                  {showFlag && (
                    <span className="text-base">
                      {CURRENCY_FLAGS[currency.code] || "💱"}
                    </span>
                  )}
                  <div className="text-left">
                    <div className="font-medium">{currency.code}</div>
                    <div className="text-xs opacity-80 truncate">
                      {currency.name}
                    </div>
                    {showRates && !currency.isBase && (
                      <div className="text-xs opacity-60">
                        Rate: {currency.rate.toFixed(currency.code === 'ARS' ? 2 : 4)}
                      </div>
                    )}
                  </div>
                  {currency.code === currentCurrency.code && (
                    <Check className="h-4 w-4 ml-auto" />
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Full variant
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Currency Settings</span>
            </div>
            {showRates && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUpdateRates}
                  disabled={isUpdatingRates}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isUpdatingRates ? 'animate-spin' : ''}`} />
                  Update Rates
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Selection */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {showFlag && (
                    <span className="text-2xl">
                      {CURRENCY_FLAGS[currentCurrency.code] || "💱"}
                    </span>
                  )}
                  <div>
                    <div className="font-semibold text-lg">
                      {currentCurrency.code}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentCurrency.name}
                    </div>
                  </div>
                </div>
                <Badge variant="default">Current</Badge>
              </div>
            </div>

            {/* Currency List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Available Currencies</span>
                {showRates && <span>Exchange Rate</span>}
              </div>
              {supportedCurrencies
                .filter(c => c.code !== currentCurrency.code)
                .map((currency) => (
                  <div
                    key={currency.code}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleCurrencyChange(currency.code)}
                  >
                    <div className="flex items-center space-x-3">
                      {showFlag && (
                        <span className="text-xl">
                          {CURRENCY_FLAGS[currency.code] || "💱"}
                        </span>
                      )}
                      <div>
                        <div className="font-medium">{currency.code}</div>
                        <div className="text-sm text-muted-foreground">
                          {currency.name}
                        </div>
                      </div>
                    </div>
                    {showRates && (
                      <div className="text-right">
                        <div className="font-mono text-sm">
                          {currency.isBase ? 'Base' : `1 = ${currency.rate.toFixed(currency.code === 'ARS' ? 2 : 4)}`}
                        </div>
                        {!currency.isBase && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            vs {currentCurrency.code}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Rate Update Info */}
            {showRates && (
              <div className="text-xs text-muted-foreground flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>Exchange rates are updated automatically every hour</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}