"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Mail,
  AlertTriangle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatPrice } from "@/lib/utils"
import { OrderStatusUpdate, type OrderStatus } from "./OrderStatusTracker"
import { toast } from "sonner"

interface Order {
  _id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  status: OrderStatus
  total: number
  itemCount: number
  createdAt: number
  updatedAt: number
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  items: Array<{
    name: string
    quantity: number
    price: number
    sku: string
  }>
}

interface AdminOrderManagerProps {
  onOrderUpdate?: (orderId: string, newStatus: OrderStatus) => void
  onOrderView?: (orderId: string) => void
}

export function AdminOrderManager({
  onOrderUpdate,
  onOrderView
}: AdminOrderManagerProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  // Mock orders data
  useState(() => {
    const mockOrders: Order[] = [
      {
        _id: "1",
        orderNumber: "ORD-001",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        status: "processing",
        total: 299.99,
        itemCount: 3,
        createdAt: Date.now() - 86400000 * 2,
        updatedAt: Date.now() - 86400000,
        shippingAddress: {
          firstName: "John",
          lastName: "Doe",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001"
        },
        items: [
          { name: "Wireless Headphones", quantity: 1, price: 199.99, sku: "WH-001" },
          { name: "Phone Case", quantity: 2, price: 49.99, sku: "PC-002" }
        ]
      },
      {
        _id: "2",
        orderNumber: "ORD-002",
        customerName: "Jane Smith",
        customerEmail: "jane@example.com",
        status: "shipped",
        total: 149.99,
        itemCount: 2,
        createdAt: Date.now() - 86400000 * 5,
        updatedAt: Date.now() - 86400000 * 3,
        shippingAddress: {
          firstName: "Jane",
          lastName: "Smith",
          address: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90210"
        },
        items: [
          { name: "Bluetooth Speaker", quantity: 1, price: 89.99, sku: "BS-003" },
          { name: "Charging Cable", quantity: 1, price: 19.99, sku: "CC-004" }
        ]
      },
      {
        _id: "3",
        orderNumber: "ORD-003",
        customerName: "Bob Johnson",
        customerEmail: "bob@example.com",
        status: "delivered",
        total: 79.99,
        itemCount: 1,
        createdAt: Date.now() - 86400000 * 10,
        updatedAt: Date.now() - 86400000 * 7,
        shippingAddress: {
          firstName: "Bob",
          lastName: "Johnson",
          address: "789 Pine St",
          city: "Chicago",
          state: "IL",
          zipCode: "60601"
        },
        items: [
          { name: "USB Cable", quantity: 1, price: 79.99, sku: "USB-005" }
        ]
      }
    ]

    setTimeout(() => {
      setOrders(mockOrders)
      setIsLoading(false)
    }, 1000)
  })

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      pending: "bg-gray-100 text-gray-800",
      processing: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      shipped: "bg-orange-100 text-orange-800",
      out_for_delivery: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-yellow-100 text-yellow-800",
      returned: "bg-gray-100 text-gray-800"
    }

    return (
      <Badge className={statusConfig[status]}>
        {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    )
  }

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Update local state
      setOrders(prev => prev.map(order =>
        order._id === orderId
          ? { ...order, status: newStatus, updatedAt: Date.now() }
          : order
      ))

      onOrderUpdate?.(orderId, newStatus)
      toast.success(`Order ${orders.find(o => o._id === orderId)?.orderNumber} status updated to ${newStatus}`)

    } catch (error) {
      toast.error("Failed to update order status")
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      pending: 0,
      processing: 0,
      confirmed: 0,
      shipped: 0,
      out_for_delivery: 0,
      delivered: 0,
      cancelled: 0,
      refunded: 0,
      returned: 0
    }

    orders.forEach(order => {
      counts[order.status]++
    })

    return counts
  }

  const statusCounts = getStatusCounts()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading orders...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">
            Manage orders, update status, and track fulfillment
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status} className={status === statusFilter ? "ring-2 ring-primary" : ""}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-muted-foreground capitalize">
                {status === "all" ? "Total" : status.replace(/_/g, ' ')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders by number, customer, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | "all")}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.orderNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {order._id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.customerEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {updatingOrderId === order._id ? (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Updating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getStatusBadge(order.status)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.itemCount} items</div>
                        <div className="text-sm text-muted-foreground">
                          {order.items[0]?.name}
                          {order.itemCount > 1 && ` +${order.itemCount - 1} more`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatPrice(order.total)}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onOrderView?.(order._id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Contact Customer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, "processing")}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Mark Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, "confirmed")}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirm Order
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, "shipped")}>
                            <Truck className="h-4 w-4 mr-2" />
                            Mark Shipped
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, "delivered")}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Delivered
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleStatusUpdate(order._id, "cancelled")}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Quick Status Update Component
interface QuickStatusUpdateProps {
  orderId: string
  currentStatus: OrderStatus
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void
}

export function QuickStatusUpdate({
  orderId,
  currentStatus,
  onStatusUpdate
}: QuickStatusUpdateProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuickUpdate = async (newStatus: OrderStatus) => {
    setIsUpdating(true)
    try {
      await onStatusUpdate(orderId, newStatus)
    } finally {
      setIsUpdating(false)
    }
  }

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      pending: "processing",
      processing: "confirmed",
      confirmed: "shipped",
      shipped: "out_for_delivery",
      out_for_delivery: "delivered",
      delivered: null,
      cancelled: null,
      refunded: null,
      returned: null
    }
    return statusFlow[current]
  }

  const nextStatus = getNextStatus(currentStatus)

  if (!nextStatus || isUpdating) {
    return (
      <Button variant="outline" size="sm" disabled>
        {isUpdating ? (
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <CheckCircle className="h-4 w-4 mr-2" />
        )}
        {isUpdating ? "Updating..." : "Complete"}
      </Button>
    )
  }

  const statusLabels = {
    processing: "Start Processing",
    confirmed: "Confirm Order",
    shipped: "Mark Shipped",
    out_for_delivery: "Out for Delivery",
    delivered: "Mark Delivered"
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => handleQuickUpdate(nextStatus)}
      disabled={isUpdating}
    >
      {statusLabels[nextStatus]}
    </Button>
  )
}