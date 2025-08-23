"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InventoryStatus } from "@/components/StockIndicator"
import {
  Plus,
  Minus,
  Package,
  AlertTriangle,
  History,
  Settings
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface InventoryManagerProps {
  productId: string
  className?: string
}

export function InventoryManager({ productId, className }: InventoryManagerProps) {
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0)
  const [adjustmentReason, setAdjustmentReason] = useState("")
  const [isAdjusting, setIsAdjusting] = useState(false)

  // Fetch product inventory
  const product = useQuery(api.products.getProductById, { productId })

  // Fetch inventory logs
  const inventoryLogs = useQuery(api.inventory.getInventoryLogs, {
    productId,
    limit: 20
  }) || []

  // Mutations
  const adjustInventory = useMutation(api.inventory.adjustInventory)

  const handleInventoryAdjustment = async (type: 'increase' | 'decrease', quantity: number) => {
    if (!product || quantity <= 0) return

    setIsAdjusting(true)

    try {
      const newQuantity = type === 'increase'
        ? product.inventory.quantity + quantity
        : Math.max(0, product.inventory.quantity - quantity)

      await adjustInventory({
        productId,
        quantity: quantity,
        type: type === 'increase' ? 'stock_in' : 'stock_out',
        reason: adjustmentReason || (type === 'increase' ? 'Ajuste manual' : 'Ajuste manual'),
        previousQuantity: product.inventory.quantity,
        newQuantity
      })

      setAdjustmentQuantity(0)
      setAdjustmentReason("")
      toast.success(`Inventario ${type === 'increase' ? 'aumentado' : 'disminuido'} exitosamente`)
    } catch (error) {
      console.error("Error adjusting inventory:", error)
      toast.error("Error al ajustar inventario")
    } finally {
      setIsAdjusting(false)
    }
  }

  const handleQuickAdjustment = async (amount: number) => {
    if (amount > 0) {
      await handleInventoryAdjustment('increase', amount)
    } else {
      await handleInventoryAdjustment('decrease', Math.abs(amount))
    }
  }

  const handleLowStockNotification = async () => {
    // TODO: Implement low stock notification system
    toast.info("Sistema de notificaciones de stock bajo en desarrollo")
  }

  if (!product) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Producto no encontrado
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Inventario Actual</TabsTrigger>
          <TabsTrigger value="adjust">Ajustar Stock</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Estado del Inventario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryStatus inventory={product.inventory} />

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {product.inventory.quantity}
                  </div>
                  <div className="text-sm text-gray-600">Cantidad actual</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {product.inventory.lowStockThreshold}
                  </div>
                  <div className="text-sm text-gray-600">Umbral bajo</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {product.inventory.quantity > product.inventory.lowStockThreshold ? '✓' : '⚠'}
                  </div>
                  <div className="text-sm text-gray-600">Estado</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {product.inventory.allowBackorder ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-gray-600">Pedidos especiales</div>
                </div>
              </div>

              {/* Low Stock Alert */}
              {product.inventory.quantity <= product.inventory.lowStockThreshold && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">
                        ¡Stock bajo!
                      </h4>
                      <p className="text-sm text-yellow-700">
                        Quedan {product.inventory.quantity} unidades. Considera reabastecer.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleLowStockNotification}
                      className="ml-auto"
                    >
                      Notificar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjust" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Ajustar Inventario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Adjustments */}
              <div>
                <h4 className="font-medium mb-3">Ajustes rápidos</h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {[1, 5, 10, -1, -5, -10].map((amount) => (
                    <Button
                      key={amount}
                      variant={amount > 0 ? "default" : "destructive"}
                      size="sm"
                      onClick={() => handleQuickAdjustment(amount)}
                      disabled={isAdjusting}
                    >
                      {amount > 0 ? '+' : ''}{amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Manual Adjustment */}
              <div className="border-t pt-6">
                <h4 className="font-medium mb-3">Ajuste manual</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Cantidad
                    </label>
                    <Input
                      type="number"
                      value={adjustmentQuantity}
                      onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Razón (opcional)
                    </label>
                    <Input
                      value={adjustmentReason}
                      onChange={(e) => setAdjustmentReason(e.target.value)}
                      placeholder="Razón del ajuste"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleInventoryAdjustment('increase', adjustmentQuantity)}
                    disabled={isAdjusting || adjustmentQuantity <= 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Aumentar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleInventoryAdjustment('decrease', adjustmentQuantity)}
                    disabled={isAdjusting || adjustmentQuantity <= 0}
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Disminuir
                  </Button>
                </div>
              </div>

              {/* Preview */}
              {adjustmentQuantity !== 0 && (
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-3">Vista previa</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Cantidad actual:</span>
                      <span className="font-medium">{product.inventory.quantity}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span>Nueva cantidad:</span>
                      <span className={`font-medium ${
                        adjustmentQuantity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Math.max(0, product.inventory.quantity + adjustmentQuantity)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historial de Inventario
              </CardTitle>
            </CardHeader>
            <CardContent>
              {inventoryLogs.length > 0 ? (
                <div className="space-y-3">
                  {inventoryLogs.map((log) => (
                    <div key={log._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          log.type === 'stock_in' ? 'bg-green-100 text-green-600' :
                          log.type === 'stock_out' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {log.type === 'stock_in' ? <Plus className="h-4 w-4" /> :
                           log.type === 'stock_out' ? <Minus className="h-4 w-4" /> :
                           <Settings className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {log.type === 'stock_in' ? 'Entrada de stock' :
                             log.type === 'stock_out' ? 'Salida de stock' :
                             'Ajuste manual'}
                          </div>
                          <div className="text-xs text-gray-600">
                            {format(log.createdAt, "dd/MM/yyyy HH:mm", { locale: es })}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`font-medium ${
                          log.quantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {log.quantity > 0 ? '+' : ''}{log.quantity}
                        </div>
                        <div className="text-xs text-gray-600">
                          {log.previousQuantity} → {log.newQuantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay historial de inventario</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}