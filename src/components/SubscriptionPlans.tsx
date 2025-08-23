"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Check, 
  Zap, 
  Star, 
  Crown, 
  TrendingUp,
  Shield,
  Clock,
  CreditCard
} from "lucide-react"
import { SubscriptionPlan, SUBSCRIPTION_PLANS, formatSubscriptionPrice } from "@/lib/subscription"
import { useLanguage } from "@/components/LanguageProvider"
import { useCurrency } from "@/components/CurrencyProvider"
import { toast } from "sonner"

interface SubscriptionPlansProps {
  currentPlan?: string
  onSelectPlan?: (planId: string) => void
  showCurrentBadge?: boolean
  className?: string
}

export function SubscriptionPlans({ 
  currentPlan, 
  onSelectPlan, 
  showCurrentBadge = true,
  className = "" 
}: SubscriptionPlansProps) {
  const { t } = useLanguage()
  const { formatAmount } = useCurrency()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSelectPlan = async (planId: string) => {
    setIsLoading(planId)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      onSelectPlan?.(planId)
      toast.success(`Plan ${planId} seleccionado correctamente`)
    } catch (error) {
      toast.error("Error al seleccionar el plan")
    } finally {
      setIsLoading(null)
    }
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic':
        return <Zap className="h-6 w-6 text-blue-600" />
      case 'professional':
        return <Star className="h-6 w-6 text-purple-600" />
      case 'enterprise':
        return <Crown className="h-6 w-6 text-yellow-600" />
      default:
        return <Shield className="h-6 w-6 text-gray-600" />
    }
  }

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'basic':
        return 'border-blue-200 bg-blue-50/30'
      case 'professional':
        return 'border-purple-200 bg-purple-50/30 ring-2 ring-purple-200'
      case 'enterprise':
        return 'border-yellow-200 bg-yellow-50/30'
      default:
        return 'border-gray-200 bg-gray-50/30'
    }
  }

  return (
    <div className={className}>
      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <span className={`text-sm ${billingCycle === 'monthly' ? 'font-semibold' : 'text-muted-foreground'}`}>
          Mensual
        </span>
        <Switch
          checked={billingCycle === 'yearly'}
          onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
        />
        <span className={`text-sm ${billingCycle === 'yearly' ? 'font-semibold' : 'text-muted-foreground'}`}>
          Anual
        </span>
        {billingCycle === 'yearly' && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <TrendingUp className="h-3 w-3 mr-1" />
            Ahorra 20%
          </Badge>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SUBSCRIPTION_PLANS.filter(plan => plan.isActive).map((plan) => {
          const isCurrentPlan = currentPlan === plan.id
          const isPopular = plan.isPopular
          const price = billingCycle === 'yearly' ? plan.price * 12 * 0.8 : plan.price // 20% discount for yearly
          const interval = billingCycle === 'yearly' ? 'año' : 'mes'

          return (
            <Card
              key={plan.id}
              className={`relative transition-all duration-300 hover:shadow-lg ${
                getPlanColor(plan.id)
              } ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white shadow-md">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Más Popular
                  </Badge>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && showCurrentBadge && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="default">
                    <Check className="h-3 w-3 mr-1" />
                    Plan Actual
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2">
                  {getPlanIcon(plan.id)}
                </div>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-sm">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Pricing */}
                <div className="text-center">
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-3xl font-bold">
                      {formatAmount(price / 100)}
                    </span>
                    <span className="text-muted-foreground">/ {interval}</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <div className="text-xs text-green-600 mt-1">
                      Equivale a {formatAmount(price / 100 / 12)} / mes
                    </div>
                  )}
                  {plan.trialDays && (
                    <div className="flex items-center justify-center text-sm text-muted-foreground mt-2">
                      <Clock className="h-4 w-4 mr-1" />
                      {plan.trialDays} días de prueba gratis
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Incluye:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full"
                  variant={isCurrentPlan ? "outline" : isPopular ? "default" : "outline"}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrentPlan || isLoading === plan.id}
                >
                  {isLoading === plan.id ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Procesando...
                    </div>
                  ) : isCurrentPlan ? (
                    "Plan Actual"
                  ) : plan.trialDays ? (
                    `Comenzar Prueba Gratis`
                  ) : (
                    "Seleccionar Plan"
                  )}
                </Button>

                {/* Additional Info */}
                {!isCurrentPlan && (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground flex items-center justify-center">
                      <CreditCard className="h-3 w-3 mr-1" />
                      Sin compromiso de permanencia
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Additional Information */}
      <div className="mt-12 text-center space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-muted/50">
            <Shield className="h-8 w-8 text-green-600" />
            <div className="text-left">
              <div className="font-semibold text-sm">100% Seguro</div>
              <div className="text-xs text-muted-foreground">Encriptación SSL</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-muted/50">
            <Clock className="h-8 w-8 text-blue-600" />
            <div className="text-left">
              <div className="font-semibold text-sm">Soporte 24/7</div>
              <div className="text-xs text-muted-foreground">Ayuda cuando la necesites</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-muted/50">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="text-left">
              <div className="font-semibold text-sm">Escalable</div>
              <div className="text-xs text-muted-foreground">Crece con tu negocio</div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground">
            Todos los planes incluyen acceso completo a nuestra plataforma, 
            actualizaciones automáticas y soporte técnico especializado. 
            Puedes cambiar o cancelar tu plan en cualquier momento.
          </p>
        </div>
      </div>
    </div>
  )
}