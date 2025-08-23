"use client"

import { useQuery } from "convex/react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Calendar
} from "lucide-react"
import { api } from "@/convex/_generated/api"
import { formatPrice } from "@/lib/utils"

export default function AdminDashboard() {
  // Fetch dashboard data
  const products = useQuery(api.products.getProducts, { limit: 1000 }) || []
  const users = useQuery(api.users.getAllUsers, {}) || []
  const categories = useQuery(api.categories.getCategories, {}) || []

  // Calculate metrics
  const totalProducts = products.length
  const activeProducts = products.filter((p: typeof products[0]) => p.isActive).length
  const totalUsers = users.length
  const adminUsers = users.filter((u: typeof users[0]) => u.role === "admin").length
  const customerUsers = users.filter((u: typeof users[0]) => u.role === "customer").length

  // Mock data for orders and revenue (since orders table might not exist yet)
  const totalOrders = 0
  const totalRevenue = 0
  const recentOrders = []

  const dashboardCards = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      icon: Package,
      description: `${activeProducts} active`,
      trend: totalProducts > 0 ? "up" : "neutral",
      color: "text-blue-600"
    },
    {
      title: "Total Users",
      value: totalUsers.toString(),
      icon: Users,
      description: `${customerUsers} customers, ${adminUsers} admins`,
      trend: totalUsers > 0 ? "up" : "neutral",
      color: "text-green-600"
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      description: "This month",
      trend: totalOrders > 0 ? "up" : "neutral",
      color: "text-purple-600"
    },
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      description: "This month",
      trend: totalRevenue > 0 ? "up" : "neutral",
      color: "text-yellow-600"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-gray-600">Welcome to your admin panel</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{card.description}</span>
                {card.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                {card.trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 5).map((product: typeof products[0]) => (
                <div key={product._id} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {product.seoScore && (
                      <Badge variant="outline">
                        SEO: {product.seoScore}%
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No products found
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.slice(0, 5).map((user: typeof users[0]) => (
                <div key={user._id} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email || "No email"}
                    </p>
                  </div>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </div>
              ))}
              {users.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No users found
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium">System Status</p>
              <p className="text-xs text-green-600">Operational</p>
            </div>
            <div className="text-center">
              <Eye className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Categories</p>
              <p className="text-xs text-muted-foreground">{categories.length} total</p>
            </div>
            <div className="text-center">
              <Package className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Product Health</p>
              <p className="text-xs text-muted-foreground">
                {totalProducts > 0 ? Math.round((activeProducts / totalProducts) * 100) : 0}% active
              </p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-sm font-medium">User Growth</p>
              <p className="text-xs text-muted-foreground">{totalUsers} registered</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/products/new"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium">Add Product</span>
            </Link>
            <Link
              href="/admin/categories/new"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-sm font-medium">Add Category</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-8 w-8 text-purple-500 mb-2" />
              <span className="text-sm font-medium">Manage Users</span>
            </Link>
            <Link
              href="/admin/analytics"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="h-8 w-8 text-orange-500 mb-2" />
              <span className="text-sm font-medium">View Analytics</span>
            </Link>
            <Link
              href="/admin/calendario"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-8 w-8 text-indigo-500 mb-2" />
              <span className="text-sm font-medium">Manage Calendar</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}