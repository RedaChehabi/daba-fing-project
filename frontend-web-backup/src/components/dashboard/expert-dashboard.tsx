"use client"

import React, { useState, useEffect } from 'react';
import DashboardHeader from './dashboard-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer } from "@/components/ui/chart";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  List, 
  Eye, 
  Play, 
  PieChart, 
  MessageSquareQuote, 
  BookOpen, 
  ArrowRight,
  AlertCircle,
  TrendingUp,
  Award,
  Target
} from 'lucide-react';
import Link from 'next/link';

// Types for better type safety
interface ExpertStats {
  assignedCases: number;
  pendingReview: number;
  completedAnalyses: number;
  averageAccuracy: number;
}

interface CaseItem {
  id: string;
  status: 'Pending Review' | 'Needs Analysis' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  assigned: string;
  type: string;
  submittedBy?: string;
  confidence?: number;
}

interface AnalysisTypeData {
  name: string;
  value: number;
  fill: string;
}

interface PerformanceData {
  month: string;
  completed: number;
  accuracy: number;
}

// Enhanced sample data
const analysisTypeData: AnalysisTypeData[] = [
  { name: 'Feedback Validation', value: 15, fill: '#8884d8' },
  { name: 'Initial Scan Analysis', value: 20, fill: '#82ca9d' },
  { name: 'Anomaly Check', value: 8, fill: '#ffc658' },
  { name: 'Quality Assessment', value: 2, fill: '#ff7300' },
];

const performanceData: PerformanceData[] = [
  { month: 'Jan', completed: 12, accuracy: 94.5 },
  { month: 'Feb', completed: 15, accuracy: 95.2 },
  { month: 'Mar', completed: 8, accuracy: 96.1 },
  { month: 'Apr', completed: 18, accuracy: 94.8 },
  { month: 'May', completed: 22, accuracy: 95.7 },
  { month: 'Jun', completed: 20, accuracy: 96.3 },
];

const ExpertDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [stats, setStats] = useState<ExpertStats>({
    assignedCases: 0,
    pendingReview: 0,
    completedAnalyses: 0,
    averageAccuracy: 0,
  });

  const [caseQueue, setCaseQueue] = useState<CaseItem[]>([]);
  // Note: Using static chart data until expert review system backend is implemented

  // Load expert data from API
  useEffect(() => {
    const fetchExpertData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // TODO: Replace with real expert-specific API endpoints when expert review system is implemented
        // For now, return minimal data since expert review backend isn't built yet
        
        setStats({
          assignedCases: 0,
          pendingReview: 0,
          completedAnalyses: 0,
          averageAccuracy: 0,
        });

        setCaseQueue([]);
        
      } catch (err) {
        console.error('Error loading expert data:', err);
        setError('Failed to load expert dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpertData();
  }, []);

  const getPriorityBadgeVariant = (priority: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusBadge = (status: CaseItem['status']) => {
    const variants = {
      'Pending Review': 'default',
      'Needs Analysis': 'secondary',
      'In Progress': 'outline',
      'Completed': 'default',
    } as const;
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getStatusIcon = (status: CaseItem['status']) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Pending Review':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'In Progress':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'Needs Analysis':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <DashboardHeader 
          title="Expert Dashboard" 
          description="Manage assigned cases and review analyses." 
        />
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
              <p className="text-red-600">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Expert Dashboard"
        description="Manage assigned cases and review analyses."
      />

      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.assignedCases}</div>
                <p className="text-xs text-muted-foreground">Total cases in your queue</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.pendingReview}</div>
                <p className="text-xs text-muted-foreground">Analyses awaiting your feedback</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.completedAnalyses}</div>
                <p className="text-xs text-muted-foreground">Total analyses completed</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Accuracy</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.averageAccuracy}%</div>
                <p className="text-xs text-muted-foreground">Your analysis accuracy</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Analysis Type Distribution Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Analysis Types Handled
            </CardTitle>
            <CardDescription>Distribution of analysis types completed.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="h-64 flex items-center justify-center text-center">
                <div>
                  <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No analysis data available</p>
                  <p className="text-sm text-muted-foreground">Expert review system will show analysis distribution here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expert Tools Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Expert Tools</CardTitle>
            <CardDescription>Quick access to relevant sections.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/verify" passHref>
              <Button variant="outline" className="w-full justify-start gap-3">
                <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
                <span>Review Feedback Queue</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/dashboard/knowledge-base" passHref>
              <Button variant="outline" className="w-full justify-start gap-3">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>Knowledge Base</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/dashboard/performance" passHref>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span>Performance Metrics</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Trends
          </CardTitle>
          <CardDescription>Your monthly completion rate and accuracy trends</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="h-64 flex items-center justify-center text-center">
              <div>
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No performance data available</p>
                <p className="text-sm text-muted-foreground">Performance trends will appear here when you complete expert reviews</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Case Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Case Queue
          </CardTitle>
          <CardDescription>List of assigned cases requiring your attention.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : caseQueue.length > 0 ? (
            <div className="space-y-3">
              {caseQueue.map((caseItem) => (
                <div key={caseItem.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    {getStatusIcon(caseItem.status)}
                    <div>
                      <div className="font-semibold">
                        {caseItem.id} - <span className="text-sm text-muted-foreground">{caseItem.type}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant={getPriorityBadgeVariant(caseItem.priority)}>
                          {caseItem.priority} Priority
                        </Badge>
                        {getStatusBadge(caseItem.status)}
                        <span className="text-xs text-muted-foreground">by {caseItem.submittedBy}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Assigned: {caseItem.assigned}
                        {caseItem.confidence && (
                          <span className="ml-2">Confidence: {caseItem.confidence}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {caseItem.status === "Pending Review" && (
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none gap-1">
                        <Eye className="h-4 w-4" /> Review
                      </Button>
                    )}
                    {caseItem.status === "Needs Analysis" && (
                      <Button size="sm" className="flex-1 sm:flex-none gap-1">
                        <Play className="h-4 w-4" /> Start Analysis
                      </Button>
                    )}
                    {caseItem.status === "In Progress" && (
                      <Button size="sm" variant="secondary" className="flex-1 sm:flex-none gap-1">
                        <Eye className="h-4 w-4" /> Continue
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Your case queue is empty</p>
              <p className="text-sm text-muted-foreground">New cases will appear here when assigned to you</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpertDashboard;
