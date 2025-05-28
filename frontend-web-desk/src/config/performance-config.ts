/**
 * Performance optimization configuration for DabaFing web app
 */

export const performanceConfig = {
    // Image optimization
    images: {
      quality: 80, // Default image quality (0-100)
      placeholderQuality: 10, // Quality for placeholder images
      formats: ["avif", "webp", "jpeg"], // Preferred formats in order
      sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive image sizes
      lazyLoadThreshold: 0.1, // Intersection observer threshold for lazy loading
      lazyLoadMargin: "200px", // Root margin for lazy loading
      preloadPriority: ["hero", "above-fold"], // Image categories to preload
    },
  
    // Network optimization
    network: {
      connectionThrottling: {
        slow2g: {
          maxImageWidth: 640,
          disableAnimations: true,
          disablePreloading: true,
          disableBackgroundImages: true,
        },
        regular2g: {
          maxImageWidth: 750,
          disableAnimations: true,
          disablePreloading: true,
        },
        slow3g: {
          maxImageWidth: 1080,
          disableAnimations: false,
          disablePreloading: false,
        },
        regular3g: {
          maxImageWidth: 1200,
          disableAnimations: false,
          disablePreloading: false,
        },
        regular4g: {
          maxImageWidth: 1920,
          disableAnimations: false,
          disablePreloading: false,
        },
      },
      cacheTTL: {
        images: 7 * 24 * 60 * 60 * 1000, // 7 days
        api: 5 * 60 * 1000, // 5 minutes
        static: 24 * 60 * 60 * 1000, // 1 day
      },
      prefetchThreshold: 0.75, // Prefetch when 75% likely to be needed
      maxConcurrentRequests: 6, // Maximum concurrent network requests
    },
  
    // Rendering optimization
    rendering: {
      debounceDelay: 300, // Default debounce delay in ms
      throttleDelay: 100, // Default throttle delay in ms
      virtualizedRowHeight: 50, // Default height for virtualized list items
      chunkSize: 10, // Number of items to render in each chunk
      chunkDelay: 16, // Delay between rendering chunks (ms)
      animationFrameRate: 60, // Target frame rate for animations
      disableAnimationsOnLowPower: true, // Disable animations on low power mode
      enableProgressiveHydration: true, // Enable progressive hydration
    },
  
    // Memory optimization
    memory: {
      maxCacheSize: 50 * 1024 * 1024, // 50MB max cache size
      disposalThreshold: 0.9, // Dispose cache when 90% full
      monitorInterval: 30000, // Check memory usage every 30 seconds
      leakDetectionThreshold: 5, // Number of consecutive increases to trigger leak warning
    },
  
    // Bundle optimization
    bundle: {
      dynamicImportThreshold: 30 * 1024, // 30KB threshold for dynamic imports
      preloadComponents: ["Header", "Footer", "Sidebar"], // Components to preload
      deferNonCritical: true, // Defer loading non-critical components
      inlineThreshold: 8 * 1024, // 8KB threshold for inlining resources
    },
  
    // Feature flags
    features: {
      enablePerformanceMonitoring: process.env.NODE_ENV === "development",
      enableMemoryMonitoring: process.env.NODE_ENV === "development",
      enableNetworkMonitoring: true,
      enableErrorBoundaries: true,
      enableOptimizationTips: true,
    },
  }
  
  // Helper function to get configuration based on device capabilities
  export function getOptimizedConfig() {
    if (typeof window === "undefined") {
      return performanceConfig
    }
  
    const config = { ...performanceConfig }
  
    // Adjust based on device memory
    if ("deviceMemory" in navigator) {
      const memory = (navigator as any).deviceMemory
  
      if (memory <= 2) {
        // Low memory device
        config.images.quality = 70
        config.rendering.disableAnimationsOnLowPower = true
        config.bundle.deferNonCritical = true
      }
    }
  
    // Adjust based on connection type
    if ("connection" in navigator) {
      const connection = (navigator as any).connection
      const effectiveType = connection?.effectiveType
  
      if (effectiveType === "slow-2g" || effectiveType === "2g") {
        config.network.prefetchThreshold = 0.9
        config.images.quality = 60
      }
    }
  
    // Adjust based on reduced motion preference
    if (typeof window !== "undefined" && window.matchMedia) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        config.rendering.disableAnimationsOnLowPower = true
      }
    }
  
    return config
  }
  