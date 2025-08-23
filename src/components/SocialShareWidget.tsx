"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Share2, 
  Heart, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Twitter, 
  MessageSquare, 
  Send,
  Copy,
  Check,
  ExternalLink,
  TrendingUp
} from "lucide-react"
import { getSocialMediaService } from "@/lib/social"
import SocialShareButtons from "@/components/SocialShareButtons"
import { toast } from "sonner"

interface SocialShareWidgetProps {
  productId: string
  productName: string
  productDescription: string
  productImage?: string
  price?: string
  discount?: string
  className?: string
  showAnalytics?: boolean
}

// Enhanced widget that combines sharing with social proof
export function SocialShareWidget({
  productId,
  productName,
  productDescription,
  productImage,
  price,
  discount,
  className = "",
  showAnalytics = false
}: SocialShareWidgetProps) {
  const [socialMediaService] = useState(() => getSocialMediaService())
  const [shareAnalytics, setShareAnalytics] = useState<any>(null)
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false)

  const loadShareAnalytics = async () => {
    if (!showAnalytics) return
    
    setIsLoadingAnalytics(true)
    try {
      const analytics = await socialMediaService.getShareAnalytics(productId)
      setShareAnalytics(analytics)
    } catch (error) {
      console.error('Failed to load share analytics:', error)
    } finally {
      setIsLoadingAnalytics(false)
    }
  }

  const generateSocialPost = async (platform: string) => {
    try {
      const shareableContent = socialMediaService.generateShareableContent(productId, platform)
      
      const postText = shareableContent.text
      const hashtags = shareableContent.hashtags.map(tag => `#${tag}`).join(' ')
      const fullContent = `${postText}\n\n${hashtags}\n\n${shareableContent.url}`

      return fullContent
    } catch (error) {
      console.error('Failed to generate social post:', error)
      return `¡Mira este increíble producto! ${productName} ${shareableContent?.url || ''}`
    }
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Share2 className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Compartir Producto</h3>
          </div>
          {showAnalytics && shareAnalytics && (
            <Badge variant="secondary">
              <TrendingUp className="h-3 w-3 mr-1" />
              {shareAnalytics.totalShares} shares
            </Badge>
          )}
        </div>

        {/* Main Share Buttons */}
        <SocialShareButtons
          entityId={productId}
          entityType="product"
          title={productName}
          description={productDescription}
          imageUrl={productImage}
          price={price}
          discount={discount}
          variant="compact"
          className="mb-4"
        />

        {/* Social Proof & Analytics */}
        {showAnalytics && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Actividad Social</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadShareAnalytics}
                disabled={isLoadingAnalytics}
              >
                {isLoadingAnalytics ? 'Cargando...' : 'Actualizar'}
              </Button>
            </div>

            {shareAnalytics ? (
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-bold text-blue-600">{shareAnalytics.totalShares}</div>
                  <div className="text-muted-foreground">Shares</div>
                </div>
                <div>
                  <div className="font-bold text-green-600">{shareAnalytics.totalClicks}</div>
                  <div className="text-muted-foreground">Clics</div>
                </div>
                <div>
                  <div className="font-bold text-purple-600">{shareAnalytics.totalConversions}</div>
                  <div className="text-muted-foreground">Ventas</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  Carga las analíticas para ver el rendimiento social
                </p>
              </div>
            )}
          </div>
        )}

        {/* Advanced Social Features */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mt-4">
              <ExternalLink className="h-4 w-4 mr-2" />
              Opciones Avanzadas
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Compartir en Redes Sociales</DialogTitle>
              <DialogDescription>
                Opciones adicionales para compartir este producto
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Platform-specific post generators */}
              <div className="space-y-2">
                <h4 className="font-medium">Generar Post Personalizado</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => generateSocialPost('instagram')}
                    className="flex items-center space-x-2"
                  >
                    <Instagram className="h-4 w-4" />
                    <span>Instagram</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => generateSocialPost('facebook')}
                    className="flex items-center space-x-2"
                  >
                    <Facebook className="h-4 w-4" />
                    <span>Facebook</span>
                  </Button>
                </div>
              </div>

              {/* Quick Copy Options */}
              <div className="space-y-2">
                <h4 className="font-medium">Copiar Rápido</h4>
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const url = `${window.location.origin}/products/${productId}`
                      navigator.clipboard.writeText(url)
                      toast.success('URL copiada al portapapeles')
                    }}
                    className="flex items-center space-x-2"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copiar Enlace</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const shareText = `¡Mira este increíble producto! ${productName} - ${productDescription}`
                      navigator.clipboard.writeText(shareText)
                      toast.success('Texto copiado al portapapeles')
                    }}
                    className="flex items-center space-x-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Copiar Descripción</span>
                  </Button>
                </div>
              </div>

              {/* Social Proof */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Compartido recientemente:</span>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="font-medium">34 veces hoy</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

// Minimal inline version for product cards
export function SocialShareMini({
  productId,
  productName,
  className = ""
}: {
  productId: string
  productName: string
  className?: string
}) {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <SocialShareButtons
        entityId={productId}
        entityType="product"
        title={productName}
        description={`Descubre ${productName} en nuestra tienda`}
        variant="floating"
      />
    </div>
  )
}