"use client"

import { useEffect, useState, useRef } from "react"

/**
 * Image loading optimization utilities for DabaFing web app
 */

/**
 * Check if the browser supports modern image formats
 */
export function checkImageFormatSupport() {
  if (typeof document === "undefined") return { avif: false, webp: false }

  const canvas = document.createElement("canvas")
  if (!canvas || typeof canvas.getContext !== "function") {
    return { avif: false, webp: false }
  }

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    return { avif: false, webp: false }
  }

  // Check WebP support
  const webpSupport = canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0

  // AVIF support is harder to detect, so we'll use a feature detection approach
  let avifSupport = false
  const img = new Image()
  img.onload = () => {
    avifSupport = true
  }
  img.onerror = () => {
    avifSupport = false
  }
  img.src =
    "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK"

  return { avif: avifSupport, webp: webpSupport }
}

/**
 * Get the optimal image format based on browser support
 */
export function getOptimalImageFormat() {
  const { avif, webp } = checkImageFormatSupport()

  if (avif) return "avif"
  if (webp) return "webp"
  return "jpeg"
}

/**
 * Generate a low-quality image placeholder
 */
export function generatePlaceholder(width: number, height: number, color?: string): string {
  // Default to a light gray if no color is provided
  const bgColor = color || "#f1f1f1"

  // Create a simple SVG placeholder
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="${bgColor}"/>
    </svg>
  `

  // Convert to base64
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * Custom hook for lazy loading images
 */
export function useLazyImage(
  src: string,
  options: {
    threshold?: number
    rootMargin?: string
    placeholderSrc?: string
  } = {},
) {
  const { threshold = 0.1, rootMargin = "100px", placeholderSrc } = options
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || generatePlaceholder(100, 100))
  const imgRef = useRef<HTMLImageElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false)
    setCurrentSrc(placeholderSrc || generatePlaceholder(100, 100))

    const img = imgRef.current
    if (!img) return

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Start loading the image
          const tempImg = new Image()
          tempImg.src = src
          tempImg.onload = () => {
            setCurrentSrc(src)
            setIsLoaded(true)

            // Disconnect observer once loaded
            if (observerRef.current) {
              observerRef.current.disconnect()
            }
          }

          tempImg.onerror = () => {
            console.error(`Failed to load image: ${src}`)
            // Keep the placeholder on error
          }
        }
      },
      { threshold, rootMargin },
    )

    // Start observing
    observerRef.current.observe(img)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [src, threshold, rootMargin, placeholderSrc])

  return { ref: imgRef, src: currentSrc, isLoaded }
}

/**
 * Preload an image
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Preload multiple images
 */
export function preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(srcs.map(preloadImage))
}

/**
 * Custom hook to preload images
 */
export function useImagePreloader(srcs: string[]) {
  const [loadedCount, setLoadedCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!srcs.length) {
      setIsComplete(true)
      return
    }

    setIsComplete(false)
    setLoadedCount(0)

    let mounted = true

    const loadImage = (src: string) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = img.onerror = () => {
          if (mounted) {
            setLoadedCount((prevCount) => {
              const newCount = prevCount + 1
              if (newCount === srcs.length) {
                setIsComplete(true)
              }
              return newCount
            })
          }
          resolve()
        }
        img.src = src
      })
    }

    // Load images in parallel
    Promise.all(srcs.map(loadImage)).catch(console.error)

    return () => {
      mounted = false
    }
  }, [srcs])

  return { loadedCount, isComplete, progress: srcs.length ? (loadedCount / srcs.length) * 100 : 100 }
}

/**
 * Generate responsive image srcset
 */
export function generateSrcSet(src: string, widths: number[] = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]): string {
  // Parse the URL to extract the base and extension
  const urlParts = src.split(".")
  const extension = urlParts.pop() || "jpg"
  const basePath = urlParts.join(".")

  // Generate the srcset string
  return widths.map((width) => `${basePath}-${width}.${extension} ${width}w`).join(", ")
}
