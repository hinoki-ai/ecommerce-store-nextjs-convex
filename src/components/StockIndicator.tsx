"use client"

import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface StockIndicatorProps {
  quantity: number
  lowStockThreshold?: number
  allowBackorder?: boolean
  trackInventory?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "text-xs px-2 py-1",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-2"
}

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5"
}

export function StockIndicator({
  quantity,
  lowStockThreshold = 5,
  allowBackorder = false,
  trackInventory = true,
  size = "md",
  className
}: StockIndicatorProps) {
  // If inventory tracking is disabled
  if (!trackInventory) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-green-50 text-green-700 border-green-200",
          sizeClasses[size],
          className
        )}
      >
        <CheckCircle className={cn(iconSizes[size], "mr-1")} />
        Disponible
      </Badge>
    )
  }

  // Out of stock
  if (quantity <= 0) {
    if (allowBackorder) {
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-orange-50 text-orange-700 border-orange-200",
            sizeClasses[size],
            className
          )}
        >
          <Clock className={cn(iconSizes[size], "mr-1")} />
          Sin stock (Pedido especial)
        </Badge>
      )
    } else {
      return (
        <Badge
          variant="destructive"
          className={cn(sizeClasses[size], className)}
        >
          <XCircle className={cn(iconSizes[size], "mr-1")} />
          Agotado
        </Badge>
      )
    }
  }

  // Low stock warning
  if (quantity <= lowStockThreshold) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-yellow-50 text-yellow-700 border-yellow-200",
          sizeClasses[size],
          className
        )}
      >
        <AlertTriangle className={cn(iconSizes[size], "mr-1")} />
        ¡Últimas {quantity}!
      </Badge>
    )
  }

  // In stock
  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-green-50 text-green-700 border-green-200",
        sizeClasses[size],
        className
      )}
    >
      <CheckCircle className={cn(iconSizes[size], "mr-1")} />
      En stock ({quantity})
    </Badge>
  )
}

// Stock status for product cards (simplified)
export function StockStatus({
  quantity,
  lowStockThreshold = 5,
  className
}: Pick<StockIndicatorProps, 'quantity' | 'lowStockThreshold' | 'className'>) {
  if (quantity <= 0) {
    return (
      <span className={cn("text-red-600 text-sm font-medium", className)}>
        Agotado
      </span>
    )
  }

  if (quantity <= lowStockThreshold) {
    return (
      <span className={cn("text-orange-600 text-sm font-medium", className)}>
        ¡Solo {quantity} disponibles!
      </span>
    )
  }

  return (
    <span className={cn("text-green-600 text-sm font-medium", className)}>
      En stock
    </span>
  )
}

// Inventory status with detailed information
export function InventoryStatus({
  inventory,
  className
}: {
  inventory: {
    quantity: number
    lowStockThreshold: number
    trackInventory: boolean
    allowBackorder: boolean
  }
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Estado del inventario:</span>
        <StockIndicator
          quantity={inventory.quantity}
          lowStockThreshold={inventory.lowStockThreshold}
          allowBackorder={inventory.allowBackorder}
          trackInventory={inventory.trackInventory}
        />
      </div>

      {inventory.trackInventory && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Cantidad actual:</span>
            <span className="ml-2 font-medium">
              {inventory.quantity > 0 ? inventory.quantity : 0}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Umbral bajo:</span>
            <span className="ml-2 font-medium">{inventory.lowStockThreshold}</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inventory.trackInventory}
            readOnly
            className="rounded border-gray-300"
          />
          <span className="text-gray-600">Controlar inventario</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inventory.allowBackorder}
            readOnly
            className="rounded border-gray-300"
          />
          <span className="text-gray-600">Permitir pedidos especiales</span>
        </div>
      </div>
    </div>
  )
}