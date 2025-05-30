"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import { Fingerprint, BarChart, Clock, Download, Share2, CheckCircle, FileImage, Activity, Zap } from 'lucide-react'
import { memo } from 'react'
import RidgeVisualization from '@/components/visualization/ridge-visualization'

interface AnalysisResult {
  classification: string
  ridgeCount: number
  confidence: number
  processingTime: string
  additional_details?: {
    minutiae_points?: Array<{type: 'ending' | 'bifurcation', x: number, y: number}>
    core_points?: Array<{x: number, y: number}>
    delta_points?: Array<{x: number, y: number}>
    quality_metrics?: {
      sharpness: number
      contrast: number
      brightness: number
      noise_level: number
      ridge_clarity: number
      overall_quality: number
    }
    enhanced_image_path?: string
    preprocessing_steps?: string[]
  }
}

interface ResultsViewProps {
  analysisResult: AnalysisResult
  previewUrl: string | null
  capturedImage: string | null
  onUploadAnother: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

function ResultsView({ analysisResult, previewUrl, capturedImage, onUploadAnother }: ResultsViewProps) {
  if (!analysisResult) return null

  const imageUrl = previewUrl || capturedImage || ''
  const enhancedImageUrl = analysisResult.additional_details?.enhanced_image_path
  const minutiaePoints = analysisResult.additional_details?.minutiae_points || []
  const corePoints = analysisResult.additional_details?.core_points || []
  const deltaPoints = analysisResult.additional_details?.delta_points || []
  const qualityMetrics = analysisResult.additional_details?.quality_metrics
  const preprocessingSteps = analysisResult.additional_details?.preprocessing_steps || []

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getQualityBadge = (quality: number) => {
    if (quality >= 85) return { variant: 'default' as const, text: 'Excellent' }
    if (quality >= 70) return { variant: 'secondary' as const, text: 'Good' }
    if (quality >= 50) return { variant: 'outline' as const, text: 'Fair' }
    return { variant: 'destructive' as const, text: 'Poor' }
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 pointer-events-none"></div>
        
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Analysis Complete</CardTitle>
                <CardDescription>Advanced computer vision analysis results</CardDescription>
              </div>
            </div>
            {qualityMetrics && (
              <Badge {...getQualityBadge(qualityMetrics.overall_quality)}>
                Quality: {qualityMetrics.overall_quality.toFixed(0)}%
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Key Results Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div className="space-y-3" variants={itemVariants}>
              <Label className="text-base font-semibold">Classification</Label>
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
              <Label className="text-base font-semibold">Ridge Count</Label>
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
              <Label className="text-base font-semibold">Processing Time</Label>
              <div className="flex items-center space-x-3 rounded-md border p-4 bg-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-medium">{analysisResult.processingTime}</div>
                  <p className="text-sm text-muted-foreground">Analysis completion time</p>
                </div>
              </div>
            </motion.div>
          </div>

          <Separator />

          {/* Advanced Ridge Visualization */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-lg font-semibold">Ridge Pattern Visualization</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Interactive visualization showing minutiae points, core/delta structures, and quality analysis
                </p>
              </div>
              <div className="flex gap-2">
                {preprocessingSteps.length > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <Zap className="h-3 w-3" />
                    Enhanced
                  </Badge>
                )}
                <Badge variant="secondary" className="gap-1">
                  <Activity className="h-3 w-3" />
                  CV Analysis
                </Badge>
              </div>
            </div>
            
            <RidgeVisualization
              originalImageUrl={imageUrl}
              enhancedImageUrl={enhancedImageUrl}
              minutiaePoints={minutiaePoints}
              corePoints={corePoints}
              deltaPoints={deltaPoints}
              ridgeCount={analysisResult.ridgeCount}
              classification={analysisResult.classification}
              qualityMetrics={qualityMetrics}
            />
          </motion.div>

          {/* Detailed Analysis Metrics */}
          {(minutiaePoints.length > 0 || qualityMetrics) && (
            <>
              <Separator />
              <motion.div className="space-y-4" variants={itemVariants}>
                <Label className="text-lg font-semibold">Detailed Analysis</Label>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {minutiaePoints.length > 0 && (
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {minutiaePoints.length}
                      </div>
                      <div className="text-sm text-blue-700">Minutiae Points</div>
                      <div className="text-xs text-blue-600 mt-1">
                        {minutiaePoints.filter(p => p.type === 'ending').length} endings, 
                        {' '}{minutiaePoints.filter(p => p.type === 'bifurcation').length} bifurcations
                      </div>
                    </div>
                  )}
                  
                  {corePoints.length > 0 && (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{corePoints.length}</div>
                      <div className="text-sm text-green-700">Core Points</div>
                      <div className="text-xs text-green-600 mt-1">Central structures</div>
                    </div>
                  )}
                  
                  {deltaPoints.length > 0 && (
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{deltaPoints.length}</div>
                      <div className="text-sm text-orange-700">Delta Points</div>
                      <div className="text-xs text-orange-600 mt-1">Ridge divergences</div>
                    </div>
                  )}

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className={`text-2xl font-bold ${getConfidenceColor(analysisResult.confidence)}`}>
                      {analysisResult.confidence}%
                    </div>
                    <div className="text-sm text-purple-700">Confidence</div>
                    <div className="text-xs text-purple-600 mt-1">Analysis certainty</div>
                  </div>
                </div>

                {preprocessingSteps.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Image Processing Steps:</div>
                    <div className="flex flex-wrap gap-2">
                      {preprocessingSteps.map((step, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {step.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </>
          )}

          <Separator />

          {/* Action Buttons */}
          <motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}>
            <Button onClick={onUploadAnother} className="flex-1">
              <FileImage className="h-4 w-4 mr-2" />
              Analyze Another Fingerprint
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                <span>Download Report</span>
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                <span>Share Results</span>
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default memo(ResultsView)
