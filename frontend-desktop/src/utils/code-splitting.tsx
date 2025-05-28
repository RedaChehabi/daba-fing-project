import type React from "react"
import { lazy, Suspense, type ComponentType } from "react"

// Fallback loading component
const DefaultFallback = () => (
  <div className="flex items-center justify-center p-4">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
)

// Function to create a lazy-loaded component with error boundary
export function createLazyComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  Fallback: React.ComponentType = DefaultFallback,
  errorFallback?: React.ComponentType<{ error: Error; reset: () => void }>,
) {
  const LazyComponent = lazy(factory)

  return function LazyLoadedComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={Fallback ? <Fallback /> : <DefaultFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}
