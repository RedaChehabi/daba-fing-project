"use client"

import type React from "react"

import { useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFocusTrap } from "@/utils/accessibility-optimization"
import { X } from "lucide-react"

interface OptimizedModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
  closeOnEscape?: boolean
  closeOnOutsideClick?: boolean
  preventScroll?: boolean
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

export function OptimizedModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  preventScroll = true,
  size = "md",
}: OptimizedModalProps) {
  const rootRef = useFocusTrap(isOpen)

  // Handle close on escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose, closeOnEscape])

  // Handle close on outside click
  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (!closeOnOutsideClick || !rootRef.current) return

      if (!rootRef.current.contains(event.target as Node)) {
        onClose()
      }
    },
    [onClose, closeOnOutsideClick, rootRef],
  )

  useEffect(() => {
    if (!isOpen) return

    // Add event listener when modal is open
    document.addEventListener("mousedown", handleOutsideClick)

    // Prevent scrolling on the body
    if (preventScroll) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      // Remove event listener when modal is closed
      document.removeEventListener("mousedown", handleOutsideClick)

      // Restore scrolling on the body
      if (preventScroll) {
        document.body.style.overflow = ""
      }
    }
  }, [isOpen, handleOutsideClick, preventScroll])

  // Size mapping
  const sizeClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    full: "sm:max-w-full",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        ref={rootRef as React.RefObject<HTMLDivElement>}
        className={cn(
          "sm:rounded-lg border bg-card text-card-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out data-[state=open]:zoom-in-100 data-[state=open]:fade-in",
          sizeClasses[size],
          className,
        )}
      >
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {showCloseButton && (
          <DialogClose
            asChild
            className="absolute right-4 top-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        )}
      </DialogContent>
    </Dialog>
  )
}
