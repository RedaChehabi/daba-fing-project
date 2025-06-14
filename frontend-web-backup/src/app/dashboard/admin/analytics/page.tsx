'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Users, 
  Fingerprint, 
  Server, 
  Clock,
  TrendingUp,
  TrendingDown,
  Download,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Filter,
  Scan,
  Shield,
  ChartArea,
  Database,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// TypeScript interfaces
interface AnalyticsMetric {
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  description?: string;
}

interface AnalyticsData {
  users: {
    total: number;
    by_role: {
      admin: number;
      expert: number;
      regular: number;
    };
    growth: Array<{month: string; users: number}>;
  };
  analyses: {
    total: number;
    completed: number;
    success_rate: number;
    avg_processing_time: string;
  };
  uploads: {
    total: number;
    monthly: Array<{month: string; scans: number}>;
  };
  system: {
    status: string;
    uptime: string;
    last_backup: string;
  };
}

interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
  [key: string]: any;
}

interface UserActivityData {
  month: string;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
}

interface ScanAnalyticsData {
  month: string;
  uploaded: number;
  analyzed: number;
  pending: number;
  failed: number;
}

interface SystemPerformanceData {
  time: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  responseTime: number;
}

interface ExpertAnalyticsData {
  expert: string;
  casesAssigned: number;
  casesCompleted: number;
  avgResponseTime: number;
  accuracy: number;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Load real analytics data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
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
          throw new Error(`Analytics API error: ${response.status}`);
        }

        const data = await response.json();
        setAnalyticsData(data.analytics);
        
      } catch (err) {
        console.error('Failed to load analytics data:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  // Helper function to format numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const metrics: AnalyticsMetric[] = analyticsData ? [
    {
      title: "Total Users",
      value: formatNumber(analyticsData.users.total),
      change: "+12%",
      changeType: 'increase',
      icon: <Users className="h-5 w-5" />,
      description: "Registered users in the system"
    },
    {
      title: "Total Analyses",
      value: formatNumber(analyticsData.analyses.total),
      change: `${analyticsData.analyses.success_rate}%`,
      changeType: 'increase',
      icon: <Activity className="h-5 w-5" />,
      description: "Fingerprint analyses completed"
    },
    {
      title: "Success Rate",
      value: `${analyticsData.analyses.success_rate}%`,
      change: "+2.3%",
      changeType: 'increase',
      icon: <TrendingUp className="h-5 w-5" />,
      description: "Analysis accuracy rate"
    },
    {
      title: "System Status",
      value: analyticsData.system.status,
      change: analyticsData.system.uptime,
      changeType: 'neutral',
      icon: <Shield className="h-5 w-5" />,
      description: "Current system health"
    },
    {
      title: "Total Uploads",
      value: formatNumber(analyticsData.uploads.total),
      change: "+8.2%",
      changeType: 'increase',
      icon: <Database className="h-5 w-5" />,
      description: "Total fingerprint uploads"
    },
    {
      title: "Processing Time",
      value: analyticsData.analyses.avg_processing_time,
      change: "-12ms",
      changeType: 'increase',
      icon: <ChartArea className="h-5 w-5" />,
      description: "Average analysis time"
    }
  ] : [];

  const formatTooltipValue = (value: any, name: string) => {
    if (name.includes('Time')) return `${value}ms`;
    if (name.includes('Usage')) return `${value}%`;
    return value;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Detailed analytics and system performance metrics.</p>
          </div>
        </div>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}. Please check your permissions and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading || !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Detailed analytics and system performance metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className="text-muted-foreground">{metric.icon}</div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {metric.changeType === 'increase' ? (
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                    )}
                    <span className={metric.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>
                      {Math.abs(metric.change)}%
                    </span>
                    <span className="ml-1">{metric.description}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">User Activity</TabsTrigger>
          <TabsTrigger value="scans">Scan Analytics</TabsTrigger>
          <TabsTrigger value="system">System Performance</TabsTrigger>
          <TabsTrigger value="experts">Expert Analytics</TabsTrigger>
          <TabsTrigger value="analysis">Analysis Types</TabsTrigger>
        </TabsList>

        {/* User Activity Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Activity Trends</CardTitle>
                <CardDescription>Monthly active users breakdown over time.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : analyticsData?.users?.growth?.length > 0 ? (
                  <ChartContainer
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.users.growth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={formatTooltipValue} />
                        <Area 
                          type="monotone" 
                          dataKey="users" 
                          stackId="1" 
                          stroke="var(--color-activeUsers)" 
                          fill="var(--color-activeUsers)" 
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-center">
                    <div>
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No user activity data available</p>
                      <p className="text-sm text-muted-foreground">Data will appear here when users are more active</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>User retention and engagement metrics.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : analyticsData?.users?.growth?.length > 0 ? (
                  <ChartContainer
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={analyticsData.users.growth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={formatTooltipValue} />
                        <Bar dataKey="users" fill="var(--color-users)" radius={4} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-center">
                    <div>
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No user engagement data available</p>
                      <p className="text-sm text-muted-foreground">User retention metrics will appear here when there's more activity</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scan Analytics Tab */}
        <TabsContent value="scans" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Scan Volume Trends</CardTitle>
                <CardDescription>Fingerprint scans uploaded and processed over time.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : analyticsData?.uploads?.monthly?.length > 0 ? (
                  <ChartContainer
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.uploads.monthly}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={formatTooltipValue} />
                        <Line type="monotone" dataKey="scans" stroke="var(--color-scans)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-center">
                    <div>
                      <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No scan volume data available</p>
                      <p className="text-sm text-muted-foreground">Upload trends will appear here when there are more uploads</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Efficiency</CardTitle>
                <CardDescription>Success rate and failure analysis.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : analyticsData?.uploads?.monthly?.length > 0 ? (
                  <ChartContainer
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={analyticsData.uploads.monthly}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={formatTooltipValue} />
                        <Bar dataKey="scans" fill="var(--color-scans)" radius={4} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-center">
                    <div>
                      <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No processing efficiency data available</p>
                      <p className="text-sm text-muted-foreground">Success/failure metrics will appear here when analysis tracking is enhanced</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Performance Tab */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Resource Usage</CardTitle>
              <CardDescription>Real-time system performance metrics throughout the day.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="h-[400px] flex items-center justify-center text-center">
                  <div>
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">No system performance data available</p>
                    <p className="text-sm text-muted-foreground">System monitoring will appear here when implemented</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expert Analytics Tab */}
        <TabsContent value="experts" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Expert Performance</CardTitle>
                <CardDescription>Case completion rates by expert.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-center">
                    <div>
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No expert performance data available</p>
                      <p className="text-sm text-muted-foreground">Expert analytics will appear here when expert review system is implemented</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expert Efficiency Metrics</CardTitle>
                <CardDescription>Response time and accuracy by expert.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">No expert data available</p>
                    <p className="text-sm text-muted-foreground">Expert efficiency metrics will appear here when experts start reviewing cases</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analysis Types Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Type Distribution</CardTitle>
                <CardDescription>Breakdown of fingerprint analysis methods used.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-center">
                    <div>
                      <ChartArea className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No analysis type data available</p>
                      <p className="text-sm text-muted-foreground">Analysis method distribution will appear here when more analyses are completed</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analysis Method Details</CardTitle>
                <CardDescription>Detailed breakdown of analysis methods and their usage.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">No detailed analysis data available</p>
                    <p className="text-sm text-muted-foreground">Method details will appear here when analysis tracking is implemented</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
