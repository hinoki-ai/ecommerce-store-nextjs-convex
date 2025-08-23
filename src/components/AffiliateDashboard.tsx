"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  Users,
  DollarSign,
  TrendingUp,
  Share2,
  Copy,
  ExternalLink,
  Calendar,
  Clock,
  Target,
  Award,
  Wallet,
  BarChart3,
  MousePointer,
  ShoppingBag,
  Gift,
  Star,
  Plus,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Settings,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Crown,
  Zap
} from "lucide-react"
import {
  Affiliate,
  AffiliateLink,
  AffiliateCommission,
  AffiliatePayout,
  AffiliateAnalytics,
  AFFILIATE_TIERS,
  getAffiliateStatusColor,
  getAffiliateStatusText,
  getCommissionStatusColor,
  formatCommissionRate,
  formatConversionRate,
  getAffiliateService
} from "@/lib/affiliate"
import { useLanguage } from "@/components/LanguageProvider"
import { useCurrency } from "@/components/CurrencyProvider"
import { toast } from "sonner"

interface AffiliateDashboardProps {
  userId: string
  className?: string
}

// Mock enhanced data
const mockAffiliate: Affiliate = {
  id: 'aff-1',
  userId: 'user-123',
  code: 'JUAN2024',
  status: 'active',
  tier: AFFILIATE_TIERS[1], // Silver tier
  commissionRate: 0.08,
  totalEarnings: 15750,
  pendingEarnings: 3250,
  paidEarnings: 12500,
  totalReferrals: 25,
  activeReferrals: 18,
  clickCount: 450,
  conversionRate: 5.6,
  joinedAt: new Date('2024-01-15'),
  lastActiveAt: new Date(),
  payoutMethod: 'paypal'
}

const mockLinks: AffiliateLink[] = [
  {
    id: 'link-1',
    affiliateId: 'aff-1',
    name: 'Link Principal',
    url: 'https://store.com/ref/JUAN2024',
    shortUrl: 'https://store.com/s/abc123',
    description: 'Link principal para todas las promociones',
    clicks: 450,
    conversions: 25,
    revenue: 15750,
    isActive: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'link-2', 
    affiliateId: 'aff-1',
    name: 'Campaña Verano',
    url: 'https://store.com/ref/JUAN2024?campaign=summer',
    shortUrl: 'https://store.com/s/sum456',
    description: 'Promoción especial de verano',
    clicks: 120,
    conversions: 8,
    revenue: 3200,
    isActive: true,
    createdAt: new Date('2024-06-01')
  }
]

