"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertTriangle,
  Clock,
  TrendingUp,
  Users,
  Eye,
  Bell,
  BellOff,
  Package,
  Zap
} from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

interface RealTimeInventoryProps {
  productId: Id<"products">
  variant?: string
  showNotifications?: boolean
  showSocialProof?: boolean
  showTrendingIndicator?: boolean
}

interface InventoryStatus {
  quantity: number
  lowStockThreshold: number
  reserved: number
  available: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'backorder'
  lastUpdated: number
}

interface SocialProof {
  viewingNow: number
  recentPurchases: number
  totalSold: number
  lastPurchaseTime: number
}

export function RealTimeInventory({
  productId,
  variant,
  showNotifications = true,
  showSocialProof = true,
  showTrendingIndicator = true
}: RealTimeInventoryProps) {
  const [email, setEmail] = useState("")
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false)
  const [previousQuantity, setPreviousQuantity] = useState<number | null>(null)

  // Real-time inventory query
  const inventory = useQuery(api.inventory.getProductInventory, { productId })
  
  // Social proof data
  const socialProof = useQuery(
    api.products.getProductSocialProof,
    showSocialProof ? { productId } : "skip"
  ) as SocialProof | null

  // Notification signup mutation
  const signUpForNotification = useMutation(api.notifications.subscribeToBackInStock)

  // Track inventory changes
  useEffect(() => {
    if (inventory && previousQuantity !== null) {
      if (inventory.quantity > previousQuantity) {
        // Stock increased - item restocked
        toast.success(`${inventory.quantity - previousQuantity} more units added to stock!`)
      } else if (inventory.quantity < previousQuantity) {
        // Stock decreased - item was purchased
        const purchased = previousQuantity - inventory.quantity
        if (purchased <= 3) { // Only show for small quantities to avoid spam
          toast.info(`${purchased} unit${purchased !== 1 ? 's' : ''} just purchased!`)
        }
      }
    }
    if (inventory) {
      setPreviousQuantity(inventory.quantity)
    }
  }, [inventory?.quantity, previousQuantity])

  const handleNotificationSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    try {
      await signUpForNotification({
        productId,
        email: email.trim(),
        variant: variant || undefined
      })
      
      setIsNotificationEnabled(true)
      setEmail("")
      toast.success("You'll be notified when this item is back in stock!")
    } catch (error) {
      toast.error("Failed to sign up for notifications")
    }
  }

  if (!inventory) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Package className="h-4 w-4 animate-pulse" />
        <span>Loading stock info...</span>
      </div>
    )
  }

  const getStatusInfo = () => {
    switch (inventory.status) {
      case 'out_of_stock':
        return {
          color: 'destructive',
          icon: AlertTriangle,
          text: 'Out of Stock',
          description: 'Currently unavailable'
        }
      case 'low_stock':
        return {
          color: 'warning',
          icon: AlertTriangle,
          text: `Only ${inventory.available} left!`,
          description: 'Limited quantity available'
        }
      case 'backorder':
        return {
          color: 'secondary',
          icon: Clock,
          text: 'Available on Backorder',
          description: 'Ships when restocked'
        }
      default:
        return {
          color: 'success',
          icon: Package,
          text: 'In Stock',
          description: `${inventory.available} available`
        }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  const isLowStock = inventory.status === 'low_stock'
  const isOutOfStock = inventory.status === 'out_of_stock'

  return (
    <div className="space-y-3">
      {/* Main Stock Status */}
      <div className="flex items-center gap-2">
        <Badge 
          variant={statusInfo.color as any}
          className="flex items-center gap-1 px-2 py-1"
        >
          <StatusIcon className="h-3 w-3" />
          {statusInfo.text}
        </Badge>
        
        {showTrendingIndicator && socialProof?.recentPurchases > 5 && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Trending
          </Badge>
        )}
      </div>

      {/* Quantity Animation */}
      <AnimatePresence mode="wait">
        {!isOutOfStock && (
          <motion.div
            key={inventory.quantity}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-sm text-muted-foreground"
          >
            {statusInfo.description}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Low Stock Warning */}
      {isLowStock && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Hurry! Limited stock remaining</span>
          </div>
          <p className="text-xs text-orange-600 dark:text-orange-300 mt-1">
            Order soon to secure your item
          </p>
        </motion.div>
      )}

      {/* Social Proof */}
      {showSocialProof && socialProof && !isOutOfStock && (
        <div className="space-y-2">
          {socialProof.viewingNow > 1 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span>{socialProof.viewingNow} people viewing this item</span>
            </div>
          )}
          
          {socialProof.recentPurchases > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>
                {socialProof.recentPurchases} purchased in the last 24 hours
              </span>
            </div>
          )}
        </div>
      )}

      {/* Out of Stock Notification Signup */}
      {isOutOfStock && showNotifications && (
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {isNotificationEnabled ? (
                  <BellOff className="h-4 w-4 text-green-600" />
                ) : (
                  <Bell className="h-4 w-4" />
                )}
                <h4 className="text-sm font-medium">
                  {isNotificationEnabled 
                    ? "You'll be notified when available" 
                    : "Get notified when back in stock"
                  }
                </h4>
              </div>
              
              {!isNotificationEnabled && (
                <form onSubmit={handleNotificationSignup} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-8"
                    required
                  />
                  <Button type="submit" size="sm">
                    Notify Me
                  </Button>
                </form>
              )}
              
              <p className="text-xs text-muted-foreground">
                {isNotificationEnabled 
                  ? "We'll email you as soon as this item is available"
                  : "Be the first to know when this item is back in stock"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Update Indicator */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span>Live inventory • Updated {new Date(inventory.lastUpdated).toLocaleTimeString()}</span>
      </div>
    </div>
  )
}