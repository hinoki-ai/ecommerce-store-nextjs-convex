"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Clock, Gift, ShoppingCart, Mail, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/hooks/useCart"
import { useAdvancedCart } from "@/hooks/useAdvancedCart"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface CartAbandonmentRecoveryProps {
  isEnabled?: boolean
  showAfterMinutes?: number
  discountPercentage?: number
  urgencyThreshold?: number
}

export function CartAbandonmentRecovery({
  isEnabled = true,
  showAfterMinutes = 15,
  discountPercentage = 15,
  urgencyThreshold = 30
}: CartAbandonmentRecoveryProps) {
  const [showRecovery, setShowRecovery] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(urgencyThreshold * 60) // seconds
  const [hasEmailCapture, setHasEmailCapture] = useState(false)
  
  const { cart, cartCount } = useCart()
  const { cartAge, hasAbandonedCart, recoverAbandonedCart } = useAdvancedCart()

  // Show recovery popup after specified time
  useEffect(() => {
    if (!isEnabled || cartCount === 0) return

    const timer = setTimeout(() => {
      if (cartCount > 0) {
        setShowRecovery(true)
        
        // Track abandonment event
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'cart_abandonment', {
            event_category: 'ecommerce',
            value: cart?.total || 0,
            items: cartCount,
            abandonment_time: showAfterMinutes
          })
        }
      }
    }, showAfterMinutes * 60 * 1000)

    return () => clearTimeout(timer)
  }, [isEnabled, cartCount, showAfterMinutes, cart?.total])

  // Urgency countdown timer
  useEffect(() => {
    if (!showRecovery) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [showRecovery])

  // Check for returning abandoned cart user
  useEffect(() => {
    if (hasAbandonedCart && cartCount > 0) {
      setShowRecovery(true)
      recoverAbandonedCart()
    }
  }, [hasAbandonedCart, cartCount, recoverAbandonedCart])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    
    try {
      // Save cart and send abandonment recovery email
      const cartData = {
        email: email.trim(),
        cartId: cart?._id,
        items: cart?.items || [],
        total: cart?.total || 0,
        discountPercentage,
        timestamp: Date.now()
      }

      // In a real implementation, this would call your abandonment recovery API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setHasEmailCapture(true)
      toast.success(`We'll save your cart and send you a special ${discountPercentage}% discount!`)
      
      // Track email capture
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'email_capture', {
          event_category: 'cart_recovery',
          method: 'abandonment',
          value: cart?.total || 0
        })
      }
      
      // Auto-close after success
      setTimeout(() => {
        setShowRecovery(false)
      }, 3000)
      
    } catch (error) {
      toast.error("Failed to save your cart. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContinueShopping = () => {
    setShowRecovery(false)
    
    // Track conversion
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cart_recovery_converted', {
        event_category: 'ecommerce',
        action: 'continue_shopping'
      })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const calculateSavings = () => {
    const cartTotal = cart?.total || 0
    return (cartTotal * discountPercentage) / 100
  }

  if (!cart || cartCount === 0) return null

  return (
    <AnimatePresence>
      {showRecovery && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />
          
          {/* Recovery Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-md mx-4 relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 z-10"
                onClick={() => setShowRecovery(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <CardHeader className="text-center pb-4">
                {hasEmailCapture ? (
                  <>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl text-green-700">Cart Saved!</CardTitle>
                    <p className="text-muted-foreground">
                      Check your email for a special discount code
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl">Don&apos;t Lose Your Cart!</CardTitle>
                    <p className="text-muted-foreground">
                      Your {cartCount} item{cartCount !== 1 ? 's' : ''} are waiting for you
                    </p>
                  </>
                )}
              </CardHeader>
              
              <CardContent className="space-y-6">
                {!hasEmailCapture && (
                  <>
                    {/* Cart Summary */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">Cart Total</span>
                        <span className="font-bold text-lg">{formatPrice(cart.total)}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {cart.items.slice(0, 2).map((item) => (
                          <div key={item.productId} className="flex items-center gap-3">
                            {item.product?.images?.[0] && (
                              <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.product.images[0].url}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {item.product?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Qty: {item.quantity} • {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {cart.items.length > 2 && (
                          <p className="text-xs text-muted-foreground text-center">
                            +{cart.items.length - 2} more item{cart.items.length - 2 !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Special Offer */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-lg p-4 border border-red-200 dark:border-red-800">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Gift className="h-5 w-5 text-red-600" />
                        <span className="font-bold text-lg text-red-700 dark:text-red-300">
                          Limited Time: {discountPercentage}% OFF
                        </span>
                      </div>
                      <p className="text-center text-sm text-red-600 dark:text-red-400">
                        Save {formatPrice(calculateSavings())} on your order
                      </p>
                      
                      {timeLeft > 0 && (
                        <div className="mt-3 text-center">
                          <Badge variant="destructive" className="animate-pulse">
                            <Clock className="h-3 w-3 mr-1" />
                            Expires in {formatTime(timeLeft)}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="recovery-email" className="text-sm font-medium">
                          Save your cart & get {discountPercentage}% off:
                        </label>
                        <Input
                          id="recovery-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Percent className="h-4 w-4 mr-2" />
                            Save Cart & Get {discountPercentage}% Off
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="text-center">
                      <Button 
                        variant="ghost" 
                        onClick={handleContinueShopping}
                        className="text-sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        No thanks, continue shopping
                      </Button>
                    </div>
                  </>
                )}

                {hasEmailCapture && (
                  <div className="text-center space-y-4">
                    <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        ✅ Your cart has been saved<br/>
                        📧 Discount code sent to {email}<br/>
                        ⏰ Valid for 24 hours
                      </p>
                    </div>
                    
                    <Button onClick={handleContinueShopping} className="w-full">
                      Continue Shopping
                    </Button>
                  </div>
                )}

                {/* Trust indicators */}
                <div className="text-center text-xs text-muted-foreground space-y-1">
                  <p>🔒 Your information is secure</p>
                  <p>📧 No spam, unsubscribe anytime</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}