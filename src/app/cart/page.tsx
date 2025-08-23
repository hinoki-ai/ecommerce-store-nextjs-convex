"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Shield,
  Truck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/hooks/useCart"
import { useLanguage } from "@/components/LanguageProvider"
import { toast } from "sonner"

export default function CartPage() {
  const {
    cart,
    isLoading,
    removeFromCart,
    updateCartItemQuantity,
    clearCart
  } = useCart()
  const { t } = useLanguage()
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return

    const itemId = `${productId}`
    setUpdatingItems(prev => new Set(prev).add(itemId))

    try {
      await updateCartItemQuantity(productId as any, newQuantity)
      if (newQuantity === 0) {
        toast.success(t('cart.itemRemoved'))
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast.error(t('cart.failedToUpdate'))
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId as any)
      toast.success(t('cart.itemRemoved'))
    } catch (error) {
      console.error("Error removing item:", error)
      toast.error(t('cart.failedToRemove'))
    }
  }

  const handleClearCart = async () => {
    if (!cart?.items.length) return

    try {
      await clearCart()
      toast.success(t('cart.cartCleared'))
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast.error(t('cart.failedToClear'))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-2xl">{t('cart.loading')}</div>
          </div>
        </div>
      </div>
    )
  }

  if (!cart || !cart.items.length) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">{t('cart.empty')}</h1>
            <p className="text-muted-foreground text-lg mb-8">
              {t('cart.emptyMessage')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/products">
                  {t('cart.emptyAction')}
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/collections">
                  {t('nav.collections')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('cart.continueShopping')}
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{t('cart.title')}</h1>
              <p className="text-muted-foreground">
                {cart.items.length} {cart.items.length !== 1 ? t('cart.items') : t('cart.item')} {t('cart.inCart')}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleClearCart}>
            {t('cart.clearCart')}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              if (!item.product) return null

              const itemId = `${item.productId}`
              const isUpdating = updatingItems.has(itemId)
              const itemTotal = item.price * item.quantity

              return (
                <Card key={item.productId}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                          {item.product.images?.[0] ? (
                            <Image
                              src={item.product.images[0].url}
                              alt={item.product.images[0].alt || item.product.name}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gray-200">
                              <span className="text-xs text-gray-400">{t('cart.noImage')}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="font-semibold text-lg hover:text-primary transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {t('cart.sku')}: {item.productId.slice(-8)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="font-semibold">
                              {formatPrice(item.price)}
                            </span>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                disabled={isUpdating || item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-12 text-center font-medium">
                                {isUpdating ? "..." : item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                disabled={isUpdating}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold">
                              {formatPrice(itemTotal)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-sm text-muted-foreground">
                                {formatPrice(item.price)} {t('cart.each')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('cart.orderSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')} ({cart.items.length} {cart.items.length !== 1 ? t('cart.items') : t('cart.item')})</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>{t('cart.tax')}</span>
                  <span>{formatPrice(cart.tax)}</span>
                </div>

                <div className="flex justify-between">
                  <span>{t('cart.shipping')}</span>
                  <span className="text-green-600">{t('cart.free')}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>{t('cart.total')}</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>

                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {t('cart.checkout')}
                  </Link>
                </Button>

                <div className="text-center">
                  <Link
                    href="/products"
                    className="text-sm text-primary hover:underline"
                  >
                    {t('cart.continueShopping')}
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">{t('cart.whyShopWithUs')}</h3>

                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">{t('cart.securePayment')}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('cart.sslEncryption')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">{t('cart.freeShipping')}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('cart.freeShippingDesc')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      ✓
                    </Badge>
                    <div>
                      <div className="font-medium">{t('cart.easyReturns')}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('cart.easyReturnsDesc')}
                      </div>
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