"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Package,
  Warehouse,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  MapPin,
  Clock,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Truck,
  ShoppingCart,
  Bell,
  Target,
  Zap
} from "lucide-react"
import {
  AdvancedInventoryService,
  InventoryLocation,
  InventoryItem,
  StockAlert,
  PurchaseOrder,
  InventoryMovement,
  getAlertSeverityColor,
  formatStockLevel,
  getMovementTypeLabel,
  getInventoryService
} from "@/lib/inventory"
import { useLanguage } from "@/components/LanguageProvider"
import { useCurrency } from "@/components/CurrencyProvider"
import { toast } from "sonner"

interface AdvancedInventoryManagerProps {
  className?: string
}

// Mock inventory data
const mockInventoryItems: InventoryItem[] = [
  {
    id: "inv-1",
    productId: "prod-1", 
    locationId: "loc-1",
    sku: "WH-001",
    quantity: 150,
    reservedQuantity: 20,
    availableQuantity: 130,
    lowStockThreshold: 50,
    reorderPoint: 75,
    reorderQuantity: 200,
    cost: 25.99,
    lastUpdated: new Date(),
    lastCounted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    notes: "Auditoría realizada la semana pasada"
  },
  {
    id: "inv-2",
    productId: "prod-2",
    locationId: "loc-1", 
    sku: "TS-002",
    quantity: 35,
    reservedQuantity: 5,
    availableQuantity: 30,
    lowStockThreshold: 25,
    reorderPoint: 40,
    reorderQuantity: 100,
    cost: 19.99,
    lastUpdated: new Date(),
    lastCounted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: "inv-3",
    productId: "prod-3",
    locationId: "loc-2",
    sku: "SC-003", 
    quantity: 200,
    reservedQuantity: 10,
    availableQuantity: 190,
    lowStockThreshold: 100,
    reorderPoint: 150,
    reorderQuantity: 300,
    cost: 149.99,
    lastUpdated: new Date(),
    lastCounted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
]

const mockAlerts: StockAlert[] = [
  {
    id: "alert-1",
    productId: "prod-2",
    locationId: "loc-1",
    type: "low_stock",
    severity: "high",
    message: "Stock bajo: 30 unidades disponibles (límite: 25)",
    isActive: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "alert-2", 
    productId: "prod-4",
    locationId: "loc-2",
    type: "out_of_stock",
    severity: "critical",
    message: "Producto agotado en Tienda Las Condes",
    isActive: true,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: "alert-3",
    productId: "prod-2",
    locationId: "loc-1", 
    type: "reorder_point",
    severity: "high",
    message: "Se alcanzó el punto de reorden: 30 unidades (punto: 40)",
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 60 * 1000)
  }
]

const mockMovements: InventoryMovement[] = [
  {
    id: "mov-1",
    productId: "prod-1",
    locationId: "loc-1",
    type: "sale",
    quantity: -5,
    previousQuantity: 155,
    newQuantity: 150,
    reason: "Venta online",
    reference: "order-123",
    userId: "user-1",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "mov-2",
    productId: "prod-2", 
    locationId: "loc-1",
    type: "purchase",
    quantity: +50,
    previousQuantity: 15,
    newQuantity: 35,
    reason: "Recepción de proveedor",
    reference: "po-456",
    cost: 19.99,
    userId: "user-1",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  },
  {
    id: "mov-3",
    productId: "prod-3",
    locationId: "loc-2",
    type: "transfer",
    quantity: -20,
    previousQuantity: 220,
    newQuantity: 200,
    reason: "Transferencia a almacén central",
    reference: "transfer-789",
    userId: "user-2",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
  }
]

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "po-1",
    supplierId: "supplier-1",
    locationId: "loc-1",
    status: "pending",
    items: [
      {
        productId: "prod-2",
        sku: "TS-002",
        quantityOrdered: 100,
        quantityReceived: 0,
        unitCost: 19.99,
        totalCost: 1999
      }
    ],
    totalAmount: 1999,
    orderDate: new Date(),
    expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
]

