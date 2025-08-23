export interface InventoryLocation {
  id: string
  name: string
  address: string
  type: 'warehouse' | 'store' | 'dropship' | 'supplier'
  isActive: boolean
  priority: number // Lower = higher priority
  metadata?: Record<string, string>
}

export interface InventoryItem {
  id: string
  productId: string
  locationId: string
  sku: string
  quantity: number
  reservedQuantity: number
  availableQuantity: number
  lowStockThreshold: number
  reorderPoint: number
  reorderQuantity: number
  cost: number
  lastUpdated: Date
  lastCounted: Date
  notes?: string
}

export interface InventoryMovement {
  id: string
  productId: string
  locationId: string
  type: MovementType
  quantity: number
  previousQuantity: number
  newQuantity: number
  reason: string
  reference?: string // Order ID, supplier ID, etc.
  cost?: number
  userId: string
  createdAt: Date
}

export type MovementType = 
  | 'purchase' // Received from supplier
  | 'sale' // Sold to customer
  | 'transfer' // Moved between locations
  | 'adjustment' // Manual adjustment
  | 'reservation' // Reserved for order
  | 'release' // Released reservation
  | 'loss' // Damaged/lost
  | 'return' // Customer return

export interface StockAlert {
  id: string
  productId: string
  locationId: string
  type: AlertType
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  isActive: boolean
  createdAt: Date
  resolvedAt?: Date
}

export type AlertType = 
  | 'low_stock'
  | 'out_of_stock'
  | 'overstock'
  | 'reorder_point'
  | 'expired'
  | 'discrepancy'

export interface PurchaseOrder {
  id: string
  supplierId: string
  locationId: string
  status: PurchaseOrderStatus
  items: PurchaseOrderItem[]
  totalAmount: number
  orderDate: Date
  expectedDate?: Date
  receivedDate?: Date
  notes?: string
}

export type PurchaseOrderStatus = 
  | 'draft'
  | 'pending'
  | 'ordered'
  | 'partial'
  | 'received'
  | 'cancelled'

export interface PurchaseOrderItem {
  productId: string
  sku: string
  quantityOrdered: number
  quantityReceived: number
  unitCost: number
  totalCost: number
}

export interface InventoryForecast {
  productId: string
  locationId: string
  period: 'week' | 'month' | 'quarter'
  demandForecast: number
  reorderSuggestion: number
  stockOutRisk: number // 0-1 probability
  suggestedReorderDate: Date
}

// Mock data
export const MOCK_LOCATIONS: InventoryLocation[] = [
  {
    id: 'loc-1',
    name: 'Almacén Central',
    address: 'Av. Principal 123, Santiago, Chile',
    type: 'warehouse',
    isActive: true,
    priority: 1
  },
  {
    id: 'loc-2', 
    name: 'Tienda Las Condes',
    address: 'Mall Las Condes, Santiago, Chile',
    type: 'store',
    isActive: true,
    priority: 2
  },
  {
    id: 'loc-3',
    name: 'Tienda Providencia',
    address: 'Av. Providencia 456, Santiago, Chile', 
    type: 'store',
    isActive: true,
    priority: 3
  }
]

// Advanced Inventory Service
export class AdvancedInventoryService {
  private locations: Map<string, InventoryLocation> = new Map()
  private inventory: Map<string, InventoryItem[]> = new Map()
  private movements: InventoryMovement[] = []
  private alerts: StockAlert[] = []

  constructor() {
    // Initialize with mock data
    MOCK_LOCATIONS.forEach(location => {
      this.locations.set(location.id, location)
      this.inventory.set(location.id, [])
    })
  }

  // Location management
  async getLocations(): Promise<InventoryLocation[]> {
    return Array.from(this.locations.values())
  }

  async addLocation(location: Omit<InventoryLocation, 'id'>): Promise<InventoryLocation> {
    const newLocation: InventoryLocation = {
      ...location,
      id: `loc-${Date.now()}`
    }
    this.locations.set(newLocation.id, newLocation)
    this.inventory.set(newLocation.id, [])
    return newLocation
  }

  // Inventory queries
  async getInventoryByProduct(productId: string): Promise<InventoryItem[]> {
    const allInventory: InventoryItem[] = []
    for (const locationInventory of this.inventory.values()) {
      const productInventory = locationInventory.filter(item => item.productId === productId)
      allInventory.push(...productInventory)
    }
    return allInventory
  }

  async getInventoryByLocation(locationId: string): Promise<InventoryItem[]> {
    return this.inventory.get(locationId) || []
  }

  async getTotalStock(productId: string): Promise<number> {
    const inventoryItems = await this.getInventoryByProduct(productId)
    return inventoryItems.reduce((total, item) => total + item.availableQuantity, 0)
  }

  async getAvailableStock(productId: string, locationId?: string): Promise<number> {
    if (locationId) {
      const locationInventory = await this.getInventoryByLocation(locationId)
      const item = locationInventory.find(item => item.productId === productId)
      return item?.availableQuantity || 0
    }
    
    return this.getTotalStock(productId)
  }

