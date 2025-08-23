"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarContent, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Share2,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Repeat2,
  Eye,
  BarChart3,
  Calendar,
  Settings,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Play,
  Pause,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Image,
  Video,
  Camera,
  ThumbsUp,
  Award,
  Target,
  Zap,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  MessageSquare
} from "lucide-react"
import {
  SocialPost,
  SocialPlatform,
  UGCContent,
  SocialAnalytics,
  SOCIAL_PLATFORMS,
  getSocialMediaService,
  formatEngagement,
  getPostStatusColor,
  getPostStatusText
} from "@/lib/social"
import { useLanguage } from "@/components/LanguageProvider"
import { useCurrency } from "@/components/CurrencyProvider"
import { toast } from "sonner"

interface SocialMediaDashboardProps {
  className?: string
}

// Enhanced mock data using the existing social service types
const mockPosts: SocialPost[] = [
  {
    id: 'post-1',
    platform: 'instagram',
    postId: 'ig_123456789',
    productId: 'prod-1',
    content: '¡Nuevos audífonos premium con 30 horas de batería! 🎧 Perfectos para tu rutina diaria. #TechLife #Wireless #Premium',
    media: [
      {
        type: 'image',
        url: '/api/placeholder/1080/1080',
        alt: 'Audífonos premium wireless',
        order: 0
      }
    ],
    hashtags: ['TechLife', 'Wireless', 'Premium', 'Audio'],
    mentions: [],
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'published',
    engagement: {
      likes: 1250,
      comments: 89,
      shares: 156,
      clicks: 432,
      impressions: 12500,
      reach: 8900,
      saves: 234,
      lastUpdated: new Date()
    },
    createdBy: 'admin-1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 'post-2',
    platform: 'facebook',
    productId: 'prod-2',
    content: 'Camiseta 100% algodón orgánico. Comodidad y estilo sostenible. ¿Ya tienes la tuya?',
    media: [
      {
        type: 'image',
        url: '/api/placeholder/1200/628',
        alt: 'Camiseta de algodón orgánico',
        order: 0
      }
    ],
    hashtags: ['Sustainable', 'Organic', 'Fashion', 'EcoFriendly'],
    mentions: [],
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: 'scheduled',
    engagement: {
      likes: 0,
      comments: 0,
      shares: 0,
      clicks: 0,
      impressions: 0,
      reach: 0,
      saves: 0,
      lastUpdated: new Date()
    },
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const mockUGCContent: UGCContent[] = [
  {
    id: 'ugc-1',
    platform: 'instagram',
    contentType: 'image',
    originalUrl: 'https://instagram.com/p/abc123',
    mediaUrl: '/api/placeholder/400/400',
    caption: 'Loving my new headphones! Sound quality is amazing 🎧 @ourstore',
    author: {
      username: 'musiclover_sofia',
      displayName: 'Sofia Martinez',
      avatar: '/api/placeholder/50/50',
      verified: false,
      followers: 2500
    },
    productTags: ['prod-1'],
    hashtags: ['music', 'headphones', 'audiophile'],
    mentions: ['ourstore'],
    engagement: {
      likes: 156,
      comments: 12,
      shares: 8,
      clicks: 0,
      impressions: 850,
      reach: 720,
      saves: 23,
      lastUpdated: new Date()
    },
    isApproved: true,
    isRightsCleared: false,
    usage: {
      canUseInAds: false,
      canUseOnWebsite: true,
      canUseInEmail: true
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    discoveredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  }
]

export function SocialMediaDashboard({ className = "" }: SocialMediaDashboardProps) {
  const { t } = useLanguage()
  const { formatAmount } = useCurrency()
  const [socialMediaService] = useState(() => getSocialMediaService())
  
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(SOCIAL_PLATFORMS)
  const [posts, setPosts] = useState<SocialPost[]>(mockPosts)
  const [ugcContent, setUgcContent] = useState<UGCContent[]>(mockUGCContent)
  const [analytics, setAnalytics] = useState<Record<string, SocialAnalytics>>({})
  const [isLoading, setIsLoading] = useState(false)
  
  // New post form
  const [newPost, setNewPost] = useState({
    platform: 'instagram' as const,
    productId: '',
    content: '',
    scheduledAt: undefined as Date | undefined
  })

  const [showNewPostDialog, setShowNewPostDialog] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [platformsData, postsData] = await Promise.all([
        socialMediaService.getPlatforms(),
        socialMediaService.getPosts()
      ])
      
      setPlatforms(platformsData)
      setPosts(postsData)
      
      // Load analytics for each platform
      const analyticsData: Record<string, SocialAnalytics> = {}
      const now = new Date()
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      
      for (const platform of platformsData.filter(p => p.isActive)) {
        analyticsData[platform.id] = await socialMediaService.getPlatformAnalytics(
          platform.id, 
          monthAgo, 
          now
        )
      }
      setAnalytics(analyticsData)
      
      toast.success("Datos de redes sociales actualizados")
    } catch (error) {
      toast.error("Error al cargar los datos de redes sociales")
    } finally {
      setIsLoading(false)
    }
  }

  const createPost = async () => {
    if (!newPost.content.trim() || !newPost.productId) {
      toast.error("El contenido y producto son requeridos")
      return
    }

    try {
      const post = await socialMediaService.createPost({
        platform: newPost.platform,
        productId: newPost.productId,
        content: newPost.content,
        media: [], // Would be populated from file uploads
        hashtags: extractHashtags(newPost.content),
        mentions: extractMentions(newPost.content),
        scheduledAt: newPost.scheduledAt,
        status: newPost.scheduledAt ? 'scheduled' : 'draft',
        createdBy: 'current-user'
      })

      setPosts(prev => [post, ...prev])
      setNewPost({
        platform: 'instagram',
        productId: '',
        content: '',
        scheduledAt: undefined
      })
      setShowNewPostDialog(false)
      toast.success("Publicación creada exitosamente")
    } catch (error) {
      toast.error("Error al crear la publicación")
    }
  }

  const publishPost = async (postId: string) => {
    try {
      const published = await socialMediaService.publishPost(postId)
      if (published) {
        setPosts(prev => prev.map(p => p.id === postId ? published : p))
        toast.success("Publicación publicada exitosamente")
      }
    } catch (error) {
      toast.error("Error al publicar")
    }
  }

  const approveUGC = async (ugcId: string) => {
    try {
      const approved = await socialMediaService.approveUGC(ugcId)
      if (approved) {
        setUgcContent(prev => prev.map(c => c.id === ugcId ? approved : c))
        toast.success("Contenido aprobado")
      }
    } catch (error) {
      toast.error("Error al aprobar el contenido")
    }
  }

  const togglePlatform = async (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId)
    if (!platform) return

    try {
      const updated = await socialMediaService.updatePlatform(platformId, { 
        isActive: !platform.isActive 
      })
      if (updated) {
        setPlatforms(prev => prev.map(p => p.id === platformId ? updated : p))
        toast.success(`${platform.displayName} ${updated.isActive ? 'activado' : 'desactivado'}`)
      }
    } catch (error) {
      toast.error("Error al actualizar la plataforma")
    }
  }

  const extractHashtags = (content: string): string[] => {
    const hashtags = content.match(/#[\w]+/g)
    return hashtags ? hashtags.map(tag => tag.slice(1)) : []
  }

  const extractMentions = (content: string): string[] => {
    const mentions = content.match(/@[\w]+/g)
    return mentions ? mentions.map(mention => mention.slice(1)) : []
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />
      case 'facebook':
        return <Facebook className="h-5 w-5" />
      case 'twitter':
        return <Twitter className="h-5 w-5" />
      default:
        return <Globe className="h-5 w-5" />
    }
  }

  const activePlatforms = platforms.filter(p => p.isActive)
  const totalPosts = posts.length
  const totalEngagement = posts.reduce((sum, p) => 
    sum + p.engagement.likes + p.engagement.comments + p.engagement.shares, 0)
  const totalReach = Object.values(analytics).reduce((sum, a) => sum + a.reach.total, 0)

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">Social Media Management</h2>
          <p className="text-muted-foreground">
            Gestiona tus redes sociales y contenido generado por usuarios
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadData} disabled={isLoading} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={() => setShowNewPostDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Publicación
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Share2 className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{activePlatforms.length}</p>
                <p className="text-sm text-muted-foreground">Plataformas Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{totalPosts}</p>
                <p className="text-sm text-muted-foreground">Publicaciones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{formatEngagement(totalEngagement)}</p>
                <p className="text-sm text-muted-foreground">Engagement Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{formatEngagement(totalReach)}</p>
                <p className="text-sm text-muted-foreground">Alcance Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="posts">Publicaciones</TabsTrigger>
          <TabsTrigger value="ugc">Contenido UGC</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          <TabsTrigger value="platforms">Plataformas</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-6">
          <div className="space-y-4">
            {posts.map(post => {
              const platform = platforms.find(p => p.id === post.platform)
              const engagementRate = post.engagement.impressions > 0 ? 
                ((post.engagement.likes + post.engagement.comments + post.engagement.shares) / post.engagement.impressions) * 100 : 0

              return (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: platform?.color + '20' }}>
                          {getPlatformIcon(post.platform)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{platform?.displayName}</h3>
                            <Badge className={getPostStatusColor(post.status)}>
                              {getPostStatusText(post.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {post.publishedAt ? 
                              `Publicado: ${post.publishedAt.toLocaleDateString()}` :
                              post.scheduledAt ? 
                                `Programado: ${post.scheduledAt.toLocaleDateString()}` :
                                `Creado: ${post.createdAt.toLocaleDateString()}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {post.status === 'draft' && (
                          <Button variant="outline" size="sm" onClick={() => publishPost(post.id)}>
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <p className="text-sm mb-2">{post.content}</p>
                      {post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.hashtags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Media Preview */}
                    {post.media.length > 0 && (
                      <div className="flex space-x-2 mb-4">
                        {post.media.map(media => (
                          <div key={media.order} className="relative">
                            <img 
                              src={media.url} 
                              alt={media.alt}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            {media.type === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Play className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Engagement Stats */}
                    {post.status === 'published' && (
                      <div className="grid grid-cols-6 gap-4 text-center text-sm">
                        <div>
                          <div className="font-bold text-red-600">{formatEngagement(post.engagement.likes)}</div>
                          <div className="text-muted-foreground">Likes</div>
                        </div>
                        <div>
                          <div className="font-bold text-blue-600">{formatEngagement(post.engagement.comments)}</div>
                          <div className="text-muted-foreground">Comentarios</div>
                        </div>
                        <div>
                          <div className="font-bold text-green-600">{formatEngagement(post.engagement.shares)}</div>
                          <div className="text-muted-foreground">Shares</div>
                        </div>
                        <div>
                          <div className="font-bold text-purple-600">{formatEngagement(post.engagement.reach)}</div>
                          <div className="text-muted-foreground">Alcance</div>
                        </div>
                        <div>
                          <div className="font-bold text-orange-600">{formatEngagement(post.engagement.clicks)}</div>
                          <div className="text-muted-foreground">Clics</div>
                        </div>
                        <div>
                          <div className="font-bold text-teal-600">{engagementRate.toFixed(1)}%</div>
                          <div className="text-muted-foreground">Engagement</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}

            {posts.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold">No hay publicaciones</h3>
                  <p className="text-muted-foreground">Crea tu primera publicación para comenzar</p>
                  <Button className="mt-4" onClick={() => setShowNewPostDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Publicación
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* UGC Tab */}
        <TabsContent value="ugc" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ugcContent.map(content => (
              <Card key={content.id}>
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img 
                      src={content.mediaUrl} 
                      alt={content.caption}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Badge 
                      className={`absolute top-2 right-2 ${
                        content.isApproved ? 'bg-green-600' : 'bg-yellow-600'
                      }`}
                    >
                      {content.isApproved ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                      {content.isApproved ? 'Aprobado' : 'Pendiente'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={content.author.avatar} />
                      <AvatarContent>{content.author.displayName.charAt(0)}</AvatarContent>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{content.author.displayName}</p>
                      <p className="text-xs text-muted-foreground">
                        @{content.author.username} • {formatEngagement(content.author.followers)} seguidores
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3">{content.caption}</p>
                  
                  <div className="flex justify-between text-xs text-muted-foreground mb-4">
                    <span>{formatEngagement(content.engagement.likes)} likes</span>
                    <span>{formatEngagement(content.engagement.comments)} comentarios</span>
                    <span>{content.discoveredAt.toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    {!content.isApproved && (
                      <Button 
                        size="sm" 
                        onClick={() => approveUGC(content.id)}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aprobar
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Ver Original
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {ugcContent.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold">No hay contenido UGC</h3>
                <p className="text-muted-foreground">El contenido generado por usuarios aparecerá aquí</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(analytics).map(([platformId, platformAnalytics]) => {
              const platform = platforms.find(p => p.id === platformId)
              if (!platform) return null

              return (
                <Card key={platformId}>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      {getPlatformIcon(platformId)}
                      <CardTitle>{platform.displayName}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatEngagement(platformAnalytics.followers.count)}
                        </div>
                        <div className="text-sm text-muted-foreground">Seguidores</div>
                        <div className="text-xs text-green-600">
                          +{platformAnalytics.followers.growth} ({platformAnalytics.followers.growthRate}%)
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {platformAnalytics.engagement.rate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Engagement Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatEngagement(platformAnalytics.reach.total)}
                        </div>
                        <div className="text-sm text-muted-foreground">Alcance Total</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {formatAmount(platformAnalytics.traffic.revenue)}
                        </div>
                        <div className="text-sm text-muted-foreground">Ingresos</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map(platform => (
              <Card key={platform.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{platform.icon}</div>
                      <div>
                        <h3 className="font-semibold">{platform.displayName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {platform.features.length} funciones disponibles
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={platform.isActive}
                      onCheckedChange={() => togglePlatform(platform.id)}
                    />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {platform.features.map(feature => (
                      <div key={feature} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm capitalize">{feature.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>
                Ajustes globales para la gestión de redes sociales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Auto-aprobación de UGC</Label>
                  <p className="text-sm text-muted-foreground">
                    Aprobar automáticamente contenido de usuarios verificados
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Publicación automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Publicar contenido programado automáticamente
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Respuestas automáticas</Label>
                  <p className="text-sm text-muted-foreground">
                    Responder automáticamente a mensajes frecuentes
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Post Dialog */}
      <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nueva Publicación</DialogTitle>
            <DialogDescription>
              Crea contenido para tus redes sociales
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Plataforma</Label>
                <Select
                  value={newPost.platform}
                  onValueChange={(value) => setNewPost(prev => ({ ...prev, platform: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activePlatforms.map(platform => (
                      <SelectItem key={platform.id} value={platform.id}>
                        {platform.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Producto</Label>
                <Input
                  value={newPost.productId}
                  onChange={(e) => setNewPost(prev => ({ ...prev, productId: e.target.value }))}
                  placeholder="ID del producto"
                />
              </div>
            </div>

            <div>
              <Label>Contenido</Label>
              <Textarea
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Escribe el contenido de tu publicación..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Usa # para hashtags y @ para menciones
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewPostDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={createPost}>
                Crear Publicación
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}