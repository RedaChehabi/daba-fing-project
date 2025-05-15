// File: frontend-web/src/app/dashboard/page.tsx
"use client"

import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// Import specific dashboard components
import AdminDashboard from "@/components/dashboard/admin-dashboard";
import ExpertDashboard from "@/components/dashboard/expert-dashboard";
import UserDashboard from "@/components/dashboard/user-dashboard";


export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect will be handled by DashboardLayout, but good to have a fallback UI
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            You must be logged in to view the dashboard. Redirecting to login...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const userRole = user.role; // Directly use the role from context

  // Debug information - can be removed later
  // console.log("DashboardPage - User role from context:", userRole);

  let dashboardComponent = null;
  if (userRole === "Admin") {
    dashboardComponent = <AdminDashboard />;
  } else if (userRole === "Expert") {
    dashboardComponent = <ExpertDashboard />;
  } else if (userRole === "Regular") {
    dashboardComponent = <UserDashboard />;
  } else {
    // Fallback for unexpected roles or if role is not yet defined during initial load
    dashboardComponent = (
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user.username}!</CardTitle>
          <CardDescription>
            Your role is currently "{user.role}". Specific dashboard content is being prepared.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>If you believe your role is incorrect, please contact support.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    // The container and h1 are removed as they are now expected to be part of the
    // AdminDashboard, ExpertDashboard, or UserDashboard components themselves for better encapsulation.
    // If those components do NOT include their own title like "Admin Dashboard",
    // you might want to add a generic title here based on role.
    // For example:
    // <div className="container mx-auto py-8 px-4">
    //   <h1 className="text-3xl font-bold mb-6">{userRole} Dashboard</h1>
    //   {dashboardComponent}
    // </div>
    <>
        {dashboardComponent}
    </>
  );
}