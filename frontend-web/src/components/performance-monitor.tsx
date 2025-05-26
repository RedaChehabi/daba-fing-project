"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { monitorLongTasks } from "@/utils/performance"

interface PerformanceMetrics {
  fps: number
  memory: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  } | null
  longTasks: number
  networkRequests: number
}

export function PerformanceMonitor({ visible = false }: { visible?: boolean }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: null,
    longTasks: 0,
    networkRequests: 0,
  })

  useEffect(() => {
    if (!visible) return

    // Only run in development
    if (process.env.NODE_ENV !== "development") return

    let frameCount = 0
    let lastTime = performance.now()
    let animationFrameId: number
    let longTaskObserver: PerformanceObserver | null = null
    let resourceObserver: PerformanceObserver | null = null
    let networkRequestCount = 0

    // Monitor FPS
    const measureFPS = () => {
      frameCount++
      const now = performance.now()

      if (now - lastTime >= 1000) {
        setMetrics((prev) => ({
          ...prev,
          fps: Math.round((frameCount * 1000) / (now - lastTime)),
        }))

        frameCount = 0
        lastTime = now

        // Log memory usage
        if (performance && "memory" in performance) {
          const memory = (performance as any).memory
          setMetrics((prev) => ({
            ...prev,
            memory: {
              usedJSHeapSize: memory.usedJSHeapSize,
              totalJSHeapSize: memory.totalJSHeapSize,
              jsHeapSizeLimit: memory.jsHeapSizeLimit,
            },
          }))
        }
      }

      animationFrameId = requestAnimationFrame(measureFPS)
    }

    // Start measuring FPS
    animationFrameId = requestAnimationFrame(measureFPS)

    // Monitor long tasks
    longTaskObserver = monitorLongTasks()
    if (longTaskObserver) {
      let longTaskCount = 0;
      longTaskObserver.observe({ entryTypes: ["longtask"] })

      // Create a new observer with our callback
      longTaskObserver.disconnect();
      longTaskObserver = new PerformanceObserver((list) => {
        longTaskCount += list.getEntries().length;
        setMetrics((prev) => ({
          ...prev,
          longTasks: longTaskCount,
        }))
      });
      longTaskObserver.observe({ entryTypes: ["longtask"] });
    }

    // Monitor network requests
    try {
      resourceObserver = new PerformanceObserver((list) => {
        const entries = list
          .getEntries()
          .filter((entry: any) => entry.initiatorType === "fetch" || entry.initiatorType === "xmlhttprequest")

        networkRequestCount += entries.length
        setMetrics((prev) => ({
          ...prev,
          networkRequests: networkRequestCount,
        }))
      })

      resourceObserver.observe({ entryTypes: ["resource"] })
    } catch (e) {
      console.error("PerformanceObserver for resources not supported", e)
    }

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      longTaskObserver?.disconnect()
      resourceObserver?.disconnect()
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 opacity-80 hover:opacity-100 transition-opacity">
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm">Performance Monitor</CardTitle>
        </CardHeader>
        <CardContent className="py-2 space-y-2 text-xs">
          <div className="flex justify-between">
            <span>FPS:</span>
            <span
              className={`font-mono ${
                metrics.fps < 30 ? "text-red-500" : metrics.fps < 50 ? "text-yellow-500" : "text-green-500"
              }`}
            >
              {Number.isNaN(metrics.fps) ? "N/A" : metrics.fps}
            </span>
          </div>

          {metrics.memory && (
            <div>
              <div className="flex justify-between">
                <span>Memory Usage:</span>
                <span className="font-mono">
                  {Math.round(metrics.memory.usedJSHeapSize / 1048576)} /{" "}
                  {Math.round(metrics.memory.totalJSHeapSize / 1048576)} MB
                </span>
              </div>
              <Progress
                value={(metrics.memory.usedJSHeapSize / metrics.memory.jsHeapSizeLimit) * 100}
                className="h-1 mt-1"
              />
            </div>
          )}

          <div className="flex justify-between">
            <span>Long Tasks:</span>
            <span className={`font-mono ${metrics.longTasks > 5 ? "text-red-500" : "text-muted-foreground"}`}>
              {metrics.longTasks}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Network Requests:</span>
            <span className="font-mono">{metrics.networkRequests}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
