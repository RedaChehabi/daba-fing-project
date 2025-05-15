"use client"

/**
 * Memory optimization utilities for DabaFing web app
 */

import { useEffect, useRef } from "react"

/**
 * Check if the browser supports the Performance Memory API
 */
export function supportsMemoryAPI(): boolean {
  return typeof performance !== "undefined" && "memory" in performance
}

/**
 * Get current memory usage if available
 */
export function getMemoryUsage() {
  if (!supportsMemoryAPI()) {
    return null
  }

  const memory = (performance as any).memory

  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usedPercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  }
}

/**
 * Format bytes to human-readable format
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

/**
 * Custom hook to monitor memory usage
 */
export function useMemoryMonitor(interval = 5000) {
  const memoryRef = useRef<{
    current: ReturnType<typeof getMemoryUsage>
    peak: ReturnType<typeof getMemoryUsage>
  }>({
    current: null,
    peak: null,
  })

  useEffect(() => {
    if (!supportsMemoryAPI()) {
      return
    }

    const updateMemory = () => {
      const current = getMemoryUsage()

      if (!current) return

      // Update peak memory usage
      if (!memoryRef.current.peak || current.usedJSHeapSize > (memoryRef.current.peak?.usedJSHeapSize || 0)) {
        memoryRef.current.peak = current
      }

      memoryRef.current.current = current
    }

    // Initial update
    updateMemory()

    // Set up interval
    const intervalId = setInterval(updateMemory, interval)

    return () => {
      clearInterval(intervalId)
    }
  }, [interval])

  return memoryRef
}

/**
 * Utility to help with garbage collection
 */
export function disposeResources(resources: Array<{ dispose?: () => void; close?: () => void }>) {
  resources.forEach((resource) => {
    if (resource.dispose) {
      resource.dispose()
    } else if (resource.close) {
      resource.close()
    }
  })
}

/**
 * Custom hook to help with resource cleanup
 */
export function useResourceCleanup() {
  const resources = useRef<Array<{ dispose?: () => void; close?: () => void }>>([])

  const registerResource = (resource: { dispose?: () => void; close?: () => void }) => {
    resources.current.push(resource)
    return resource
  }

  useEffect(() => {
    return () => {
      disposeResources(resources.current)
      resources.current = []
    }
  }, [])

  return registerResource
}

/**
 * Utility to detect memory leaks
 */
export function detectMemoryLeaks(interval = 10000, threshold = 10) {
  if (!supportsMemoryAPI()) {
    return () => {}
  }

  let lastUsage = (performance as any).memory.usedJSHeapSize
  let increasingCount = 0

  const intervalId = setInterval(() => {
    const currentUsage = (performance as any).memory.usedJSHeapSize

    // Check if memory usage is consistently increasing
    if (currentUsage > lastUsage) {
      increasingCount++

      if (increasingCount >= threshold) {
        console.warn("Potential memory leak detected:", {
          previousUsage: formatBytes(lastUsage),
          currentUsage: formatBytes(currentUsage),
          increase: formatBytes(currentUsage - lastUsage),
          consecutiveIncreases: increasingCount,
        })
      }
    } else {
      increasingCount = 0
    }

    lastUsage = currentUsage
  }, interval)

  return () => {
    clearInterval(intervalId)
  }
}