  // Stock movements
  async recordMovement(movement: Omit<InventoryMovement, 'id' | 'createdAt'>): Promise<InventoryMovement> {
    const newMovement: InventoryMovement = {
      ...movement,
      id: `mov-${Date.now()}`,
      createdAt: new Date()
    }
    
    this.movements.push(newMovement)
    await this.updateInventory(movement.locationId, movement.productId, movement.newQuantity)
    
    // Check for alerts after movement
    await this.checkStockAlerts(movement.productId, movement.locationId)
    
    return newMovement
  }

  private async updateInventory(locationId: string, productId: string, newQuantity: number): Promise<void> {
    const locationInventory = this.inventory.get(locationId) || []
    const itemIndex = locationInventory.findIndex(item => item.productId === productId)
    
    if (itemIndex >= 0) {
      locationInventory[itemIndex].quantity = newQuantity
      locationInventory[itemIndex].availableQuantity = newQuantity - locationInventory[itemIndex].reservedQuantity
      locationInventory[itemIndex].lastUpdated = new Date()
    }
  }

  // Reservations
  async reserveStock(productId: string, quantity: number, locationId?: string): Promise<boolean> {
    const locations = locationId ? [locationId] : Array.from(this.locations.keys())
    
    for (const locId of locations) {
      const locationInventory = this.inventory.get(locId) || []
      const item = locationInventory.find(item => item.productId === productId)
      
      if (item && item.availableQuantity >= quantity) {
        item.reservedQuantity += quantity
        item.availableQuantity -= quantity
        
        await this.recordMovement({
          productId,
          locationId: locId,
          type: 'reservation',
          quantity,
          previousQuantity: item.quantity,
          newQuantity: item.quantity,
          reason: 'Stock reserved for order',
          userId: 'system'
        })
        
        return true
      }
    }
    
    return false
  }

  async releaseReservation(productId: string, quantity: number, locationId?: string): Promise<void> {
    const locations = locationId ? [locationId] : Array.from(this.locations.keys())
    
    for (const locId of locations) {
      const locationInventory = this.inventory.get(locId) || []
      const item = locationInventory.find(item => item.productId === productId)
      
      if (item && item.reservedQuantity >= quantity) {
        item.reservedQuantity -= quantity
        item.availableQuantity += quantity
        
        await this.recordMovement({
          productId,
          locationId: locId,
          type: 'release',
          quantity,
          previousQuantity: item.quantity,
          newQuantity: item.quantity,
          reason: 'Reservation released',
          userId: 'system'
        })
        
        break
      }
    }
  }

  // Multi-location allocation
  async allocateStock(productId: string, requiredQuantity: number): Promise<{ locationId: string; quantity: number }[]> {
    const allocation: { locationId: string; quantity: number }[] = []
    let remainingQuantity = requiredQuantity
    
    // Sort locations by priority
    const sortedLocations = Array.from(this.locations.values())
      .filter(loc => loc.isActive)
      .sort((a, b) => a.priority - b.priority)
    
    for (const location of sortedLocations) {
      if (remainingQuantity <= 0) break
      
      const availableStock = await this.getAvailableStock(productId, location.id)
      const allocateQuantity = Math.min(availableStock, remainingQuantity)
      
      if (allocateQuantity > 0) {
        allocation.push({
          locationId: location.id,
          quantity: allocateQuantity
        })
        remainingQuantity -= allocateQuantity
      }
    }
    
    return allocation
  }

  // Stock alerts
  private async checkStockAlerts(productId: string, locationId: string): Promise<void> {
    const item = await this.getInventoryByLocation(locationId)
      .then(inventory => inventory.find(item => item.productId === productId))
    
    if (!item) return
    
    // Low stock alert
    if (item.availableQuantity <= item.lowStockThreshold) {
      await this.createAlert({
        productId,
        locationId,
        type: 'low_stock',
        severity: item.availableQuantity === 0 ? 'critical' : 'medium',
        message: `Stock bajo: ${item.availableQuantity} unidades disponibles (límite: ${item.lowStockThreshold})`
      })
    }
    
    // Reorder point alert
    if (item.availableQuantity <= item.reorderPoint) {
      await this.createAlert({
        productId,
        locationId,
        type: 'reorder_point',
        severity: 'high',
        message: `Se alcanzó el punto de reorden: ${item.availableQuantity} unidades (punto: ${item.reorderPoint})`
      })
    }
  }

  private async createAlert(alert: Omit<StockAlert, 'id' | 'isActive' | 'createdAt'>): Promise<StockAlert> {
    // Check if similar alert already exists
    const existingAlert = this.alerts.find(a => 
      a.productId === alert.productId &&
      a.locationId === alert.locationId &&
      a.type === alert.type &&
      a.isActive
    )
    
    if (existingAlert) {
      return existingAlert
    }
    
    const newAlert: StockAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      isActive: true,
      createdAt: new Date()
    }
    
