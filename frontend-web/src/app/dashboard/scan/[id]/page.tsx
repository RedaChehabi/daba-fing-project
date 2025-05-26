import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Fingerprint, Download, Share2, ChevronLeft, Eye } from "lucide-react"
import Link from "next/link"

// Mock data for a fingerprint scan
const scanData = {
  id: "FP-123",
  type: "Right Index",
  status: "Analyzed",
  uploadDate: "Apr 5, 2023",
  analyzedDate: "Apr 6, 2023",
  user: "John Smith",
  pattern: "Whorl",
  patternSubtype: "Double Loop",
  confidenceScore: 95,
  minutiaeCount: 38,
  notes: "Clear impression with well-defined ridges.",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  // For static export, we need to provide the possible id values
  // In a real app, you would fetch this from your API
  return [
    { id: 'FP-123' },
    { id: 'FP-124' },
    { id: 'FP-125' },
  ]
}

export default async function ScanDetailPage({ params }: PageProps) {
  const { id } = await params
  // In a real app, you would fetch scan data based on id
  const scan = scanData

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/history" className="flex items-center text-muted-foreground hover:text-foreground mb-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Scans
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Scan {scan.id}</h1>
            <p className="text-muted-foreground">{scan.type} Fingerprint</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm">
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
              <Badge>{scan.pattern}</Badge>
              <Badge variant="outline" className="ml-2">
                {scan.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Upload Date</p>
                <p className="font-medium">{scan.uploadDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Analyzed Date</p>
                <p className="font-medium">{scan.analyzedDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Uploaded By</p>
                <p className="font-medium">{scan.user}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Confidence Score</p>
                <p className="font-medium">{scan.confidenceScore}%</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-muted-foreground mb-1">Pattern Analysis</p>
              <p className="font-medium">
                {scan.pattern} ({scan.patternSubtype})
              </p>
            </div>

            <div>
              <p className="text-muted-foreground mb-1">Minutiae Count</p>
              <p className="font-medium">{scan.minutiaeCount} points identified</p>
            </div>

            <div>
              <p className="text-muted-foreground mb-1">Notes</p>
              <p>{scan.notes}</p>
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
