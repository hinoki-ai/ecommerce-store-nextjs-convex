"use client"

// Force dynamic rendering to prevent build-time issues with Convex
export const dynamic = 'force-dynamic'

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "convex/react"
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Mail,
  Search,
  AlertCircle,
  Calendar,
  DollarSign,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

import { formatPrice } from "@/lib/utils"
import { api } from "@/convex/_generated/api"
import { OrderStatusTracker, type OrderStatus } from "@/components/OrderStatusTracker"

interface OrderTracking {
  _id: string
  orderNumber: string
  status: "processing" | "shipped" | "delivered" | "cancelled"
  statusHistory: Array<{
    status: string
    timestamp: number
    description: string
  }>
  estimatedDelivery?: string
  trackingNumber?: string
  carrier?: string
  currentLocation?: string
  total: number
  items: Array<{
    name: string
    quantity: number
    price: number
    image?: string
  }>
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  customerEmail?: string
  createdAt: number
}

const mockOrderTracking: OrderTracking = {
  _id: "1",
  orderNumber: "ORD-001",
  status: "shipped",
  statusHistory: [
    {
      status: "processing",
      timestamp: Date.now() - 86400000 * 3,
      description: "Order received and payment confirmed"
    },
    {
      status: "processing",
      timestamp: Date.now() - 86400000 * 2,
      description: "Order being prepared for shipment"
    },
    {
      status: "shipped",
      timestamp: Date.now() - 86400000 * 1,
      description: "Order shipped via USPS Priority Mail"
    }
  ],
  estimatedDelivery: new Date(Date.now() + 86400000 * 2).toLocaleDateString(),
  trackingNumber: "9400111899223344556677",
  carrier: "USPS",
  currentLocation: "In Transit - New York, NY",
  total: 299.99,
  items: [
    {
      name: "Premium Wireless Headphones",
      quantity: 1,
      price: 199.99,
      image: "/api/placeholder/100/100"
    },
    {
      name: "Bluetooth Speaker",
      quantity: 1,
      price: 99.99,
      image: "/api/placeholder/100/100"
    }
  ],
  shippingAddress: {
    firstName: "John",
    lastName: "Doe",
    address: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "US"
  },
  customerEmail: "john@example.com",
  createdAt: Date.now() - 86400000 * 3
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "processing":
      return <Clock className="h-5 w-5 text-blue-600" />
    case "shipped":
      return <Truck className="h-5 w-5 text-orange-600" />
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case "cancelled":
      return <AlertCircle className="h-5 w-5 text-red-600" />
    default:
      return <Package className="h-5 w-5 text-gray-600" />
  }
}

