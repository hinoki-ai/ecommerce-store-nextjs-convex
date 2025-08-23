"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StarRating, StarRatingDisplay, RatingDistribution } from "@/components/StarRating"
import { ReviewForm } from "@/components/ReviewForm"
import {
  ThumbsUp,
  ThumbsDown,
  Flag,
  MessageSquare,
  Filter,
  SortAsc,
  Plus,
  Eye,
  EyeOff
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

interface ReviewListProps {
  productId: string
  showForm?: boolean
  className?: string
}

interface Review {
  _id: string
  productId: string
  userId?: string
  orderId?: string
  customerName: string
  rating: number
  title?: string
  content?: string
  isVerifiedPurchase: boolean
  isApproved: boolean
  helpfulVotes: number
  createdAt: number
  updatedAt: number
}

export function ReviewList({
  productId,
  showForm = true,
  className
}: ReviewListProps) {
  const { user } = useAuth()
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest" | "helpful">("newest")
  const [filterBy, setFilterBy] = useState<"all" | "5" | "4" | "3" | "2" | "1" | "verified">("all")
  const [showFormState, setShowFormState] = useState(false)
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set())

  // Fetch reviews and stats
  const reviews = useQuery(api.reviews.getProductReviews, {
    productId,
    limit: 50
  }) || []

  const reviewStats = useQuery(api.reviews.getProductReviewStats, {
    productId
  }) || {
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  }

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter(review => {
      if (filterBy === "all") return true
      if (filterBy === "verified") return review.isVerifiedPurchase
      return review.rating === parseInt(filterBy)
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt - a.createdAt
        case "oldest":
          return a.createdAt - b.createdAt
        case "highest":
          return b.rating - a.rating
        case "lowest":
          return a.rating - b.rating
        case "helpful":
          return b.helpfulVotes - a.helpfulVotes
        default:
          return 0
      }
    })

  const toggleReviewExpansion = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews)
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId)
    } else {
      newExpanded.add(reviewId)
    }
    setExpandedReviews(newExpanded)
  }

  const hasUserReviewed = reviews.some(review =>
    review.userId === user?.id
  )

  if (reviewStats.totalReviews === 0 && !showForm) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay reseñas aún
          </h3>
          <p className="text-gray-600">
            Sé el primero en dejar una reseña para este producto
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      {/* Review Summary */}
      {reviewStats.totalReviews > 0 && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rating Overview */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {reviewStats.averageRating.toFixed(1)}
                </div>
                <StarRatingDisplay
                  rating={reviewStats.averageRating}
                  count={reviewStats.totalReviews}
                  size="lg"
                  className="justify-center mb-4"
                />
                <p className="text-gray-600">
                  Promedio basado en {reviewStats.totalReviews} reseñas
                </p>
              </div>

              {/* Rating Distribution */}
              <div>
                <h4 className="font-semibold mb-3">Distribución de calificaciones</h4>
                <RatingDistribution
                  distribution={reviewStats.ratingDistribution}
                  total={reviewStats.totalReviews}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-gray-400" />
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Más recientes</SelectItem>
              <SelectItem value="oldest">Más antiguas</SelectItem>
              <SelectItem value="highest">Mejor calificación</SelectItem>
              <SelectItem value="lowest">Peor calificación</SelectItem>
              <SelectItem value="helpful">Más útiles</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las reseñas</SelectItem>
              <SelectItem value="5">5 estrellas</SelectItem>
              <SelectItem value="4">4 estrellas</SelectItem>
              <SelectItem value="3">3 estrellas</SelectItem>
              <SelectItem value="2">2 estrellas</SelectItem>
              <SelectItem value="1">1 estrella</SelectItem>
              <SelectItem value="verified">Compra verificada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showForm && user && !hasUserReviewed && !showFormState && (
          <Button
            onClick={() => setShowFormState(true)}
            className="ml-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Escribir reseña
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showForm && showFormState && (
        <div className="mb-6">
          <ReviewForm
            productId={productId}
            onSuccess={() => setShowFormState(false)}
            onCancel={() => setShowFormState(false)}
          />
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredAndSortedReviews.length > 0 ? (
          filteredAndSortedReviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              isExpanded={expandedReviews.has(review._id)}
              onToggleExpansion={() => toggleReviewExpansion(review._id)}
            />
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay reseñas con estos filtros
              </h3>
              <p className="text-gray-600">
                Intenta cambiar los filtros para ver más reseñas
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Load More (if needed) */}
      {filteredAndSortedReviews.length >= 20 && (
        <div className="text-center mt-6">
          <Button variant="outline">
            Cargar más reseñas
          </Button>
        </div>
      )}
    </div>
  )
}

// Individual Review Card Component
interface ReviewCardProps {
  review: Review
  isExpanded: boolean
  onToggleExpansion: () => void
}

function ReviewCard({ review, isExpanded, onToggleExpansion }: ReviewCardProps) {
  const { user } = useAuth()
  const [helpfulVotes, setHelpfulVotes] = useState(review.helpfulVotes)
  const [userVote, setUserVote] = useState<'helpful' | 'not-helpful' | null>(null)

  const handleHelpfulVote = (type: 'helpful' | 'not-helpful') => {
    if (userVote === type) {
      // Remove vote
      setHelpfulVotes(prev => prev - 1)
      setUserVote(null)
    } else {
      // Add or change vote
      setHelpfulVotes(prev => prev + (userVote ? 0 : 1))
      setUserVote(type)
    }
  }

  const handleReport = () => {
    toast.success("Reseña reportada. Gracias por tu feedback.")
  }

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), "dd 'de' MMMM 'de' yyyy", { locale: es })
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="w-12 h-12">
            <AvatarFallback>
              {review.customerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900">
                  {review.customerName}
                </h4>
                {review.isVerifiedPurchase && (
                  <Badge variant="secondary" className="text-xs">
                    Compra verificada
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <StarRating value={review.rating} readonly size="sm" />
                <span className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </div>

            {/* Title */}
            {review.title && (
              <h5 className="font-medium text-gray-900 mb-2">
                {review.title}
              </h5>
            )}

            {/* Content */}
            <div className="text-gray-700 mb-4">
              {review.content && review.content.length > 300 && !isExpanded ? (
                <>
                  <p className="line-clamp-3">
                    {review.content}
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={onToggleExpansion}
                    className="p-0 h-auto font-normal"
                  >
                    Leer más
                  </Button>
                </>
              ) : (
                <p>{review.content}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Helpful votes */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHelpfulVote('helpful')}
                    className={`h-8 px-2 ${
                      userVote === 'helpful' ? 'text-green-600' : ''
                    }`}
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Útil ({helpfulVotes})
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHelpfulVote('not-helpful')}
                    className={`h-8 px-2 ${
                      userVote === 'not-helpful' ? 'text-red-600' : ''
                    }`}
                  >
                    <ThumbsDown className="h-3 w-3 mr-1" />
                    No útil
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReport}
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}