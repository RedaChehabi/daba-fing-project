"use client"

import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react"
import { performanceConfig } from "@/config/performance-config"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { OptimizationTips } from "@/components/optimization-tips"
import { detectMemoryLeaks } from "@/utils/memory-optimization"
import { isSlowConnection } from "@/utils/network-optimization"

interface PerformanceContextType {
  isLowEndDevice: boolean
  isSlowConnection: boolean
  disableAnimations: boolean
  optimizeImages: boolean
  optimizeRendering: boolean
  enableMonitoring: boolean
}

const PerformanceContext = createContext<PerformanceContextType>({
  isLowEndDevice: false,
  isSlowConnection: false,
  disableAnimations: false,
  optimizeImages: true,
  optimizeRendering: true,
  enableMonitoring: false,
})

export function usePerformance() {
  return useContext(PerformanceContext)
}

interface PerformanceProviderProps {
  children: ReactNode
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)
  const [isSlowConn, setIsSlowConn] = useState(false)
  const [disableAnimations, setDisableAnimations] = useState(false)
  const [showMonitor, setShowMonitor] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const memoryLeakDetectorRef = useRef<() => void | null>(null)

  // Detect device capabilities on mount
  useEffect(() => {
    // Check for low-end device
    const checkDeviceCapabilities = () => {
      // Check device memory
      if ("deviceMemory" in navigator) {
        const memory = (navigator as any).deviceMemory
        setIsLowEndDevice(memory <= 2) // 2GB or less is considered low-end
      }

      // Check connection speed
      const slowConn = isSlowConnection()
      setIsSlowConn(slowConn)

      // Determine if animations should be disabled
      const shouldDisableAnimations =
        slowConn ||
        isLowEndDevice ||
        (typeof window !== "undefined" &&
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches)

      setDisableAnimations(shouldDisableAnimations)
    }

    checkDeviceCapabilities()

    // Set up memory leak detection in development
    if (process.env.NODE_ENV === "development" && performanceConfig.features.enableMemoryMonitoring) {
      memoryLeakDetectorRef.current = detectMemoryLeaks(30000, 5)
    }

    // Show performance monitor in development
    if (process.env.NODE_ENV === "development" && performanceConfig.features.enablePerformanceMonitoring) {
      setShowMonitor(true)
    }

    // Show optimization tips
    if (performanceConfig.features.enableOptimizationTips) {
      setShowTips(true)
    }

    // Clean up
    return () => {
      if (memoryLeakDetectorRef.current) {
        memoryLeakDetectorRef.current()
      }
    }
  }, [])

  const contextValue = {
    isLowEndDevice,
    isSlowConnection: isSlowConn,
    disableAnimations,
    optimizeImages: true,
    optimizeRendering: true,
    enableMonitoring: process.env.NODE_ENV === "development",
  }

  return (
    <PerformanceContext.Provider value={contextValue}>
      {showTips && <OptimizationTips />}
      {children}
      {showMonitor && <PerformanceMonitor visible={true} />}
    </PerformanceContext.Provider>
  )
}
