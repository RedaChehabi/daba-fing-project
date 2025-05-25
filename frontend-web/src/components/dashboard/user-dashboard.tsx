'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from './dashboard-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { expertApplicationService, type ExpertApplication } from '@/services/api';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { ChartContainer } from "@/components/ui/chart";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { 
  Upload, 
  CheckCircle, 
  Clock, 
  History, 
  Settings, 
  Eye, 
  TrendingUp,
  AlertCircle,
  FileText,
  Star,
  Award,UserCheck, Send 
} from 'lucide-react';
import ExpertApplicationForm from '../expert-application/expert-application-form';

// Types for better type safety
interface UploadStats {
  totalUploads: number;
  analysesCompleted: number;
  analysesPending: number;
  analysesFailed?: number;
}

interface RecentUpload {
  id: number;
  title: string;
  status: 'Analyzed' | 'Pending' | 'Failed' | 'Processing';
  date: string;
  confidence?: number;
}

interface LastAnalysis {
  id: number;
  title: string;
  classification: string;
  confidence: number;
  date: string;
}

interface UploadHistoryData {
  month: string;
  uploads: number;
  completed: number;
}

// Enhanced sample data
const uploadHistoryData: UploadHistoryData[] = [
  { month: 'Jan', uploads: 2, completed: 2 },
  { month: 'Feb', uploads: 1, completed: 1 },
  { month: 'Mar', uploads: 0, completed: 0 },
  { month: 'Apr', uploads: 3, completed: 2 },
  { month: 'May', uploads: 1, completed: 1 },
  { month: 'Jun', uploads: 2, completed: 1 },
];

const classificationData = [
  { name: 'Whorl', value: 35, color: '#8884d8' },
  { name: 'Loop', value: 45, color: '#82ca9d' },
  { name: 'Arch', value: 20, color: '#ffc658' },
];

// Add new interface for expert application status
interface ExpertApplicationStatus {
  id?: number;
  status?: 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
  application_date?: string;
  review_date?: string;
  review_notes?: string;
  can_apply_again?: boolean;
  can_apply?: boolean;
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Enhanced stats with error handling
  const [stats, setStats] = useState<UploadStats>({
    totalUploads: 0,
    analysesCompleted: 0,
    analysesPending: 0,
    analysesFailed: 0,
  });

