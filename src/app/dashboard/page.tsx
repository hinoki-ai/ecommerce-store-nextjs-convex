'use client'

// Force dynamic rendering to prevent build-time issues with Convex
export const dynamic = 'force-dynamic'

import { useUser, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, ShoppingCart, Package, Settings, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const userRole = user?.publicMetadata?.role as string || 'customer'
  const isAdmin = ['super_admin', 'admin'].includes(userRole)
  const isPremium = ['super_admin', 'admin', 'premium'].includes(userRole)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Minimarket & Hardware Store</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={userRole === 'super_admin' ? 'destructive' : userRole === 'admin' ? 'default' : 'secondary'}>
                {userRole.replace('_', ' ').toUpperCase()}
              </Badge>
              <Button
                variant="outline"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || user?.username}!
          </h2>
          <p className="mt-2 text-gray-600">
            Here's your dashboard for managing your minimarket and hardware store.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No orders yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No products listed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <p className="text-xs text-muted-foreground">No revenue yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Type</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{userRole.replace('_', ' ')}</div>
              <p className="text-xs text-muted-foreground">
                {userRole === 'free' ? 'Upgrade for more features' : 'Full access'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Customer Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Shop
              </CardTitle>
              <CardDescription>
                Browse and purchase products from our store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/products">
                <Button className="w-full">Browse Products</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                My Orders
              </CardTitle>
              <CardDescription>
                View your order history and track shipments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/orders">
                <Button variant="outline" className="w-full">View Orders</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          {isAdmin && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    Manage Products
                  </CardTitle>
                  <CardDescription>
                    Add, edit, and manage store inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/products">
                    <Button variant="outline" className="w-full">Manage Products</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Analytics
                  </CardTitle>
                  <CardDescription>
                    View store performance and analytics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/analytics">
                    <Button variant="outline" className="w-full">View Analytics</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
                  </CardTitle>
                  <CardDescription>
                    Configure store settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/settings">
                    <Button variant="outline" className="w-full">Store Settings</Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}

          {/* Premium Features */}
          {isPremium && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Advanced Reports
                </CardTitle>
                <CardDescription>
                  Access premium analytics and reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/premium/reports">
                  <Button variant="outline" className="w-full">Advanced Reports</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* User Profile Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Your account details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{user?.fullName || user?.username}</p>
                <p className="text-sm text-gray-600">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Account Type</p>
                <Badge variant="outline" className="mt-1">
                  {userRole.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Member Since</p>
                <p className="text-sm text-gray-600 mt-1">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}