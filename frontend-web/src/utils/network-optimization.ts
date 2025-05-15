"use client"

/**
 * Network optimization utilities for DabaFing web app
 */

import { useEffect, useState } from "react"

/**
 * Network connection types
 */
export type ConnectionType = "slow-2g" | "2g" | "3g" | "4g" | "unknown"

/**
 * Get current network information if available
 */
export function getNetworkInfo(): {
  type: ConnectionType
  downlink?: number
  rtt?: number
  saveData?: boolean
  effectiveType?: ConnectionType
} {
  if (typeof navigator === "undefined" || !("connection" in navigator)) {
    return { type: "unknown" }
  }

  const connection = (navigator as any).connection

  return {
    type: connection.type || "unknown",
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData,
    effectiveType: connection.effectiveType,
  }
}

/**
 * Check if the user is on a slow connection
 */
export function isSlowConnection(): boolean {
  const info = getNetworkInfo()

  return (
    info.type === "slow-2g" ||
    info.type === "2g" ||
    info.effectiveType === "slow-2g" ||
    info.effectiveType === "2g" ||
    (info.downlink !== undefined && info.downlink < 0.5) ||
    (info.rtt !== undefined && info.rtt > 500)
  )
}

/**
 * Check if the user has enabled data saver mode
 */
export function isSaveDataEnabled(): boolean {
  const info = getNetworkInfo()
  return !!info.saveData
}

/**
 * Custom hook to monitor network status
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true)

  const [networkInfo, setNetworkInfo] = useState(getNetworkInfo())

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Update network info when connection changes
    if ("connection" in navigator) {
      const connection = (navigator as any).connection

      const handleChange = () => {
        setNetworkInfo(getNetworkInfo())
      }

      connection.addEventListener("change", handleChange)

      return () => {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
        connection.removeEventListener("change", handleChange)
      }
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return {
    isOnline,
    ...networkInfo,
    isSlowConnection: isSlowConnection(),
    isSaveDataEnabled: isSaveDataEnabled(),
  }
}

/**
 * Utility to prioritize fetch requests
 */
export function prioritizeFetch(
  url: string,
  options: RequestInit = {},
  priority: "high" | "low" | "auto" = "auto",
): Promise<Response> {
  // Use the Fetch Priority API if available
  if ("priority" in Request.prototype) {
    const requestOptions = {
      ...options,
      priority,
    }

    return fetch(url, requestOptions as RequestInit)
  }

  // Fall back to regular fetch
  return fetch(url, options)
}

/**
 * Custom hook for prefetching resources
 */
export function usePrefetch(urls: string[], options: RequestInit = {}) {
  useEffect(() => {
    // Only prefetch if the user has a good connection
    if (isSlowConnection() || isSaveDataEnabled()) {
      return
    }

    const controller = new AbortController()
    const { signal } = controller

    // Use requestIdleCallback if available, otherwise setTimeout
    const requestIdleCallback = (window as any).requestIdleCallback || ((cb: Function) => setTimeout(cb, 1))

    requestIdleCallback(() => {
      urls.forEach((url) => {
        fetch(url, { ...options, signal, priority: "low" as any }).catch(() => {
          // Silently fail for prefetch
        })
      })
    })

    return () => {
      controller.abort()
    }
  }, [urls, options])
}

/**
 * Utility to compress data before sending
 */
export async function compressData(data: string): Promise<Uint8Array> {
  // Use CompressionStream if available
  if ("CompressionStream" in window) {
    const encoder = new TextEncoder()
    const encodedData = encoder.encode(data)

    const compressedStream = new ReadableStream({
      start(controller) {
        controller.enqueue(encodedData)
        controller.close()
      },
    }).pipeThrough(new (window as any).CompressionStream("gzip"))

    const reader = compressedStream.getReader()
    const chunks: Uint8Array[] = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }

    // Combine chunks
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    const result = new Uint8Array(totalLength)

    let offset = 0
    for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }

    return result
  }

  // Fallback: return uncompressed data
  return new TextEncoder().encode(data)
}
