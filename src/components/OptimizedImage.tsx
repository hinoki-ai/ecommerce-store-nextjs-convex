"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ImageIcon, Loader2 } from "lucide-react"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
  fallbackSrc?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  fill = false,
  objectFit = 'cover',
  loading = 'lazy',
  onLoad,
  onError,
  fallbackSrc = '/placeholder-image.svg'
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)
  const [isVisible, setIsVisible] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px' // Start loading 50px before the image comes into view
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority, loading])

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setHasError(false) // Reset error state to try fallback
    } else {
      setIsLoading(false)
      setHasError(true)
      onError?.()
    }
  }

  // Generate blur data URL if not provided
  const getBlurDataURL = () => {
    if (blurDataURL) return blurDataURL
    if (placeholder === 'blur') {
      // Generate a simple blur data URL
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBzdG9wLWNvbG9yPSIjZjBmMGYwIiBzdG9wLW9wYWNpdHk9IjAuNSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2U5ZWNlZiIgc3RvcC1vcGFjaXR5PSIwLjUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+"
    }
    return undefined
  }

  const imageProps = {
    src: currentSrc,
    alt,
    quality,
    onLoad: handleLoad,
    onError: handleError,
    className: `${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`,
    ...(width && height && { width, height }),
    ...(fill && { fill: true }),
    ...(sizes && { sizes }),
    ...(priority && { priority }),
    ...(placeholder === 'blur' && { placeholder: 'blur' as const, blurDataURL: getBlurDataURL() }),
    style: fill ? { objectFit } : undefined
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${fill ? 'w-full h-full' : ''} ${className}`}
      style={!fill && width && height ? { width, height } : undefined}
    >
      {/* Loading State */}
      {isLoading && isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-muted/10 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Loading image...</span>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {hasError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-muted/20"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs text-center px-2">
              Image unavailable
            </span>
          </div>
        </motion.div>
      )}

      {/* Lazy Loading Placeholder */}
      {!isVisible && !priority && loading === 'lazy' && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/50" />
      )}

      {/* Actual Image */}
      {isVisible && !hasError && (
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={fill ? 'w-full h-full' : ''}
        >
          <Image
            {...imageProps}
            unoptimized={currentSrc === fallbackSrc} // Don't optimize fallback SVG
          />
        </motion.div>
      )}

      {/* Progressive Enhancement Overlay */}
      {isLoading && isVisible && placeholder === 'blur' && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/40 animate-pulse" />
      )}
    </div>
  )
}

// Preload utility for critical images
export function preloadImage(src: string, priority: boolean = false): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
    
    // For priority images, set higher priority
    if (priority && 'fetchPriority' in img) {
      (img as any).fetchPriority = 'high'
    }
  })
}

// Batch preload utility
export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(src => preloadImage(src)))
}