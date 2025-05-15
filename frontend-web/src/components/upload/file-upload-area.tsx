"use client"

import type React from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { OptimizedImage } from "@/components/optimized-image"
import { motion } from "framer-motion"
import { FileIcon, ImageIcon, X, Loader2, CheckCircle2, AlertCircle, UploadIcon } from "lucide-react"
import { memo } from "react"

interface FileUploadAreaProps {
  dragActive: boolean
  selectedFile: File | null
  previewUrl: string | null
  uploadStatus: string
  uploadProgress: number
  errorMessage: string | null
  fileInputRef: React.RefObject<HTMLInputElement>
  handleDrag: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleUploadClick: () => void
  handleClearSelection: () => void
  handleAnalyze: () => void
}

function FileUploadArea({
  dragActive,
  selectedFile,
  previewUrl,
  uploadStatus,
  uploadProgress,
  errorMessage,
  fileInputRef,
  handleDrag,
  handleDrop,
  handleFileInputChange,
  handleUploadClick,
  handleClearSelection,
  handleAnalyze,
}: FileUploadAreaProps) {
  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  }

  return (
    <Card className="hover-card-effect overflow-hidden">
      <CardHeader>
        <CardTitle>Upload From Device</CardTitle>
        <CardDescription>Drag and drop or browse for a fingerprint image</CardDescription>
      </CardHeader>
      <CardContent
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px] transition-all duration-300 ${
          dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-border"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Initial Drag/Drop Prompt */}
        {!selectedFile && uploadStatus === "idle" && !errorMessage && (
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="rounded-full bg-primary/10 p-6 animate-float"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UploadIcon className="h-10 w-10 text-primary" />
            </motion.div>
            <div className="space-y-2">
              <p className="text-lg font-medium">Drag and drop your fingerprint image here</p>
              <p className="text-sm text-muted-foreground">Supports JPG, JPEG, PNG, BMP, TIFF, TIF, WebP</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-px w-12 bg-border"></div>
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px w-12 bg-border"></div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleUploadClick}
              className="gap-2 button-hover-effect"
            >
              <FileIcon className="h-4 w-4" />
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
              aria-label="Upload fingerprint image file"
            />
          </motion.div>
        )}

        {/* Selected File Preview and Status */}
        {selectedFile && (
          <motion.div
            className="w-full space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* File Info and Remove Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClearSelection}
                      className="transition-transform hover:scale-110 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear selection</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear selection</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="relative mx-auto max-w-[300px]">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary to-blue-600 opacity-30 blur-sm animate-pulse-slow"></div>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                  <OptimizedImage
                    src={previewUrl}
                    alt="Fingerprint preview"
                    fill
                    className="object-contain"
                    sizes="300px"
                  />
                </div>
              </div>
            )}

            {/* Progress Indicator */}
            {uploadStatus === "uploading" && (
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Uploading and analyzing...
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </motion.div>
            )}

            {/* Success Message */}
            {uploadStatus === "success" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Alert variant="default" className="bg-success/10 text-success border-success">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Fingerprint analysis completed successfully. View the results for detailed information.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Display Error Message if any */}
        {errorMessage && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </CardContent>

      {/* Analyze Button for File */}
      <CardFooter>
        <Button
          onClick={handleAnalyze}
          disabled={!selectedFile || uploadStatus === "uploading"}
          className="w-full gap-2 button-hover-effect"
          size="lg"
        >
          {uploadStatus === "uploading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Analyze Fingerprint
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default memo(FileUploadArea)
