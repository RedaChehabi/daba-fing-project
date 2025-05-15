"use client"

import type React from "react"

import { useRef, useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { useVirtualizedList } from "@/utils/render-optimization"
import { useListNavigation } from "@/utils/accessibility-optimization"

interface OptimizedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  getItemKey: (item: T, index: number) => string | number
  className?: string
  itemClassName?: string
  virtualize?: boolean
  itemHeight?: number
  loadMoreThreshold?: number
  onLoadMore?: () => void
  emptyMessage?: React.ReactNode
  loadingMessage?: React.ReactNode
  isLoading?: boolean
  hasMore?: boolean
}

export function OptimizedList<T>({
  items,
  renderItem,
  getItemKey,
  className,
  itemClassName,
  virtualize = false,
  itemHeight = 50,
  loadMoreThreshold = 300,
  onLoadMore,
  emptyMessage = "No items found",
  loadingMessage = "Loading...",
  isLoading = false,
  hasMore = false,
}: OptimizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const accessibilityListRef = useListNavigation()
  const [containerHeight, setContainerHeight] = useState(0)

  // Update container height on resize
  useEffect(() => {
    if (!virtualize) return

    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight)
      }
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(updateHeight)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [virtualize])

  // Set up virtualization
  const virtualizedListResult = useVirtualizedList({
    items,
    itemHeight,
    windowHeight: containerHeight,
    overscan: 5,
  })

  const { visibleItems, totalHeight, offsetY, handleScroll } = virtualize
    ? virtualizedListResult
    : {
        visibleItems: items,
        totalHeight: 0,
        offsetY: 0,
        handleScroll: () => {},
      }

  // Handle infinite loading
  const handleInfiniteScroll = useCallback(() => {
    if (!onLoadMore || !hasMore || isLoading) return

    const container = containerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const scrollBottom = scrollHeight - scrollTop - clientHeight

    if (scrollBottom < loadMoreThreshold) {
      onLoadMore()
    }
  }, [onLoadMore, hasMore, isLoading, loadMoreThreshold])

  // Combine scroll handlers
  const handleCombinedScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      handleScroll(e)
      handleInfiniteScroll()
    },
    [handleScroll, handleInfiniteScroll],
  )

  // Empty state
  if (items.length === 0 && !isLoading) {
    return <div className={cn("py-8 text-center text-muted-foreground", className)}>{emptyMessage}</div>
  }

  return (
    <div
      ref={containerRef}
      className={cn("overflow-auto", className)}
      onScroll={virtualize || onLoadMore ? handleCombinedScroll : undefined}
      style={{ position: "relative" }}
    >
      {virtualize && (
        <div style={{ height: `${totalHeight}px`, position: "relative" }}>
          <ul
            ref={accessibilityListRef}
            className="list-none p-0 m-0"
            role="list"
            style={{ transform: `translateY(${offsetY}px)` }}
          >
            {visibleItems.map((item, index) => (
              <li
                key={getItemKey(item, index)}
                className={cn(itemClassName)}
                role="listitem"
                tabIndex={0}
                style={{ height: `${itemHeight}px` }}
              >
                {renderItem(item, index)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!virtualize && (
        <ul ref={accessibilityListRef} className="list-none p-0 m-0" role="list">
          {items.map((item, index) => (
            <li key={getItemKey(item, index)} className={cn(itemClassName)} role="listitem" tabIndex={0}>
              {renderItem(item, index)}
            </li>
          ))}
        </ul>
      )}

      {isLoading && <div className="py-4 text-center text-muted-foreground">{loadingMessage}</div>}

      {hasMore && !isLoading && onLoadMore && (
        <div className="py-4 text-center">
          <button
            onClick={onLoadMore}
            className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  )
}
