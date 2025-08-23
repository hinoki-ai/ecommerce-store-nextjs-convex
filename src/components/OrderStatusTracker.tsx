"use client"

import React, { useState, useEffect } from "react"
import {
  Clock,
  CheckCircle,
  Truck,
  Package,
  AlertCircle,
  RefreshCw,
  Bell,
  Mail,
  MessageSquare
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

interface OrderStatusUpdate {
  id: string
  orderId: string
  status: OrderStatus
  previousStatus?: OrderStatus
  timestamp: number
  description: string
  updatedBy: string
  trackingNumber?: string
  carrier?: string
  estimatedDelivery?: string
  location?: string
  notes?: string
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "confirmed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "returned"

interface OrderStatusTrackerProps {
  orderId: string
  currentStatus: OrderStatus
  statusHistory: OrderStatusUpdate[]
  onStatusUpdate?: (newStatus: OrderStatus) => void
  showNotifications?: boolean
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-gray-100 text-gray-800",
    icon: Clock,
    description: "Order received, awaiting confirmation"
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-800",
    icon: RefreshCw,
    description: "Order is being prepared"
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "Order confirmed and being prepared for shipment"
  },
  shipped: {
    label: "Shipped",
    color: "bg-orange-100 text-orange-800",
    icon: Package,
    description: "Order has been shipped"
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-purple-100 text-purple-800",
    icon: Truck,
    description: "Package is out for delivery"
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "Package has been delivered successfully"
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle,
    description: "Order has been cancelled"
  },
  refunded: {
    label: "Refunded",
    color: "bg-yellow-100 text-yellow-800",
    icon: RefreshCw,
    description: "Refund has been processed"
  },
  returned: {
    label: "Returned",
    color: "bg-gray-100 text-gray-800",
    icon: RefreshCw,
    description: "Package has been returned"
  }
}

const statusOrder: OrderStatus[] = [
  "pending",
  "processing",
  "confirmed",
  "shipped",
  "out_for_delivery",
  "delivered"
]

export function OrderStatusTracker({
  orderId,
  currentStatus,
  statusHistory,
  onStatusUpdate,
  showNotifications = true
}: OrderStatusTrackerProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  // Simulate real-time updates (in production, this would come from WebSocket or polling)
  useEffect(() => {
    if (showNotifications && notificationsEnabled) {
      // Check for status updates every 30 seconds
      const interval = setInterval(() => {
        // Simulate status update notification
        // In real implementation, this would check for actual status changes
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [showNotifications, notificationsEnabled])

  const getStatusProgress = (status: OrderStatus): number => {
    const index = statusOrder.indexOf(status)
    if (index === -1) return 0
    return ((index + 1) / statusOrder.length) * 100
  }

  const isStatusCompleted = (status: OrderStatus): boolean => {
    const currentIndex = statusOrder.indexOf(currentStatus)
    const checkIndex = statusOrder.indexOf(status)
    return checkIndex <= currentIndex
  }

  const getLatestUpdate = (status: OrderStatus): OrderStatusUpdate | null => {
    return statusHistory
      .filter(update => update.status === status)
      .sort((a, b) => b.timestamp - a.timestamp)[0] || null
  }

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (isUpdating) return

    setIsUpdating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const update: OrderStatusUpdate = {
        id: `update-${Date.now()}`,
        orderId,
        status: newStatus,
        previousStatus: currentStatus,
        timestamp: Date.now(),
        description: `Order status updated to ${statusConfig[newStatus].label}`,
        updatedBy: "system",
        trackingNumber: newStatus === "shipped" ? `TRACK${Math.random().toString(36).substr(2, 9).toUpperCase()}` : undefined,
        carrier: newStatus === "shipped" ? "USPS" : undefined,
        estimatedDelivery: newStatus === "shipped" ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString() : undefined
      }

      onStatusUpdate?.(newStatus)

      if (showNotifications) {
        toast.success(`Order status updated to ${statusConfig[newStatus].label}`)
      }

    } catch (error) {
      toast.error("Failed to update order status")
    } finally {
      setIsUpdating(false)
    }
  }

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - timestamp

    if (diff < 60000) return "Just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Current Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {React.createElement(statusConfig[currentStatus].icon, {
                className: "h-5 w-5"
              })}
              Current Status: {statusConfig[currentStatus].label}
            </div>
            <Badge className={statusConfig[currentStatus].color}>
              {statusConfig[currentStatus].label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(getStatusProgress(currentStatus))}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getStatusProgress(currentStatus)}%` }}
                />
              </div>
            </div>

            {/* Status Steps */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {statusOrder.map((status) => {
                const config = statusConfig[status]
                const isCompleted = isStatusCompleted(status)
                const isCurrent = status === currentStatus
                const update = getLatestUpdate(status)

                return (
                  <div
                    key={status}
                    className={`text-center p-3 rounded-lg border-2 ${
                      isCurrent
                        ? 'border-primary bg-primary/5'
                        : isCompleted
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        React.createElement(config.icon, { className: "h-4 w-4" })
                      )}
                    </div>
                    <div className="text-xs font-medium truncate">
                      {config.label}
                    </div>
                    {update && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(update.timestamp)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Current Status Description */}
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                {React.createElement(statusConfig[currentStatus].icon, {
                  className: "h-5 w-5 text-primary mt-0.5"
                })}
                <div>
                  <p className="font-medium">{statusConfig[currentStatus].label}</p>
                  <p className="text-sm text-muted-foreground">
                    {statusConfig[currentStatus].description}
                  </p>
                  {currentStatus === "shipped" && statusHistory.find(h => h.status === "shipped")?.trackingNumber && (
                    <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm font-medium text-blue-800">
                        Tracking: {statusHistory.find(h => h.status === "shipped")?.trackingNumber}
                      </p>
                      <p className="text-xs text-blue-600">
                        Carrier: {statusHistory.find(h => h.status === "shipped")?.carrier}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status History */}
      <Card>
        <CardHeader>
          <CardTitle>Status History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusHistory
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((update, index) => {
                const config = statusConfig[update.status]
                return (
                  <div key={update.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        config.color.replace('text-', 'bg-').replace('-800', '-100')
                      }`}>
                        {React.createElement(config.icon, {
                          className: `h-5 w-5 ${config.color}`
                        })}
                      </div>
                      {index < statusHistory.length - 1 && (
                        <div className="w-px h-8 bg-gray-200 mx-auto mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{config.label}</h4>
                        <span className="text-sm text-muted-foreground">
                          {formatTimestamp(update.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {update.description}
                      </p>
                      {update.trackingNumber && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                          <span className="font-medium">Tracking: </span>
                          {update.trackingNumber}
                          {update.carrier && <span> ({update.carrier})</span>}
                        </div>
                      )}
                      {update.location && (
                        <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                          <span className="font-medium">Location: </span>
                          {update.location}
                        </div>
                      )}
                      {update.estimatedDelivery && (
                        <div className="mt-2 p-2 bg-orange-50 rounded text-sm">
                          <span className="font-medium">Est. Delivery: </span>
                          {update.estimatedDelivery}
                        </div>
                      )}
                      {update.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <span className="font-medium">Notes: </span>
                          {update.notes}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>

      {/* Notifications Settings */}
      {showNotifications && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Status Update Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your order status changes
                  </p>
                </div>
                <Button
                  variant={notificationsEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                >
                  {notificationsEnabled ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get text message alerts
                    </p>
                  </div>
                  <Badge variant="outline">Setup Required</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Admin Order Status Update Component
interface OrderStatusUpdateProps {
  orderId: string
  currentStatus: OrderStatus
  onStatusChange: (newStatus: OrderStatus, notes?: string) => void
}

export function OrderStatusUpdate({
  orderId,
  currentStatus,
  onStatusChange
}: OrderStatusUpdateProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus)
  const [notes, setNotes] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async () => {
    if (isUpdating) return

    setIsUpdating(true)
    try {
      await onStatusChange(selectedStatus, notes)
      setNotes("")
      toast.success("Order status updated successfully")
    } catch (error) {
      toast.error("Failed to update order status")
    } finally {
      setIsUpdating(false)
    }
  }

  const availableStatuses = statusOrder.filter(status => {
    const currentIndex = statusOrder.indexOf(currentStatus)
    const statusIndex = statusOrder.indexOf(status)
    return statusIndex >= currentIndex
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Order Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            New Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            className="w-full p-2 border rounded"
          >
            {availableStatuses.map(status => (
              <option key={status} value={status}>
                {statusConfig[status].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this status update..."
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <Button
          onClick={handleUpdate}
          disabled={isUpdating || selectedStatus === currentStatus}
          className="w-full"
        >
          {isUpdating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Status"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}