const mockCommissions: AffiliateCommission[] = [
  {
    id: 'comm-1',
    affiliateId: 'aff-1',
    orderId: 'order-123',
    customerId: 'customer-456',
    orderAmount: 299.99,
    commissionAmount: 24.00,
    commissionRate: 0.08,
    tier: 'silver',
    status: 'approved',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: 'comm-2',
    affiliateId: 'aff-1', 
    orderId: 'order-124',
    customerId: 'customer-789',
    orderAmount: 149.99,
    commissionAmount: 12.00,
    commissionRate: 0.08,
    tier: 'silver',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
]

const mockAnalytics: AffiliateAnalytics = {
  affiliateId: 'aff-1',
  period: 'month',
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  endDate: new Date(),
  clicks: 180,
  conversions: 12,
  conversionRate: 6.7,
  revenue: 4200,
  commission: 336,
  topCountries: [
    { country: 'Chile', clicks: 120 },
    { country: 'Argentina', clicks: 35 },
    { country: 'Perú', clicks: 25 }
  ],
  topSources: [
    { source: 'Instagram', clicks: 90 },
    { source: 'Facebook', clicks: 50 },
    { source: 'Direct', clicks: 40 }
  ],
  dailyStats: []
}

export function AffiliateDashboard({ userId, className = "" }: AffiliateDashboardProps) {
  const { t } = useLanguage()
  const { formatAmount } = useCurrency()
  const [affiliateService] = useState(() => getAffiliateService())
  
  const [affiliate, setAffiliate] = useState<Affiliate>(mockAffiliate)
  const [links, setLinks] = useState<AffiliateLink[]>(mockLinks)
  const [commissions, setCommissions] = useState<AffiliateCommission[]>(mockCommissions)
  const [analytics, setAnalytics] = useState<AffiliateAnalytics>(mockAnalytics)
  const [isLoading, setIsLoading] = useState(false)
  
  // New link form
  const [newLink, setNewLink] = useState({
    name: '',
    description: '',
    category: '',
    url: ''
  })

  const [showNewLinkForm, setShowNewLinkForm] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const dashboard = await affiliateService.getAffiliateDashboard(affiliate.id)
      setAffiliate(dashboard.affiliate)
      setLinks(dashboard.links)
      setCommissions(dashboard.recentCommissions)
      setAnalytics(dashboard.monthlyAnalytics)
      toast.success("Dashboard actualizado")
    } catch (error) {
      toast.error("Error al cargar los datos")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, label: string = "Enlace") => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copiado al portapapeles`)
  }

  const createNewLink = async () => {
    if (!newLink.name.trim()) {
      toast.error("El nombre del enlace es requerido")
      return
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const url = newLink.url || `${baseUrl}/ref/${affiliate.code}`
      
      const link = await affiliateService.createAffiliateLink(affiliate.id, {
        name: newLink.name,
        description: newLink.description,
        category: newLink.category,
        url: url
      })

      setLinks(prev => [link, ...prev])
      setNewLink({ name: '', description: '', category: '', url: '' })
      setShowNewLinkForm(false)
      toast.success("Enlace creado exitosamente")
    } catch (error) {
      toast.error("Error al crear el enlace")
    }
  }

  const requestPayout = async () => {
    if (affiliate.pendingEarnings < 50) {
      toast.error("Mínimo $50 para solicitar retiro")
      return
    }

    try {
      await affiliateService.requestPayout(affiliate.id, affiliate.pendingEarnings, affiliate.payoutMethod)
      setAffiliate(prev => ({
        ...prev,
        pendingEarnings: 0
      }))
      toast.success("Solicitud de retiro enviada")
    } catch (error) {
      toast.error("Error al solicitar retiro")
    }
  }

  const nextTier = AFFILIATE_TIERS.find(tier => 
    tier.minReferrals > affiliate.totalReferrals
  )
  
  const tierProgress = nextTier ? 
    (affiliate.totalReferrals / nextTier.minReferrals) * 100 : 100

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <span>Panel de Afiliado</span>
          </h2>
          <p className="text-muted-foreground">
            Gestiona tus referencias y gana comisiones
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadData} disabled={isLoading} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${affiliate.tier.color}`}>
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold">Afiliado {affiliate.tier.name}</h3>
                  <Badge className={getAffiliateStatusColor(affiliate.status)}>
                    {getAffiliateStatusText(affiliate.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Código: {affiliate.code} • Miembro desde {affiliate.joinedAt.toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Comisión actual: {formatCommissionRate(affiliate.commissionRate)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {formatAmount(affiliate.totalEarnings)}
              </div>
              <p className="text-sm text-muted-foreground">Total ganado</p>
            </div>
          </div>
          
          {/* Tier Progress */}
          {nextTier && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  Progreso a {nextTier.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {affiliate.totalReferrals} / {nextTier.minReferrals} referidos
                </span>
              </div>
              <Progress value={tierProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {nextTier.minReferrals - affiliate.totalReferrals} referidos más para desbloquear {formatCommissionRate(nextTier.commissionRate)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{formatAmount(affiliate.pendingEarnings)}</p>
                <p className="text-sm text-muted-foreground">Pendiente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{affiliate.totalReferrals}</p>
                <p className="text-sm text-muted-foreground">Total referidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MousePointer className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{affiliate.clickCount}</p>
                <p className="text-sm text-muted-foreground">Clics totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{formatConversionRate(affiliate.conversionRate)}</p>
                <p className="text-sm text-muted-foreground">Conversión</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="links">Enlaces</TabsTrigger>
          <TabsTrigger value="commissions">Comisiones</TabsTrigger>
          <TabsTrigger value="payouts">Retiros</TabsTrigger>
          <TabsTrigger value="tools">Herramientas</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento del Mes</CardTitle>
                <CardDescription>Estadísticas de los últimos 30 días</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Clics</span>
                  <span className="font-medium">{analytics.clicks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Conversiones</span>
                  <span className="font-medium">{analytics.conversions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ingresos generados</span>
                  <span className="font-medium">{formatAmount(analytics.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Comisiones ganadas</span>
                  <span className="font-medium text-green-600">{formatAmount(analytics.commission)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tasa de conversión</span>
                  <span className="font-medium">{formatConversionRate(analytics.conversionRate)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Top Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Mejores Fuentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topSources.map((source, index) => (
                    <div key={source.source} className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span>{source.source}</span>
                      </div>
                      <span className="font-medium">{source.clicks} clics</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Commissions */}
          <Card>
            <CardHeader>
              <CardTitle>Comisiones Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {commissions.slice(0, 5).map(commission => (
                  <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Pedido #{commission.orderId}</div>
                        <div className="text-sm text-muted-foreground">
                          {commission.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">
                        {formatAmount(commission.commissionAmount)}
                      </div>
                      <Badge className={getCommissionStatusColor(commission.status)}>
                        {commission.status === 'approved' ? 'Aprobado' :
                         commission.status === 'pending' ? 'Pendiente' :
                         commission.status === 'paid' ? 'Pagado' : commission.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Links Tab */}
        <TabsContent value="links" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Mis Enlaces de Afiliado</CardTitle>
                  <CardDescription>Crea y gestiona tus enlaces personalizados</CardDescription>
                </div>
                <Button onClick={() => setShowNewLinkForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Enlace
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* New Link Form */}
              {showNewLinkForm && (
                <Card className="border-dashed">
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nombre del enlace *</Label>
                        <Input
                          value={newLink.name}
                          onChange={(e) => setNewLink(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ej: Campaña Black Friday"
                        />
                      </div>
                      <div>
                        <Label>Categoría</Label>
                        <Select
                          value={newLink.category}
                          onValueChange={(value) => setNewLink(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="social">Redes Sociales</SelectItem>
                            <SelectItem value="email">Email Marketing</SelectItem>
                            <SelectItem value="blog">Blog/Contenido</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Descripción</Label>
                      <Textarea
                        value={newLink.description}
                        onChange={(e) => setNewLink(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe el propósito de este enlace..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>URL personalizada (opcional)</Label>
                      <Input
                        value={newLink.url}
                        onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://store.com/ref/JUAN2024?campaign=custom"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={createNewLink}>Crear Enlace</Button>
                      <Button variant="outline" onClick={() => setShowNewLinkForm(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Links List */}
              {links.map(link => (
                <Card key={link.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium">{link.name}</h3>
                          <Badge variant={link.isActive ? "default" : "secondary"}>
                            {link.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                        {link.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {link.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Creado: {link.createdAt.toLocaleDateString()}</span>
                          {link.category && <span>Categoría: {link.category}</span>}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Link Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-2xl font-bold">{link.clicks}</div>
                        <div className="text-sm text-muted-foreground">Clics</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{link.conversions}</div>
                        <div className="text-sm text-muted-foreground">Conversiones</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{formatAmount(link.revenue)}</div>
                        <div className="text-sm text-muted-foreground">Ingresos</div>
                      </div>
                    </div>

                    {/* Link URLs */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded">
                        <div className="flex-1 text-sm font-mono">{link.url}</div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(link.url, "Enlace completo")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded">
                        <div className="flex-1 text-sm font-mono">{link.shortUrl}</div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(link.shortUrl, "Enlace corto")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commissions Tab */}
        <TabsContent value="commissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Comisiones</CardTitle>
              <CardDescription>Todas tus comisiones ganadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissions.map(commission => (
                  <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Pedido #{commission.orderId}</div>
                        <div className="text-sm text-muted-foreground">
                          Monto: {formatAmount(commission.orderAmount)} • {commission.createdAt.toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Comisión {formatCommissionRate(commission.commissionRate)} • Tier {commission.tier}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 text-lg">
                        {formatAmount(commission.commissionAmount)}
                      </div>
                      <Badge className={getCommissionStatusColor(commission.status)}>
                        {commission.status === 'approved' ? 'Aprobado' :
                         commission.status === 'pending' ? 'Pendiente' :
                         commission.status === 'paid' ? 'Pagado' :
                         commission.status === 'cancelled' ? 'Cancelado' : commission.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-6">
          {/* Payout Request Card */}
          <Card>
            <CardHeader>
              <CardTitle>Solicitar Retiro</CardTitle>
              <CardDescription>Retira tus comisiones ganadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-semibold text-lg">
                    Saldo disponible: {formatAmount(affiliate.pendingEarnings)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Mínimo para retiro: $50 • Método: {affiliate.payoutMethod}
                  </div>
                </div>
                <Button
                  onClick={requestPayout}
                  disabled={affiliate.pendingEarnings < 50}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Solicitar Retiro
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payout History */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Retiros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold">No hay retiros aún</h3>
                <p className="text-muted-foreground">Tus solicitudes de retiro aparecerán aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          {/* Marketing Materials */}
          <Card>
            <CardHeader>
              <CardTitle>Materiales de Marketing</CardTitle>
              <CardDescription>Recursos para promocionar tus enlaces</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Banners Promocionales</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Imágenes optimizadas para redes sociales
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Pack
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Plantillas de Email</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Emails pre-escritos para campañas
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Ver Plantillas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Generator */}
          <Card>
            <CardHeader>
              <CardTitle>Generador de Códigos QR</CardTitle>
              <CardDescription>Crea códigos QR para tus enlaces</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <div className="w-32 h-32 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl">📱</span>
                  </div>
                  <Button>
                    <Zap className="h-4 w-4 mr-2" />
                    Generar QR
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Herramientas para Redes Sociales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">Plantillas para Instagram</h4>
                      <p className="text-sm text-muted-foreground">Stories y posts optimizados</p>
                    </div>
                    <Button variant="outline" size="sm">Ver</Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">Copy para Facebook</h4>
                      <p className="text-sm text-muted-foreground">Textos persuasivos listos para usar</p>
                    </div>
                    <Button variant="outline" size="sm">Ver</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}