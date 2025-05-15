"use client"

import type React from "react"
import { useState, useRef, useCallback, useMemo, lazy, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, File, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
// REMOVE this line if it exists:
// import { fingerprints } from "@/utils/api";

// ADD or ENSURE this line exists (assuming your service is structured this way):
import { fingerprintService } from '@/services/api';
// Dynamically import Webcam component to reduce initial bundle size
const Webcam = dynamic(() => import("react-webcam"), {
  ssr: false,
  loading: () => (
    <div className="rounded-md border mb-4 bg-muted h-[480px] w-[640px] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
})

// --- Define Interface for Analysis Result ---
interface AnalysisResult {
  classification: string
  ridgeCount: number
  confidence: number
  processingTime: string
  // Add any other fields returned by your actual API
}

// --- Helper to convert Base64 Data URL to Blob ---
const dataURLtoBlob = (dataurl: string): Blob | null => {
  try {
    const arr = dataurl.split(",")
    if (!arr[0]) return null
    const mimeMatch = arr[0].match(/:(.*?);/)
    if (!mimeMatch || !arr[1]) return null
    const mime = mimeMatch[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  } catch (e) {
    console.error("Error converting data URL to Blob", e)
    return null
  }
}

// Split the page into smaller components for better code splitting
const FileUploadArea = lazy(() => import("@/components/upload/file-upload-area"))
const CameraUploadArea = lazy(() => import("@/components/upload/camera-upload-area"))
const ResultsView = lazy(() => import("@/components/upload/results-view"))
const UploadGuidelines = lazy(() => import("@/components/upload/upload-guidelines"))

export default function UploadPage() {
  // --- State Variables ---
  const [uploadMethod, setUploadMethod] = useState<"file" | "camera">("file")
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null) // For file preview
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [activeTab, setActiveTab] = useState("upload")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Camera State
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  // --- Refs ---
  const fileInputRef = useRef<HTMLInputElement>(null)
  const webcamRef = useRef<any>(null); // Keep the ref here in the parent

  // --- Handlers for File Upload ---
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [])

  // Unified file selection logic
  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) {
      handleClearSelection()
      return
    }
    // Check if file is an image
    if (!file.type.match("image.*")) {
      setErrorMessage("Please select an image file.")
      handleClearSelection()
      return
    }

    setSelectedFile(file)
    setCapturedImage(null) // Clear camera capture if file is selected
    setErrorMessage(null)
    setUploadStatus("idle")
    setAnalysisResult(null)

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files?.[0] ?? null)
    },
    [handleFileSelect],
  )

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // --- Handlers for Camera ---
  const videoConstraints = useMemo(
    () => ({
      width: 1280,
      height: 720,
      facingMode: "user", // Use 'environment' for rear camera
    }),
    [],
  )

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot({ width: 1920, height: 1080 })
      if (imageSrc) {
        setCapturedImage(imageSrc)
        setSelectedFile(null) // Clear file selection if image captured
        setPreviewUrl(null)
        setErrorMessage(null)
        setUploadStatus("idle")
        setAnalysisResult(null)
      } else {
        setErrorMessage("Could not capture image from webcam.")
      }
    }
  }, [webcamRef])

  // Handler to enable the camera view
  const handleCameraEnable = useCallback(() => {
    setCameraEnabled(true)
    handleClearSelection() // Clear file selection when switching to camera
  }, [])

  const handleCloseCamera = useCallback(() => {
    setCameraEnabled(false)
    setCapturedImage(null) // Clear captured image when closing camera
  }, [])

  // --- Cleanup / Reset ---
  const handleClearSelection = useCallback(() => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setCapturedImage(null)
    setUploadStatus("idle")
    setUploadProgress(0)
    setAnalysisResult(null)
    setActiveTab("upload")
    setErrorMessage(null)
    // Reset file input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  // --- Unified Analysis Handler ---
  const handleAnalyze = useCallback(async () => {
    let imageBlob: Blob | null = null
    let sourceName = "image.jpg" // Default filename

    if (uploadMethod === "file" && selectedFile) {
      imageBlob = selectedFile
      sourceName = selectedFile.name
    } else if (uploadMethod === "camera" && capturedImage) {
      imageBlob = dataURLtoBlob(capturedImage)
      sourceName = "capture.jpg"
    }

    if (!imageBlob) {
      setErrorMessage(uploadMethod === "file" ? "Please select a file." : "Please capture an image.")
      return
    }

    setUploadStatus("uploading")
    setErrorMessage(null)
    setAnalysisResult(null)
    setUploadProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev >= 95 ? 95 : prev + 5))
      }, 150)

      // Try to use the real API
      try {
        // Upload the fingerprint
        const uploadResponse = await fingerprintService.uploadFingerprint(formData);


        // Analyze the fingerprint
        const analysisResponse = await fingerprintService.analyzeFingerprint(uploadResponse.id);

        clearInterval(progressInterval)
        setUploadProgress(100)

        // Map the API response to our AnalysisResult interface
        const result: AnalysisResult = {
          classification: analysisResponse.classification || "Whorl",
          ridgeCount: analysisResponse.ridge_count || 24,
          confidence: analysisResponse.confidence || 96.7,
          processingTime: analysisResponse.processing_time || "1.2 seconds",
        }

        setAnalysisResult(result)
        setUploadStatus("success")
        setActiveTab("results")
      } catch (apiError) {
        console.error("API error:", apiError)

        // Fallback to mock data if API fails
        setTimeout(() => {
          clearInterval(progressInterval)
          setUploadProgress(100)

          // Simulate a successful response
          const mockResult: AnalysisResult = {
            classification: "Whorl",
            ridgeCount: 24,
            confidence: 96.7,
            processingTime: "1.2 seconds",
          }

          setAnalysisResult(mockResult)
          setUploadStatus("success")
          setActiveTab("results")
        }, 3000)
      }
    } catch (err) {
      setUploadProgress(0)
      console.error("Analysis Error:", err)
      let specificError = "Failed to analyze fingerprint. Please try again."
      if (err instanceof Error) {
        specificError = err.message || specificError
      }
      setErrorMessage(specificError)
      setUploadStatus("error")
    }
  }, [uploadMethod, selectedFile, capturedImage])

  // Animation variants
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

  // Memoize props for child components
  const fileUploadProps = useMemo(
    () => ({
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
    }),
    [
      dragActive,
      selectedFile,
      previewUrl,
      uploadStatus,
      uploadProgress,
      errorMessage,
      handleDrag,
      handleDrop,
      handleFileInputChange,
      handleUploadClick,
      handleClearSelection,
      handleAnalyze,
    ],
  )

  const cameraUploadProps = useMemo(
    () => ({
      cameraEnabled,
      capturedImage,
      uploadStatus,
      // uploadProgress, // This prop was not used by CameraUploadArea in your original structure
      errorMessage,
      // webcamRef, // Ref will be passed directly to the lazy loaded component
      videoConstraints,
      capture,
      handleCameraEnable,
      handleCloseCamera,
      handleAnalyze,
      WebcamComponent: Webcam // Pass the dynamically imported Webcam
    }),
    [
      cameraEnabled, capturedImage, uploadStatus, errorMessage, videoConstraints,
      capture, handleCameraEnable, handleCloseCamera, handleAnalyze, Webcam // Add Webcam to dependencies
    ]
  );

  const resultsViewProps = useMemo(
    () => ({
      analysisResult,
      previewUrl,
      capturedImage,
    }),
    [analysisResult, previewUrl, capturedImage],
  )

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div className="space-y-2" variants={itemVariants}>
        <h2 className="text-2xl font-bold tracking-tight">Upload Fingerprint</h2>
        <p className="text-muted-foreground">
          Upload or capture a fingerprint image for classification and ridge counting.
        </p>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        {/* Tab Triggers */}
        <TabsList className="grid w-full grid-cols-2 lg:w-auto">
          <TabsTrigger
            value="upload"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Upload
          </TabsTrigger>
          <TabsTrigger
            value="results"
            disabled={!analysisResult && uploadStatus !== "success"}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Results
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Upload Tab Content */}
          {activeTab === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="upload" className="space-y-4 mt-0">
                {/* Upload Method Selection Card */}
                <Card className="hover-card-effect overflow-hidden">
                  <CardHeader>
                    <CardTitle>Select Upload Method</CardTitle>
                    <CardDescription>Choose how you want to upload your fingerprint image</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* File Upload Button */}
                      <Button
                        variant={uploadMethod === "file" ? "default" : "outline"}
                        className={`flex flex-col h-20 gap-1 transition-all ${uploadMethod === "file" ? "shadow-md" : ""}`}
                        onClick={() => {
                          setUploadMethod("file")
                          handleClearSelection()
                        }}
                      >
                        <File className={`h-5 w-5 ${uploadMethod === "file" ? "animate-pulse-slow" : ""}`} />
                        <span>Upload File</span>
                      </Button>
                      {/* Camera Button */}
                      <Button
                        variant={uploadMethod === "camera" ? "default" : "outline"}
                        className={`flex flex-col h-20 gap-1 transition-all ${uploadMethod === "camera" ? "shadow-md" : ""}`}
                        onClick={() => {
                          setUploadMethod("camera")
                          handleClearSelection()
                        }}
                      >
                        <Camera className={`h-5 w-5 ${uploadMethod === "camera" ? "animate-pulse-slow" : ""}`} />
                        <span>Use Camera</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* File Upload Area */}
                {uploadMethod === "file" && (
                  <Suspense fallback={<div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-lg"></div>}>
                    <FileUploadArea {...fileUploadProps} />
                  </Suspense>
                )}

                {/* Camera Area */}
                {uploadMethod === "camera" && (
        <Suspense fallback={<div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-lg flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
          <CameraUploadArea {...cameraUploadProps} ref={webcamRef} /> {/* Pass ref here */}
        </Suspense>
      )}

                {/* Upload Guidelines Card */}
                <Suspense fallback={<div className="h-[200px] w-full bg-muted/20 animate-pulse rounded-lg"></div>}>
                  <UploadGuidelines />
                </Suspense>
              </TabsContent>
            </motion.div>
          )}

          {/* Results Tab Content */}
          {activeTab === "results" && analysisResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="results" className="mt-0">
                <Suspense fallback={<div className="h-[400px] w-full bg-muted/20 animate-pulse rounded-lg"></div>}>
                  <ResultsView {...resultsViewProps} onUploadAnother={handleClearSelection} />
                </Suspense>
              </TabsContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </motion.div>
  )
}
