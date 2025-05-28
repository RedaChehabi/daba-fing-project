/**
 * Image optimization utilities for DabaFing web app
 */

// Function to resize an image before upload
export async function resizeImageForUpload(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      // Release object URL
      URL.revokeObjectURL(img.src)

      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }
      }

      // Create canvas and resize
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      // Draw image with smoothing
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Canvas to Blob conversion failed"))
          }
        },
        file.type,
        quality,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      reject(new Error("Image loading failed"))
    }

    img.src = URL.createObjectURL(file)
  })
}

// Convert data URL to Blob with optimization
export function dataURLtoOptimizedBlob(dataURL: string, mimeType = "image/jpeg", quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")

      // Limit dimensions for better performance
      const maxDimension = 1200
      let width = img.width
      let height = img.height

      if (width > height && width > maxDimension) {
        height = Math.round((height * maxDimension) / width)
        width = maxDimension
      } else if (height > maxDimension) {
        width = Math.round((width * maxDimension) / height)
        height = maxDimension
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Canvas to Blob conversion failed"))
          }
        },
        mimeType,
        quality,
      )
    }

    img.onerror = () => {
      reject(new Error("Image loading failed"))
    }

    img.src = dataURL
  })
}

// Progressive image loading
export function createProgressiveImage(
  src: string,
  placeholderColor = "#e2e8f0",
): { placeholder: string; src: string } {
  // Return a placeholder color and the actual image source
  return {
    placeholder: placeholderColor,
    src: src,
  }
}

// Check if image dimensions are within acceptable limits
export function validateImageDimensions(
  file: File,
  minWidth = 300,
  minHeight = 300,
  maxWidth = 4000,
  maxHeight = 4000,
): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      const isValid =
        img.width >= minWidth && img.height >= minHeight && img.width <= maxWidth && img.height <= maxHeight

      resolve(isValid)
    }

    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      resolve(false)
    }

    img.src = URL.createObjectURL(file)
  })
}
