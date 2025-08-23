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
import { Switch } from "@/components/ui/switch"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Tag,
  Target,
  Copy,
  Edit,
  Play,
  Pause,
  Eye,
  Plus,
  RefreshCw,
  Zap,
  DollarSign,
  ShoppingCart
} from "lucide-react"
import {
  Promotion,
  PromotionType,
  DiscountType,
  PromotionStatus,
  CouponCode,
  PromotionMetrics,
  PROMOTION_TEMPLATES,
  getPromotionStatusColor,
  getPromotionStatusText,
  formatDiscountDisplay,
  getPromotionService
} from "@/lib/promotions"
import { useLanguage } from "@/components/LanguageProvider"
import { useCurrency } from "@/components/CurrencyProvider"
import { toast } from "sonner"


interface PromotionManagerProps {
  className?: string
}

// Mock enhanced data
const mockPromotions: Promotion[] = [
  {
    id: 'promo-1',
    name: 'Black Friday Mega Sale',
    description: 'Descuento del 30% en toda la tienda',
    type: 'automatic',
    discountType: 'percentage',
    discountValue: 30,
    conditions: {
      minOrderValue: 100
    },
    usage: {
      totalLimit: 1000,
      usedCount: 245,
      remainingUses: 755
    },
    scheduling: {
      startDate: new Date('2024-11-25'),
      endDate: new Date('2024-11-30')
    },
    targeting: {},
    status: 'active',
    priority: 10,
    stackable: false,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-25'),
    createdBy: 'admin-1'
  },
  {
    id: 'promo-2', 
    name: 'Nuevos Clientes 15% OFF',
    description: 'Descuento especial para primeros compradores',
    type: 'coupon',
    discountType: 'percentage', 
    discountValue: 15,
    conditions: {
      firstTimeCustomer: true,
      minOrderValue: 75
    },
    usage: {
      perCustomerLimit: 1,
      usedCount: 89
    },
    scheduling: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31')
    },
    targeting: {
      newCustomersOnly: true
    },
    status: 'active',
    priority: 5,
    stackable: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin-1'
  },
  {
    id: 'promo-3',
    name: 'Envío Gratis $75+',
    description: 'Envío gratuito en pedidos superiores a $75',
    type: 'automatic',
    discountType: 'free_shipping',
    discountValue: 0,
    conditions: {
      minOrderValue: 75
    },
    usage: {
      usedCount: 456
    },
    scheduling: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31')
    },
    targeting: {},
    status: 'active',
    priority: 3,
    stackable: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin-1'
  }
]

const mockCoupons: CouponCode[] = [
  {
    id: 'coupon-1',
    promotionId: 'promo-2',
    code: 'WELCOME15',
    isActive: true,
    usageCount: 25,
    maxUses: 100,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'coupon-2',
    promotionId: 'promo-2',
    code: 'NEWBIE15',
    isActive: true,
    usageCount: 15,
    maxUses: 50,
    createdAt: new Date('2024-02-01')
  }
]