const getStatusBadge = (status: string) => {
  const variants = {
    processing: "default",
    shipped: "secondary",
    delivered: "default",
    cancelled: "destructive"
  } as const

  const colors = {
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-orange-100 text-orange-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800"
  }

  return (
    <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

const getStatusStep = (currentStatus: string, stepStatus: string): "completed" | "current" | "pending" => {
  const statusOrder = ["processing", "shipped", "delivered"]
  const currentIndex = statusOrder.indexOf(currentStatus)
  const stepIndex = statusOrder.indexOf(stepStatus)

  if (stepIndex < currentIndex) return "completed"
  if (stepIndex === currentIndex) return "current"
  return "pending"
}

export default function TrackOrderPage() {

  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || "")
  const [email, setEmail] = useState(searchParams.get('email') || "")
  const [isTracking, setIsTracking] = useState(false)
  const [trackedOrder, setTrackedOrder] = useState<OrderTracking | null>(null)
  const [error, setError] = useState("")



  const handleTrackOrder = async () => {
    if (!orderNumber.trim() || !email.trim()) {
      setError("Please enter both order number and email")
      return
    }

    setIsTracking(true)
    setError("")

    try {
      // Simulate API call - in real implementation, this would query the database
      await new Promise(resolve => setTimeout(resolve, 1000))

      // For demo purposes, show mock data if order number is valid
      if (orderNumber.toUpperCase() === "ORD-001" || orderNumber.toUpperCase() === "ORD-002") {
        setTrackedOrder(mockOrderTracking)
      } else {
        setError("Order not found. Please check your order number and email.")
      }
    } catch {
      setError("Unable to track order. Please try again later.")
    } finally {
      setIsTracking(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTrackOrder()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Track Your Order</h1>
          <p className="text-xl text-muted-foreground">
            Enter your order number and email to track your package
          </p>
        </div>

        {/* Tracking Form */}
        {!trackedOrder && (
          <Card className="max-w-2xl mx-auto mb-12">
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Order Number *</Label>
                <Input
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  placeholder="ORD-001"
                  onKeyPress={handleKeyPress}
                />
                <p className="text-xs text-muted-foreground">
                  Found on your order confirmation email
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  onKeyPress={handleKeyPress}
                />
                <p className="text-xs text-muted-foreground">
                  Email used to place the order
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleTrackOrder}
                disabled={isTracking}
                className="w-full"
                size="lg"
              >
                {isTracking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Tracking Order...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Track Order
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Order Tracking Results */}
        {trackedOrder && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Order Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(trackedOrder.status)}
                      Order {trackedOrder.orderNumber}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      Order placed on {new Date(trackedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(trackedOrder.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Estimated Delivery</span>
                    </div>
                    <p className="text-lg font-semibold text-primary">
                      {trackedOrder.estimatedDelivery}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total Amount</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatPrice(trackedOrder.total)}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Current Location</span>
                    </div>
                    <p className="text-lg font-semibold text-primary">
                      {trackedOrder.currentLocation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Status Tracker */}
            <OrderStatusTracker
              orderId={trackedOrder._id}
              currentStatus={trackedOrder.status as OrderStatus}
              statusHistory={trackedOrder.statusHistory.map((history, index) => ({
                id: `history-${index}`,
                orderId: trackedOrder._id,
                status: history.status as OrderStatus,
                timestamp: history.timestamp,
                description: history.description,
                updatedBy: "system",
                trackingNumber: history.status === "shipped" ? trackedOrder.trackingNumber : undefined,
                carrier: history.status === "shipped" ? trackedOrder.carrier : undefined,
                estimatedDelivery: history.status === "shipped" ? trackedOrder.estimatedDelivery : undefined,
                location: trackedOrder.currentLocation
              }))}
              showNotifications={true}
            />

            {/* Legacy Tracking Progress (keeping for reference) */}
            <Card style={{ display: 'none' }}>
              <CardHeader>
                <CardTitle>Order Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between">
                    {["processing", "shipped", "delivered"].map((stepStatus, index) => {
                      const stepState = getStatusStep(trackedOrder.status, stepStatus)
                      const isLast = index === 2

                      return (
                        <div key={stepStatus} className="flex items-center">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                            stepState === "completed"
                              ? "bg-primary border-primary text-primary-foreground"
                              : stepState === "current"
                                ? "border-primary text-primary"
                                : "border-muted-foreground text-muted-foreground"
                          }`}>
                            {stepState === "completed" ? (
                              <CheckCircle className="h-6 w-6" />
                            ) : (
                              getStatusIcon(stepStatus)
                            )}
                          </div>
                          <div className="ml-3">
                            <p className={`text-sm font-medium ${
                              stepState === "current" ? "text-foreground" : "text-muted-foreground"
                            }`}>
                              {stepStatus.charAt(0).toUpperCase() + stepStatus.slice(1)}
                            </p>
                          </div>
                          {!isLast && (
                            <div className={`w-16 h-0.5 mx-4 ${
                              stepState === "completed" ? "bg-primary" : "bg-muted-foreground"
                            }`} />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Tracking Details */}
                  {trackedOrder.trackingNumber && (
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-muted-foreground">Carrier</p>
                          <p className="font-semibold">{trackedOrder.carrier}</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">Tracking Number</p>
                          <p className="font-semibold font-mono">{trackedOrder.trackingNumber}</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">Current Status</p>
                          <p className="font-semibold">{trackedOrder.currentLocation}</p>
                        </div>
                      </div>
                    </div>
                  )}
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
                  {trackedOrder.statusHistory.map((historyItem, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(historyItem.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            {historyItem.status.charAt(0).toUpperCase() + historyItem.status.slice(1)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(historyItem.timestamp).toLocaleDateString()} at{" "}
                            {new Date(historyItem.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {historyItem.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gray-200">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Delivery Address
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{trackedOrder.shippingAddress.firstName} {trackedOrder.shippingAddress.lastName}</p>
                      <p>{trackedOrder.shippingAddress.address}</p>
                      <p>{trackedOrder.shippingAddress.city}, {trackedOrder.shippingAddress.state} {trackedOrder.shippingAddress.zipCode}</p>
                      <p>{trackedOrder.shippingAddress.country}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Contact Information
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {trackedOrder.customerEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => setTrackedOrder(null)}>
                Track Another Order
              </Button>
              <Button asChild>
                <a
                  href={`mailto:support@yourstore.com?subject=Order ${trackedOrder.orderNumber} Inquiry`}
                  className="inline-flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Contact Support
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}