"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Info } from "lucide-react"
import { memo } from "react"

function UploadGuidelines() {
  return (
    <Card className="hover-card-effect">
      <CardHeader>
        <CardTitle>Upload Guidelines</CardTitle>
        <CardDescription>Follow these guidelines for optimal results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Info className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-base font-medium">Image Requirements</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground list-none pl-10">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>Use high-resolution images (at least 500 DPI)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>Ensure good lighting conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>Center the fingerprint in the frame</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>Avoid blurry or smudged images</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>Maximum file size: 10MB</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Info className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-base font-medium">Supported Formats</h3>
              </div>
              <div className="pl-10 flex flex-wrap gap-2">
                {["JPEG", "PNG", "BMP", "TIFF", "WebP"].map((format) => (
                  <Badge key={format} variant="outline" className="bg-primary/5 hover:bg-primary/10">
                    {format}
                  </Badge>
                ))}
              </div>
              <div className="pl-10 pt-2">
                <Alert variant="default" className="bg-muted border-muted-foreground/20">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    For best results, use uncompressed formats like PNG or TIFF to preserve image details.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default memo(UploadGuidelines)
