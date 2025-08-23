"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Palette, Ruler } from "lucide-react"

interface ProductVariantsProps {
  productId: string
  onVariantChange?: (variants: Record<string, string>) => void
}

interface Variant {
  _id: string
  productId: string
  name: string
  type: "select" | "radio" | "checkbox"
  options: Array<{
    value: string
    label: string
    priceAdjustment?: number
    imageUrl?: string
    stockQuantity?: number
    sku?: string
  }>
  required: boolean
  sortOrder: number
  isActive: boolean
}

export function ProductVariants({ productId, onVariantChange }: ProductVariantsProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({})

  const variants = useQuery(api.productVariants.getProductVariants, { productId }) || []

  const handleVariantChange = (variantId: string, value: string, variantName: string) => {
    const newSelectedVariants = { ...selectedVariants, [variantId]: value }
    setSelectedVariants(newSelectedVariants)
    onVariantChange?.(newSelectedVariants)
  }

  const handleCheckboxChange = (variantId: string, value: string, checked: boolean) => {
    const currentOptions = selectedOptions[variantId] || []
    let newOptions: string[]

    if (checked) {
      newOptions = [...currentOptions, value]
    } else {
      newOptions = currentOptions.filter(opt => opt !== value)
    }

    const newSelectedOptions = { ...selectedOptions, [variantId]: newOptions }
    setSelectedOptions(newSelectedOptions)
    // For checkbox variants, we can pass the selected options as a comma-separated string
    onVariantChange?.({ [variantId]: newOptions.join(",") })
  }

  const getVariantIcon = (variantName: string) => {
    const name = variantName.toLowerCase()
    if (name.includes("color") || name.includes("colour")) {
      return <Palette className="h-4 w-4" />
    }
    if (name.includes("size") || name.includes("talla")) {
      return <Ruler className="h-4 w-4" />
    }
    return null
  }

  const getVariantDisplay = (variant: Variant) => {
    const isColorVariant = variant.name.toLowerCase().includes("color") ||
                          variant.name.toLowerCase().includes("colour")

    switch (variant.type) {
      case "select":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {getVariantIcon(variant.name)}
              <label className="font-medium">
                {variant.name}
                {variant.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>

            {isColorVariant ? (
              <div className="flex flex-wrap gap-2">
                {variant.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleVariantChange(variant._id, option.value, variant.name)}
                    className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                      selectedVariants[variant._id] === option.value
                        ? 'border-blue-500 scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{
                      backgroundColor: option.value,
                      backgroundImage: option.imageUrl ? `url(${option.imageUrl})` : undefined,
                      backgroundSize: 'cover'
                    }}
                    title={option.label}
                  >
                    {selectedVariants[variant._id] === option.value && (
                      <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-lg" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {variant.options.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedVariants[variant._id] === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVariantChange(variant._id, option.value, variant.name)}
                    className="justify-start"
                  >
                    {option.label}
                    {option.priceAdjustment && option.priceAdjustment > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        +${option.priceAdjustment}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )

      case "radio":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {getVariantIcon(variant.name)}
              <label className="font-medium">
                {variant.name}
                {variant.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>

            <div className="space-y-2">
              {variant.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={variant._id}
                    value={option.value}
                    checked={selectedVariants[variant._id] === option.value}
                    onChange={() => handleVariantChange(variant._id, option.value, variant.name)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="flex-1">{option.label}</span>
                  {option.priceAdjustment && option.priceAdjustment > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      +${option.priceAdjustment}
                    </Badge>
                  )}
                  {option.stockQuantity !== undefined && (
                    <span className="text-xs text-gray-500">
                      ({option.stockQuantity} disponibles)
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        )

      case "checkbox":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {getVariantIcon(variant.name)}
              <label className="font-medium">
                {variant.name}
                {variant.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>

            <div className="space-y-2">
              {variant.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={(selectedOptions[variant._id] || []).includes(option.value)}
                    onChange={(e) => handleCheckboxChange(variant._id, option.value, e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="flex-1">{option.label}</span>
                  {option.priceAdjustment && option.priceAdjustment > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      +${option.priceAdjustment}
                    </Badge>
                  )}
                </label>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (variants.length === 0) {
    return null
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Opciones del Producto</h3>
        <div className="space-y-6">
          {variants.map((variant) => (
            <div key={variant._id}>
              {getVariantDisplay(variant)}
            </div>
          ))}
        </div>

        {/* Selected Variants Summary */}
        {Object.keys(selectedVariants).length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium mb-2">Selección actual:</h4>
            <div className="space-y-1 text-sm">
              {Object.entries(selectedVariants).map(([variantId, value]) => {
                const variant = variants.find(v => v._id === variantId)
                const option = variant?.options.find(o => o.value === value)
                return variant && option ? (
                  <div key={variantId} className="flex justify-between">
                    <span className="text-gray-600">{variant.name}:</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                ) : null
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}