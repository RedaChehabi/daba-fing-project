import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  title: string;
  description?: string; // Optional description
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, description }) => {
  return (
    <div className="space-y-6"> {/* Base styling for the dashboard page content */}
      <DashboardHeader // <-- ADD THIS COMPONENT INSTANCE
        title="User Dashboard"
        description="Overview of your fingerprint analysis activity."
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* ... Card for Total Uploads ... */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUploads}</div>
          </CardContent>
        </Card>
        {/* ... Card for Analyses Completed ... */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analyses Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" /> {/* Use a success color */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.analysesCompleted}</div>
          </CardContent>
        </Card>
        {/* ... Card for Analyses Pending ... */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analyses Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.analysesPending}</div>
          </CardContent>
        </Card>
      </div>

      {/* ... (rest of UserDashboard JSX: Quick Actions, Last Analysis, Upload History Chart, Recent Uploads List) ... */}
       {/* Quick Actions & Last Analysis */}
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
                 <Link href={`/dashboard/history/${lastAnalysis.id}`} passHref>
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
      {/* ... etc. ... */}
    </div>
  );
};

export default DashboardHeader;