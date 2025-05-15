import React from 'react';
// import DashboardHeader from './dashboard-header'; // REMOVE THIS IMPORT
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// Import chart components
import { ChartContainer } from "@/components/ui/chart";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
// Added icons: Users, Activity, Server, CheckCircle, BarChart3, FileCog, ArrowRight
import { Users, Activity, Server, CheckCircle, BarChart3, FileCog, ArrowRight } from 'lucide-react';
import Link from 'next/link'; // Import Link
import { Button } from '@/components/ui/button'; // Import Button

// Sample data for the chart
const userRolesData = [
  { role: 'User', count: 120 },
  { role: 'Expert', count: 25 },
  { role: 'Admin', count: 5 },
];

const AdminDashboard = () => {
  // Placeholder data - replace with actual data fetching and logic
  const stats = {
    totalUsers: 150,
    pendingApprovals: 5,
    recentAnalyses: 25,
    systemHealth: 'Operational',
  };

  return (
    <div className="space-y-6"> {/* Removed p-4 md:p-6 if layout handles it */}
       {/* REMOVE the DashboardHeader component usage */}
       {/*
       <DashboardHeader
        title="Admin Dashboard"
        description="System overview and management tools."
      />
      */}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" /> {/* Updated Icon */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" /> {/* Updated Icon */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            {/* <p className="text-xs text-muted-foreground">+180.1% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Analyses</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" /> {/* Updated Icon */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentAnalyses}</div>
            {/* <p className="text-xs text-muted-foreground">+19% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" /> {/* Updated Icon */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.systemHealth}</div>
            {/* <p className="text-xs text-muted-foreground">+201 since last hour</p> */}
          </CardContent>
        </Card>
      </div>

      {/* User Roles Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Distribution by Role</CardTitle>
          <CardDescription>Number of users in each role category.</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ChartContainer
            config={{
              count: {
                label: "Users",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[250px]" // Adjusted height
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={userRolesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="role" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={30} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
                  content={({ active, payload, label }) =>
                    active && payload && payload.length ? (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Role
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {label}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Count
                            </span>
                            <span className="font-bold">
                              {payload[0]?.value}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : null
                  }
                 />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* User Roles Chart & Admin Links Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* User Roles Chart */}
        <Card className="lg:col-span-2"> {/* Make chart take 2 columns on large screens */}
          <CardHeader>
            <CardTitle>User Distribution by Role</CardTitle>
            <CardDescription>Number of users in each role category.</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <ChartContainer
              config={{
                count: {
                  label: "Users",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[250px]" // Adjusted height
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={userRolesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="role" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={30} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
                    content={({ active, payload, label }) =>
                      active && payload && payload.length ? (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Role
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {label}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Count
                              </span>
                              <span className="font-bold">
                                {payload[0]?.value}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : null
                    }
                   />
                  <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Admin Quick Links Card */}
        <Card className="lg:col-span-1"> {/* Make links take 1 column */}
          <CardHeader>
            <CardTitle>Admin Tools</CardTitle>
            <CardDescription>Quick access to management sections.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/admin/users" passHref>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Manage Users</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/dashboard/admin/analytics" passHref>
              <Button variant="outline" className="w-full justify-start gap-3">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span>View Analytics</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </Link>
             <Link href="/dashboard/admin/status" passHref>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span>System Status</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/dashboard/admin/reports" passHref>
              <Button variant="outline" className="w-full justify-start gap-3">
                <FileCog className="h-4 w-4 text-muted-foreground" />
                <span>Generate Reports</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>


      {/* Removed Placeholder Cards for User Management and System Logs */}

    </div>
  );
};

export default AdminDashboard;
