"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2
} from "lucide-react"

interface ProductImage {
  url: string
  alt: string
}

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const mainImage = images[selectedImage] || images[0]

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index)
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
    setIsZoomed(false)
  }

  const handleNext = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
    resetZoom()
  }

  const handlePrev = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
    resetZoom()
  }

  const resetZoom = () => {
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
    setIsZoomed(false)
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3))
    setIsZoomed(true)
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.25, 1)
    setZoomLevel(newZoom)
    if (newZoom === 1) {
      setIsZoomed(false)
      setPanPosition({ x: 0, y: 0 })
    }
  }

  const handleImageClick = () => {
    if (zoomLevel === 1) {
      handleZoomIn()
    } else {
      resetZoom()
    }
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true)
    }
  }, [zoomLevel])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1 && containerRef.current) {
      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const maxX = (zoomLevel - 1) * rect.width / 2
      const maxY = (zoomLevel - 1) * rect.height / 2

      setPanPosition({
        x: Math.max(-maxX, Math.min(maxX, x - rect.width / 2)),
        y: Math.max(-maxY, Math.min(maxY, y - rect.height / 2))
      })
    }
  }, [isDragging, zoomLevel])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      handleZoomIn()
    } else {
      handleZoomOut()
    }
  }, [])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    if (!isFullscreen) {
      resetZoom()
    }
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isFullscreen) {
      switch (e.key) {
        case 'Escape':
          setIsFullscreen(false)
          break
        case 'ArrowLeft':
          handlePrev()
          break
        case 'ArrowRight':
          handleNext()
          break
        case '+':
        case '=':
          handleZoomIn()
          break
        case '-':
          handleZoomOut()
          break
        case '0':
          resetZoom()
          break
      }
    }
  }, [isFullscreen])

  // Add keyboard event listener for fullscreen mode
  React.useEffect(() => {
    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isFullscreen, handleKeyDown])

  if (!mainImage) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No Image</span>
      </div>
    )
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Main Image Container */}
        <div
          ref={containerRef}
          className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in ${
            isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ cursor: isDragging ? 'grabbing' : zoomLevel > 1 ? 'grab' : 'zoom-in' }}
        >
          <div
            className="relative w-full h-full transition-transform duration-200"
            style={{
              transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
              transformOrigin: 'center center'
            }}
          >
            <Image
              ref={imageRef}
              src={mainImage.url}
              alt={mainImage.alt || productName}
              fill
              className="object-cover"
              onClick={handleImageClick}
              priority
            />
          </div>

          {/* Zoom Controls */}
          {zoomLevel > 1 && (
            <div className="absolute top-4 left-4 flex gap-2">
              <Button size="sm" variant="secondary" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" onClick={resetZoom}>
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && !isFullscreen && (
            <>
              <Button
                size="sm"
                variant="secondary"
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                onClick={handlePrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                onClick={handleNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Fullscreen Toggle */}
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-4 right-4"
            onClick={toggleFullscreen}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          {/* Close Fullscreen */}
          {isFullscreen && (
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-4 right-16"
              onClick={toggleFullscreen}
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Zoom Level Indicator */}
          {isZoomed && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
              {Math.round(zoomLevel * 100)}%
            </div>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {images.length > 1 && !isFullscreen && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? 'border-blue-500 scale-105'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${productName} ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Instructions */}
      {isFullscreen && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded text-sm">
          Usa las flechas para navegar • +/- para zoom • ESC para salir
        </div>
      )}
    </>
  )
}