  const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);
  const [lastAnalysis, setLastAnalysis] = useState<LastAnalysis | null>(null);

  // Simulate data fetching
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set mock data
        setStats({
          totalUploads: 9,
          analysesCompleted: 6,
          analysesPending: 2,
          analysesFailed: 1,
        });

        setRecentUploads([
          { id: 1, title: 'Left Index', status: 'Analyzed', date: '2023-10-26', confidence: 94.5 },
          { id: 2, title: 'Right Thumb', status: 'Pending', date: '2023-10-27' },
          { id: 3, title: 'Left Thumb', status: 'Analyzed', date: '2023-10-25', confidence: 95.2 },
          { id: 4, title: 'Right Index', status: 'Failed', date: '2023-10-24' },
          { id: 5, title: 'Left Middle', status: 'Processing', date: '2023-10-28' },
        ]);

        setLastAnalysis({
          id: 3,
          title: 'Left Thumb',
          classification: 'Whorl',
          confidence: 95.2,
          date: '2023-10-25',
        });
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: RecentUpload['status']) => {
    const variants = {
      'Analyzed': 'default',
      'Pending': 'secondary',
      'Failed': 'destructive',
      'Processing': 'outline',
    } as const;
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getStatusIcon = (status: RecentUpload['status']) => {
    switch (status) {
      case 'Analyzed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'Processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  // Check expert application status
  useEffect(() => {
    const checkExpertApplicationStatus = async () => {
      if (user?.role === 'Regular') {
        try {
          const token = localStorage.getItem('access_token');
          const response = await fetch('/api/user/expert-application/', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setExpertApplicationStatus({
              hasApplication: true,
              status: data.status,
              applicationDate: data.application_date
            });
          } else {
            setExpertApplicationStatus({ hasApplication: false });
          }
        } catch (err) {
          console.error('Error checking expert application status:', err);
        }
      }
    };

    checkExpertApplicationStatus();
  }, [user]);

  if (error) {
    return (
      <div className="space-y-6">
        <DashboardHeader 
          title="User Dashboard" 
          description="Overview of your fingerprint analysis activity." 
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
        title="User Dashboard" 
        description="Overview of your fingerprint analysis activity." 
      />

      {/* Expert Application Section - Only show for Regular users */}
      {user?.role === 'Regular' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Become an Expert
            </CardTitle>
            <CardDescription>
              Apply to become an expert and help review fingerprint analyses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expertApplicationStatus?.status ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Application Status:</span>
                  {getApplicationStatusBadge(expertApplicationStatus.status)}
                </div>
                {expertApplicationStatus.application_date && (
                  <p className="text-sm text-muted-foreground">
                    Applied on: {new Date(expertApplicationStatus.application_date).toLocaleDateString()}
                  </p>
                )}
                {expertApplicationStatus.review_date && (
                  <p className="text-sm text-muted-foreground">
                    Reviewed on: {new Date(expertApplicationStatus.review_date).toLocaleDateString()}
                  </p>
                )}
                {expertApplicationStatus.review_notes && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Review Notes:</p>
                    <p className="text-sm text-muted-foreground">{expertApplicationStatus.review_notes}</p>
                  </div>
                )}
                {expertApplicationStatus.can_apply_again && (
                  <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Star className="h-4 w-4" /> Apply Again
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Apply to Become an Expert</DialogTitle>
                        <DialogDescription>
                          Tell us about your experience and why you want to become an expert reviewer.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="motivation">Motivation *</Label>
                          <Textarea
                            id="motivation"
                            placeholder="Why do you want to become an expert?"
                            value={applicationForm.motivation}
                            onChange={(e) => setApplicationForm(prev => ({ ...prev, motivation: e.target.value }))}
                            className="min-h-[100px]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="experience">Experience *</Label>
                          <Textarea
                            id="experience"
                            placeholder="Describe your relevant experience with fingerprint analysis"
                            value={applicationForm.experience}
                            onChange={(e) => setApplicationForm(prev => ({ ...prev, experience: e.target.value }))}
                            className="min-h-[100px]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="qualifications">Qualifications</Label>
                          <Textarea
                            id="qualifications"
                            placeholder="Any relevant qualifications or certifications (optional)"
                            value={applicationForm.qualifications}
                            onChange={(e) => setApplicationForm(prev => ({ ...prev, qualifications: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="portfolio_url">Portfolio URL</Label>
                          <Input
                            id="portfolio_url"
                            type="url"
                            placeholder="Link to your portfolio or relevant work (optional)"
                            value={applicationForm.portfolio_url}
                            onChange={(e) => setApplicationForm(prev => ({ ...prev, portfolio_url: e.target.value }))}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsApplicationDialogOpen(false)}
                          disabled={isSubmittingApplication}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSubmitExpertApplication}
                          disabled={isSubmittingApplication}
                        >
                          {isSubmittingApplication ? 'Submitting...' : 'Submit Application'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ) : expertApplicationStatus?.can_apply ? (
              <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Star className="h-4 w-4" /> Apply to Become Expert
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Apply to Become an Expert</DialogTitle>
                    <DialogDescription>
                      Tell us about your experience and why you want to become an expert reviewer.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="motivation">Motivation *</Label>
                      <Textarea
                        id="motivation"
                        placeholder="Why do you want to become an expert?"
                        value={applicationForm.motivation}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, motivation: e.target.value }))}
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">Experience *</Label>
                      <Textarea
                        id="experience"
                        placeholder="Describe your relevant experience with fingerprint analysis"
                        value={applicationForm.experience}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, experience: e.target.value }))}
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="qualifications">Qualifications</Label>
                      <Textarea
                        id="qualifications"
                        placeholder="Any relevant qualifications or certifications (optional)"
                        value={applicationForm.qualifications}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, qualifications: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="portfolio_url">Portfolio URL</Label>
                      <Input
                        id="portfolio_url"
                        type="url"
                        placeholder="Link to your portfolio or relevant work (optional)"
                        value={applicationForm.portfolio_url}
                        onChange={(e) => setApplicationForm(prev => ({ ...prev, portfolio_url: e.target.value }))}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsApplicationDialogOpen(false)}
                      disabled={isSubmittingApplication}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSubmitExpertApplication}
                      disabled={isSubmittingApplication}
                    >
                      {isSubmittingApplication ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Loading application status...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalUploads}</div>
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
              <div className="text-2xl font-bold">{stats.analysesCompleted}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.analysesPending}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.analysesFailed}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Last Analysis */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks at your fingertips.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link href="/dashboard/upload" passHref>
              <Button className="gap-2">
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

        <Card>
          <CardHeader>
            <CardTitle>Last Analysis Summary</CardTitle>
            <CardDescription>Quick look at your most recent result.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-20" />
              </div>
            ) : lastAnalysis ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="font-medium">{lastAnalysis.title}</p>
                  <span className="text-sm text-muted-foreground">{lastAnalysis.date}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Classification:</span>{' '}
                    <span className="font-semibold">{lastAnalysis.classification}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Confidence:</span>{' '}
                    <span className="font-semibold">{lastAnalysis.confidence}%</span>
                  </p>
                </div>
                <Link href={`/dashboard/history/${lastAnalysis.id}`} passHref>
                  <Button variant="link" size="sm" className="p-0 h-auto gap-1">
                    <Eye className="h-3 w-3" /> View Details
                  </Button>
                </Link>
              </>
            ) : (
              <div className="text-center py-4">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">No analysis results found yet.</p>
                <Link href="/dashboard/upload" passHref>
                  <Button size="sm" className="mt-2">
                    Upload First Fingerprint
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Upload History Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Upload History
            </CardTitle>
            <CardDescription>Monthly upload and completion trends</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ChartContainer config={{}} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={uploadHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="uploads" fill="#8884d8" name="Uploads" />
                    <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Classification Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Classification Distribution</CardTitle>
            <CardDescription>Breakdown of fingerprint types analyzed</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ChartContainer config={{}} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={classificationData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {classificationData.map((entry, index) => (
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
      </div>

      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>Your latest fingerprint analysis submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : recentUploads.length > 0 ? (
            <div className="space-y-3">
              {recentUploads.map((upload) => (
                <div key={upload.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(upload.status)}
                    <div>
                      <p className="font-medium">{upload.title}</p>
                      <p className="text-sm text-muted-foreground">{upload.date}</p>
                      {upload.confidence && (
                        <p className="text-xs text-muted-foreground">
                          Confidence: {upload.confidence}%
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(upload.status)}
                    {upload.status === 'Analyzed' && (
                      <Link href={`/dashboard/history/${upload.id}`} passHref>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No uploads yet</p>
              <Link href="/dashboard/upload" passHref>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your First Fingerprint
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;

const getApplicationStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />Pending Review</Badge>;
    case 'approved':
      return <Badge className="gap-1 bg-green-500"><CheckCircle className="h-3 w-3" />Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" />Rejected</Badge>;
    default:
      return null;
  }
};

const handleApplicationSuccess = () => {
  setShowApplicationForm(false);
  setExpertApplicationStatus({
    hasApplication: true,
    status: 'pending',
    applicationDate: new Date().toISOString()
  });
};

// Add these interfaces after the existing interfaces
interface ExpertApplication {
  id: number;
  application_date: string;
  status: 'pending' | 'approved' | 'rejected';
  motivation: string;
  experience: string;
  qualifications?: string;
  review_date?: string;
  review_notes?: string;
}

// Add these state variables in the UserDashboard component
const [expertApplications, setExpertApplications] = useState<ExpertApplication[]>([]);
const [showApplicationDialog, setShowApplicationDialog] = useState(false);
const [applicationForm, setApplicationForm] = useState({
  motivation: '',
  experience: '',
  qualifications: ''
});
const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);

// Add this function to fetch expert applications
const fetchExpertApplications = async () => {
  try {
    const response = await expertApplicationService.getApplications();
    setExpertApplications(response.applications);
  } catch (error) {
    console.error('Failed to fetch expert applications:', error);
  }
};

// Add this function to submit expert application
const handleSubmitApplication = async () => {
  if (!applicationForm.motivation.trim() || !applicationForm.experience.trim()) {
    setError('Motivation and experience are required');
    return;
  }

  setIsSubmittingApplication(true);
  try {
    await expertApplicationService.apply(applicationForm);
    setShowApplicationDialog(false);
    setApplicationForm({ motivation: '', experience: '', qualifications: '' });
    await fetchExpertApplications();
    // Show success message
  } catch (error: any) {
    setError(error.response?.data?.detail || 'Failed to submit application');
  } finally {
    setIsSubmittingApplication(false);
  }
};

// Update the useEffect to fetch expert applications
useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set mock data
      setStats({
        totalUploads: 9,
        analysesCompleted: 6,
        analysesPending: 2,
        analysesFailed: 1,
      });

      setRecentUploads([
        { id: 1, title: 'Left Index', status: 'Analyzed', date: '2023-10-26', confidence: 94.5 },
        { id: 2, title: 'Right Thumb', status: 'Pending', date: '2023-10-27' },
        { id: 3, title: 'Left Thumb', status: 'Analyzed', date: '2023-10-25', confidence: 95.2 },
        { id: 4, title: 'Right Index', status: 'Failed', date: '2023-10-24' },
        { id: 5, title: 'Left Middle', status: 'Processing', date: '2023-10-28' },
      ]);

      setLastAnalysis({
        id: 3,
        title: 'Left Thumb',
        classification: 'Whorl',
        confidence: 95.2,
        date: '2023-10-25',
      });
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  fetchDashboardData();
}, []);

// Add this helper function to check if user can apply for expert
const canApplyForExpert = () => {
  const { user } = useAuth();
  if (!user || user.role !== 'Regular') return false;
  
  const hasPendingApplication = expertApplications.some(app => app.status === 'pending');
  return !hasPendingApplication;
};

// Add this helper function to get application status
const getApplicationStatus = () => {
  const pendingApp = expertApplications.find(app => app.status === 'pending');
  if (pendingApp) return 'pending';
  
  const approvedApp = expertApplications.find(app => app.status === 'approved');
  if (approvedApp) return 'approved';
  
  const rejectedApp = expertApplications.find(app => app.status === 'rejected');
  if (rejectedApp) return 'rejected';
  
  return null;
};

// Update the Quick Actions section to include Expert Application
<Card>
  <CardHeader>
    <CardTitle>Quick Actions</CardTitle>
    <CardDescription>Common tasks at your fingertips.</CardDescription>
  </CardHeader>
  <CardContent className="flex flex-wrap gap-3">
    <Link href="/dashboard/upload" passHref>
      <Button className="gap-2">
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
    
    {/* Expert Application Button */}
    {canApplyForExpert() && (
      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <UserCheck className="h-4 w-4" /> Apply for Expert
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply to Become an Expert</DialogTitle>
            <DialogDescription>
              Submit your application to become a fingerprint analysis expert. This will give you additional privileges to review and validate analyses.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="motivation">Why do you want to become an expert? *</Label>
              <Textarea
                id="motivation"
                placeholder="Explain your motivation for becoming an expert..."
                value={applicationForm.motivation}
                onChange={(e) => setApplicationForm(prev => ({ ...prev, motivation: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="experience">Describe your relevant experience *</Label>
              <Textarea
                id="experience"
                placeholder="Detail your experience with fingerprint analysis, forensics, or related fields..."
                value={applicationForm.experience}
                onChange={(e) => setApplicationForm(prev => ({ ...prev, experience: e.target.value }))}
                className="mt-1"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="qualifications">Qualifications (Optional)</Label>
              <Textarea
                id="qualifications"
                placeholder="Any relevant certifications, degrees, or training..."
                value={applicationForm.qualifications}
                onChange={(e) => setApplicationForm(prev => ({ ...prev, qualifications: e.target.value }))}
                className="mt-1"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplicationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitApplication} disabled={isSubmittingApplication}>
              {isSubmittingApplication ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )}
    
    {/* Application Status Display */}
    {getApplicationStatus() && (
      <div className="flex items-center gap-2 px-3 py-2 rounded-md border">
        <UserCheck className="h-4 w-4" />
        <span className="text-sm">
          Expert Application: 
          <Badge 
            variant={getApplicationStatus() === 'approved' ? 'default' : 
                    getApplicationStatus() === 'pending' ? 'secondary' : 'destructive'}
            className="ml-1"
          >
            {getApplicationStatus()}
          </Badge>
        </span>
      </div>
    )}
  </CardContent>
</Card>

// Add this function to the UserDashboard component
const ExpertApplicationCard = () => {
  // Don't show if user is already an expert
  if (user?.role === 'Expert') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Expert Application
        </CardTitle>
        <CardDescription>
          {expertApplication ? 
            'Your expert application status' : 
            'Apply to become a fingerprint analysis expert'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {expertApplication ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge 
                variant={expertApplication.status === 'approved' ? 'default' : 
                        expertApplication.status === 'pending' ? 'secondary' : 'destructive'}
              >
                {expertApplication.status.charAt(0).toUpperCase() + expertApplication.status.slice(1)}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Applied:</span>
              <p className="text-sm">{expertApplication.application_date}</p>
            </div>
            {expertApplication.review_date && (
              <div>
                <span className="text-sm text-muted-foreground">Reviewed:</span>
                <p className="text-sm">{expertApplication.review_date}</p>
              </div>
            )}
            {expertApplication.review_notes && (
              <div>
                <span className="text-sm text-muted-foreground">Review Notes:</span>
                <p className="text-sm">{expertApplication.review_notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Become an expert to provide professional feedback on fingerprint analyses and help improve the system.
            </p>
            <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
              <DialogTrigger asChild>
                <Button className="w-full gap-2">
                  <UserPlus className="h-4 w-4" />
                  Apply to Become Expert
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Apply to Become an Expert</DialogTitle>
                  <DialogDescription>
                    Please provide information about your background and motivation to become a fingerprint analysis expert.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="motivation">Motivation *</Label>
                    <Textarea
                      id="motivation"
                      placeholder="Why do you want to become an expert? What drives your interest in fingerprint analysis?"
                      value={applicationForm.motivation}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, motivation: e.target.value }))}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience *</Label>
                    <Textarea
                      id="experience"
                      placeholder="Describe your relevant experience in forensics, biometrics, or related fields..."
                      value={applicationForm.experience}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, experience: e.target.value }))}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="qualifications">Qualifications (Optional)</Label>
                    <Textarea
                      id="qualifications"
                      placeholder="Any relevant qualifications, certifications, or educational background..."
                      value={applicationForm.qualifications}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, qualifications: e.target.value }))}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowApplicationDialog(false)}
                    disabled={isSubmittingApplication}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleExpertApplicationSubmit}
                    disabled={isSubmittingApplication}
                  >
                    {isSubmittingApplication ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Add the ExpertApplicationCard to the dashboard layout
// In the return statement, add this after the Quick Actions & Last Analysis section:

      {/* Expert Application Section */}
      <ExpertApplicationCard />