export function AdvancedInventoryManager({ className = "" }: AdvancedInventoryManagerProps) {
  const { t } = useLanguage()
  const { formatAmount } = useCurrency()
  const [inventoryService] = useState(() => getInventoryService())
  
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventoryItems)
  const [alerts, setAlerts] = useState<StockAlert[]>(mockAlerts)
  const [movements, setMovements] = useState<InventoryMovement[]>(mockMovements) 
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders)
  const [locations, setLocations] = useState<InventoryLocation[]>([])
  const [metrics, setMetrics] = useState<any>({})
  
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [locationsData, metricsData] = await Promise.all([
        inventoryService.getLocations(),
        inventoryService.getInventoryMetrics()
      ])
      
      setLocations(locationsData)
      setMetrics(metricsData)
      
      toast.success("Datos del inventario cargados")
    } catch (error) {
      toast.error("Error al cargar los datos del inventario")
    } finally {
      setIsLoading(false)  
    }
  }

  const refreshData = async () => {
    await loadData()
  }

  const handleResolveAlert = async (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isActive: false, resolvedAt: new Date() } : alert
    ))
    toast.success("Alerta resuelta")
  }

  const handleCreatePurchaseOrder = async () => {
    try {
      const suggestions = await inventoryService.generateReorderSuggestions()
      setPurchaseOrders(prev => [...prev, ...suggestions])
      toast.success(`${suggestions.length} órdenes de compra sugeridas`)
    } catch (error) {
      toast.error("Error al generar órdenes de compra")
    }
  }

  const getStockStatusColor = (item: InventoryItem) => {
    if (item.availableQuantity === 0) return "text-red-600"
    if (item.availableQuantity <= item.lowStockThreshold) return "text-orange-600" 
    if (item.availableQuantity <= item.reorderPoint) return "text-yellow-600"
    return "text-green-600"
  }

  const getStockStatusIcon = (item: InventoryItem) => {
    if (item.availableQuantity === 0) return <XCircle className="h-4 w-4" />
    if (item.availableQuantity <= item.lowStockThreshold) return <AlertTriangle className="h-4 w-4" />
    return <CheckCircle className="h-4 w-4" />
  }

  const filteredInventory = inventory.filter(item => {
    const matchesLocation = selectedLocation === "all" || item.locationId === selectedLocation
    const matchesSearch = item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "low_stock" && item.availableQuantity <= item.lowStockThreshold) ||
      (filterStatus === "out_of_stock" && item.availableQuantity === 0) ||
      (filterStatus === "normal" && item.availableQuantity > item.lowStockThreshold)
    
    return matchesLocation && matchesSearch && matchesStatus
  })

  const activeAlertsCount = alerts.filter(alert => alert.isActive).length
  const criticalAlertsCount = alerts.filter(alert => alert.isActive && alert.severity === 'critical').length

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">Gestión Avanzada de Inventario</h2>
          <p className="text-muted-foreground">
            Administra inventario multi-ubicación con análisis inteligente
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleCreatePurchaseOrder} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Generar Órdenes
          </Button>
          <Button onClick={refreshData} disabled={isLoading} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{metrics.totalItems || inventory.length}</p>
                <p className="text-sm text-muted-foreground">Productos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{formatAmount(metrics.totalValue || 50000)}</p>
                <p className="text-sm text-muted-foreground">Valor Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{activeAlertsCount}</p>
                <p className="text-sm text-muted-foreground">Alertas Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{metrics.turnoverRate || 4.2}x</p>
                <p className="text-sm text-muted-foreground">Rotación Anual</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Banner */}
      {criticalAlertsCount > 0 && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">
                    {criticalAlertsCount} alerta{criticalAlertsCount > 1 ? 's' : ''} crítica{criticalAlertsCount > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-red-800">
                    Productos agotados que requieren atención inmediata
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Ver Alertas
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="stock">Inventario</TabsTrigger>
          <TabsTrigger value="movements">Movimientos</TabsTrigger>
          <TabsTrigger value="alerts">Alertas ({activeAlertsCount})</TabsTrigger>
          <TabsTrigger value="orders">Órdenes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stock Status Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Estado del Stock por Ubicación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.map(location => {
                    const locationItems = inventory.filter(item => item.locationId === location.id)
                    const lowStockCount = locationItems.filter(item => 
                      item.availableQuantity <= item.lowStockThreshold
                    ).length
                    const normalStockCount = locationItems.length - lowStockCount
                    
                    return (
                      <div key={location.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{location.name}</span>
                          <span>{locationItems.length} productos</span>
                        </div>
                        <div className="flex space-x-1 h-2">
                          <div 
                            className="bg-green-500 rounded-l" 
                            style={{ width: `${(normalStockCount / locationItems.length) * 100}%` }}
                          />
                          <div 
                            className="bg-red-500 rounded-r"
                            style={{ width: `${(lowStockCount / locationItems.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Movements */}
            <Card>
              <CardHeader>
                <CardTitle>Movimientos Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {movements.slice(0, 5).map(movement => (
                    <div key={movement.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant={movement.quantity > 0 ? "default" : "secondary"}>
                          {getMovementTypeLabel(movement.type)}
                        </Badge>
                        <span className="text-sm">SKU: {movement.productId}</span>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {movement.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Stock Bajo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {metrics.lowStockItems || 2}
                </div>
                <p className="text-xs text-muted-foreground">productos bajo mínimo</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Agotados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {metrics.outOfStockItems || 1}
                </div>
                <p className="text-xs text-muted-foreground">productos sin stock</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sobrestock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.overstockItems || 0}
                </div>
                <p className="text-xs text-muted-foreground">productos en exceso</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stock Tab */}
        <TabsContent value="stock" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <Label>Buscar por SKU</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar productos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>Ubicación</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las ubicaciones</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Estado</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="normal">Stock Normal</SelectItem>
                      <SelectItem value="low_stock">Stock Bajo</SelectItem>
                      <SelectItem value="out_of_stock">Agotado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Inventario Actual</CardTitle>
              <CardDescription>{filteredInventory.length} productos encontrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInventory.map(item => {
                  const location = locations.find(loc => loc.id === item.locationId)
                  const stockPercentage = item.reorderPoint > 0 ? 
                    (item.availableQuantity / item.reorderPoint) * 100 : 100

                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStockStatusIcon(item)}
                          <div>
                            <div className="font-medium">SKU: {item.sku}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {location?.name}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-6 flex-1 mx-8">
                        <div>
                          <div className="text-sm text-muted-foreground">Disponible</div>
                          <div className={`font-medium ${getStockStatusColor(item)}`}>
                            {item.availableQuantity}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Total</div>
                          <div className="font-medium">{item.quantity}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Reservado</div>
                          <div className="font-medium">{item.reservedQuantity}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Estado</div>
                          <Badge className={getAlertSeverityColor(
                            item.availableQuantity === 0 ? 'critical' :
                            item.availableQuantity <= item.lowStockThreshold ? 'high' : 'low'
                          )}>
                            {formatStockLevel(item.availableQuantity, item.quantity)}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Movements Tab */}
        <TabsContent value="movements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Movimientos</CardTitle>
              <CardDescription>Registro completo de todas las transacciones de inventario</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {movements.map(movement => (
                  <div key={movement.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Badge variant={movement.quantity > 0 ? "default" : "secondary"}>
                        {getMovementTypeLabel(movement.type)}
                      </Badge>
                      <div>
                        <div className="font-medium">Producto ID: {movement.productId}</div>
                        <div className="text-sm text-muted-foreground">{movement.reason}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-sm text-muted-foreground">Cantidad</div>
                        <div className={`font-medium ${
                          movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Stock Final</div>
                        <div className="font-medium">{movement.newQuantity}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Fecha</div>
                        <div className="font-medium text-sm">
                          {movement.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Inventario</CardTitle>
              <CardDescription>{activeAlertsCount} alertas activas requieren atención</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.filter(alert => alert.isActive).map(alert => (
                  <div key={alert.id} className={`flex items-center justify-between p-4 border rounded-lg ${
                    alert.severity === 'critical' ? 'border-red-200 bg-red-50' : 
                    alert.severity === 'high' ? 'border-orange-200 bg-orange-50' : 'border-yellow-200 bg-yellow-50'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <AlertTriangle className={`h-5 w-5 ${
                        alert.severity === 'critical' ? 'text-red-600' :
                        alert.severity === 'high' ? 'text-orange-600' : 'text-yellow-600'
                      }`} />
                      <div>
                        <div className="font-medium">{alert.message}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {alert.createdAt.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={getAlertSeverityColor(alert.severity)}>
                        {alert.severity === 'critical' ? 'Crítico' :
                         alert.severity === 'high' ? 'Alto' : 
                         alert.severity === 'medium' ? 'Medio' : 'Bajo'}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleResolveAlert(alert.id)}
                      >
                        Resolver
                      </Button>
                    </div>
                  </div>
                ))}
                
                {activeAlertsCount === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold">No hay alertas activas</h3>
                    <p className="text-muted-foreground">El inventario está funcionando correctamente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchase Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Órdenes de Compra</CardTitle>
                  <CardDescription>Gestiona las órdenes de reabastecimiento</CardDescription>
                </div>
                <Button onClick={handleCreatePurchaseOrder}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Orden
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchaseOrders.map(order => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-medium">Orden #{order.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.items.length} producto{order.items.length > 1 ? 's' : ''}
                        </div>
                      </div>
                      <Badge variant={order.status === 'pending' ? 'destructive' : 'default'}>
                        {order.status === 'pending' ? 'Pendiente' :
                         order.status === 'ordered' ? 'Ordenado' :
                         order.status === 'received' ? 'Recibido' : order.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Total</div>
                        <div className="font-medium">{formatAmount(order.totalAmount)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Fecha Orden</div>
                        <div className="font-medium">{order.orderDate.toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Fecha Esperada</div>
                        <div className="font-medium">
                          {order.expectedDate?.toLocaleDateString() || 'No definida'}
                        </div>
                      </div>
                      <div className="text-right">
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {purchaseOrders.length === 0 && (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold">No hay órdenes de compra</h3>
                    <p className="text-muted-foreground">Crea tu primera orden para reabastecer inventario</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}