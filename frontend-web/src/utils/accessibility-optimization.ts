"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Accessibility optimization utilities for DabaFing web app
 */

/**
 * Check if the user has a screen reader enabled
 * Note: This is not 100% reliable but can provide a hint
 */
export function detectScreenReader(): boolean {
  if (typeof window === "undefined") return false

  // Check for common screen reader indicators
  return (
    // NVDA
    window.navigator.userAgent.includes("NVDA") ||
    // JAWS
    window.navigator.userAgent.includes("JAWS") ||
    // VoiceOver
    (/Apple/.test(window.navigator.vendor) && /Mac/.test(window.navigator.platform)) ||
    // Various detection methods
    "speechSynthesis" in window ||
    // Experimental
    document.documentElement.getAttribute("data-using-screen-reader") === "true"
  )
}

/**
 * Check if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Check if the user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === "undefined") return false

  return window.matchMedia("(prefers-contrast: more)").matches
}

/**
 * Custom hook for managing focus trapping within a component
 */
export function useFocusTrap(active = true) {
  const rootRef = useRef<HTMLElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return

    const root = rootRef.current
    if (!root) return

    // Store the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement

    // Find all focusable elements
    const focusableElements = root.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    if (focusableElements.length === 0) return

    // Focus the first element
    focusableElements[0].focus()

    // Handle tab key to trap focus
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        // If shift+tab and on first element, move to last
        if (document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable.focus()
        }
      } else {
        // If tab and on last element, move to first
        if (document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable.focus()
        }
      }
    }

    root.addEventListener("keydown", handleKeyDown)

    return () => {
      root.removeEventListener("keydown", handleKeyDown)

      // Restore focus when unmounting
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [active])

  return rootRef
}

/**
 * Custom hook for managing focus within a list
 */
export function useListNavigation() {
  const listRef = useRef<HTMLUListElement | null>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const items = Array.from(list.querySelectorAll<HTMLElement>('[role="listitem"], li'))
      const currentIndex = items.findIndex((item) => item === document.activeElement)

      if (currentIndex === -1) return

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault()
          if (currentIndex < items.length - 1) {
            items[currentIndex + 1].focus()
          }
          break
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault()
          if (currentIndex > 0) {
            items[currentIndex - 1].focus()
          }
          break
        case "Home":
          e.preventDefault()
          items[0].focus()
          break
        case "End":
          e.preventDefault()
          items[items.length - 1].focus()
          break
      }
    }

    list.addEventListener("keydown", handleKeyDown)

    return () => {
      list.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return listRef
}

/**
 * Custom hook for announcing messages to screen readers
 */
export function useAnnounce() {
  const [message, setMessage] = useState("")
  const announcerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!message) return

    // Create announcer element if it doesn't exist
    if (!announcerRef.current) {
      const div = document.createElement("div")
      div.setAttribute("aria-live", "assertive")
      div.setAttribute("aria-atomic", "true")
      div.className = "sr-only"
      document.body.appendChild(div)
      announcerRef.current = div
    }

    // Set the message
    announcerRef.current.textContent = message

    // Clear after a short delay
    const timeoutId = setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = ""
      }
    }, 1000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [message])

  return setMessage
}

/**
 * Custom hook for managing keyboard shortcuts
 */
export function useKeyboardShortcut(
  key: string,
  callback: (e: KeyboardEvent) => void,
  options: {
    ctrl?: boolean
    alt?: boolean
    shift?: boolean
    meta?: boolean
    disabled?: boolean
  } = {},
) {
  const { ctrl = false, alt = false, shift = false, meta = false, disabled = false } = options

  useEffect(() => {
    if (disabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        e.ctrlKey === ctrl &&
        e.altKey === alt &&
        e.shiftKey === shift &&
        e.metaKey === meta
      ) {
        callback(e)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [key, ctrl, alt, shift, meta, callback, disabled])
}

/**
 * Generate an accessible color contrast ratio
 */
export function getAccessibleTextColor(backgroundColor: string): string {
  // Convert hex to RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    const r = Number.parseInt(hex.slice(1, 3), 16)
    const g = Number.parseInt(hex.slice(3, 5), 16)
    const b = Number.parseInt(hex.slice(5, 7), 16)
    return [r, g, b]
  }

  // Calculate relative luminance
  const getLuminance = (rgb: [number, number, number]): number => {
    const [r, g, b] = rgb.map((c) => {
      const channel = c / 255
      return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  // Parse the background color
  let rgb: [number, number, number]
  if (backgroundColor.startsWith("#")) {
    rgb = hexToRgb(backgroundColor)
  } else {
    // Default to white if color format is not supported
    rgb = [255, 255, 255]
  }

  // Calculate luminance
  const luminance = getLuminance(rgb)

  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? "#000000" : "#ffffff"
}
