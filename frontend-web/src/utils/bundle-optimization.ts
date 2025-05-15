"use client"

import { useEffect, useRef, useState } from "react"
import type React from "react"
import { lazy, Suspense, type ComponentType } from "react"

/**
 * Bundle optimization utilities for DabaFing web app
 */

/**
 * Create a lazy-loaded component with a custom loading component
 */
export function createLazyComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  LoadingComponent: ComponentType = () => <div>Loading...</div>,
) {
  const LazyComponent = lazy(factory)

  return function LazyLoadedComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={<LoadingComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

/**
 * Dynamically import a module only when needed
 */
export function importWhenNeeded<T>(importFn: () => Promise<T>): () => Promise<T> {
  let modulePromise: Promise<T> | null = null

  return () => {
    if (!modulePromise) {
      modulePromise = importFn()
    }

    return modulePromise
  }
}

/**
 * Preload a component or module
 */
export function preload<T>(importFn: () => Promise<T>): void {
  // Use requestIdleCallback if available, otherwise setTimeout
  const requestIdleCallback = (window as any).requestIdleCallback || ((cb: Function) => setTimeout(cb, 1))

  requestIdleCallback(() => {
    importFn().catch(() => {
      // Silently fail for preload
    })
  })
}

/**
 * Create a component that only renders on the client
 */
export function clientOnly<T extends ComponentType<any>>(
  Component: T,
  LoadingComponent: ComponentType = () => null,
): ComponentType<React.ComponentProps<T>> {
  if (typeof window === "undefined") {
    return LoadingComponent
  }

  return Component as ComponentType<React.ComponentProps<T>>
}

/**
 * Create a component that only renders when visible in the viewport
 */
export function renderWhenVisible<T extends ComponentType<any>>(
  Component: T,
  options: IntersectionObserverInit = {},
): ComponentType<React.ComponentProps<T>> {
  // Return the original component on the server
  if (typeof window === "undefined") {
    return Component
  }

  return function VisibleComponent(props: React.ComponentProps<T>) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      }, options)

      if (ref.current) {
        observer.observe(ref.current)
      }

      return () => {
        observer.disconnect()
      }
    }, [])

    return (
      <div ref={ref} style={{ minHeight: 1 }}>
        {isVisible ? <Component {...props} /> : null}
      </div>
    )
  }
}

/**
 * Split a component's rendering into chunks to avoid blocking the main thread
 */
export function chunkRendering<T extends ComponentType<any>>(
  Component: T,
  chunkSize = 10,
): ComponentType<React.ComponentProps<T> & { items: any[] }> {
  return function ChunkedComponent({ items, ...props }: React.ComponentProps<T> & { items: any[] }) {
    const [renderedItems, setRenderedItems] = useState<any[]>([])
    const remainingItemsRef = useRef<any[]>([...items])

    useEffect(() => {
      if (remainingItemsRef.current.length === 0) return

      const renderNextChunk = () => {
        const chunk = remainingItemsRef.current.splice(0, chunkSize)
        setRenderedItems((prev) => [...prev, ...chunk])

        if (remainingItemsRef.current.length > 0) {
          // Use requestAnimationFrame to schedule the next chunk
          requestAnimationFrame(renderNextChunk)
        }
      }

      requestAnimationFrame(renderNextChunk)

      return () => {
        remainingItemsRef.current = []
      }
    }, [])

    // @ts-ignore - pass the rendered items to the component
    return <Component {...props} items={renderedItems} />
  }
}

/**
 * Defer non-critical component rendering until after the page has loaded
 */
export function deferComponentLoad<T extends ComponentType<any>>(
  Component: T,
  LoadingComponent: ComponentType = () => null,
): ComponentType<React.ComponentProps<T>> {
  return function DeferredComponent(props: React.ComponentProps<T>) {
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
      // Check if the page has already loaded
      if (document.readyState === "complete") {
        setShouldRender(true)
        return
      }

      // Otherwise wait for the load event
      const handleLoad = () => setShouldRender(true)
      window.addEventListener("load", handleLoad)

      return () => {
        window.removeEventListener("load", handleLoad)
      }
    }, [])

    return shouldRender ? <Component {...props} /> : <LoadingComponent />
  }
}

/**
 * Create a component that only loads its resources when it's about to be needed
 */
export function nearViewportLoader<T>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    distance?: number
    LoadingComponent?: ComponentType
  } = {},
) {
  const { distance = 300, LoadingComponent = () => null } = options

  return function NearViewportComponent(props: T) {
    const [Component, setComponent] = useState<ComponentType<T> | null>(null)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Load the component when it's near the viewport
            importFn().then((module) => {
              setComponent(() => module.default)
              observer.disconnect()
            })
          }
        },
        { rootMargin: `${distance}px` },
      )

      if (ref.current) {
        observer.observe(ref.current)
      }

      return () => {
        observer.disconnect()
      }
    }, [])

    return (
      <div ref={ref} style={{ minHeight: 1 }}>
        {Component ? <Component {...props} /> : <LoadingComponent />}
      </div>
    )
  }
}
