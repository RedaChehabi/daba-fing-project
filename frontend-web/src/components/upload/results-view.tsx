"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { OptimizedImage } from "@/components/optimized-image"
import { motion } from "framer-motion"
import { Fingerprint, BarChart, Loader2, Download, Share2, Info, X, CheckCircle2, UploadIcon } from "lucide-react"
import { memo } from "react"

interface ResultsViewProps {
  analysisResult: {
    classification: string
    ridgeCount: number
    confidence: number
    processingTime: string
  } | null
  previewUrl: string | null
  capturedImage: string | null
  onUploadAnother: () => void
}

function ResultsView({ analysisResult, previewUrl, capturedImage, onUploadAnother }: ResultsViewProps) {
  if (!analysisResult) return null

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <Card className="hover-card-effect overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>Fingerprint classification and ridge counting results</CardDescription>
          </div>
          <Badge className="bg-success/20 text-success hover:bg-success/30">
            {analysisResult.confidence}% confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div className="space-y-6" variants={containerVariants}>
            <motion.div className="space-y-3" variants={itemVariants}>
              <Label className="text-base">Classification</Label>
              <div className="flex items-center space-x-3 rounded-md border p-4 bg-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Fingerprint className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-medium">{analysisResult.classification}</div>
                  <p className="text-sm text-muted-foreground">
                    Pattern type identified with {analysisResult.confidence}% confidence
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div className="space-y-3" variants={itemVariants}>
              <Label className="text-base">Ridge Count</Label>
              <div className="flex items-center space-x-3 rounded-md border p-4 bg-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-medium">{analysisResult.ridgeCount} ridges</div>
                  <p className="text-sm text-muted-foreground">Total ridge count between core and delta points</p>
                </div>
              </div>
            </motion.div>

            <motion.div className="space-y-3" variants={itemVariants}>
              <Label className="text-base">Processing Time</Label>
              <div className="flex items-center space-x-3 rounded-md border p-4 bg-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Loader2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-medium">{analysisResult.processingTime}</div>
                  <p className="text-sm text-muted-foreground">Total time taken for analysis completion</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div className="space-y-4" variants={itemVariants}>
            <Label className="text-base">Original Image</Label>
            <div className="relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary to-blue-600 opacity-30 blur-sm animate-pulse-slow"></div>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                {(previewUrl || capturedImage) && (
                  <OptimizedImage
                    src={previewUrl || capturedImage || "/placeholder.svg"}
                    alt="Original fingerprint"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 300px"
                    unoptimized={!!capturedImage} // Only use unoptimized for base64 images
                  />
                )}
              </div>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div className="space-y-3" variants={itemVariants}>
          <Label className="text-base">Ridge Feature Enhancement</Label>
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary to-blue-600 opacity-20 blur-sm"></div>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted flex items-center justify-center">
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
              <div className="relative z-10 text-center p-6">
                <div className="rounded-full bg-primary/10 p-4 mx-auto mb-4 animate-float">
                  <Fingerprint className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Enhanced Fingerprint Image</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  The enhanced image shows ridge features with highlighted core and delta points for better
                  visualization.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="space-y-3" variants={itemVariants}>
          <Label className="text-base">Feedback</Label>
          <div className="rounded-md border p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Is this analysis correct? Your feedback helps improve our model.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 hover:bg-success/10 hover:text-success hover:border-success transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                Correct
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
              >
                <X className="h-4 w-4" />
                Incorrect
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Info className="h-4 w-4" />
                Suggest Improvements
              </Button>
            </div>
          </div>
        </motion.div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onUploadAnother} className="gap-2">
          <UploadIcon className="h-4 w-4" />
          Upload Another
        </Button>
        <Button className="gap-2 button-hover-effect">
          <Download className="h-4 w-4" />
          Export Results
        </Button>
      </CardFooter>
    </Card>
  )
}

export default memo(ResultsView)
