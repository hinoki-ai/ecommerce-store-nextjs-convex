"use client"

import { useState, useEffect } from "react"
import { X, ShoppingCart, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/hooks/useCart"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface ExitIntentPopupProps {
  isEnabled?: boolean
  discountPercentage?: number
  minimumCartValue?: number
}

export function ExitIntentPopup({ 
  isEnabled = true, 
  discountPercentage = 10,
  minimumCartValue = 50 
}: ExitIntentPopupProps) {
  const [showPopup, setShowPopup] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const { cart, cartCount } = useCart()

  useEffect(() => {
    if (!isEnabled || hasTriggered || cartCount === 0) return

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from top of viewport
      if (e.clientY <= 0 && !hasTriggered) {
        setShowPopup(true)
        setHasTriggered(true)
        
        // Track exit intent event
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'exit_intent', {
            event_category: 'engagement',
            value: cart?.total || 0,
            items: cartCount
          })
        }
      }
    }

    // Add small delay to prevent immediate triggering
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, 3000) // 3 second delay

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isEnabled, hasTriggered, cartCount, cart?.total])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    
    try {
      // Here you would typically save the email and send abandonment recovery email
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(`Special ${discountPercentage}% discount sent to ${email}!`)
      
      // Track email capture
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'email_capture', {
          event_category: 'lead_generation',
          method: 'exit_intent'
        })
      }
      
      setShowPopup(false)
    } catch (error) {
      toast.error("Failed to send discount. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContinueShopping = () => {
    setShowPopup(false)
    
    // Track conversion
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exit_intent_converted', {
        event_category: 'engagement',
        action: 'continue_shopping'
      })
    }
  }

  if (!cart || cartCount === 0) return null

  return (
    <AnimatePresence>
      {showPopup && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            onClick={() => setShowPopup(false)}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-md mx-4 relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 z-10"
                onClick={() => setShowPopup(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Wait! Don&apos;t Leave Empty-Handed</CardTitle>
                <p className="text-muted-foreground">
                  You have {cartCount} item{cartCount !== 1 ? 's' : ''} worth {formatPrice(cart.total)} in your cart
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Special Offer */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Percent className="h-5 w-5 text-primary" />
                    <span className="font-bold text-lg">{discountPercentage}% OFF</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Special discount on your current cart items
                  </p>
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="exit-email" className="text-sm font-medium">
                      Get your discount code:
                    </label>
                    <Input
                      id="exit-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending...
                      </>
                    ) : (
                      `Get ${discountPercentage}% Discount`
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <Button 
                    variant="ghost" 
                    onClick={handleContinueShopping}
                    className="text-sm"
                  >
                    No thanks, continue shopping
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="text-center text-xs text-muted-foreground">
                  <p>✅ No spam, unsubscribe anytime</p>
                  <p>🔒 Your email is safe with us</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}