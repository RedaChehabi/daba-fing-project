"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Fingerprint, 
  Eye, 
  Check, 
  X, 
  AlertTriangle, 
  MessageSquareQuote,
  Search,
  Filter,
  Clock,
  User,
  FileText,
  TrendingUp,
  Calendar,
  RefreshCw
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

// TypeScript Interfaces
interface PendingReview {
  analysisId: string
  userId: string
  fingerprintId: string
  analysisDate: string
  systemFeedback: string
  status: 'Needs Review' | 'In Progress' | 'Urgent'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  confidence: number
  analysisType: string
  submittedBy: string
}

interface CompletedReview {
  analysisId: string
  fingerprintId: string
  userId: string
  reviewDate: string
  systemFeedback: string
  expertDecision: 'Confirmed' | 'Correction Needed' | 'Disputed' | 'Requires Further Analysis'
  reviewedBy: string
  reviewTime: number // in minutes
  notes?: string
}

interface ReviewStats {
  totalPending: number
  totalCompleted: number
  averageReviewTime: number
  accuracyRate: number
  todayReviewed: number
  urgentReviews: number
}

export default function FeedbackReviewPage() {
  // State Management
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([])
  const [completedReviews, setCompletedReviews] = useState<CompletedReview[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("pending")

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // TODO: Replace with actual API endpoints for expert review system
        // For now, return empty arrays since we haven't implemented the expert review backend yet
        setPendingReviews([])
        setCompletedReviews([])
        setStats({
          totalPending: 0,
          totalCompleted: 0,
          averageReviewTime: 0,
          accuracyRate: 0,
          todayReviewed: 0,
          urgentReviews: 0
        })
        
      } catch (error) {
        console.error('Error loading review data:', error)
        setError('Failed to load review data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, []);

  // Filter functions
  const filteredPendingReviews = pendingReviews.filter(review => {
    const matchesSearch = review.analysisId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.fingerprintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.userId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || review.status === statusFilter
    const matchesPriority = priorityFilter === "all" || review.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const filteredCompletedReviews = completedReviews.filter(review => {
    return review.analysisId.toLowerCase().includes(searchTerm.toLowerCase()) ||
           review.fingerprintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
           review.userId.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Helper functions
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Urgent": return "destructive"
      case "In Progress": return "secondary"
      case "Needs Review": return "outline"
      default: return "default"
    }
  }

  const getPriorityBadgeVariant = (priority: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (priority) {
      case "Critical": return "destructive"
      case "High": return "secondary"
      case "Medium": return "outline"
      case "Low": return "default"
      default: return "default"
    }
  }

  const getDecisionBadgeVariant = (decision: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (decision) {
      case "Confirmed": return "default"
      case "Correction Needed": return "secondary"
      case "Disputed": return "destructive"
      case "Requires Further Analysis": return "outline"
      default: return "outline"
    }
  }

  const handleReviewFeedbackClick = (review: PendingReview) => {
    console.log("Review feedback for:", review.analysisId)
    // Implement review functionality
  }

  const handleViewAnalysisClick = (review: PendingReview) => {
    console.log("View analysis for:", review.analysisId)
    // Implement view analysis functionality
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsLoading(false)
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analysis Feedback Review</h1>
          <p className="text-muted-foreground">Review and validate the system's fingerprint analysis feedback.</p>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPending}</div>
              <p className="text-xs text-muted-foreground">
                {stats.urgentReviews} urgent
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayReviewed}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalCompleted} total completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Review Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageReviewTime}m</div>
              <p className="text-xs text-muted-foreground">
                Per analysis review
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accuracyRate}%</div>
              <Progress value={stats.accuracyRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by Analysis ID, Fingerprint ID, or User ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Needs Review">Needs Review</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Review 
              <Badge variant="secondary" className="ml-2">
                {isLoading ? "..." : filteredPendingReviews.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed">Reviewed</TabsTrigger>
          </TabsList>
        </div>

        {/* Pending Review Tab Content */}
        <TabsContent value="pending" className="mt-4">
          {isLoading ? (
            <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <CardHeader className="p-4 pb-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-full mt-2" />
                    <Skeleton className="h-3 w-3/4" />
                  </CardHeader>
                  <CardFooter className="p-4 pt-2 flex gap-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 flex-1" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredPendingReviews.length > 0 ? (
            <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPendingReviews.map((review) => (
                <Card key={review.analysisId} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
                  <div className="aspect-[4/3] bg-gradient-to-br from-muted/50 to-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-75 transition-opacity">
                      <Fingerprint className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                    <div className="absolute top-3 left-3 flex gap-1">
                      <Badge variant={getPriorityBadgeVariant(review.priority)} className="text-xs">
                        {review.priority}
                      </Badge>
                    </div>
                    <Button size="icon" variant="secondary" className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View Details</span>
                    </Button>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-background/80 backdrop-blur-sm rounded px-2 py-1">
                        <div className="text-xs text-muted-foreground">Confidence</div>
                        <Progress value={review.confidence} className="h-1 mt-1" />
                        <div className="text-xs text-right">{review.confidence}%</div>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-base font-semibold">{review.analysisId}</CardTitle>
                      <Badge variant={getStatusBadgeVariant(review.status)} className="whitespace-nowrap text-xs">
                        {review.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground pt-1 line-clamp-2" title={review.systemFeedback}>
                      {review.systemFeedback}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {review.userId}
                      </div>
                      <div className="flex items-center gap-1">
                        <Fingerprint className="h-3 w-3" />
                        {review.fingerprintId}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {review.analysisDate}
                      </div>
                      <div>{review.analysisType}</div>
                    </div>
                  </CardHeader>
                  <CardFooter className="p-4 pt-2 flex gap-2">
                    <Button
                      className="flex-1 gap-1"
                      size="sm"
                      onClick={() => handleReviewFeedbackClick(review)}
                    >
                      <MessageSquareQuote className="h-4 w-4" /> Review
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 gap-1"
                      size="sm"
                      onClick={() => handleViewAnalysisClick(review)}
                    >
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Check className="mx-auto h-12 w-12 mb-4 text-green-500" />
              <p className="font-medium">No feedback pending review</p>
              <p className="text-sm">All caught up!</p>
            </div>
          )}
        </TabsContent>

        {/* Reviewed Tab Content */}
        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardHeader className="px-4 md:px-6 pt-4 md:pt-6">
              <CardTitle>Reviewed Feedback History</CardTitle>
              <CardDescription>History of reviewed analysis feedback with expert decisions.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 py-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Analysis ID</TableHead>
                      <TableHead>Fingerprint ID</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Reviewed On</TableHead>
                      <TableHead>Reviewed By</TableHead>
                      <TableHead>Review Time</TableHead>
                      <TableHead className="text-right">Expert Decision</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompletedReviews.length > 0 ? (
                      filteredCompletedReviews.map((review) => (
                        <TableRow key={review.analysisId}>
                          <TableCell className="font-medium">{review.analysisId}</TableCell>
                          <TableCell>{review.fingerprintId}</TableCell>
                          <TableCell>{review.userId}</TableCell>
                          <TableCell>{review.reviewDate}</TableCell>
                          <TableCell>{review.reviewedBy}</TableCell>
                          <TableCell>{review.reviewTime}m</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={getDecisionBadgeVariant(review.expertDecision)} className="gap-1">
                              {review.expertDecision === "Confirmed" && <Check className="h-3 w-3" />}
                              {review.expertDecision === "Disputed" && <X className="h-3 w-3" />}
                              {review.expertDecision === "Correction Needed" && <AlertTriangle className="h-3 w-3" />}
                              {review.expertDecision === "Requires Further Analysis" && <Clock className="h-3 w-3" />}
                              {review.expertDecision}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          No feedback reviews completed yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            {!isLoading && filteredCompletedReviews.length > 0 && (
              <CardFooter className="flex justify-between items-center p-4 md:p-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredCompletedReviews.length} of {completedReviews.length} reviews
                </p>
                <Button variant="outline" size="sm">
                  View Full Review History
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
