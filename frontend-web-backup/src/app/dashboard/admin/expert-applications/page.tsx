'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  RefreshCw,
  Eye,
  UserCheck,
  UserX,
  Calendar,
  Mail,
  User,
  FileText,
  Award,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { expertApplicationService, type ExpertApplication } from '@/services/api'

// Types
interface ApplicationUser {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }

interface ExtendedExpertApplication extends ExpertApplication {
  user?: ApplicationUser
  reviewed_by?: string
}

interface ApplicationStats {
  total: number
  pending: number
  approved: number
  rejected: number
  this_month: number
}

interface ReviewData {
  action: 'approve' | 'reject'
  review_notes: string
}

export default function ExpertApplicationsPage() {
  // State Management
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applications, setApplications] = useState<ExtendedExpertApplication[]>([])
  const [stats, setStats] = useState<ApplicationStats | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedApplication, setSelectedApplication] = useState<ExtendedExpertApplication | null>(null)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [reviewData, setReviewData] = useState<ReviewData>({ action: 'approve', review_notes: '' })
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const { user } = useAuth()

  // Check admin access
  useEffect(() => {
    if (user && user.role !== 'Admin') {
      setError('Access denied. Admin privileges required.')
      setIsLoading(false)
      return
    }
  }, [user])

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setError(null)
      const response = await expertApplicationService.getAll()
      setApplications(response.applications || [])
      
      // Calculate stats
      const apps = response.applications || []
      const now = new Date()
      const thisMonth = apps.filter((app) => {
        const appDate = new Date(app.application_date)
        return appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear()
      })
      
      setStats({
        total: apps.length,
        pending: apps.filter((app) => app.status === 'pending').length,
        approved: apps.filter((app) => app.status === 'approved').length,
        rejected: apps.filter((app) => app.status === 'rejected').length,
        this_month: thisMonth.length
      })
    } catch (error: any) {
      console.error('Failed to fetch applications:', error)
      setError(error.response?.data?.detail || 'Failed to load expert applications')
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'Admin') {
      fetchApplications()
    }
  }, [user])

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchApplications()
  }

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      !searchTerm || // If no search term, include all
      app.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.motivation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.experience?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (!selectedApplication) return
    
    setIsSubmittingReview(true)
    try {
      await expertApplicationService.review(selectedApplication.id, reviewData)
      setShowReviewDialog(false)
      setSelectedApplication(null)
      setReviewData({ action: 'approve', review_notes: '' })
      await fetchApplications()
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to submit review')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  // Open review dialog
  const openReviewDialog = (application: ExtendedExpertApplication, action: 'approve' | 'reject') => {
    setSelectedApplication(application)
    setReviewData({ action, review_notes: '' })
    setShowReviewDialog(true)
  }

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    }
    
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle
    }
    
    const Icon = icons[status as keyof typeof icons] || Clock
    
    return (
      <Badge className={`${variants[status as keyof typeof variants]} border`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expert Applications</h1>
            <p className="text-muted-foreground">Manage expert application requests</p>
          </div>
        </div>
        
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
        
        {user?.role === 'Admin' && (
          <Button onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Try Again
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expert Applications</h1>
          <p className="text-muted-foreground">
            Review and manage expert application requests
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting decision</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Accepted applications</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">Declined applications</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.this_month}</div>
              <p className="text-xs text-muted-foreground">New applications</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, username, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Applications ({filteredApplications.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({filteredApplications.filter(app => app.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({filteredApplications.filter(app => app.status === 'approved').length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({filteredApplications.filter(app => app.status === 'rejected').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-500 text-center max-w-md">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No applications match your current filters. Try adjusting your search criteria.'
                    : 'No expert applications have been submitted yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="bg-blue-100 rounded-full p-3">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {application.user?.first_name || 'Unknown'} {application.user?.last_name || 'User'}
                            </h3>
                            <StatusBadge status={application.status} />
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>@{application.user?.username || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{application.user?.email || 'No email provided'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>Applied: {new Date(application.application_date).toLocaleDateString()}</span>
                            </div>
                            {application.review_date && (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                <span>Reviewed: {new Date(application.review_date).toLocaleDateString()}</span>
                                {application.reviewed_by && <span>by {application.reviewed_by}</span>}
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-4 space-y-3">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Motivation</h4>
                              <p className="text-sm text-gray-600 line-clamp-2">{application.motivation}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Experience</h4>
                              <p className="text-sm text-gray-600 line-clamp-2">{application.experience}</p>
                            </div>
                            {application.qualifications && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-1">Qualifications</h4>
                                <p className="text-sm text-gray-600 line-clamp-2">{application.qualifications}</p>
                              </div>
                            )}
                            {application.review_notes && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-1">Review Notes</h4>
                                <p className="text-sm text-gray-600">{application.review_notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        
                        {application.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => openReviewDialog(application, 'approve')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openReviewDialog(application, 'reject')}
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending">
          <div className="space-y-4">
            {filteredApplications.filter(app => app.status === 'pending').map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow border-yellow-200">
                {/* Same card content as above but filtered for pending */}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="bg-yellow-100 rounded-full p-3">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.user?.first_name || 'Unknown'} {application.user?.last_name || 'User'}
                          </h3>
                          <StatusBadge status={application.status} />
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>@{application.user?.username || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{application.user?.email || 'No email provided'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Applied: {new Date(application.application_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Motivation</h4>
                            <p className="text-sm text-gray-600">{application.motivation}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Experience</h4>
                            <p className="text-sm text-gray-600">{application.experience}</p>
                          </div>
                          {application.qualifications && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Qualifications</h4>
                              <p className="text-sm text-gray-600">{application.qualifications}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => openReviewDialog(application, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openReviewDialog(application, 'reject')}
                      >
                        <UserX className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="space-y-4">
            {filteredApplications.filter(app => app.status === 'approved').map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="bg-green-100 rounded-full p-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.user?.first_name || 'Unknown'} {application.user?.last_name || 'User'}
                          </h3>
                          <StatusBadge status={application.status} />
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            <Award className="w-3 h-3 mr-1" />
                            Expert
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>@{application.user?.username || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{application.user?.email || 'No email provided'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Applied: {new Date(application.application_date).toLocaleDateString()}</span>
                          </div>
                          {application.review_date && (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              <span>Approved: {new Date(application.review_date).toLocaleDateString()}</span>
                              {application.reviewed_by && <span>by {application.reviewed_by}</span>}
                            </div>
                          )}
                        </div>
                        
                        {application.review_notes && (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-900 mb-1">Review Notes</h4>
                            <p className="text-sm text-gray-600">{application.review_notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="space-y-4">
            {filteredApplications.filter(app => app.status === 'rejected').map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="bg-red-100 rounded-full p-3">
                        <XCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.user?.first_name || 'Unknown'} {application.user?.last_name || 'User'}
                          </h3>
                          <StatusBadge status={application.status} />
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>@{application.user?.username || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{application.user?.email || 'No email provided'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Applied: {new Date(application.application_date).toLocaleDateString()}</span>
                          </div>
                          {application.review_date && (
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4" />
                              <span>Rejected: {new Date(application.review_date).toLocaleDateString()}</span>
                              {application.reviewed_by && <span>by {application.reviewed_by}</span>}
                            </div>
                          )}
                        </div>
                        
                        {application.review_notes && (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-900 mb-1">Review Notes</h4>
                            <p className="text-sm text-gray-600">{application.review_notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {reviewData.action === 'approve' ? 'Approve' : 'Reject'} Expert Application
            </DialogTitle>
            <DialogDescription>
              {selectedApplication && (
                <span>
                  Review application from {selectedApplication.user?.first_name} {selectedApplication.user?.last_name}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Review Notes</label>
              <Textarea
                placeholder={`Add notes about your ${reviewData.action} decision...`}
                value={reviewData.review_notes}
                onChange={(e) => setReviewData(prev => ({ ...prev, review_notes: e.target.value }))}
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReviewDialog(false)}
              disabled={isSubmittingReview}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReviewSubmit}
              disabled={isSubmittingReview}
              className={reviewData.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
              variant={reviewData.action === 'reject' ? 'destructive' : 'default'}
            >
              {isSubmittingReview ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {reviewData.action === 'approve' ? (
                    <><UserCheck className="mr-2 h-4 w-4" />Approve Application</>
                  ) : (
                    <><UserX className="mr-2 h-4 w-4" />Reject Application</>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApplication && !showReviewDialog} onOpenChange={(open) => !open && setSelectedApplication(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              {selectedApplication && (
                <span>
                  Expert application from {selectedApplication.user?.first_name} {selectedApplication.user?.last_name}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Applicant</label>
                  <p className="text-sm">{selectedApplication.user?.first_name} {selectedApplication.user?.last_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Username</label>
                  <p className="text-sm">@{selectedApplication.user?.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm">{selectedApplication.user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <StatusBadge status={selectedApplication.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Application Date</label>
                  <p className="text-sm">{new Date(selectedApplication.application_date).toLocaleDateString()}</p>
                </div>
                {selectedApplication.review_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Review Date</label>
                    <p className="text-sm">{new Date(selectedApplication.review_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Motivation</label>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">{selectedApplication.motivation}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Experience</label>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">{selectedApplication.experience}</p>
              </div>
              
              {selectedApplication.qualifications && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Qualifications</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">{selectedApplication.qualifications}</p>
                </div>
              )}
              
              {selectedApplication.review_notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Review Notes</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">{selectedApplication.review_notes}</p>
                </div>
              )}
              
              {selectedApplication.reviewed_by && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Reviewed By</label>
                  <p className="text-sm mt-1">{selectedApplication.reviewed_by}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedApplication(null)}>
              Close
            </Button>
            {selectedApplication?.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    openReviewDialog(selectedApplication, 'approve')
                    setSelectedApplication(null)
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    openReviewDialog(selectedApplication, 'reject')
                    setSelectedApplication(null)
                  }}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}