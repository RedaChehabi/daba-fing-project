/**
 * API call optimization utilities for DabaFing web app
 */

import { measureApiTime } from "./performance"

// Simple in-memory cache
const apiCache: Record<string, { data: any; timestamp: number }> = {}

// Cache expiration time in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000

// Function to create a cache key from URL and params
function createCacheKey(url: string, params?: Record<string, any>): string {
  if (!params) return url
  return `${url}:${JSON.stringify(params)}`
}

// Function to check if cache is valid
function isCacheValid(key: string): boolean {
  if (!apiCache[key]) return false

  const now = Date.now()
  return now - apiCache[key].timestamp < CACHE_EXPIRATION
}

// Optimized fetch with caching, timeout, and retry logic
export async function optimizedFetch<T>(
  url: string,
  options: RequestInit = {},
  cacheOptions: {
    useCache?: boolean
    cacheKey?: string
    cacheDuration?: number
  } = {},
  retryOptions: {
    maxRetries?: number
    retryDelay?: number
  } = {},
): Promise<T> {
  const { useCache = true, cacheKey = url, cacheDuration = CACHE_EXPIRATION } = cacheOptions

  const { maxRetries = 3, retryDelay = 1000 } = retryOptions

  // Check cache first if GET request and caching is enabled
  if (useCache && (!options.method || options.method === "GET")) {
    if (isCacheValid(cacheKey)) {
      return Promise.resolve(apiCache[cacheKey].data)
    }
  }

  // Add timeout to fetch
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

  // Merge abort signal with existing options
  const fetchOptions = {
    ...options,
    signal: controller.signal,
  }

  // Retry logic
  let lastError: Error | null = null
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Measure API call performance
      const response = await measureApiTime(fetch(url, fetchOptions), `${options.method || "GET"} ${url}`)

      // Clear timeout
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      // Cache the response if it's a GET request and caching is enabled
      if (useCache && (!options.method || options.method === "GET")) {
        apiCache[cacheKey] = {
          data,
          timestamp: Date.now(),
        }
      }

      return data as T
    } catch (error) {
      lastError = error as Error

      // Don't retry if we've reached max retries or if it was aborted
      if (attempt >= maxRetries || (error instanceof DOMException && error.name === "AbortError")) {
        break
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)))
    }
  }

  // Clear timeout if we exited the loop
  clearTimeout(timeoutId)

  throw lastError || new Error("Request failed")
}

// Function to invalidate cache
export function invalidateCache(urlPattern?: string): void {
  if (!urlPattern) {
    // Clear entire cache
    Object.keys(apiCache).forEach((key) => delete apiCache[key])
    return
  }

  // Clear specific cache entries that match the pattern
  Object.keys(apiCache).forEach((key) => {
    if (key.includes(urlPattern)) {
      delete apiCache[key]
    }
  })
}

// Function to prefetch data
export function prefetchData(urls: string[]): void {
  urls.forEach((url) => {
    optimizedFetch(url, {}, { useCache: true }).catch(() => {
      // Silently fail for prefetch
    })
  })
}

// Batch multiple API requests
export async function batchRequests<T>(requests: Array<{ url: string; options?: RequestInit }>): Promise<T[]> {
  return Promise.all(
    requests.map((req) =>
      optimizedFetch<T>(req.url, req.options || {}).catch((error) => {
        console.error(`Failed to fetch ${req.url}:`, error)
        throw error
      }),
    ),
  )
}
