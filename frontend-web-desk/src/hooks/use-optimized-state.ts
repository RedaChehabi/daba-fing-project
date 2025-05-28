"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { debounce, throttle } from "../utils/performance"

// Hook for state that only updates when the value has changed
export function useDeepCompareState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState)
  const previousStateRef = useRef<T>(initialState)

  const setStateIfChanged = useCallback((newState: T | ((prevState: T) => T)) => {
    setState((prevState) => {
      const nextState = typeof newState === "function" ? (newState as (prevState: T) => T)(prevState) : newState

      // Simple deep comparison for objects
      const isEqual = JSON.stringify(prevState) === JSON.stringify(nextState)

      if (isEqual) {
        return prevState
      }

      previousStateRef.current = nextState
      return nextState
    })
  }, [])

  return [state, setStateIfChanged] as const
}

// Hook for debounced state updates
export function useDebouncedState<T>(initialState: T, delay = 300) {
  const [state, setState] = useState<T>(initialState)
  const [debouncedState, setDebouncedState] = useState<T>(initialState)

  const debouncedSetState = useCallback(
    debounce((value: T) => {
      setDebouncedState(value)
    }, delay),
    [delay],
  )

  const updateState = useCallback(
    (value: T | ((prevState: T) => T)) => {
      setState((prevState) => {
        const nextState = typeof value === "function" ? (value as (prevState: T) => T)(prevState) : value

        debouncedSetState(nextState)
        return nextState
      })
    },
    [debouncedSetState],
  )

  return [state, updateState, debouncedState] as const
}

// Hook for throttled state updates
export function useThrottledState<T>(initialState: T, limit = 300) {
  const [state, setState] = useState<T>(initialState)
  const [throttledState, setThrottledState] = useState<T>(initialState)

  const throttledSetState = useCallback(
    throttle((value: T) => {
      setThrottledState(value)
    }, limit),
    [limit],
  )

  const updateState = useCallback(
    (value: T | ((prevState: T) => T)) => {
      setState((prevState) => {
        const nextState = typeof value === "function" ? (value as (prevState: T) => T)(prevState) : value

        throttledSetState(nextState)
        return nextState
      })
    },
    [throttledSetState],
  )

  return [state, updateState, throttledState] as const
}

// Hook for memoized state that prevents unnecessary re-renders
export function useMemoizedState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState)
  const stateRef = useRef<T>(initialState)

  const updateState = useCallback((value: T | ((prevState: T) => T)) => {
    const nextState = typeof value === "function" ? (value as (prevState: T) => T)(stateRef.current) : value

    // Only update if the value has changed
    if (JSON.stringify(stateRef.current) !== JSON.stringify(nextState)) {
      stateRef.current = nextState
      setState(nextState)
    }
  }, [])

  // Keep the ref in sync with state
  useEffect(() => {
    stateRef.current = state
  }, [state])

  return [state, updateState] as const
}
