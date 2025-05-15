"use client" // Add this line at the top

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Added Check, X, AlertTriangle, ListFilter, Search, MessageSquareQuote icons
import { Fingerprint, Eye, Check, X, AlertTriangle, ListFilter, Search, MessageSquareQuote } from "lucide-react" // Added MessageSquareQuote
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Updated Sample Data: Reflects analysis results needing feedback review
const pendingReviews = [
  { analysisId: "ANL-205", userId: "USR-012", fingerprintId: "FP-102", analysisDate: "1 hour ago", systemFeedback: "Possible Match: Pattern Delta", status: "Needs Review" },
  { analysisId: "ANL-204", userId: "USR-088", fingerprintId: "FP-101", analysisDate: "2 hours ago", systemFeedback: "Classification: Whorl", status: "Needs Review" },
  { analysisId: "ANL-203", userId: "USR-034", fingerprintId: "FP-100", analysisDate: "4 hours ago", systemFeedback: "Anomaly Detected: Scar Tissue", status: "Needs Review" },
  { analysisId: "ANL-202", userId: "USR-110", fingerprintId: "FP-099", analysisDate: "6 hours ago", systemFeedback: "Classification: Arch", status: "Needs Review" },
];

// Updated Sample Data: Reflects completed reviews
const completedReviews = [
  { analysisId: "ANL-201", fingerprintId: "FP-096", userId: "USR-005", reviewDate: "Apr 7, 2023", systemFeedback: "Classification: Loop", expertDecision: "Confirmed" },
  { analysisId: "ANL-200", fingerprintId: "FP-095", userId: "USR-015", reviewDate: "Apr 7, 2023", systemFeedback: "Possible Match: Pattern Arch", expertDecision: "Confirmed" },
  { analysisId: "ANL-199", fingerprintId: "FP-094", userId: "USR-021", reviewDate: "Apr 6, 2023", systemFeedback: "Classification: Whorl", expertDecision: "Correction Needed" },
  { analysisId: "ANL-198", fingerprintId: "FP-093", userId: "USR-002", reviewDate: "Apr 6, 2023", systemFeedback: "Anomaly Detected: Minutiae Sparse", expertDecision: "Confirmed" },
  { analysisId: "ANL-197", fingerprintId: "FP-092", userId: "USR-045", reviewDate: "Apr 5, 2023", systemFeedback: "Classification: Loop", expertDecision: "Disputed" },
];


export default function FeedbackReviewPage() { // Renamed component
  // Helper to get badge variant based on expert decision
  const getDecisionBadgeVariant = (decision: string): "success" | "warning" | "destructive" | "outline" => {
    switch (decision) {
      case "Confirmed":
        return "success";
      case "Correction Needed": // Changed from Inconclusive
        return "warning";
      case "Disputed": // Changed from Rejected
        return "destructive";
      default:
        return "outline";
    }
  };

  // --- Add Handler Functions ---
  const handleReviewFeedbackClick = (review: typeof pendingReviews[0]) => {
    console.log(`Review Feedback clicked for Analysis ID: ${review.analysisId}`);
    // TODO: Implement actual logic (e.g., open modal, navigate)
  };

  const handleViewAnalysisClick = (review: typeof pendingReviews[0]) => {
    console.log(`View Analysis clicked for Analysis ID: ${review.analysisId}`);
    // TODO: Implement actual logic (e.g., navigate to analysis detail page)
  };
  // --- End Handler Functions ---


  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header Section Updated */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* Updated Title and Description */}
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analysis Feedback Review</h1>
          <p className="text-muted-foreground">Review and validate the system's fingerprint analysis feedback.</p>
        </div>
      </div>

      {/* Updated Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            {/* Updated Tab Triggers */}
            <TabsTrigger value="pending">
              Pending Review <Badge variant="secondary" className="ml-2">{pendingReviews.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed">Reviewed</TabsTrigger>
          </TabsList>
           {/* Optional: Filter/Search can remain similar */}
        </div>

        {/* Pending Review Tab Content */}
        <TabsContent value="pending" className="mt-4">
          {pendingReviews.length > 0 ? (
            <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pendingReviews.map((review) => (
                <Card key={review.analysisId} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
                  {/* Placeholder can remain similar or show a snippet of the fingerprint */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-muted/50 to-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-75 transition-opacity">
                      <Fingerprint className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                    <Button size="icon" variant="secondary" className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View Details</span>
                    </Button>
                  </div>
                  {/* Card Content Updated */}
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-base font-semibold">{review.analysisId}</CardTitle>
                      <Badge variant="outline" className="whitespace-nowrap">{review.status}</Badge>
                    </div>
                    {/* Display System Feedback */}
                    <CardDescription className="text-sm text-muted-foreground pt-1 line-clamp-2" title={review.systemFeedback}>
                      Feedback: {review.systemFeedback}
                    </CardDescription>
                     <CardDescription className="text-xs text-muted-foreground pt-1">
                      User: {review.userId} • Print: {review.fingerprintId} • {review.analysisDate}
                    </CardDescription>
                  </CardHeader>
                  {/* Card Actions Updated */}
                  <CardFooter className="p-4 pt-2 flex gap-2">
                    {/* Updated Button Text and Icon - Added onClick */}
                    <Button
                      className="flex-1 gap-1"
                      size="sm"
                      onClick={() => handleReviewFeedbackClick(review)} // Added onClick
                    >
                      <MessageSquareQuote className="h-4 w-4" /> Review Feedback
                    </Button>
                    {/* Added onClick */}
                    <Button
                      variant="outline"
                      className="flex-1"
                      size="sm"
                      onClick={() => handleViewAnalysisClick(review)} // Added onClick
                    >
                      View Analysis
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
             <div className="text-center py-12 text-muted-foreground">
               <Check className="mx-auto h-12 w-12 mb-4 text-success" /> {/* Changed Icon */}
               <p className="font-medium">No feedback pending review</p>
               <p className="text-sm">All caught up!</p>
             </div>
          )}
        </TabsContent>

        {/* Reviewed Tab Content */}
        <TabsContent value="completed" className="mt-4">
          <Card>
            {/* Updated Header */}
            <CardHeader className="px-4 md:px-6 pt-4 md:pt-6">
              <CardTitle>Reviewed Feedback History</CardTitle>
              <CardDescription>History of reviewed analysis feedback.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  {/* Updated Table Headers */}
                  <TableRow>
                    <TableHead className="w-[120px]">Analysis ID</TableHead>
                    <TableHead>Fingerprint ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Reviewed On</TableHead>
                    <TableHead className="text-right">Expert Decision</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedReviews.length > 0 ? (
                    completedReviews.map((review) => (
                      <TableRow key={review.analysisId}>
                        <TableCell className="font-medium">{review.analysisId}</TableCell>
                        <TableCell>{review.fingerprintId}</TableCell>
                        <TableCell>{review.userId}</TableCell>
                        <TableCell>{review.reviewDate}</TableCell>
                        <TableCell className="text-right">
                          {/* Updated Badge Logic */}
                          <Badge variant={getDecisionBadgeVariant(review.expertDecision)}>
                            {review.expertDecision === "Confirmed" && <Check className="mr-1 h-3 w-3" />}
                            {review.expertDecision === "Disputed" && <X className="mr-1 h-3 w-3" />}
                            {review.expertDecision === "Correction Needed" && <AlertTriangle className="mr-1 h-3 w-3" />}
                            {review.expertDecision}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                     <TableRow>
                       <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                         No feedback reviews completed yet.
                       </TableCell>
                     </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            {completedReviews.length > 0 && (
              <CardFooter className="flex justify-end p-4 md:p-6">
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
