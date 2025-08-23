"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { useAuth } from "@clerk/nextjs"
import Link from "next/link"
import {
  Package,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  RefreshCw,
  Calendar,
  DollarSign,
  ShoppingBag
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { QuickCancelButton } from "@/components/OrderCancellation"
import { api } from "@/convex/_generated/api"



const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "shipped":
      return <Truck className="h-4 w-4 text-blue-600" />
    case "processing":
      return <Clock className="h-4 w-4 text-orange-600" />
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <Package className="h-4 w-4 text-gray-600" />
  }
}

const getStatusBadge = (status: string) => {
  const variants = {
    delivered: "default",
    shipped: "secondary",
    processing: "outline",
    cancelled: "destructive"
  } as const

  return (
    <Badge variant={variants[status as keyof typeof variants] || "outline"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export default function OrdersPage() {
  const { userId, isSignedIn } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Fetch user orders from Convex
  const orders = useQuery(
    api.orders.getUserOrders,
    isSignedIn && userId ? { userId } : "skip"
  ) || []

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt - a.createdAt
        case "oldest":
          return a.createdAt - b.createdAt
        case "amount-high":
          return b.totalAmount - a.totalAmount
        case "amount-low":
          return a.totalAmount - b.totalAmount
        default:
          return 0
      }
    })

  const getOrderStats = () => {
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const deliveredOrders = orders.filter(order => order.status === "delivered").length

    return { totalOrders, totalSpent, deliveredOrders }
  }

  const stats = getOrderStats()

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Package className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Order History</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Please sign in to view your order history
            </p>
            <Button asChild size="lg">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Order History</h1>
          <p className="text-muted-foreground">
            Track your orders and view past purchases
          </p>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatPrice(stats.totalSpent)}</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.deliveredOrders}</p>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders by order number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="amount-high">Amount (High to Low)</SelectItem>
                    <SelectItem value="amount-low">Amount (Low to High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CardTitle className="text-lg">
                        Order #{order.orderNumber}
                      </CardTitle>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/orders/${order._id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Info */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <div className="font-semibold text-foreground">
                        {formatPrice(order.totalAmount)}
                      </div>
                    </div>

                    <Separator />

                    {/* Order Items Preview */}
                    <div className="space-y-2">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name}</span>
                          <span className="text-muted-foreground">
                            {item.quantity}x {formatPrice(item.unitPrice)}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm text-muted-foreground">
                          +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>

                    {/* Order Actions */}
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="text-sm font-medium capitalize">
                          {order.status}
                        </span>
                      </div>

                      <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/orders/${order.orderNumber}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      {order.status === "processing" && (
                        <QuickCancelButton
                          orderId={order._id}
                          orderNumber={order.orderNumber}
                          orderStatus={order.status}
                          orderTotal={order.totalAmount}
                          canCancel={true}
                          onCancelSuccess={() => {
                            // Refresh the orders list
                            window.location.reload()
                          }}
                        />
                      )}
                      {order.status === "shipped" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/track?order=${order.orderNumber}&email=${encodeURIComponent("user@example.com")}`}>
                            <Truck className="h-4 w-4 mr-2" />
                            Track Package
                          </Link>
                        </Button>
                      )}
                      {order.status === "delivered" && (
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Return Item
                        </Button>
                      )}
                    </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't placed any orders yet"
                }
              </p>
              <Button asChild>
                <Link href="/products">
                  Start Shopping
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}