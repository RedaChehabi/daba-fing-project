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
  Filter
} from "lucide-react";

// TypeScript interfaces
interface AnalyticsMetric {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  description: string;
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

// Sample data
const userActivityData: UserActivityData[] = [
  { month: "Jan", activeUsers: 120, newUsers: 45, returningUsers: 75 },
  { month: "Feb", activeUsers: 150, newUsers: 60, returningUsers: 90 },
  { month: "Mar", activeUsers: 180, newUsers: 70, returningUsers: 110 },
  { month: "Apr", activeUsers: 210, newUsers: 85, returningUsers: 125 },
  { month: "May", activeUsers: 250, newUsers: 95, returningUsers: 155 },
  { month: "Jun", activeUsers: 300, newUsers: 110, returningUsers: 190 },
];

const scanAnalyticsData: ScanAnalyticsData[] = [
  { month: "Jan", uploaded: 423, analyzed: 350, pending: 50, failed: 23 },
  { month: "Feb", uploaded: 530, analyzed: 460, pending: 45, failed: 25 },
  { month: "Mar", uploaded: 702, analyzed: 650, pending: 35, failed: 17 },
  { month: "Apr", uploaded: 721, analyzed: 700, pending: 15, failed: 6 },
  { month: "May", uploaded: 840, analyzed: 790, pending: 30, failed: 20 },
  { month: "Jun", uploaded: 950, analyzed: 900, pending: 25, failed: 25 },
];

const systemPerformanceData: SystemPerformanceData[] = [
  { time: "00:00", cpuUsage: 45, memoryUsage: 62, diskUsage: 78, responseTime: 120 },
  { time: "04:00", cpuUsage: 32, memoryUsage: 58, diskUsage: 78, responseTime: 95 },
  { time: "08:00", cpuUsage: 68, memoryUsage: 72, diskUsage: 79, responseTime: 180 },
  { time: "12:00", cpuUsage: 85, memoryUsage: 85, diskUsage: 80, responseTime: 220 },
  { time: "16:00", cpuUsage: 92, memoryUsage: 88, diskUsage: 81, responseTime: 250 },
  { time: "20:00", cpuUsage: 75, memoryUsage: 80, diskUsage: 82, responseTime: 190 },
];

const expertAnalyticsData: ExpertAnalyticsData[] = [
  { expert: "Dr. Smith", casesAssigned: 45, casesCompleted: 42, avgResponseTime: 2.5, accuracy: 98.5 },
  { expert: "Dr. Johnson", casesAssigned: 38, casesCompleted: 35, avgResponseTime: 3.2, accuracy: 97.8 },
  { expert: "Dr. Williams", casesAssigned: 52, casesCompleted: 48, avgResponseTime: 2.8, accuracy: 99.1 },
  { expert: "Dr. Brown", casesAssigned: 41, casesCompleted: 39, avgResponseTime: 3.5, accuracy: 96.9 },
];

const analysisTypeData = [
  { name: "Minutiae", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Ridge Pattern", value: 30, color: "hsl(var(--chart-2))" },
  { name: "Core Points", value: 15, color: "hsl(var(--chart-3))" },
  { name: "Delta Points", value: 10, color: "hsl(var(--chart-4))" },
];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const metrics: AnalyticsMetric[] = [
    {
      title: "User Growth",
      value: "+24%",
      change: 24,
      changeType: 'increase',
      icon: <Users className="h-4 w-4" />,
      description: "From last quarter"
    },
    {
      title: "Scan Volume",
      value: "950",
      change: 13,
      changeType: 'increase',
      icon: <Fingerprint className="h-4 w-4" />,
      description: "This month"
    },
    {
      title: "System Load",
      value: "42%",
      change: -5,
      changeType: 'decrease',
      icon: <Server className="h-4 w-4" />,
      description: "Average across servers"
    },
    {
      title: "Response Time",
      value: "1.2s",
      change: -8,
      changeType: 'decrease',
      icon: <Clock className="h-4 w-4" />,
      description: "Average response time"
    },
    {
      title: "Success Rate",
      value: "97.3%",
      change: 2.1,
      changeType: 'increase',
      icon: <CheckCircle className="h-4 w-4" />,
      description: "Analysis accuracy"
    },
    {
      title: "Expert Efficiency",
      value: "94.2%",
      change: 1.5,
      changeType: 'increase',
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Case completion rate"
    },
  ];

  const formatTooltipValue = (value: any, name: string) => {
    if (name.includes('Time')) return `${value}ms`;
    if (name.includes('Usage')) return `${value}%`;
    return value;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Detailed analytics and system performance metrics.</p>
        </div>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
                ) : (
                  <ChartContainer
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={userActivityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={formatTooltipValue} />
                        <Area 
                          type="monotone" 
                          dataKey="activeUsers" 
                          stackId="1" 
                          stroke="var(--color-activeUsers)" 
                          fill="var(--color-activeUsers)" 
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="newUsers" 
                          stackId="2" 
                          stroke="var(--color-newUsers)" 
                          fill="var(--color-newUsers)" 
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
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
                ) : (
                  <ChartContainer
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={userActivityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={formatTooltipValue} />
                        <Bar dataKey="newUsers" fill="var(--color-newUsers)" radius={4} />
                        <Bar dataKey="returningUsers" fill="var(--color-returningUsers)" radius={4} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
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
                ) : (
                  <ChartContainer
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={scanAnalyticsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={formatTooltipValue} />
                        <Line type="monotone" dataKey="uploaded" stroke="var(--color-uploaded)" strokeWidth={2} />
                        <Line type="monotone" dataKey="analyzed" stroke="var(--color-analyzed)" strokeWidth={2} />
                        <Line type="monotone" dataKey="pending" stroke="var(--color-pending)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
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
                ) : (
                  <ChartContainer
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={scanAnalyticsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={formatTooltipValue} />
                        <Bar dataKey="analyzed" fill="var(--color-analyzed)" radius={4} />
                        <Bar dataKey="failed" fill="var(--color-failed)" radius={4} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
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
                <ChartContainer
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={systemPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip formatter={formatTooltipValue} />
                      <Line type="monotone" dataKey="cpuUsage" stroke="var(--color-cpuUsage)" strokeWidth={2} />
                      <Line type="monotone" dataKey="memoryUsage" stroke="var(--color-memoryUsage)" strokeWidth={2} />
                      <Line type="monotone" dataKey="diskUsage" stroke="var(--color-diskUsage)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
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
                  <ChartContainer
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={expertAnalyticsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="expert" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip formatter={formatTooltipValue} />
                        <Bar dataKey="casesAssigned" fill="var(--color-casesAssigned)" radius={4} />
                        <Bar dataKey="casesCompleted" fill="var(--color-casesCompleted)" radius={4} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
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
                  expertAnalyticsData.map((expert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{expert.expert}</p>
                        <p className="text-sm text-muted-foreground">
                          {expert.casesCompleted}/{expert.casesAssigned} cases completed
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant={expert.accuracy > 98 ? "default" : "secondary"}>
                          {expert.accuracy}% accuracy
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {expert.avgResponseTime}h avg response
                        </p>
                      </div>
                    </div>
                  ))
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
                  <ChartContainer
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analysisTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analysisTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
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
                  analysisTypeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Primary analysis method
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{item.value}%</p>
                        <p className="text-xs text-muted-foreground">of total</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
