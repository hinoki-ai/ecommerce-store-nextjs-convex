"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import Link from "next/link"
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { QuickCancelButton } from "@/components/OrderCancellation"
import { api } from "@/convex/_generated/api"

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case "shipped":
      return <Truck className="h-5 w-5 text-blue-600" />
    case "processing":
      return <Clock className="h-5 w-5 text-orange-600" />
    case "cancelled":
      return <XCircle className="h-5 w-5 text-red-600" />
    default:
      return <Package className="h-5 w-5 text-gray-600" />
  }
}

const getStatusBadge = (status: string) => {
  const variants = {
    delivered: "default",
    shipped: "secondary",
    processing: "secondary",
    cancelled: "destructive",
    pending: "outline"
  } as const

  return (
    <Badge variant={variants[status as keyof typeof variants] || "outline"} className="capitalize">
      {status}
    </Badge>
  )
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderNumber = params.orderNumber as string

  // Fetch order details from Convex
  const order = useQuery(
    api.orders.getOrderByNumber,
    orderNumber ? { orderNumber } : "skip"
  )

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Package className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground text-lg mb-8">
              We couldn't find an order with number: {orderNumber}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/orders">View All Orders</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
            <p className="text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(order.status)}
                      <span className="font-medium capitalize">{order.status}</span>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Order Actions */}
                <div className="flex gap-2 mt-4">
                  {order.status === "processing" && (
                    <QuickCancelButton
                      orderId={order._id}
                      orderNumber={order.orderNumber}
                      orderStatus={order.status}
                      orderTotal={order.totalAmount}
                      canCancel={true}
                      onCancelSuccess={() => router.refresh()}
                    />
                  )}
                  {order.status === "shipped" && order.trackingNumber && (
                    <Button variant="outline" size="sm">
                      <Truck className="h-4 w-4 mr-2" />
                      Track Package
                    </Button>
                  )}
                  {order.status === "delivered" && (
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Return Item
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm">
                          Quantity: {item.quantity}
                        </span>
                        <span className="font-medium">
                          {formatPrice(item.unitPrice)} × {item.quantity} = {formatPrice(item.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="font-medium">{order.customerInfo.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  {order.shippingAddress.additionalInfo && (
                    <p>{order.shippingAddress.additionalInfo}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.customerInfo.phone && (
                    <p className="mt-2">
                      <span className="font-medium">Phone: </span>
                      {order.customerInfo.phone}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(order.taxAmount)}</span>
                  </div>
                  {order.shippingCost > 0 && (
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{formatPrice(order.shippingCost)}</span>
                    </div>
                  )}
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(order.discountAmount)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium capitalize">
                    {order.paymentMethod || "Credit Card"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"}>
                    {order.paymentStatus}
                  </Badge>
                </div>
                {order.paymentIntentId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction ID</p>
                    <p className="font-mono text-xs">{order.paymentIntentId}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Shipping Method</p>
                  <p className="font-medium capitalize">
                    {order.shippingMethod || "Standard Shipping"}
                  </p>
                </div>
                {order.trackingNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                    <p className="font-mono text-sm">{order.trackingNumber}</p>
                  </div>
                )}
                {order.estimatedDeliveryDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-medium">
                      {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}