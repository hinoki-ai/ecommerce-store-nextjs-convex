"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import Link from "next/link"
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Check,
  MapPin,
  User,
  Phone,
  Mail,
  Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/hooks/useCart"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@clerk/nextjs"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { toast } from "sonner"

interface CheckoutFormData {
  // Shipping Information
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  apartment: string
  city: string
  state: string
  zipCode: string
  country: string

  // Payment Information
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string

  // Additional Options
  saveAddress: boolean
  savePayment: boolean
  marketingEmails: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const { userId, isSignedIn } = useAuth()
  const { cart, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isGuestCheckout, setIsGuestCheckout] = useState(!isSignedIn)

  // Convex mutations
  const createOrderFromCart = useMutation(api.orders.createOrderFromCart)
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    saveAddress: false,
    savePayment: false,
    marketingEmails: false
  })

  // Fetch user data if logged in
  const user = useQuery(
    api.users.getUser,
    userId ? { userId } : "skip"
  )

  // Redirect if cart is empty
  useEffect(() => {
    if (cart && cart.items.length === 0) {
      router.push('/cart')
    }
  }, [cart, router])

  // Auto-fill user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || ""
      }))
    }
  }, [user])

  const handleInputChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Shipping Information
        return !!(
          formData.firstName.trim() &&
          formData.lastName.trim() &&
          formData.email.trim() &&
          formData.phone.trim() &&
          formData.address.trim() &&
          formData.city.trim() &&
          formData.state.trim() &&
          formData.zipCode.trim()
        )
      case 2: // Payment Information
        return !!(
          formData.cardNumber.replace(/\s/g, '').length >= 16 &&
          formData.expiryDate.length >= 5 &&
          formData.cvv.length >= 3 &&
          formData.cardholderName.trim()
        )
      default:
        return true
    }
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    } else {
      toast.error("Please fill in all required fields")
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setIsProcessing(true)

    try {
      // Create order from cart using Convex mutation
      const orderData = {
        cartId: cart._id,
        customerInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone || undefined
        },
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          region: formData.state,
          postalCode: formData.zipCode,
          country: formData.country,
          additionalInfo: formData.apartment || undefined
        },
        billingAddress: {
          street: formData.address,
          city: formData.city,
          region: formData.state,
          postalCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: "card",
        shippingMethod: "standard",
        userId: userId || undefined
      }

      // Create order using Convex mutation
      const order = await createOrderFromCart(orderData)

      // Clear the cart after successful order
      await clearCart()

      // Redirect to success page with order details
      router.push(`/checkout/success?order=${order.orderNumber}`)

      toast.success("Order placed successfully!")

    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some items to your cart before checking out
            </p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const steps = [
    { id: 1, name: "Shipping", icon: Truck },
    { id: 2, name: "Payment", icon: CreditCard },
    { id: 3, name: "Review", icon: Check }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Checkout</h1>
              <p className="text-muted-foreground">
                Complete your order
              </p>
            </div>
          </div>
        </div>

        {/* Account Options */}
        {!isSignedIn && (
          <div className="max-w-2xl mx-auto mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold">Checkout Options</h3>
                  <p className="text-muted-foreground">
                    Choose how you'd like to complete your purchase
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      !isGuestCheckout ? 'border-primary bg-primary/5' : 'border-muted-foreground'
                    }`} onClick={() => setIsGuestCheckout(false)}>
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="font-medium">Sign In</h4>
                        <p className="text-sm text-muted-foreground">
                          Access your saved information and track orders
                        </p>
                        <SignInButton mode="modal">
                          <Button variant={!isGuestCheckout ? "default" : "outline"} className="w-full">
                            Sign In
                          </Button>
                        </SignInButton>
                      </div>
                    </div>

                    <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      isGuestCheckout ? 'border-primary bg-primary/5' : 'border-muted-foreground'
                    }`} onClick={() => setIsGuestCheckout(true)}>
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <ShoppingBag className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="font-medium">Guest Checkout</h4>
                        <p className="text-sm text-muted-foreground">
                          Quick checkout without creating an account
                        </p>
                        <Button
                          variant={isGuestCheckout ? "default" : "outline"}
                          onClick={() => setIsGuestCheckout(true)}
                          className="w-full"
                        >
                          Continue as Guest
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account? <SignUpButton mode="modal" className="text-primary hover:underline">Create one</SignUpButton> for a faster experience next time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2
                    ${isCompleted
                      ? 'bg-primary border-primary text-primary-foreground'
                      : isActive
                        ? 'border-primary text-primary'
                        : 'border-muted-foreground text-muted-foreground'
                    }
                  `}>
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-primary' : 'bg-muted-foreground'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isSignedIn && (
                    <div className="bg-muted/30 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Checking out as {user?.firstName || 'User'}</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
                    />
                    {isGuestCheckout && (
                      <p className="text-xs text-muted-foreground">
                        We'll send order updates to this email
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                    <Input
                      id="apartment"
                      value={formData.apartment}
                      onChange={(e) => handleInputChange("apartment", e.target.value)}
                      placeholder="Apt 4B"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="New York"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="NY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {isSignedIn && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="saveAddress"
                        checked={formData.saveAddress}
                        onCheckedChange={(checked) => handleInputChange("saveAddress", !!checked)}
                      />
                      <Label htmlFor="saveAddress" className="text-sm">
                        Save this address for future orders
                      </Label>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/30 rounded-lg p-4 flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Secure Payment</h4>
                      <p className="text-xs text-muted-foreground">
                        Your payment information is encrypted and secure
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                    <Input
                      id="cardholderName"
                      value={formData.cardholderName}
                      onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  {isSignedIn && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="savePayment"
                        checked={formData.savePayment}
                        onCheckedChange={(checked) => handleInputChange("savePayment", !!checked)}
                      />
                      <Label htmlFor="savePayment" className="text-sm">
                        Save this payment method for future orders
                      </Label>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Review Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping Address Review */}
                  <div>
                    <h4 className="font-medium mb-3">Shipping Address</h4>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                      <p>{formData.address}</p>
                      {formData.apartment && <p>{formData.apartment}</p>}
                      <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                      <p>{formData.email}</p>
                      <p>{formData.phone}</p>
                    </div>
                  </div>

                  {/* Payment Review */}
                  <div>
                    <h4 className="font-medium mb-3">Payment Method</h4>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p className="font-medium">•••• •••• •••• {formData.cardNumber.slice(-4)}</p>
                          <p className="text-sm text-muted-foreground">{formData.cardholderName}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {cart.items.map((item) => (
                        <div key={item.productId} className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.product?.images?.[0] ? (
                              <img
                                src={item.product.images[0].url}
                                alt={item.product.images[0].alt || item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full bg-gray-200">
                                <span className="text-xs text-gray-400">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.product?.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="marketingEmails"
                      checked={formData.marketingEmails}
                      onCheckedChange={(checked) => handleInputChange("marketingEmails", !!checked)}
                    />
                    <Label htmlFor="marketingEmails" className="text-sm">
                      Send me promotional emails and updates
                    </Label>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span>{item.product?.name} × {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(cart.tax)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="space-y-3">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevStep} className="w-full">
                  Previous Step
                </Button>
              )}

              {currentStep < 3 ? (
                <Button onClick={handleNextStep} className="w-full">
                  Continue to {currentStep === 1 ? 'Payment' : 'Review'}
                </Button>
              ) : (
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Place Order - {formatPrice(cart.total)}
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Trust Indicators */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Why shop with us?</h3>

                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-green-600" />
                    <div className="text-xs">
                      <div className="font-medium">Secure Payment</div>
                      <div className="text-muted-foreground">SSL Protected</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <div className="text-xs">
                      <div className="font-medium">Free Shipping</div>
                      <div className="text-muted-foreground">On orders over $50</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs">
                      ✓
                    </Badge>
                    <div className="text-xs">
                      <div className="font-medium">Easy Returns</div>
                      <div className="text-muted-foreground">30-day policy</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}