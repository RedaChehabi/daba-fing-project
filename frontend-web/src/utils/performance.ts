/**
 * Performance monitoring utilities for DabaFing web app
 */

// Function to measure component render time
export function measureRenderTime(componentName: string) {
  const startTime = performance.now()

  return () => {
    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms`)
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === "production") {
      // Replace with your analytics service
      // sendToAnalytics('component_render', { component: componentName, time: renderTime });
    }
  }
}

// Function to measure API call time
export function measureApiTime<T>(apiCall: Promise<T>, apiName: string): Promise<T> {
  const startTime = performance.now()

  return apiCall.then((result) => {
    const endTime = performance.now()
    const callTime = endTime - startTime

    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[API Performance] ${apiName} completed in ${callTime.toFixed(2)}ms`)
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === "production") {
      // Replace with your analytics service
      // sendToAnalytics('api_call', { api: apiName, time: callTime });
    }

    return result
  })
}

// Memory usage monitoring
export function logMemoryUsage(label: string) {
  // Only available in certain browsers
  if (performance && "memory" in performance) {
    const memory = (performance as any).memory
    console.log(
      `[Memory] ${label}: Used JS Heap: ${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB, Total JS Heap: ${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
    )
  }
}

// Create a performance observer for long tasks
export function monitorLongTasks() {
  if (typeof window !== "undefined" && "PerformanceObserver" in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Log long tasks (tasks that block the main thread for more than 50ms)
          console.warn(`[Long Task] Task took ${entry.duration.toFixed(2)}ms`)
        }
      })

      observer.observe({ entryTypes: ["longtask"] })
      return observer
    } catch (e) {
      console.error("PerformanceObserver for longtask not supported", e)
    }
  }
  return null
}

// Function to debounce expensive operations
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

// Function to throttle expensive operations
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}
