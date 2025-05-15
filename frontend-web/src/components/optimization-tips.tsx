"use client"

import { useState, memo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Lightbulb, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface OptimizationTip {
  id: string
  title: string
  description: string
  category: "performance" | "quality" | "usability"
  priority: "high" | "medium" | "low"
}

const tips: OptimizationTip[] = [
  {
    id: "tip-1",
    title: "Use high-resolution images",
    description: "For best fingerprint analysis results, use images with at least 500 DPI resolution.",
    category: "quality",
    priority: "high",
  },
  {
    id: "tip-2",
    title: "Optimize network usage",
    description: "When on a limited connection, use the file upload option instead of the camera to reduce data usage.",
    category: "performance",
    priority: "medium",
  },
  {
    id: "tip-3",
    title: "Clear browser cache periodically",
    description: "To ensure optimal performance, clear your browser cache every few weeks.",
    category: "performance",
    priority: "low",
  },
  {
    id: "tip-4",
    title: "Use proper lighting",
    description: "Ensure good lighting conditions when capturing fingerprint images for better analysis results.",
    category: "quality",
    priority: "high",
  },
  {
    id: "tip-5",
    title: "Prefer PNG format",
    description:
      "When possible, use PNG format for fingerprint images to preserve details and avoid compression artifacts.",
    category: "quality",
    priority: "medium",
  },
]

export function OptimizationTips() {
  const [isOpen, setIsOpen] = useState(false)
  const [dismissedTips, setDismissedTips] = useState<string[]>([])

  const activeTips = tips.filter((tip) => !dismissedTips.includes(tip.id))

  const dismissTip = (id: string) => {
    setDismissedTips((prev) => [...prev, id])
  }

  const resetTips = () => {
    setDismissedTips([])
  }

  if (activeTips.length === 0) {
    return null
  }

  return (
    <Card className="mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <CardTitle>Optimization Tips</CardTitle>
            </div>
            <CollapsibleTrigger asChild onClick={() => setIsOpen(!isOpen)}>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="sr-only">{isOpen ? "Close" : "Open"}</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CardDescription>Tips to improve your experience with DabaFing</CardDescription>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="grid gap-4">
            {activeTips.map((tip) => (
              <div key={tip.id} className="flex items-start justify-between space-x-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium leading-none">{tip.title}</h4>
                    <Badge
                      variant={
                        tip.priority === "high" ? "default" : tip.priority === "medium" ? "secondary" : "outline"
                      }
                    >
                      {tip.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => dismissTip(tip.id)} className="h-8 w-8 shrink-0">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Dismiss</span>
                </Button>
              </div>
            ))}
          </CardContent>

          <CardFooter>
            <Button variant="outline" size="sm" onClick={resetTips} className="ml-auto">
              Reset Tips
            </Button>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

export default memo(OptimizationTips)
