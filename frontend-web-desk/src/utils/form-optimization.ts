"use client"

/**
 * Form handling optimization utilities for DabaFing web app
 */

import { useState, useCallback, useRef } from "react"
import { debounce } from "./performance"

/**
 * Custom hook for form validation
 */
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: {
    [K in keyof T]?: (value: T[K], formValues: T) => string | null
  },
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  // Validate a single field
  const validateField = useCallback(
    (name: keyof T, value: any, formValues: T) => {
      const rule = validationRules[name]
      if (!rule) return null

      return rule(value, formValues)
    },
    [validationRules],
  )

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    Object.keys(validationRules).forEach((key) => {
      const fieldKey = key as keyof T
      const error = validateField(fieldKey, values[fieldKey], values)

      if (error) {
        newErrors[fieldKey] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [validateField, validationRules, values])

  // Handle field change
  const handleChange = useCallback(
    (name: keyof T, value: any) => {
      setValues((prev) => {
        const newValues = { ...prev, [name]: value }

        // Validate field if it's been touched
        if (touched[name]) {
          const error = validateField(name, value, newValues)
          setErrors((prev) => ({ ...prev, [name]: error || undefined }))
        }

        return newValues
      })
    },
    [touched, validateField],
  )

  // Handle field blur
  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched((prev) => ({ ...prev, [name]: true }))

      // Validate field on blur
      const error = validateField(name, values[name], values)
      setErrors((prev) => ({ ...prev, [name]: error || undefined }))
    },
    [validateField, values],
  )

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues,
  }
}

/**
 * Custom hook for debounced form submission
 */
export function useDebouncedSubmit<T>(onSubmit: (values: T) => Promise<void> | void, debounceTime = 500) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<Error | null>(null)

  // Create debounced submit function
  const debouncedSubmit = useRef(
    debounce(async (values: T) => {
      setIsSubmitting(true)
      setSubmitError(null)

      try {
        await onSubmit(values)
      } catch (error) {
        setSubmitError(error instanceof Error ? error : new Error(String(error)))
      } finally {
        setIsSubmitting(false)
      }
    }, debounceTime),
  ).current

  return {
    submit: debouncedSubmit,
    isSubmitting,
    submitError,
    clearError: () => setSubmitError(null),
  }
}

/**
 * Optimize form data for submission
 */
export function optimizeFormData(data: Record<string, any>): FormData {
  const formData = new FormData()

  // Process each field
  Object.entries(data).forEach(([key, value]) => {
    // Skip null or undefined values
    if (value === null || value === undefined) return

    // Handle File objects
    if (value instanceof File) {
      formData.append(key, value)
      return
    }

    // Handle arrays
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File) {
          formData.append(`${key}[${index}]`, item)
        } else {
          formData.append(`${key}[${index}]`, String(item))
        }
      })
      return
    }

    // Handle objects
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value))
      return
    }

    // Handle primitive values
    formData.append(key, String(value))
  })

  return formData
}
