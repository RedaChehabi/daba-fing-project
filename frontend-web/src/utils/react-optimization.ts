"use client"

import type React from "react"

import { useCallback, useEffect, useRef, useState } from "react"
import { debounce, throttle } from "./performance"

/**
 * Custom hook for memoizing expensive calculations
 */
export function useMemoizedCalculation<T>(
  calculation: () => T,
  dependencies: any[],
  options: {
    equalityFn?: (prev: T, next: T) => boolean
  } = {},
): T {
  const { equalityFn = (a, b) => JSON.stringify(a) === JSON.stringify(b) } = options
  const resultRef = useRef<T | null>(null)
  const depsRef = useRef<any[]>([])

  // Check if dependencies have changed
  const depsChanged = dependencies.some((dep, i) => dep !== depsRef.current[i])

  if (resultRef.current === null || depsChanged) {
    const newResult = calculation()

    // Only update if the result has changed
    if (resultRef.current === null || !equalityFn(resultRef.current, newResult)) {
      resultRef.current = newResult
    }

    depsRef.current = dependencies
  }

  return resultRef.current as T
}

/**
 * Custom hook for debounced event handlers
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  dependencies: any[] = [],
): (...args: Parameters<T>) => void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(debounce(callback, delay), dependencies)
}

/**
 * Custom hook for throttled event handlers
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  limit: number,
  dependencies: any[] = [],
): (...args: Parameters<T>) => void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(throttle(callback, limit), dependencies)
}

/**
 * Custom hook for detecting when a component is visible in the viewport
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {},
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [elementRef, options])

  return isIntersecting
}

/**
 * Custom hook for preventing excessive re-renders
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // @ts-ignore
  return useCallback((...args) => callbackRef.current(...args), [])
}

/**
 * Custom hook for safely accessing DOM elements
 */
export function useSafeRef<T extends HTMLElement>(): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  return [ref, isMounted]
}
