"use client"

import { useEffect } from "react"
import Link from "next/link"
import {
  CheckCircle,
  Package,
  Truck,
  Download,
  Mail,
  Home,
  UserPlus,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@clerk/nextjs"
import { SignUpButton } from "@clerk/nextjs"

export default function OrderSuccessPage() {
  const { clearCart } = useCart()
  const { isSignedIn } = useAuth()

  // Clear the cart when the success page loads
  useEffect(() => {
    clearCart()
  }, [clearCart])

  // In a real implementation, you'd get the order ID from URL params or context
  const orderNumber = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-xl text-muted-foreground mb-2">
            Thank you for your purchase
          </p>
          <p className="text-lg">
            Your order has been successfully placed and is being processed.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Order Number:</span>
                <Badge variant="outline" className="font-mono">
                  {orderNumber}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Order Date:</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Order Status:</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Processing
                </Badge>
              </div>

              <Separator />

              {/* Guest Sign-up Prompt */}
              {!isSignedIn && (
                <div className="bg-primary/5 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <UserPlus className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-primary mb-1">Create an Account</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Track your orders, save shipping info, and get faster checkout next time!
                      </p>
                      <SignUpButton mode="modal">
                        <Button size="sm" className="w-full">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Sign Up Now
                        </Button>
                      </SignUpButton>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">What&apos;s Next?</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Order Confirmation</p>
                      <p className="text-xs text-muted-foreground">
                        You&apos;ll receive an email confirmation shortly
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-orange-600">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Processing</p>
                      <p className="text-xs text-muted-foreground">
                        We&apos;re preparing your order for shipment
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-green-600">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Shipped</p>
                      <p className="text-xs text-muted-foreground">
                        You&apos;ll get tracking info when your order ships
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                      <Search className="h-3 w-3 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Track Your Order</p>
                      <p className="text-xs text-muted-foreground">
                        Use your order number to track delivery status
                      </p>
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <Link href={`/track?order=${orderNumber}&email=user@example.com`}>
                          Track Now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Support */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-sm mb-1">Estimated Delivery</p>
                  <p className="text-2xl font-bold text-green-600">
                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })} - {new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Free shipping on orders over $50
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="font-medium text-sm mb-2">Shipping Address</p>
                  <div className="text-sm text-muted-foreground">
                    <p>John Doe</p>
                    <p>123 Main Street</p>
                    <p>Apt 4B</p>
                    <p>New York, NY 10001</p>
                    <p>United States</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Email Support</p>
                    <p className="text-xs text-muted-foreground">
                      support@yourstore.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Order Tracking</p>
                    <p className="text-xs text-muted-foreground">
                      Use your order number to track
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Order History</p>
                    <p className="text-xs text-muted-foreground">
                      View all your past orders
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">What would you like to do next?</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild>
                    <Link href="/products">
                      <Package className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Link>
                  </Button>

                  <Button variant="outline" asChild>
                    <Link href="/orders">
                      <Download className="h-4 w-4 mr-2" />
                      View Order History
                    </Link>
                  </Button>

                  <Button variant="outline" asChild>
                    <Link href="/">
                      <Home className="h-4 w-4 mr-2" />
                      Go to Homepage
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="font-semibold mb-3">Important Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">📧 Email Confirmation</h4>
                <p className="text-muted-foreground">
                  Check your email for order confirmation and receipt. Add our email to your contacts to ensure delivery.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">📦 Order Tracking</h4>
                <p className="text-muted-foreground">
                  You&apos;ll receive tracking information via email once your order ships. Track your package on our website.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">🔄 Returns & Exchanges</h4>
                <p className="text-muted-foreground">
                  Not satisfied? Return items within 30 days for a full refund. See our return policy for details.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">🛡️ Purchase Protection</h4>
                <p className="text-muted-foreground">
                  Your purchase is protected by our satisfaction guarantee. Shop with confidence!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}