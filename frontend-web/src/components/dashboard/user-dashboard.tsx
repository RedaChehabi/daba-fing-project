import React from 'react';
// import DashboardHeader from './dashboard-header'; // REMOVE THIS IMPORT
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link'; // Import Link for navigation
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
} from "recharts";
// Added icons: Upload, CheckCircle, Clock, History, Settings, Eye
import { Upload, CheckCircle, Clock, History, Settings, Eye } from 'lucide-react';

// Sample data for upload history chart
const uploadHistoryData = [
  { month: 'Jan', uploads: 2 },
  { month: 'Feb', uploads: 1 },
  { month: 'Mar', uploads: 0 },
  { month: 'Apr', uploads: 3 },
  { month: 'May', uploads: 1 },
  { month: 'Jun', uploads: 2 },
];


const UserDashboard = () => {
  // Placeholder data - replace with actual data fetching and logic
  const stats = {
    totalUploads: 9, // Updated to match chart data sum
    analysesCompleted: 6,
    analysesPending: 3,
  };

  const recentUploads = [
    { id: 1, title: 'Left Index', status: 'Analyzed', date: '2023-10-26' },
    { id: 2, title: 'Right Thumb', status: 'Pending', date: '2023-10-27' },
    { id: 3, title: 'Left Thumb', status: 'Analyzed', date: '2023-10-25' },
    // Add more recent uploads
  ];

  // Placeholder for last analysis
  const lastAnalysis = {
    id: 3,
    title: 'Left Thumb',
    classification: 'Whorl',
    confidence: 95.2,
    date: '2023-10-25',
  };


  return (
    <div className="space-y-6"> {/* Removed p-4 md:p-6 if layout handles it */}
      {/* REMOVE the DashboardHeader component usage */}
      {/*
      <DashboardHeader
        title="User Dashboard"
        description="Overview of your fingerprint analysis activity."
      />
      */}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" /> {/* Updated Icon */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUploads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analyses Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" /> {/* Updated Icon */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.analysesCompleted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analyses Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" /> {/* Updated Icon */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.analysesPending}</div>
          </CardContent>
        </Card>
      </div>

      {/* New Section: Quick Actions & Last Analysis */}
      <div className="grid gap-4 md:grid-cols-2">
         {/* Quick Actions Card */}
         <Card>
           <CardHeader>
             <CardTitle>Quick Actions</CardTitle>
             <CardDescription>Common tasks at your fingertips.</CardDescription>
           </CardHeader>
           <CardContent className="flex flex-wrap gap-3">
             <Link href="/dashboard/upload" passHref>
               <Button variant="outline" className="gap-2">
                 <Upload className="h-4 w-4" /> Upload New
               </Button>
             </Link>
             <Link href="/dashboard/history" passHref>
               <Button variant="outline" className="gap-2">
                 <History className="h-4 w-4" /> View History
               </Button>
             </Link>
             <Link href="/dashboard/settings" passHref>
               <Button variant="outline" className="gap-2">
                 <Settings className="h-4 w-4" /> Settings
               </Button>
             </Link>
           </CardContent>
         </Card>

         {/* Last Analysis Summary Card */}
         <Card>
           <CardHeader>
             <CardTitle>Last Analysis Summary</CardTitle>
             <CardDescription>Quick look at your most recent result.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-2">
             {lastAnalysis ? (
               <>
                 <p className="font-medium">{lastAnalysis.title} ({lastAnalysis.date})</p>
                 <p className="text-sm text-muted-foreground">
                   Classification: <span className="font-semibold">{lastAnalysis.classification}</span> ({lastAnalysis.confidence}% confidence)
                 </p>
                 <Link href={`/dashboard/history/${lastAnalysis.id}`} passHref> {/* Adjust link as needed */}
                   <Button variant="link" size="sm" className="p-0 h-auto gap-1">
                     <Eye className="h-3 w-3" /> View Details
                   </Button>
                 </Link>
               </>
             ) : (
               <p className="text-muted-foreground text-sm">No analysis results found yet.</p>
             )}
           </CardContent>
         </Card>
      </div>


      {/* Upload History Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Uploads</CardTitle>
          <CardDescription>Your fingerprint uploads over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ChartContainer
            config={{
              uploads: {
                label: "Uploads",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[200px]" // Adjusted height
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={uploadHistoryData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={30} fontSize={12} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
                  content={({ active, payload, label }) =>
                    active && payload && payload.length ? (
                      <div className="rounded-lg border bg-background p-2 shadow-sm text-sm">
                        {label}: <span className="font-bold">{payload[0]?.value} uploads</span>
                      </div>
                    ) : null
                  }
                 />
                <Bar dataKey="uploads" fill="var(--color-uploads)" radius={3} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>


      {/* Recent Uploads List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>Your latest fingerprint uploads and their status.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentUploads.length > 0 ? (
            <ul className="space-y-3">
              {recentUploads.map((upload) => (
                <li key={upload.id} className="flex justify-between items-center p-3 border rounded hover:bg-muted/50">
                  <div>
                    <p className="font-medium">{upload.title}</p>
                    <p className="text-sm text-muted-foreground">Uploaded: {upload.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${upload.status === 'Analyzed' ? 'bg-success/10 text-success-foreground border border-success/30' : 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/30'}`}> {/* Updated Badges */}
                       {upload.status}
                     </span>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-4">You haven't uploaded any fingerprints yet.</p>
          )}
           <div className="mt-4 text-center">
             <Link href="/dashboard/history" passHref> {/* Changed link to history */}
                <Button variant="link">View Full History</Button> {/* Changed text */}
             </Link>
           </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
