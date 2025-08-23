"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  Download, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  Package,
  Database,
  Zap,
  Settings,
  RefreshCw,
  ExternalLink,
  Bell
} from "lucide-react"
import { 
  Subscription, 
  SubscriptionStatus, 
  SubscriptionUsage,
  getSubscriptionStatusColor,
  getSubscriptionStatusText,
  SUBSCRIPTION_PLANS
} from "@/lib/subscription"
import { useLanguage } from "@/components/LanguageProvider"
import { useCurrency } from "@/components/CurrencyProvider"
import { toast } from "sonner"

interface SubscriptionManagerProps {
  userId: string
  className?: string
}

// Mock subscription data
const mockSubscription: Subscription = {
  id: 'sub_123',
  userId: 'user_123',
  planId: 'professional',
  stripeSubscriptionId: 'sub_stripe_123',
  status: 'active',
  currentPeriodStart: new Date('2024-01-01'),
  currentPeriodEnd: new Date('2024-02-01'),
  cancelAtPeriodEnd: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15')
}

const mockUsage: Record<string, SubscriptionUsage> = {
  products: {
    subscriptionId: 'sub_123',
    feature: 'products',
    usage: 45,
    limit: 1000,
    period: new Date(),
    resetDate: new Date('2024-02-01')
  },
  storage: {
    subscriptionId: 'sub_123', 
    feature: 'storage',
    usage: 2500,
    limit: 10000,
    period: new Date(),
    resetDate: new Date('2024-02-01')
  },
  apiCalls: {
    subscriptionId: 'sub_123',
    feature: 'apiCalls', 
    usage: 3200,
    limit: 10000,
    period: new Date(),
    resetDate: new Date('2024-02-01')
  }
}

const mockBillingHistory = [
  {
    id: 'inv_1',
    date: new Date('2024-01-01'),
    amount: 29990,
    status: 'paid',
    description: 'Professional Plan - January 2024'
  },
  {
    id: 'inv_2',
    date: new Date('2023-12-01'),
    amount: 29990,
    status: 'paid',
    description: 'Professional Plan - December 2023'
  },
  {
    id: 'inv_3',
    date: new Date('2023-11-01'),
    amount: 29990,
    status: 'paid',
    description: 'Professional Plan - November 2023'
  }
]

