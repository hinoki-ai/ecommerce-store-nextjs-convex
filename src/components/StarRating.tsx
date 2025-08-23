"use client"

import { useState } from "react"
import { Star, ThumbsUp, Flag, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  createdAt: number
  verified: boolean
  helpful: number
  reported: boolean
}

interface StarRatingProps {
  rating: number
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  size?: "sm" | "md" | "lg"
}

export function StarRating({ rating, interactive = false, onRatingChange, size = "md" }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const starSize = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }

  const handleClick = (clickedRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(clickedRating)
    }
  }

  const handleMouseEnter = (hoveredRating: number) => {
    if (interactive) {
      setHoverRating(hoveredRating)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} ${
            star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={!interactive}
        >
          <Star className={`${starSize[size]} fill-current`} />
        </button>
      ))}
    </div>
  )
}

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
  averageRating: number
  totalReviews: number
  ratingDistribution: { [key: number]: number }
}

export function ProductReviews({
  productId,
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution
}: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    comment: ""
  })
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState("all")

  const handleSubmitReview = () => {
    // In a real implementation, this would submit to Convex
    console.log("Submitting review:", newReview)
    setShowReviewForm(false)
    setNewReview({ rating: 0, title: "", comment: "" })
  }

  const filteredReviews = reviews
    .filter(review => {
      if (filterBy === "all") return true
      return review.rating === parseInt(filterBy)
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt - a.createdAt
        case "oldest":
          return a.createdAt - b.createdAt
        case "helpful":
          return b.helpful - a.helpful
        case "rating-high":
          return b.rating - a.rating
        case "rating-low":
          return a.rating - b.rating
        default:
          return 0
      }
    })

  if (totalReviews === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to review this product
            </p>
            <Button onClick={() => setShowReviewForm(true)}>
              Write a Review
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rating Overview */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                <StarRating rating={averageRating} size="lg" />
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingDistribution[rating] || 0
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

                return (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-8">{rating} star</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <Button onClick={() => setShowReviewForm(true)}>
              Write a Review
            </Button>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border rounded px-3 py-1"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="helpful">Most Helpful</option>
                <option value="rating-high">Highest Rating</option>
                <option value="rating-low">Lowest Rating</option>
              </select>

              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="text-sm border rounded px-3 py-1"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Rating *</Label>
              <div className="mt-2">
                <StarRating
                  rating={newReview.rating}
                  interactive={true}
                  onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                  size="md"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="review-title">Review Title</Label>
              <input
                id="review-title"
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Summarize your review"
                className="w-full mt-2 px-3 py-2 border rounded"
              />
            </div>

            <div>
              <Label htmlFor="review-comment">Your Review *</Label>
              <Textarea
                id="review-comment"
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience with this product"
                rows={4}
                className="mt-2"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmitReview} disabled={!newReview.rating || !newReview.comment.trim()}>
                Submit Review
              </Button>
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.userAvatar} />
                  <AvatarFallback>
                    {review.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{review.userName}</h4>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} size="sm" />
                    {review.title && (
                      <span className="font-medium">{review.title}</span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {review.comment}
                  </p>

                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Flag className="h-3 w-3 mr-1" />
                      Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No reviews match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}