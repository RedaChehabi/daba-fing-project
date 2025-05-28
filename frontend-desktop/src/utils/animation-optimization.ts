"use client"

/**
 * Animation optimization utilities for DabaFing web app
 */

import { useEffect, useRef, useState } from "react"

/**
 * Custom hook for optimized animations using requestAnimationFrame
 */
export function useAnimationFrame(callback: (deltaTime: number) => void, dependencies: any[] = []) {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()
  const callbackRef = useRef(callback)

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Set up the animation loop
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

    // Clean up on unmount
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}

/**
 * Custom hook for detecting if animations should be reduced
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if the browser supports matchMedia
    if (typeof window === "undefined" || !window.matchMedia) {
      return
    }

    // Check if the user prefers reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    // Add listener for changes
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange)
      return () => {
        mediaQuery.removeEventListener("change", handleChange)
      }
    }

    // Legacy browsers
    mediaQuery.addListener(handleChange)
    return () => {
      mediaQuery.removeListener(handleChange)
    }
  }, [])

  return prefersReducedMotion
}

/**
 * Custom hook for spring animations
 */
export function useSpring(
  targetValue: number,
  config: {
    stiffness?: number
    damping?: number
    precision?: number
  } = {},
) {
  const { stiffness = 0.1, damping = 0.8, precision = 0.01 } = config

  const [value, setValue] = useState(targetValue)
  const [velocity, setVelocity] = useState(0)
  const isAnimating = useRef(false)

  useEffect(() => {
    let animationFrameId: number
    isAnimating.current = true

    const animate = () => {
      // Calculate spring physics
      const force = stiffness * (targetValue - value)
      const newVelocity = velocity * damping + force
      const newValue = value + newVelocity

      // Update state
      setValue(newValue)
      setVelocity(newVelocity)

      // Check if we've reached the target
      const isSettled = Math.abs(newValue - targetValue) < precision && Math.abs(newVelocity) < precision

      if (isSettled) {
        // Snap to exact value
        setValue(targetValue)
        setVelocity(0)
        isAnimating.current = false
      } else if (isAnimating.current) {
        // Continue animation
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      isAnimating.current = false
      cancelAnimationFrame(animationFrameId)
    }
  }, [targetValue, value, velocity, stiffness, damping, precision])

  return value
}

/**
 * Utility to create CSS keyframe animations dynamically
 */
export function createKeyframeAnimation(
  name: string,
  keyframes: Record<string, Record<string, string | number>>,
): string {
  let animation = `@keyframes ${name} {\n`

  Object.entries(keyframes).forEach(([key, styles]) => {
    animation += `  ${key} {\n`

    Object.entries(styles).forEach(([prop, value]) => {
      animation += `    ${prop}: ${value};\n`
    })

    animation += "  }\n"
  })

  animation += "}\n"

  return animation
}

/**
 * Utility to add a keyframe animation to the document
 */
export function injectKeyframes(name: string, keyframes: Record<string, Record<string, string | number>>): void {
  if (typeof document === "undefined") return

  // Check if animation already exists
  const existingStyle = document.getElementById(`keyframe-${name}`)
  if (existingStyle) return

  // Create style element
  const style = document.createElement("style")
  style.id = `keyframe-${name}`
  style.innerHTML = createKeyframeAnimation(name, keyframes)

  // Add to document head
  document.head.appendChild(style)
}
