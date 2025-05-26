"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { OptimizedImage } from "@/components/optimized-image"
import { useIntersectionObserver } from "@/utils/react-optimization"
import { cn } from "@/lib/utils"

interface OptimizedImageLoaderProps {
  src: string
  alt: string
  width?: number
  height?: number
  sizes?: string
  className?: string
  priority?: boolean
  quality?: number
  fill?: boolean
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImageLoader({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  priority = false,
  quality,
  fill = false,
  style,
  onLoad,
  onError,
}: OptimizedImageLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(containerRef, {
    rootMargin: "200px",
    threshold: 0.1,
  })

  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  // Generate a simple color placeholder based on the image URL
  const generateColorPlaceholder = () => {
    // Create a simple hash from the src
    const hash = src.split("").reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0)
    const hue = Math.abs(hash) % 360
    return `hsl(${hue}, 40%, 80%)`
  }

  const placeholderColor = generateColorPlaceholder()

  // Handle load and error events
  const handleLoad = () => {
    setLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setError(true)
    onError?.()
  }

  // Reset state when src changes
  useEffect(() => {
    setLoaded(false)
    setError(false)
  }, [src])

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden relative", fill ? "w-full h-full" : "", className)}
      style={{
        width: fill ? "100%" : width,
        height: fill ? "100%" : height,
        backgroundColor: placeholderColor,
        ...style,
      }}
    >
      {(isVisible || priority) && !error && (
        <OptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          className={cn("transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
          quality={quality}
          fill={fill}
        />
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <span className="text-sm text-muted-foreground">Failed to load image</span>
        </div>
      )}
    </div>
  )
}
