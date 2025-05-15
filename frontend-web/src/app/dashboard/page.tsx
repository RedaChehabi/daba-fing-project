"use client"

import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()

  // Add this function to normalize role names
  const normalizeRole = (role: string) => {
    if (!role) return "";
    if (role.includes("Admin")) return "Admin";
    if (role.includes("Expert")) return "Expert";
    if (role.includes("Regular") || role.includes("User")) return "Regular";
    return role;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>
            You must be logged in to view this page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Get the normalized role
  const normalizedRole = normalizeRole(user.role);

  // Debug information - you can remove this after fixing the issue
  console.log("Original role:", user.role);
  console.log("Normalized role:", normalizedRole);

  // Check if user has a valid role
  if (!normalizedRole || !["Regular", "Expert", "Admin"].includes(normalizedRole)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-destructive mb-4">
          Unknown user role: {user.role || "undefined"}. Cannot display dashboard.
        </div>
        <p>
          Please contact support or try logging in again.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Add a temporary debug display */}
      <div className="bg-yellow-100 p-4 mb-4 rounded-md">
        <h2 className="font-bold">Debug Information</h2>
        <p>Original role: "{user.role}"</p>
        <p>Normalized role: "{normalizedRole}"</p>
      </div>
      
      {normalizedRole === "Admin" && (
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>
                Welcome to the admin dashboard. Here you can manage users, view system statistics, and configure application settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">User Management</h3>
                  <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">System Statistics</h3>
                  <p className="text-sm text-muted-foreground">View system performance and usage metrics</p>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Configuration</h3>
                  <p className="text-sm text-muted-foreground">Configure application settings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {normalizedRole === "Expert" && (
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Expert Dashboard</CardTitle>
              <CardDescription>
                Welcome to the expert dashboard. Here you can analyze fingerprints, review cases, and provide expert opinions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Fingerprint Analysis</h3>
                  <p className="text-sm text-muted-foreground">Analyze and classify fingerprint samples</p>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Case Review</h3>
                  <p className="text-sm text-muted-foreground">Review and provide opinions on cases</p>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Knowledge Base</h3>
                  <p className="text-sm text-muted-foreground">Access expert resources and documentation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {normalizedRole === "Regular" && (
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>User Dashboard</CardTitle>
              <CardDescription>
                Welcome to your dashboard. Here you can upload fingerprints, view your submissions, and track analysis results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Upload Fingerprints</h3>
                  <p className="text-sm text-muted-foreground">Submit new fingerprint samples for analysis</p>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">My Submissions</h3>
                  <p className="text-sm text-muted-foreground">View your submitted fingerprint samples</p>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Analysis Results</h3>
                  <p className="text-sm text-muted-foreground">View results of fingerprint analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
