"use client"

import type React from "react"
import { useEffect, useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Only run authentication check once component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // Memoize the authentication check to prevent unnecessary re-renders
  const shouldRedirect = useMemo(() => {
    return mounted && !loading && !isAuthenticated
  }, [mounted, loading, isAuthenticated])

  // Use callback to prevent recreation on each render
  const handleRedirect = useCallback(() => {
    if (shouldRedirect) {
      router.push("/auth/login")
    }
  }, [shouldRedirect, router])

  // Redirect to login if not authenticated
  useEffect(() => {
    handleRedirect()
  }, [handleRedirect])

  // Show loading state
  if (loading || !mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If not authenticated and not loading, don't render anything
  // (will be redirected by the useEffect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 md:p-6">{children}</div>
      </div>
    </div>
  )
}