export function SubscriptionManager({ userId, className = "" }: SubscriptionManagerProps) {
  const { t } = useLanguage()
  const { formatAmount } = useCurrency()
  const [subscription, setSubscription] = useState<Subscription>(mockSubscription)
  const [usage, setUsage] = useState<Record<string, SubscriptionUsage>>(mockUsage)
  const [billingHistory, setBillingHistory] = useState(mockBillingHistory)
  const [isLoading, setIsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.planId)

  const refreshData = async () => {
    setIsLoading(true)
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Datos actualizados")
    } catch (error) {
      toast.error("Error al actualizar los datos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    setActionLoading('cancel')
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubscription(prev => ({ ...prev, cancelAtPeriodEnd: true }))
      toast.success("Suscripción programada para cancelación")
    } catch (error) {
      toast.error("Error al cancelar la suscripción")
    } finally {
      setActionLoading(null)
    }
  }

  const handleResumeSubscription = async () => {
    setActionLoading('resume')
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubscription(prev => ({ ...prev, cancelAtPeriodEnd: false }))
      toast.success("Suscripción reactivada")
    } catch (error) {
      toast.error("Error al reactivar la suscripción")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success("Descargando factura...")
    // Simulate download
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  const getUsageIcon = (feature: string) => {
    switch (feature) {
      case 'products':
        return <Package className="h-4 w-4" />
      case 'storage':
        return <Database className="h-4 w-4" />
      case 'apiCalls':
        return <Zap className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const formatFeatureName = (feature: string) => {
    switch (feature) {
      case 'products':
        return 'Productos'
      case 'storage':
        return 'Almacenamiento'
      case 'apiCalls':
        return 'Llamadas API'
      default:
        return feature
    }
  }

  const formatUsageValue = (feature: string, value: number) => {
    switch (feature) {
      case 'storage':
        return `${(value / 1000).toFixed(1)} GB`
      default:
        return value.toLocaleString()
    }
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Suscripción</h2>
          <p className="text-muted-foreground">
            Administra tu plan, facturación y uso
          </p>
        </div>
        <Button
          onClick={refreshData}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Current Subscription Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>{currentPlan?.name || 'Plan Desconocido'}</span>
                  <Badge className={getSubscriptionStatusColor(subscription.status)}>
                    {getSubscriptionStatusText(subscription.status)}
                  </Badge>
                </CardTitle>
                <CardDescription>{currentPlan?.description}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-lg">
                {formatAmount(currentPlan?.price || 0)} / mes
              </div>
              {subscription.cancelAtPeriodEnd && (
                <div className="text-sm text-red-600 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Se cancela el {subscription.currentPeriodEnd.toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Próxima facturación</div>
              <div className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {subscription.currentPeriodEnd.toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Método de pago</div>
              <div className="font-medium flex items-center">
                <CreditCard className="h-4 w-4 mr-1" />
                •••• 4242
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Desde</div>
              <div className="font-medium">
                {subscription.createdAt.toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Acciones</div>
              <div className="flex space-x-2">
                {subscription.cancelAtPeriodEnd ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleResumeSubscription}
                    disabled={actionLoading === 'resume'}
                  >
                    {actionLoading === 'resume' ? 'Reactivando...' : 'Reactivar'}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelSubscription}
                    disabled={actionLoading === 'cancel'}
                  >
                    {actionLoading === 'cancel' ? 'Cancelando...' : 'Cancelar'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="usage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usage">Uso del Plan</TabsTrigger>
          <TabsTrigger value="billing">Facturación</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        {/* Usage Tab */}
        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(usage).map(([feature, data]) => {
              const percentage = data.limit === -1 ? 0 : (data.usage / data.limit) * 100
              const isUnlimited = data.limit === -1

              return (
                <Card key={feature}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getUsageIcon(feature)}
                        <span className="font-medium">{formatFeatureName(feature)}</span>
                      </div>
                      {percentage > 80 && !isUnlimited && (
                        <Badge variant="destructive">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Alto uso
                        </Badge>
                      )}
                    </div>

                    {isUnlimited ? (
                      <div className="text-center py-4">
                        <div className="text-2xl font-bold text-green-600">∞</div>
                        <div className="text-sm text-muted-foreground">Ilimitado</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Usado: {formatUsageValue(feature, data.usage)}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between text-sm mb-2">
                          <span className={getUsageColor(percentage)}>
                            {formatUsageValue(feature, data.usage)}
                          </span>
                          <span className="text-muted-foreground">
                            de {formatUsageValue(feature, data.limit)}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <div className="flex justify-between text-xs mt-1">
                          <span className={getUsageColor(percentage)}>
                            {percentage.toFixed(0)}% usado
                          </span>
                          <span className="text-muted-foreground">
                            Se resetea el {data.resetDate.toLocaleDateString()}
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Usage Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Alertas de Uso</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="font-medium text-yellow-900">
                    Aproximándose al límite de llamadas API
                  </div>
                  <div className="text-sm text-yellow-800">
                    Has usado el 32% de tus llamadas API disponibles este mes
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-900">
                    Almacenamiento en buen estado
                  </div>
                  <div className="text-sm text-green-800">
                    Utilizando solo el 25% del almacenamiento disponible
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Facturación</CardTitle>
              <CardDescription>
                Todas tus facturas y pagos recientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingHistory.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-muted rounded">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{invoice.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.date.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">{formatAmount(invoice.amount)}</div>
                        <Badge variant={invoice.status === 'paid' ? 'default' : 'destructive'}>
                          {invoice.status === 'paid' ? 'Pagado' : 'Pendiente'}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Invoice */}
          <Card>
            <CardHeader>
              <CardTitle>Próxima Facturación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">{currentPlan?.name} - Febrero 2024</div>
                  <div className="text-sm text-muted-foreground">
                    Se facturará el {subscription.currentPeriodEnd.toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg">{formatAmount(currentPlan?.price || 0)}</div>
                  <div className="text-sm text-muted-foreground">•••• 4242</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Suscripción</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Cambiar Plan</div>
                    <div className="text-sm text-muted-foreground">
                      Actualiza o reduce tu plan según tus necesidades
                    </div>
                  </div>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Planes
                  </Button>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Método de Pago</div>
                    <div className="text-sm text-muted-foreground">
                      Actualiza tu tarjeta o método de pago
                    </div>
                  </div>
                  <Button variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Actualizar
                  </Button>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Dirección de Facturación</div>
                    <div className="text-sm text-muted-foreground">
                      Cambia la información de facturación
                    </div>
                  </div>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}