export function PromotionManager({ className = "" }: PromotionManagerProps) {
  const { formatAmount } = useCurrency()
  const [promotionService] = useState(() => getPromotionService())
  
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions)
  const [coupons, setCoupons] = useState<CouponCode[]>(mockCoupons)
  const [metrics, setMetrics] = useState<Record<string, PromotionMetrics>>({})
  const [isLoading, setIsLoading] = useState(false)
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<PromotionStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<PromotionType | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // New promotion form
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    description: '',
    type: 'automatic' as PromotionType,
    discountType: 'percentage' as DiscountType,
    discountValue: 10,
    minOrderValue: 50,
    startDate: new Date(),
    endDate: null as Date | null,
    totalLimit: 100,
    stackable: false,
    firstTimeCustomer: false,
    newCustomersOnly: false
  })

  const [showNewPromotionDialog, setShowNewPromotionDialog] = useState(false)
  const [showCouponGenerator, setShowCouponGenerator] = useState(false)
  const [selectedPromotionId, setSelectedPromotionId] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const allPromotions = await promotionService.getAllPromotions()
      setPromotions(allPromotions)
      
      // Load metrics for each promotion
      const metricsData: Record<string, PromotionMetrics> = {}
      const now = new Date()
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      
      for (const promotion of allPromotions) {
        metricsData[promotion.id] = await promotionService.getPromotionMetrics(
          promotion.id, 
          monthAgo, 
          now
        )
      }
      setMetrics(metricsData)
      
      toast.success("Datos actualizados")
    } catch (error) {
      toast.error("Error al cargar los datos")
    } finally {
      setIsLoading(false)
    }
  }

  const createPromotion = async () => {
    if (!newPromotion.name.trim()) {
      toast.error("El nombre de la promoción es requerido")
      return
    }

    try {
      const promotion = await promotionService.createPromotion({
        name: newPromotion.name,
        description: newPromotion.description,
        type: newPromotion.type,
        discountType: newPromotion.discountType,
        discountValue: newPromotion.discountValue,
        conditions: {
          minOrderValue: newPromotion.minOrderValue || undefined,
          firstTimeCustomer: newPromotion.firstTimeCustomer || undefined
        },
        usage: {
          totalLimit: newPromotion.totalLimit || undefined,
          usedCount: 0
        },
        scheduling: {
          startDate: newPromotion.startDate,
          endDate: newPromotion.endDate || undefined
        },
        targeting: {
          newCustomersOnly: newPromotion.newCustomersOnly || undefined
        },
        status: 'draft',
        priority: 5,
        stackable: newPromotion.stackable,
        createdBy: 'current-user'
      })

      setPromotions(prev => [promotion, ...prev])
      setNewPromotion({
        name: '',
        description: '',
        type: 'automatic',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 50,
        startDate: new Date(),
        endDate: null,
        totalLimit: 100,
        stackable: false,
        firstTimeCustomer: false,
        newCustomersOnly: false
      })
      setShowNewPromotionDialog(false)
      toast.success("Promoción creada exitosamente")
    } catch (error) {
      toast.error("Error al crear la promoción")
    }
  }

  const togglePromotionStatus = async (promotionId: string) => {
    const promotion = promotions.find(p => p.id === promotionId)
    if (!promotion) return

    const newStatus: PromotionStatus = promotion.status === 'active' ? 'paused' : 'active'
    
    try {
      const updated = await promotionService.updatePromotion(promotionId, { status: newStatus })
      if (updated) {
        setPromotions(prev => prev.map(p => p.id === promotionId ? updated : p))
        toast.success(`Promoción ${newStatus === 'active' ? 'activada' : 'pausada'}`)
      }
    } catch (error) {
      toast.error("Error al actualizar la promoción")
    }
  }

  const generateBulkCoupons = async (count: number, prefix: string) => {
    if (!selectedPromotionId) return

    try {
      const newCoupons = await promotionService.createBulkCoupons(
        selectedPromotionId,
        count,
        prefix || undefined,
        1 // One use per coupon
      )

      setCoupons(prev => [...newCoupons, ...prev])
      toast.success(`${newCoupons.length} cupones generados exitosamente`)
      setShowCouponGenerator(false)
    } catch (error) {
      toast.error("Error al generar cupones")
    }
  }

  const copyToClipboard = (text: string, label: string = "Texto") => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copiado al portapapeles`)
  }

  const filteredPromotions = promotions.filter(promotion => {
    const matchesStatus = statusFilter === 'all' || promotion.status === statusFilter
    const matchesType = typeFilter === 'all' || promotion.type === typeFilter
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesType && matchesSearch
  })

  const totalActivePromotions = promotions.filter(p => p.status === 'active').length
  const totalUsage = promotions.reduce((sum, p) => sum + p.usage.usedCount, 0)
  const totalDiscount = Object.values(metrics).reduce((sum, m) => sum + m.totalDiscount, 0)

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Promociones</h2>
          <p className="text-muted-foreground">
            Crea y administra cupones, descuentos y campañas promocionales
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadData} disabled={isLoading} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={() => setShowNewPromotionDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Promoción
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{totalActivePromotions}</p>
                <p className="text-sm text-muted-foreground">Promociones Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalUsage}</p>
                <p className="text-sm text-muted-foreground">Usos Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{formatAmount(totalDiscount)}</p>
                <p className="text-sm text-muted-foreground">Descuento Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{coupons.length}</p>
                <p className="text-sm text-muted-foreground">Cupones Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="promotions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="promotions">Promociones</TabsTrigger>
          <TabsTrigger value="coupons">Cupones</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        </TabsList>

        {/* Promotions Tab */}
        <TabsContent value="promotions" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar promociones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PromotionStatus | 'all')}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="active">Activa</SelectItem>
                      <SelectItem value="scheduled">Programada</SelectItem>
                      <SelectItem value="paused">Pausada</SelectItem>
                      <SelectItem value="expired">Expirada</SelectItem>
                      <SelectItem value="draft">Borrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as PromotionType | 'all')}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="automatic">Automático</SelectItem>
                      <SelectItem value="coupon">Cupón</SelectItem>
                      <SelectItem value="bogo">BOGO</SelectItem>
                      <SelectItem value="bulk">Por cantidad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promotions List */}
          <div className="space-y-4">
            {filteredPromotions.map(promotion => {
              const promotionMetrics = metrics[promotion.id]
              const usagePercentage = promotion.usage.totalLimit ? 
                (promotion.usage.usedCount / promotion.usage.totalLimit) * 100 : 0

              return (
                <Card key={promotion.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{promotion.name}</h3>
                          <Badge className={getPromotionStatusColor(promotion.status)}>
                            {getPromotionStatusText(promotion.status)}
                          </Badge>
                          <Badge variant="outline">
                            {formatDiscountDisplay(promotion.discountType, promotion.discountValue)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{promotion.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Tipo: {promotion.type}</span>
                          <span>Prioridad: {promotion.priority}</span>
                          {promotion.conditions.minOrderValue && (
                            <span>Mín: {formatAmount(promotion.conditions.minOrderValue)}</span>
                          )}
                          <span>
                            {promotion.scheduling.startDate.toLocaleDateString()} - 
                            {promotion.scheduling.endDate ? promotion.scheduling.endDate.toLocaleDateString() : 'Sin fin'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePromotionStatus(promotion.id)}
                        >
                          {promotion.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Usage Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-2xl font-bold">{promotion.usage.usedCount}</div>
                        <div className="text-sm text-muted-foreground">Usos</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {promotionMetrics?.totalDiscount ? formatAmount(promotionMetrics.totalDiscount) : '$0'}
                        </div>
                        <div className="text-sm text-muted-foreground">Descuento</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {promotionMetrics?.uniqueCustomers || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Clientes</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {promotionMetrics?.averageOrderValue ? formatAmount(promotionMetrics.averageOrderValue) : '$0'}
                        </div>
                        <div className="text-sm text-muted-foreground">Ticket promedio</div>
                      </div>
                    </div>

                    {/* Usage Progress */}
                    {promotion.usage.totalLimit && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Uso de la promoción</span>
                          <span>{promotion.usage.usedCount} / {promotion.usage.totalLimit}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        {promotion.type === 'coupon' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedPromotionId(promotion.id)
                              setShowCouponGenerator(true)
                            }}
                          >
                            <Tag className="h-4 w-4 mr-2" />
                            Generar Cupones
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicar
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Actualizado: {promotion.updatedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {filteredPromotions.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold">No se encontraron promociones</h3>
                  <p className="text-muted-foreground">Crea tu primera promoción para comenzar</p>
                  <Button className="mt-4" onClick={() => setShowNewPromotionDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Promoción
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Coupons Tab */}
        <TabsContent value="coupons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cupones Activos</CardTitle>
              <CardDescription>Gestiona códigos de cupón individuales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coupons.map(coupon => {
                  const promotion = promotions.find(p => p.id === coupon.promotionId)
                  const usagePercentage = coupon.maxUses ? 
                    (coupon.usageCount / coupon.maxUses) * 100 : 0

                  return (
                    <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded">
                          <Tag className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium font-mono">{coupon.code}</div>
                          <div className="text-sm text-muted-foreground">
                            {promotion?.name} • Creado: {coupon.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="font-medium">{coupon.usageCount}</div>
                          <div className="text-xs text-muted-foreground">Usos</div>
                        </div>
                        <div>
                          <div className="font-medium">
                            {coupon.maxUses || '∞'}
                          </div>
                          <div className="text-xs text-muted-foreground">Límite</div>
                        </div>
                        <div>
                          <Badge variant={coupon.isActive ? "default" : "secondary"}>
                            {coupon.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(coupon.code, "Código de cupón")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}

                {coupons.length === 0 && (
                  <div className="text-center py-8">
                    <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold">No hay cupones disponibles</h3>
                    <p className="text-muted-foreground">Crea promociones de tipo "cupón" para generar códigos</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plantillas de Promociones</CardTitle>
              <CardDescription>Plantillas predefinidas para crear promociones rápidamente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PROMOTION_TEMPLATES.map(template => (
                  <Card key={template.id} className="border-dashed">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                        <Badge variant="outline">
                          {formatDiscountDisplay(template.discountType, template.discountValue)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>Tipo: {template.type}</div>
                        {template.conditions.minOrderValue && (
                          <div>Pedido mínimo: {formatAmount(template.conditions.minOrderValue)}</div>
                        )}
                        {template.conditions.firstTimeCustomer && (
                          <div>Solo nuevos clientes</div>
                        )}
                      </div>
                      
                      <Button className="w-full mt-4" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Usar Plantilla
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Promoción</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {promotions.slice(0, 5).map(promotion => {
                    const metric = metrics[promotion.id]
                    return (
                      <div key={promotion.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{promotion.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {promotion.usage.usedCount} usos
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">
                            {metric ? formatAmount(metric.totalDiscount) : '$0'}
                          </div>
                          <div className="text-sm text-muted-foreground">ahorro</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas Generales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Tasa de conversión promedio</span>
                  <span className="font-medium">6.8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Ahorro promedio por pedido</span>
                  <span className="font-medium">{formatAmount(35)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Promociones más populares</span>
                  <span className="font-medium">Descuentos %</span>
                </div>
                <div className="flex justify-between">
                  <span>Mejor día de uso</span>
                  <span className="font-medium">Viernes</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* New Promotion Dialog */}
      <Dialog open={showNewPromotionDialog} onOpenChange={setShowNewPromotionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nueva Promoción</DialogTitle>
            <DialogDescription>
              Configura una nueva promoción con sus condiciones y restricciones
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre de la promoción *</Label>
                <Input
                  value={newPromotion.name}
                  onChange={(e) => setNewPromotion(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Black Friday 2024"
                />
              </div>
              <div>
                <Label>Tipo de promoción</Label>
                <Select
                  value={newPromotion.type}
                  onValueChange={(value) => setNewPromotion(prev => ({ ...prev, type: value as PromotionType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automática</SelectItem>
                    <SelectItem value="coupon">Cupón</SelectItem>
                    <SelectItem value="bogo">Compra uno lleva otro</SelectItem>
                    <SelectItem value="bulk">Descuento por cantidad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Descripción</Label>
              <Textarea
                value={newPromotion.description}
                onChange={(e) => setNewPromotion(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe los términos y condiciones..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de descuento</Label>
                <Select
                  value={newPromotion.discountType}
                  onValueChange={(value) => setNewPromotion(prev => ({ ...prev, discountType: value as DiscountType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                    <SelectItem value="fixed_amount">Monto fijo ($)</SelectItem>
                    <SelectItem value="free_shipping">Envío gratis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Valor del descuento</Label>
                <Input
                  type="number"
                  value={newPromotion.discountValue}
                  onChange={(e) => setNewPromotion(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                  placeholder="10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pedido mínimo</Label>
                <Input
                  type="number"
                  value={newPromotion.minOrderValue}
                  onChange={(e) => setNewPromotion(prev => ({ ...prev, minOrderValue: parseFloat(e.target.value) || 0 }))}
                  placeholder="50"
                />
              </div>
              <div>
                <Label>Límite de usos</Label>
                <Input
                  type="number"
                  value={newPromotion.totalLimit}
                  onChange={(e) => setNewPromotion(prev => ({ ...prev, totalLimit: parseInt(e.target.value) || 0 }))}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newPromotion.stackable}
                  onCheckedChange={(checked) => setNewPromotion(prev => ({ ...prev, stackable: checked }))}
                />
                <Label>Apilable con otras promociones</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newPromotion.firstTimeCustomer}
                  onCheckedChange={(checked) => setNewPromotion(prev => ({ ...prev, firstTimeCustomer: checked }))}
                />
                <Label>Solo nuevos clientes</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewPromotionDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={createPromotion}>
                Crear Promoción
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Coupon Generator Dialog */}
      <Dialog open={showCouponGenerator} onOpenChange={setShowCouponGenerator}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generar Cupones Masivos</DialogTitle>
            <DialogDescription>
              Crea múltiples códigos de cupón para la promoción seleccionada
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Cantidad de cupones</Label>
              <Input type="number" defaultValue="10" placeholder="10" />
            </div>
            <div>
              <Label>Prefijo (opcional)</Label>
              <Input placeholder="BF2024" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCouponGenerator(false)}>
                Cancelar
              </Button>
              <Button onClick={() => generateBulkCoupons(10, 'BF2024')}>
                Generar Cupones
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}