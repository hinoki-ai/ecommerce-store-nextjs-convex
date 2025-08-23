"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarRatingInput } from "@/components/StarRating"
import { Send, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface ReviewFormProps {
  productId: string
  orderId?: string
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

interface ReviewFormData {
  rating: number
  title: string
  content: string
}

export function ReviewForm({
  productId,
  orderId,
  onSuccess,
  onCancel,
  className
}: ReviewFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 5,
    title: "",
    content: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const createReview = useMutation(api.reviews.createReview)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "La calificación debe estar entre 1 y 5 estrellas"
    }

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido"
    } else if (formData.title.length < 3) {
      newErrors.title = "El título debe tener al menos 3 caracteres"
    }

    if (!formData.content.trim()) {
      newErrors.content = "El comentario es requerido"
    } else if (formData.content.length < 10) {
      newErrors.content = "El comentario debe tener al menos 10 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("Debes iniciar sesión para dejar una reseña")
      return
    }

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await createReview({
        productId,
        userId: user.id,
        orderId,
        customerName: user.fullName || user.username || "Usuario",
        rating: formData.rating,
        title: formData.title.trim(),
        content: formData.content.trim()
      })

      toast.success("¡Reseña enviada exitosamente!")
      setFormData({ rating: 5, title: "", content: "" })
      onSuccess?.()
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("Error al enviar la reseña. Inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (
    field: keyof ReviewFormData,
    value: string | number
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Escribir una Reseña
        </CardTitle>
        <p className="text-sm text-gray-600">
          Comparte tu experiencia con este producto. Tu opinión es importante para otros compradores.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <StarRatingInput
            value={formData.rating}
            onChange={(rating) => handleInputChange("rating", rating)}
            required
            error={errors.rating}
          />

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Resumen de tu reseña..."
              maxLength={100}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.title.length}/100 caracteres
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Comentario <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Comparte tu experiencia con este producto..."
              rows={4}
              maxLength={1000}
              className={errors.content ? "border-red-500" : ""}
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.content.length}/1000 caracteres
            </p>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              📝 Consejos para una buena reseña
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Sé específico sobre lo que te gustó o no del producto</li>
              <li>• Menciona la calidad, durabilidad y valor</li>
              <li>• Comparte cómo el producto se desempeñó en uso real</li>
              <li>• Mantén un tono respetuoso y constructivo</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Publicar Reseña
                </>
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}