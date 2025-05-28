"use client"

import type React from "react"

import { Suspense, lazy, type ComponentType } from "react"
import { Loader2 } from "lucide-react"

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>
  props?: Record<string, any>
  fallback?: React.ReactNode
}

export function LazyComponent({ component, props = {}, fallback }: LazyComponentProps) {
  const LazyComponent = lazy(component)

  return (
    <Suspense fallback={fallback || <LoadingFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

function LoadingFallback() {
  return (
    <div className="flex h-32 w-full items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  )
}
