"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { debounce } from "@/utils/performance"

interface OptimizedFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  helperText?: string
  error?: string
  debounceMs?: number
  validateOnBlur?: boolean
  validateOnChange?: boolean
  onValueChange?: (value: string) => void
  validate?: (value: string) => string | null
  className?: string
  labelClassName?: string
  inputClassName?: string
  helperClassName?: string
  errorClassName?: string
}

export function OptimizedFormInput({
  label,
  helperText,
  error,
  debounceMs = 300,
  validateOnBlur = true,
  validateOnChange = false,
  onValueChange,
  validate,
  className,
  labelClassName,
  inputClassName,
  helperClassName,
  errorClassName,
  id,
  ...props
}: OptimizedFormInputProps) {
  const [localValue, setLocalValue] = useState(props.value || props.defaultValue || "")
  const [localError, setLocalError] = useState<string | null>(error || null)
  const [touched, setTouched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`

  // Create debounced handler for value changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnValueChange = useCallback(
    debounce((value: string) => {
      onValueChange?.(value)
    }, debounceMs),
    [onValueChange, debounceMs],
  )

  // Update local value when prop value changes
  useEffect(() => {
    if (props.value !== undefined && props.value !== localValue) {
      setLocalValue(props.value as string)
    }
  }, [props.value, localValue])

  // Update local error when prop error changes
  useEffect(() => {
    if (error !== undefined) {
      setLocalError(error || null)
    }
  }, [error])

  // Handle validation
  const validateInput = useCallback(
    (value: string) => {
      if (!validate) return null

      const validationError = validate(value)
      setLocalError(validationError)
      return validationError
    },
    [validate],
  )

  // Handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)

    // Call original onChange if provided
    props.onChange?.(e)

    // Validate on change if enabled
    if (validateOnChange && touched) {
      validateInput(newValue)
    }

    // Notify parent with debounce
    debouncedOnValueChange(newValue)
  }

  // Handle blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true)

    // Call original onBlur if provided
    props.onBlur?.(e)

    // Validate on blur if enabled
    if (validateOnBlur) {
      validateInput(e.target.value)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={inputId} className={cn(labelClassName)}>
        {label}
      </Label>

      <Input
        id={inputId}
        ref={inputRef}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={!!localError}
        aria-describedby={localError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        className={cn(localError && "border-destructive focus-visible:ring-destructive", inputClassName)}
        {...props}
      />

      {helperText && !localError && (
        <p id={`${inputId}-helper`} className={cn("text-sm text-muted-foreground", helperClassName)}>
          {helperText}
        </p>
      )}

      {localError && (
        <p id={`${inputId}-error`} className={cn("text-sm text-destructive", errorClassName)} role="alert">
          {localError}
        </p>
      )}
    </div>
  )
}
