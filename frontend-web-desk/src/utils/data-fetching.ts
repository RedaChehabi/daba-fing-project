/**
 * Data fetching and caching utilities for DabaFing web app
 */

// Cache storage
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

// Default TTL (time to live) in milliseconds (5 minutes)
const DEFAULT_TTL = 5 * 60 * 1000

/**
 * Get data from cache
 */
export function getFromCache<T>(key: string): T | null {
  const item = cache.get(key)

  if (!item) return null

  // Check if cache has expired
  if (Date.now() > item.timestamp + item.ttl) {
    cache.delete(key)
    return null
  }

  return item.data as T
}

/**
 * Set data in cache
 */
export function setInCache<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  })
}

/**
 * Fetch data with caching
 */
export async function fetchWithCache<T>(
  url: string,
  options: RequestInit = {},
  cacheOptions: {
    useCache?: boolean
    cacheKey?: string
    ttl?: number
  } = {},
): Promise<T> {
  const { useCache = true, cacheKey = url, ttl = DEFAULT_TTL } = cacheOptions

  // Check cache first if enabled
  if (useCache) {
    const cachedData = getFromCache<T>(cacheKey)
    if (cachedData) return cachedData
  }

  // Fetch data
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  const data = await response.json()

  // Cache data if enabled
  if (useCache) {
    setInCache(cacheKey, data, ttl)
  }

  return data as T
}

/**
 * Prefetch data and store in cache
 */
export function prefetchData(urls: string[], ttl: number = DEFAULT_TTL): void {
  urls.forEach((url) => {
    fetchWithCache(url, {}, { ttl }).catch(() => {
      // Silently fail for prefetch
    })
  })
}

/**
 * Batch multiple requests
 */
export async function batchRequests<T>(
  requests: Array<{ url: string; options?: RequestInit; cacheOptions?: any }>,
): Promise<T[]> {
  return Promise.all(
    requests.map((req) =>
      fetchWithCache<T>(req.url, req.options || {}, req.cacheOptions || {}).catch((error) => {
        console.error(`Failed to fetch ${req.url}:`, error)
        throw error
      }),
    ),
  )
}

/**
 * Create a resource key from URL and params
 */
export function createResourceKey(url: string, params?: Record<string, any>): string {
  if (!params) return url
  return `${url}:${JSON.stringify(params)}`
}
