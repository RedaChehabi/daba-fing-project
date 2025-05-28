"use client"

import Image, { type ImageProps } from "next/image"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps extends Omit<ImageProps, "onLoadingComplete"> {
  lowQualityPlaceholder?: boolean
  fadeIn?: boolean
  loadingClassName?: string
}

export function OptimizedImage({
  src,
  alt,
  className,
  lowQualityPlaceholder = true,
  fadeIn = true,
  loadingClassName,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [blurDataURL, setBlurDataURL] = useState<string | undefined>(undefined)

  // Generate a low quality placeholder if requested
  useEffect(() => {
    if (lowQualityPlaceholder && typeof src === "string" && !props.placeholder && !props.blurDataURL) {
      // Create a simple colored placeholder based on the image URL
      const hash = src.split("").reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0)
      const hue = Math.abs(hash) % 360
      setBlurDataURL(
        `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect width="1" height="1" fill="hsl(${hue}, 40%, 80%)" /></svg>`,
      )
    }
  }, [src, lowQualityPlaceholder, props.placeholder, props.blurDataURL])

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      className={cn(
        className,
        fadeIn && isLoading
          ? "opacity-0 transition-opacity duration-500"
          : "opacity-100 transition-opacity duration-500",
        isLoading && loadingClassName,
      )}
      onLoadingComplete={() => setIsLoading(false)}
      blurDataURL={props.blurDataURL || blurDataURL}
      placeholder={lowQualityPlaceholder && (props.blurDataURL || blurDataURL) ? "blur" : props.placeholder}
      {...props}
    />
  )
}
