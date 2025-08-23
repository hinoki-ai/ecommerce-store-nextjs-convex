"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  ShoppingBag,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatPrice } from "@/lib/utils"

// Mock data for demonstration
const mockOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    status: "pending",
    total: 299.99,
    items: 3,
    date: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    paymentStatus: "paid"
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    status: "processing",
    total: 149.50,
    items: 2,
    date: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    paymentStatus: "paid"
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    email: "bob@example.com",
    status: "shipped",
    total: 499.99,
    items: 1,
    date: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    paymentStatus: "paid"
  },
  {
    id: "ORD-004",
    customer: "Alice Brown",
    email: "alice@example.com",
    status: "delivered",
    total: 79.99,
    items: 4,
    date: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    paymentStatus: "paid"
  },
  {
    id: "ORD-005",
    customer: "Charlie Wilson",
    email: "charlie@example.com",
    status: "cancelled",
    total: 199.99,
    items: 2,
    date: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    paymentStatus: "refunded"
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />
    case "processing":
      return <RefreshCw className="h-4 w-4" />
    case "shipped":
      return <Truck className="h-4 w-4" />
    case "delivered":
      return <CheckCircle className="h-4 w-4" />
    case "cancelled":
      return <XCircle className="h-4 w-4" />
    default:
      return <ShoppingBag className="h-4 w-4" />
  }
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "pending":
      return "secondary"
    case "processing":
      return "default"
    case "shipped":
      return "default"
    case "delivered":
      return "default"
    case "cancelled":
      return "destructive"
    default:
      return "outline"
  }
}

const getPaymentStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "paid":
      return "default"
    case "pending":
      return "secondary"
    case "failed":
      return "destructive"
    case "refunded":
      return "outline"
    default:
      return "outline"
  }
}

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Filter and sort orders
  const filteredOrders = mockOrders.filter((order) => {
    // Search filter
    if (searchQuery && !(
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())
    )) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false
    }

    return true
  })

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.date - a.date
      case "oldest":
        return a.date - b.date
      case "total-high":
        return b.total - a.total
      case "total-low":
        return a.total - b.total
      default:
        return 0
    }
  })

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const totalRevenue = mockOrders
    .filter(order => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0)

  const ordersByStatus = mockOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Orders</h2>
          <p className="text-gray-600">Manage customer orders and fulfillment</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{mockOrders.length}</div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {mockOrders.filter(o => o.status === "pending").length}
            </div>
            <p className="text-sm text-muted-foreground">Pending Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {Math.round((mockOrders.filter(o => o.status === "delivered").length / mockOrders.length) * 100)}%
            </div>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(ordersByStatus).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground capitalize">{status}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="total-high">Total: High to Low</SelectItem>
                  <SelectItem value="total-low">Total: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium">{order.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(order.date)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-muted-foreground">{order.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium">{order.items} items</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium">{formatPrice(order.total)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(order.date)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Truck className="h-4 w-4 mr-2" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download Invoice
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search or filters" : "No orders have been placed yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Implementation Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">ℹ️</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Implementation Note</h3>
              <p className="text-blue-800 text-sm">
                This is a demonstration interface showing how the order management system would work.
                To fully implement this feature, you would need to:
              </p>
              <ul className="text-blue-800 text-sm mt-2 space-y-1">
                <li>• Create an orders table in Convex schema</li>
                <li>• Implement order creation during checkout</li>
                <li>• Add payment processing integration</li>
                <li>• Set up order status tracking and notifications</li>
                <li>• Implement order fulfillment workflows</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}