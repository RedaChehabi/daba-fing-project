'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer } from "@/components/ui/chart";
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
} from "recharts";
import DashboardHeader from './dashboard-header';
import { 
  Users, 
  Activity, 
  Server, 
  CheckCircle, 
  BarChart3, 
  FileCog, 
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  Clock,
  Shield,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { expertApplicationService } from '@/services/api';

// TypeScript interfaces
interface AdminStats {
  totalUsers: number;
  pendingApprovals: number;
  recentAnalyses: number;
  systemHealth: 'Operational' | 'Warning' | 'Critical';
  activeExperts: number;
}

interface UserRoleData {
  role: string;
  count: number;
  color: string;
}

interface SystemMetric {
  name: string;
  value: number;
  timestamp: string;
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'analysis_completed' | 'expert_approval' | 'system_alert';
  description: string;
  timestamp: string;
  severity?: 'low' | 'medium' | 'high';
}

// Sample data
const userRolesData: UserRoleData[] = [
  { role: 'Users', count: 120, color: 'hsl(var(--chart-1))' },
  { role: 'Experts', count: 25, color: 'hsl(var(--chart-2))' },
  { role: 'Admins', count: 5, color: 'hsl(var(--chart-3))' },
];

const systemMetricsData: SystemMetric[] = [
  { name: 'Mon', value: 85, timestamp: '2024-01-01' },
  { name: 'Tue', value: 92, timestamp: '2024-01-02' },
  { name: 'Wed', value: 78, timestamp: '2024-01-03' },
  { name: 'Thu', value: 95, timestamp: '2024-01-04' },
  { name: 'Fri', value: 88, timestamp: '2024-01-05' },
  { name: 'Sat', value: 90, timestamp: '2024-01-06' },
  { name: 'Sun', value: 87, timestamp: '2024-01-07' },
];

const recentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'user_registration',
    description: 'New user registered: john.doe@example.com',
    timestamp: '2024-01-07T10:30:00Z',
    severity: 'low'
  },
  {
    id: '2',
    type: 'analysis_completed',
    description: 'Fingerprint analysis completed for case #12345',
    timestamp: '2024-01-07T09:15:00Z',
    severity: 'medium'
  },
  {
    id: '3',
    type: 'expert_approval',
    description: 'Expert approval pending for Dr. Smith',
    timestamp: '2024-01-07T08:45:00Z',
    severity: 'medium'
  },
  {
    id: '4',
    type: 'system_alert',
    description: 'High CPU usage detected on analysis server',
    timestamp: '2024-01-07T08:00:00Z',
    severity: 'high'
  },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load admin data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get real admin data from analytics endpoint
        let pendingCount = 0;
        let totalUsers = 0;
        const systemHealthStatus: 'Operational' | 'Warning' | 'Critical' = 'Operational';
        
        try {
          // Get expert applications count
          const expertResponse = await expertApplicationService.getAll();
          pendingCount = expertResponse.applications.filter((app) => app.status === 'pending').length;
        } catch (error) {
          console.error('Failed to fetch expert applications:', error);
        }
        
        try {
          // Get analytics data if admin has access
          const analyticsResponse = await fetch('http://localhost:8000/api/admin/analytics/', {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (analyticsResponse.ok) {
            const analyticsData = await analyticsResponse.json();
            totalUsers = analyticsData.users?.total || 0;
            // You can add more metrics here when analytics backend is fully implemented
          }
        } catch (error) {
          console.error('Failed to fetch analytics data:', error);
        }
        
        setStats({
          totalUsers: totalUsers,
          pendingApprovals: pendingCount,
          recentAnalyses: 0, // TODO: Get from real analytics when implemented
          systemHealth: systemHealthStatus,
          activeExperts: 0, // TODO: Get from real analytics when implemented
        });
      } catch (err) {
        console.error('Error loading admin data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Operational': return 'text-green-600';
      case 'Warning': return 'text-yellow-600';
      case 'Critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'Operational': return <CheckCircle className="h-4 w-4" />;
      case 'Warning': return <AlertTriangle className="h-4 w-4" />;
      case 'Critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Server className="h-4 w-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge variant="secondary">Medium</Badge>;
      case 'low': return <Badge variant="outline">Low</Badge>;
      default: return <Badge variant="outline">Info</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          title="Admin Dashboard"
          description="System overview and management tools."
        />
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Admin Dashboard"
        description="System overview and management tools."
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalUsers}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.pendingApprovals}</div>
                <p className="text-xs text-muted-foreground">
                  Requires attention
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Analyses</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.recentAnalyses}</div>
                <p className="text-xs text-muted-foreground">
                  Last 24 hours
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Experts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.activeExperts}</div>
                <p className="text-xs text-muted-foreground">
                  Currently online
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            {loading ? (
              <Skeleton className="h-4 w-4 rounded" />
            ) : (
              <div className={getHealthColor(stats?.systemHealth || '')}>
                {getHealthIcon(stats?.systemHealth || '')}
              </div>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className={`text-2xl font-bold ${getHealthColor(stats?.systemHealth || '')}`}>
                  {stats?.systemHealth}
                </div>
                <p className="text-xs text-muted-foreground">
                  All systems running
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* User Distribution Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Distribution by Role</CardTitle>
            <CardDescription>Number of users in each role category.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-center">
                <div>
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No user distribution data available</p>
                  <p className="text-sm text-muted-foreground">User role analytics will appear here when analytics system is fully implemented</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Tools</CardTitle>
            <CardDescription>Quick access to management sections.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/admin/users" passHref>
              <Button variant="outline" className="w-full justify-start gap-3 hover:bg-muted">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Manage Users</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/dashboard/admin/expert-applications" passHref>
              <Button variant="outline" className="w-full justify-start gap-3 hover:bg-muted">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <span>Expert Applications</span>
                <Badge className="ml-2" variant="secondary">{stats?.pendingApprovals || 0}</Badge>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/dashboard/admin/analytics" passHref>
              <Button variant="outline" className="w-full justify-start gap-3 hover:bg-muted">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span>View Analytics</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/dashboard/admin/status" passHref>
              <Button variant="outline" className="w-full justify-start gap-3 hover:bg-muted">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span>System Status</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/dashboard/admin/reports" passHref>
              <Button variant="outline" className="w-full justify-start gap-3 hover:bg-muted">
                <FileCog className="h-4 w-4 text-muted-foreground" />
                <span>Generate Reports</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics and Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* System Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Server performance metrics over the last week.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : (
              <div className="h-[250px] flex items-center justify-center text-center">
                <div>
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No system performance data available</p>
                  <p className="text-sm text-muted-foreground">System metrics will appear here when monitoring system is implemented</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events and notifications.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                    <div className="flex-shrink-0">
                      {activity.type === 'user_registration' && <Users className="h-4 w-4 text-blue-500" />}
                      {activity.type === 'analysis_completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {activity.type === 'expert_approval' && <Shield className="h-4 w-4 text-yellow-500" />}
                      {activity.type === 'system_alert' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">
                          {formatTimestamp(activity.timestamp)}
                        </p>
                        {activity.severity && getSeverityBadge(activity.severity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No recent activity data available</p>
                <p className="text-xs text-muted-foreground">Activity feed will appear here when activity tracking is implemented</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
