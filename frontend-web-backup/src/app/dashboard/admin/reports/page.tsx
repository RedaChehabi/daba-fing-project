"use client"

import { useState, useEffect } from "react"
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

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2023, 0, 1),
    to: new Date(),
  })
  const [activeTab, setActiveTab] = useState("activity")
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load real report data from analytics API
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          return;
        }

        const response = await fetch('http://localhost:8000/api/admin/analytics/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Reports API error: ${response.status}`);
        }

        const data = await response.json();
        const analyticsData = data.analytics;
        
        setReportData({
          userActivity: analyticsData.uploads.monthly || [],
          systemPerformance: [],
          totalUploads: analyticsData.uploads.total || 0,
          verifications: analyticsData.analyses.completed || 0,
          activeUsers: analyticsData.users.total || 0,
          successRate: analyticsData.analyses.success_rate || 0
        })
      } catch (err) {
        console.error('Error loading report data:', err)
        setError('Failed to load reports data')
        setReportData({
          userActivity: [],
          systemPerformance: [],
          totalUploads: 0,
          verifications: 0,
          activeUsers: 0,
          successRate: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchReportData()
  }, [dateRange])

  const handleExport = () => {
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
          <DateRangePicker />
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
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={reportData?.userActivity}>
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
                <div className="text-2xl font-bold">{reportData?.totalUploads}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verifications</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData?.verifications}</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData?.activeUsers}</div>
                <p className="text-xs text-muted-foreground">+201 since last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData?.successRate}%</div>
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
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={reportData?.systemPerformance}>
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
