"use client"

import { useState, useEffect, useCallback } from "react"
import { optimizedFetch } from "../utils/api-optimization"

interface UseFetchOptions<T> {
  initialData?: T
  dependencies?: any[]
  skip?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  cacheKey?: string
  cacheDuration?: number
}

interface FetchState<T> {
  data: T | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useOptimizedFetch<T>(
  url: string,
  options: RequestInit = {},
  {
    initialData,
    dependencies = [],
    skip = false,
    onSuccess,
    onError,
    cacheKey,
    cacheDuration,
  }: UseFetchOptions<T> = {},
): FetchState<T> {
  const [data, setData] = useState<T | undefined>(initialData)
  const [isLoading, setIsLoading] = useState<boolean>(!skip)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    if (skip) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await optimizedFetch<T>(url, options, {
        useCache: true,
        cacheKey: cacheKey || url,
        cacheDuration,
      })

      setData(result)
      onSuccess?.(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [url, options, skip, cacheKey, cacheDuration, onSuccess, onError])

  useEffect(() => {
    fetchData()
  }, [fetchData, ...dependencies])

  const refetch = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  return { data, isLoading, error, refetch }
}
