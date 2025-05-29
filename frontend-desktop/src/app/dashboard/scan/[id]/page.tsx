"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Fingerprint, Download, Share2, ChevronLeft, Eye } from "lucide-react"
import Link from "next/link"
import { analysisService } from "@/services/api"

// Interface for analysis detail from API
interface AnalysisDetail {
  id: string;
  type: string;
  status: string;
  upload_date: string;
  analyzed_date: string;
  user: string;
  pattern: string;
  pattern_subtype: string;
  confidence_score: number;
  minutiae_count: number;
  notes: string;
  image_url?: string;
  processing_time: string;
  analysis_results: Record<string, unknown>;
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ScanDetailPage({ params }: PageProps) {
  const [analysisDetail, setAnalysisDetail] = useState<AnalysisDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [scanId, setScanId] = useState<string>("")

  useEffect(() => {
    const loadAnalysisDetail = async () => {
      try {
        const resolvedParams = await params
        setScanId(resolvedParams.id)
        setLoading(true)
        const response = await analysisService.getAnalysisDetail(resolvedParams.id)
        setAnalysisDetail(response.analysis)
      } catch (error) {
        console.error('Error loading analysis detail:', error)
        alert('Failed to load analysis details. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    loadAnalysisDetail()
  }, [params])

  const handleDownload = async () => {
    if (!analysisDetail) return
    try {
      // Create a detailed report
      const reportContent = [
        `Analysis Report - ${analysisDetail.id}`,
        `===================================`,
        `Type: ${analysisDetail.type}`,
        `Status: ${analysisDetail.status}`,
        `Upload Date: ${analysisDetail.upload_date}`,
        `Analysis Date: ${analysisDetail.analyzed_date}`,
        `Pattern: ${analysisDetail.pattern} (${analysisDetail.pattern_subtype})`,
        `Confidence Score: ${analysisDetail.confidence_score}%`,
        `Minutiae Count: ${analysisDetail.minutiae_count}`,
        `Processing Time: ${analysisDetail.processing_time}`,
        `Notes: ${analysisDetail.notes}`,
        `===================================`,
        `Generated on: ${new Date().toLocaleString()}`
      ].join('\n')
      
      const blob = new Blob([reportContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analysis_report_${analysisDetail.id}.txt`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading report:', error)
      alert('Failed to download report')
    }
  }

  const handleShare = () => {
    if (analysisDetail) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!')
      }).catch(() => {
        alert('Failed to copy link')
      })
    }
  }

  const handleViewFullSize = () => {
    if (analysisDetail?.image_url) {
      window.open(analysisDetail.image_url, '_blank')
    } else {
      alert('Image not available')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg">Loading analysis details...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!analysisDetail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg">Analysis not found</div>
            <Link href="/dashboard/history" className="text-primary hover:underline">
              Return to History
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/history" className="flex items-center text-muted-foreground hover:text-foreground mb-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Scans
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Scan {scanId}</h1>
            <p className="text-muted-foreground">{analysisDetail.type} Fingerprint</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm" onClick={handleViewFullSize}>
              <Eye className="h-4 w-4 mr-2" />
              View Full Size
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Fingerprint Image</CardTitle>
            <CardDescription>Original uploaded scan</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <div className="aspect-square w-full max-w-[300px] bg-muted relative rounded-md overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Fingerprint className="h-24 w-24 text-muted-foreground/50" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Scan Details</CardTitle>
            <div className="flex items-center pt-2">
              <Badge>{analysisDetail.pattern}</Badge>
              <Badge variant="outline" className="ml-2">
                {analysisDetail.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Upload Date</p>
                <p className="font-medium">{analysisDetail.upload_date}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Analyzed Date</p>
                <p className="font-medium">{analysisDetail.analyzed_date}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Uploaded By</p>
                <p className="font-medium">{analysisDetail.user}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Confidence Score</p>
                <p className="font-medium">{analysisDetail.confidence_score}%</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-muted-foreground mb-1">Pattern Analysis</p>
              <p className="font-medium">
                {analysisDetail.pattern} ({analysisDetail.pattern_subtype})
              </p>
            </div>

            <div>
              <p className="text-muted-foreground mb-1">Minutiae Count</p>
              <p className="font-medium">{analysisDetail.minutiae_count} points identified</p>
            </div>

            <div>
              <p className="text-muted-foreground mb-1">Notes</p>
              <p>{analysisDetail.notes}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="minutiae">
        <TabsList>
          <TabsTrigger value="minutiae">Minutiae Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="minutiae" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Minutiae Analysis</CardTitle>
              <CardDescription>Detailed breakdown of identified minutiae points.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex justify-center items-center">
              <div className="text-center text-muted-foreground">
                <Fingerprint className="h-16 w-16 mx-auto mb-4" />
                <p>Interactive minutiae visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparison Analysis</CardTitle>
              <CardDescription>Compare with other fingerprints in the database.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <p className="mb-4 text-muted-foreground">No comparisons have been run yet.</p>
                <Button>Run Comparison</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
              <CardDescription>Timeline of analysis events.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { event: "Scan uploaded", date: "Apr 5, 2023 - 10:24 AM", user: "John Smith" },
                  { event: "Automated analysis started", date: "Apr 5, 2023 - 10:25 AM", user: "System" },
                  { event: "Automated analysis completed", date: "Apr 5, 2023 - 10:30 AM", user: "System" },
                  { event: "Expert review started", date: "Apr 6, 2023 - 9:15 AM", user: "Dr. Emily Johnson" },
                  { event: "Expert review completed", date: "Apr 6, 2023 - 9:45 AM", user: "Dr. Emily Johnson" },
                ].map((item, i) => (
                  <div key={i} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      {i < 4 && <div className="h-full w-px bg-border" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.event}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.date} by {item.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
