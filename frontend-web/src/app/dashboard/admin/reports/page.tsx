"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"
import { Download, Users, BarChart, User, Settings, Eye } from "lucide-react"
import { ChartContainer } from "@/components/ui/chart"
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

// Sample data - replace with actual API calls
const sampleData = {
  userActivity: [
    { name: "Jan", uploads: 400, verifications: 240 },
    { name: "Feb", uploads: 300, verifications: 139 },
    { name: "Mar", uploads: 200, verifications: 980 },
    { name: "Apr", uploads: 278, verifications: 390 },
    { name: "May", uploads: 189, verifications: 480 },
    { name: "Jun", uploads: 239, verifications: 380 },
    { name: "Jul", uploads: 349, verifications: 430 },
  ],
  systemPerformance: [
    { name: "Jan", apiLatency: 120, processingTime: 240 },
    { name: "Feb", apiLatency: 98, processingTime: 139 },
    { name: "Mar", apiLatency: 86, processingTime: 180 },
    { name: "Apr", apiLatency: 99, processingTime: 239 },
    { name: "May", apiLatency: 85, processingTime: 180 },
    { name: "Jun", apiLatency: 65, processingTime: 150 },
    { name: "Jul", apiLatency: 70, processingTime: 160 },
  ],
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2023, 0, 1),
    to: new Date(),
  })
  const [activeTab, setActiveTab] = useState("activity")

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting report for:", dateRange)
  }

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Generate and analyze system reports and statistics</p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker value={dateRange} onValueChange={setDateRange} />
          <Button onClick={handleExport} className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity" className="gap-2">
            <Users className="h-4 w-4" />
            User Activity
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <BarChart className="h-4 w-4" />
            System Performance
          </TabsTrigger>
          <TabsTrigger value="usage" className="gap-2">
            <User className="h-4 w-4" />
            Usage Patterns
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Report Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Overview of uploads and verifications over time</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <ChartContainer
                config={{
                  uploads: {
                    label: "Uploads",
                    color: "hsl(var(--chart-1))",
                  },
                  verifications: {
                    label: "Verifications",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={sampleData.userActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="uploads" fill="var(--color-uploads)" />
                    <Bar dataKey="verifications" fill="var(--color-verifications)" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,955</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verifications</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,848</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-muted-foreground">+201 since last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.3%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <CardDescription>API latency and processing time metrics</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <ChartContainer
                config={{
                  apiLatency: {
                    label: "API Latency (ms)",
                    color: "hsl(var(--chart-3))",
                  },
                  processingTime: {
                    label: "Processing Time (ms)",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={sampleData.systemPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="apiLatency" fill="var(--color-apiLatency)" />
                    <Bar dataKey="processingTime" fill="var(--color-processingTime)" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Patterns</CardTitle>
              <CardDescription>Analysis of how users interact with the system</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Usage pattern data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Settings</CardTitle>
              <CardDescription>Configure your report preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Report settings will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
