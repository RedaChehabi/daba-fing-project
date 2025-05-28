"use client"

import type React from "react"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Rendering optimization utilities for DabaFing web app
 */

/**
 * Custom hook to skip initial render
 */
export function useSkipFirstRender(callback: () => void, dependencies: any[]) {
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    return callback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}

/**
 * Custom hook to limit render frequency
 */
export function useThrottledRender<T>(value: T, limit = 100): T {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastRenderTimeRef = useRef(Date.now())
  const latestValueRef = useRef(value)

  useEffect(() => {
    latestValueRef.current = value

    const now = Date.now()
    const timeSinceLastRender = now - lastRenderTimeRef.current

    if (timeSinceLastRender >= limit) {
      // Update immediately if enough time has passed
      setThrottledValue(value)
      lastRenderTimeRef.current = now
    } else {
      // Schedule an update after the limit
      const timeoutId = setTimeout(() => {
        setThrottledValue(latestValueRef.current)
        lastRenderTimeRef.current = Date.now()
      }, limit - timeSinceLastRender)

      return () => clearTimeout(timeoutId)
    }
  }, [value, limit])

  return throttledValue
}

/**
 * Custom hook to prevent unnecessary re-renders
 */
export function useDeepCompareMemo<T>(value: T, dependencies: any[]): T {
  const ref = useRef<T>(value)

  // Simple deep comparison
  const depsChanged = dependencies.some((dep, i) => {
    const prevDep = ref.current[i as keyof T]
    return JSON.stringify(dep) !== JSON.stringify(prevDep)
  })

  if (depsChanged) {
    ref.current = value
  }

  return ref.current
}

/**
 * Custom hook to optimize list rendering
 */
export function useVirtualizedList<T>({
  items,
  itemHeight,
  windowHeight,
  overscan = 3,
}: {
  items: T[]
  itemHeight: number
  windowHeight: number
  overscan?: number
}) {
  const [scrollTop, setScrollTop] = useState(0)

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(items.length - 1, Math.floor((scrollTop + windowHeight) / itemHeight) + overscan)

  const visibleItems = items.slice(startIndex, endIndex + 1)

  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop)
  }, [])

  return {
    visibleItems,
    startIndex,
    totalHeight,
    offsetY,
    handleScroll,
  }
}

/**
 * Custom hook to optimize animations with requestAnimationFrame
 */
export function useAnimationOptimizer(callback: (deltaTime: number) => void, dependencies: any[] = []) {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()
  const callbackRef = useRef(callback)

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current
        callbackRef.current(deltaTime)
      }
      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}

/**
 * Custom hook to batch state updates
 */
export function useBatchedUpdates<T extends Record<string, any>>(initialState: T) {
  const [state, setState] = useState<T>(initialState)
  const pendingUpdatesRef = useRef<Partial<T>>({})
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const batchedSetState = useCallback((updates: Partial<T>) => {
    // Store updates
    pendingUpdatesRef.current = { ...pendingUpdatesRef.current, ...updates }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Schedule a single update
    timeoutRef.current = setTimeout(() => {
      setState((prevState) => ({ ...prevState, ...pendingUpdatesRef.current }))
      pendingUpdatesRef.current = {}
      timeoutRef.current = null
    }, 0)
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return [state, batchedSetState] as const
}

/**
 * Custom hook to prevent layout thrashing
 */
export function useLayoutOptimizer() {
  const readOperationsRef = useRef<Array<() => any>>([])
  const writeOperationsRef = useRef<Array<() => void>>([])
  const frameRequestRef = useRef<number | null>(null)

  const scheduleRead = useCallback((readFn: () => any) => {
    readOperationsRef.current.push(readFn)
    scheduleFrame()
    return new Promise((resolve) => {
      const originalReadFn = readOperationsRef.current[readOperationsRef.current.length - 1]
      readOperationsRef.current[readOperationsRef.current.length - 1] = () => {
        const result = originalReadFn()
        resolve(result)
        return result
      }
    })
  }, [])

  const scheduleWrite = useCallback((writeFn: () => void) => {
    writeOperationsRef.current.push(writeFn)
    scheduleFrame()
    return new Promise<void>((resolve) => {
      const originalWriteFn = writeOperationsRef.current[writeOperationsRef.current.length - 1]
      writeOperationsRef.current[writeOperationsRef.current.length - 1] = () => {
        originalWriteFn()
        resolve()
      }
    })
  }, [])

  const scheduleFrame = useCallback(() => {
    if (frameRequestRef.current === null) {
      frameRequestRef.current = requestAnimationFrame(processOperations)
    }
  }, [])

  const processOperations = useCallback(() => {
    // Process all read operations first
    const readResults = readOperationsRef.current.map((readFn) => readFn())

    // Then process all write operations
    writeOperationsRef.current.forEach((writeFn, index) => {
      writeFn()
    })

    // Reset
    readOperationsRef.current = []
    writeOperationsRef.current = []
    frameRequestRef.current = null
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (frameRequestRef.current !== null) {
        cancelAnimationFrame(frameRequestRef.current)
      }
    }
  }, [])

  return { scheduleRead, scheduleWrite }
}