    this.alerts.push(newAlert)
    return newAlert
  }

  async getActiveAlerts(locationId?: string): Promise<StockAlert[]> {
    return this.alerts.filter(alert => 
      alert.isActive && 
      (!locationId || alert.locationId === locationId)
    )
  }

  // Inventory forecasting
  async generateForecast(productId: string, locationId: string, period: 'week' | 'month' | 'quarter'): Promise<InventoryForecast> {
    // Simple mock forecast - in reality this would use historical data and ML
    const currentStock = await this.getAvailableStock(productId, locationId)
    const averageDemand = this.calculateAverageDemand(productId, locationId, period)
    
    const demandForecast = averageDemand * (period === 'week' ? 1 : period === 'month' ? 4 : 12)
    const stockOutRisk = Math.max(0, Math.min(1, (demandForecast - currentStock) / demandForecast))
    
    const daysUntilStockOut = Math.floor(currentStock / (averageDemand / 7))
    const suggestedReorderDate = new Date()
    suggestedReorderDate.setDate(suggestedReorderDate.getDate() + Math.max(1, daysUntilStockOut - 7))
    
    return {
      productId,
      locationId,
      period,
      demandForecast,
      reorderSuggestion: Math.max(0, demandForecast - currentStock),
      stockOutRisk,
      suggestedReorderDate
    }
  }

  private calculateAverageDemand(productId: string, locationId: string, period: 'week' | 'month' | 'quarter'): number {
    // Mock calculation - in reality would analyze historical sales data
    const baseWeeklyDemand = Math.floor(Math.random() * 50) + 10
    return baseWeeklyDemand
  }

  // Automatic reordering
  async generateReorderSuggestions(): Promise<PurchaseOrder[]> {
    const suggestions: PurchaseOrder[] = []
    const now = new Date()
    
    for (const [locationId, inventory] of this.inventory.entries()) {
      const itemsToReorder = inventory.filter(item => 
        item.availableQuantity <= item.reorderPoint && item.reorderQuantity > 0
      )
      
      if (itemsToReorder.length > 0) {
        const purchaseOrder: PurchaseOrder = {
          id: `po-${Date.now()}-${locationId}`,
          supplierId: 'supplier-1', // Would be determined based on product
          locationId,
          status: 'draft',
          items: itemsToReorder.map(item => ({
            productId: item.productId,
            sku: item.sku,
            quantityOrdered: item.reorderQuantity,
            quantityReceived: 0,
            unitCost: item.cost,
            totalCost: item.cost * item.reorderQuantity
          })),
          totalAmount: itemsToReorder.reduce((total, item) => total + (item.cost * item.reorderQuantity), 0),
          orderDate: now,
          expectedDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
        
        suggestions.push(purchaseOrder)
      }
    }
    
    return suggestions
  }

  // Analytics
  async getInventoryMetrics(locationId?: string): Promise<{
    totalValue: number
    totalItems: number
    lowStockItems: number
    outOfStockItems: number
    overstockItems: number
    turnoverRate: number
  }> {
    const inventoryItems = locationId ? 
      await this.getInventoryByLocation(locationId) :
      Array.from(this.inventory.values()).flat()
    
    const totalValue = inventoryItems.reduce((total, item) => total + (item.quantity * item.cost), 0)
    const totalItems = inventoryItems.length
    const lowStockItems = inventoryItems.filter(item => item.availableQuantity <= item.lowStockThreshold).length
    const outOfStockItems = inventoryItems.filter(item => item.availableQuantity === 0).length
    const overstockItems = inventoryItems.filter(item => item.availableQuantity > item.reorderPoint * 3).length
    
    // Simple turnover calculation - would use sales data in reality
    const turnoverRate = 4.2 // Mock value
    
    return {
      totalValue,
      totalItems,
      lowStockItems,
      outOfStockItems,
      overstockItems,
      turnoverRate
    }
  }
}

// Utility functions
export function getMovementTypeLabel(type: MovementType): string {
  const labels: Record<MovementType, string> = {
    purchase: 'Compra',
    sale: 'Venta',
    transfer: 'Transferencia',
    adjustment: 'Ajuste',
    reservation: 'Reserva',
    release: 'Liberación',
    loss: 'Pérdida',
    return: 'Devolución'
  }
  return labels[type] || type
}

export function getAlertSeverityColor(severity: 'low' | 'medium' | 'high' | 'critical'): string {
  switch (severity) {
    case 'low':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function formatStockLevel(available: number, total: number): string {
  const percentage = total > 0 ? (available / total) * 100 : 0
  
  if (percentage === 0) return 'Agotado'
  if (percentage < 20) return 'Stock Crítico'
  if (percentage < 50) return 'Stock Bajo'
  if (percentage > 150) return 'Sobrestock'
  return 'Stock Normal'
}

// Singleton service instance
let inventoryServiceInstance: AdvancedInventoryService | null = null

export function getInventoryService(): AdvancedInventoryService {
  if (!inventoryServiceInstance) {
    inventoryServiceInstance = new AdvancedInventoryService()
  }
  return inventoryServiceInstance
}