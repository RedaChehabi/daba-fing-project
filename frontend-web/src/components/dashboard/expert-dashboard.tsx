"use client"

import React from 'react';
// import DashboardHeader from './dashboard-header'; // Ensure this import is removed or commented out
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// Import chart components
import { ChartContainer } from "@/components/ui/chart";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart, // Changed to PieChart
  Pie,
  Cell,
  Tooltip,
} from "recharts";
// Import necessary icons from lucide-react
import { FileText, Clock, CheckCircle, List, Eye, Play, PieChart, MessageSquareQuote, BookOpen, ArrowRight } from 'lucide-react'; // Added PieChart, MessageSquareQuote, BookOpen, ArrowRight
import Link from 'next/link'; // Import Link

// Sample data for analysis type chart
const analysisTypeData = [
  { name: 'Feedback Validation', value: 15, fill: 'hsl(var(--chart-1))' },
  { name: 'Initial Scan Analysis', value: 20, fill: 'hsl(var(--chart-2))' },
  { name: 'Anomaly Check', value: 8, fill: 'hsl(var(--chart-3))' },
  { name: 'Quality Assessment', value: 2, fill: 'hsl(var(--chart-4))' },
];


const ExpertDashboard = () => {
  // Placeholder data - replace with actual data fetching and logic
  const stats = {
    assignedCases: 12,
    pendingReview: 3,
    completedAnalyses: 45,
  };

  // More detailed placeholder case data
  const caseQueue = [
    { id: "CASE-12345", status: "Pending Review", priority: "High", assigned: "2 hours ago", type: "Feedback Validation" },
    { id: "CASE-12346", status: "Needs Analysis", priority: "Medium", assigned: "1 day ago", type: "Initial Scan Analysis" },
    { id: "CASE-12347", status: "Pending Review", priority: "Low", assigned: "3 days ago", type: "Anomaly Check" },
  ];

  // Helper to get badge variant based on priority
  const getPriorityBadgeVariant = (priority: string): "destructive" | "warning" | "secondary" => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "warning";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6"> {/* Adjust padding if needed based on layout */}
      {/* REMOVE THIS BLOCK START */}
      {/*
      <DashboardHeader
        title="Expert Dashboard"
        description="Manage assigned cases and review analyses."
      />
      */}
      {/* REMOVE THIS BLOCK END */}


      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignedCases}</div>
            <p className="text-xs text-muted-foreground">Total cases in your queue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReview}</div>
             <p className="text-xs text-muted-foreground">Analyses awaiting your feedback</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Analyses</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedAnalyses}</div>
             <p className="text-xs text-muted-foreground">Total analyses completed</p>
          </CardContent>
        </Card>
      </div>

      {/* New Row: Analysis Type Chart & Quick Links */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Analysis Type Distribution Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" /> {/* Added Icon */}
              Analysis Types Handled
            </CardTitle>
            <CardDescription>Distribution of analysis types completed.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center pt-4 pb-6"> {/* Adjusted padding */}
            <ChartContainer
              config={{}} // Add chart config if needed
              className="mx-auto aspect-square h-[250px] w-full" // Adjusted size
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Tooltip
                    cursor={false}
                    contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                  />
                  <Pie
                    data={analysisTypeData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60} // Make it a donut chart
                    outerRadius={100}
                    paddingAngle={5}
                    labelLine={false} // Hide labels outside
                    // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} // Optional: Add labels inside/outside
                  >
                    {analysisTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quick Links/Tools Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Expert Tools</CardTitle>
            <CardDescription>Quick access to relevant sections.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/verify" passHref> {/* Link to the feedback review page */}
              <Button variant="outline" className="w-full justify-start gap-3">
                <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
                <span>Review Feedback Queue</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/dashboard/knowledge-base" passHref> {/* Example link */}
              <Button variant="outline" className="w-full justify-start gap-3">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>Knowledge Base</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </Link>
             {/* Add more relevant links here */}
          </CardContent>
        </Card>
      </div>


      {/* Enhanced Case List/Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Case Queue
          </CardTitle>
          <CardDescription>List of assigned cases requiring your attention.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {caseQueue.length > 0 ? (
            caseQueue.map((caseItem) => (
              <div key={caseItem.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="mb-2 sm:mb-0">
                  <div className="font-semibold">{caseItem.id} - <span className="text-sm text-muted-foreground">{caseItem.type}</span></div>
                  <div className="flex flex-wrap items-center gap-2 mt-1"> {/* Added flex-wrap */}
                     <Badge variant={getPriorityBadgeVariant(caseItem.priority)}>{caseItem.priority} Priority</Badge>
                     <Badge variant="outline">{caseItem.status}</Badge>
                     <span className="text-xs text-muted-foreground">Assigned: {caseItem.assigned}</span>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0"> {/* Added margin top on small screens */}
                  {caseItem.status === "Pending Review" && (
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none gap-1">
                      <Eye className="h-4 w-4" /> View Details
                    </Button>
                  )}
                  {caseItem.status === "Needs Analysis" && (
                    <Button size="sm" className="flex-1 sm:flex-none gap-1">
                      <Play className="h-4 w-4" /> Start Analysis
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">Your case queue is empty.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpertDashboard;
