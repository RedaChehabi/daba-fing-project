// File: frontend-web/src/app/dashboard/upload/page.tsx
"use client"

import React, { useState, useRef, useCallback, useMemo, lazy, Suspense } from "react"
// ... other imports from your existing page.tsx ...
import { Input } from "@/components/ui/input"; // Add Input
import { Textarea } from "@/components/ui/textarea"; // Add Textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Add Select components
import { Label } from "@/components/ui/label"; // Add Label
// Importing the Tabs component
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

// ... (interfaces, helper functions like dataURLtoBlob, lazy imports remain the same) ...
const FileUploadArea = lazy(() => import("@/components/upload/file-upload-area"))
const CameraUploadArea = lazy(() => import("@/components/upload/camera-upload-area"))
const ResultsView = lazy(() => import("@/components/upload/results-view"))
const UploadGuidelines = lazy(() => import("@/components/upload/upload-guidelines"))


export default function UploadPage() {
  // ... (existing state variables: uploadMethod, dragActive, selectedFile, etc.) ...
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadMethod, setUploadMethod] = useState<"file" | "camera">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null); // Define AnalysisResult interface
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [dragActive, setDragActive] = useState(false);


  // --- State for Fingerprint Metadata ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [handType, setHandType] = useState("right"); // Default or ""
  const [fingerPosition, setFingerPosition] = useState("index"); // Default or ""

  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<any>(null); 

  // Define AnalysisResult interface if not already defined
  interface AnalysisResult {
    classification: string;
    ridgeCount: number;
    confidence: number;
    processingTime: string;
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
    };


  // ... (handleDrag, handleDrop, handleFileSelect, handleFileInputChange, handleUploadClick, capture, handleCameraEnable, handleCloseCamera, handleClearSelection callbacks remain the same)
    const handleClearSelection = useCallback(() => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setCapturedImage(null);
        setUploadStatus("idle");
        setUploadProgress(0);
        setAnalysisResult(null);
        setActiveTab("upload");
        setErrorMessage(null);
        setTitle(""); // Clear metadata fields too
        setDescription("");
        setHandType("right");
        setFingerPosition("index");
        if (fileInputRef.current) {
        fileInputRef.current.value = "";
        }
    }, []);

    const handleFileSelect = useCallback((file: File | null) => {
        if (!file) {
          handleClearSelection();
          return;
        }
        if (!file.type.match("image.*")) {
          setErrorMessage("Please select an image file.");
          handleClearSelection();
          return;
        }
    
        setSelectedFile(file);
        setCapturedImage(null); 
        setErrorMessage(null);
        setUploadStatus("idle");
        setAnalysisResult(null);
    
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }, [handleClearSelection]);

    const handleFileInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          handleFileSelect(e.target.files?.[0] ?? null);
        },
        [handleFileSelect],
      );
    
    const handleUploadClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
          setDragActive(true);
        } else if (e.type === "dragleave") {
          setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
          }
        },
        [handleFileSelect],
      );
    
    const videoConstraints = useMemo(
        () => ({
          width: 1280,
          height: 720,
          facingMode: "user",
        }),
        [],
    );
    
    const capture = useCallback(() => {
        if (webcamRef.current) {
          const imageSrc = webcamRef.current.getScreenshot({ width: 1920, height: 1080 });
          if (imageSrc) {
            setCapturedImage(imageSrc);
            setSelectedFile(null); 
            setPreviewUrl(null);
            setErrorMessage(null);
            setUploadStatus("idle");
            setAnalysisResult(null);
          } else {
            setErrorMessage("Could not capture image from webcam.");
          }
        }
    }, [webcamRef]);

    const handleCameraEnable = useCallback(() => {
        setCameraEnabled(true);
        handleClearSelection(); 
    }, [handleClearSelection]);

    const handleCloseCamera = useCallback(() => {
        setCameraEnabled(false);
        setCapturedImage(null);
    }, []);


  const handleAnalyze = useCallback(async () => {
    let imageBlob: Blob | null = null;
    let sourceName = "image.jpg";

    if (uploadMethod === "file" && selectedFile) {
      imageBlob = selectedFile;
      sourceName = selectedFile.name;
    } else if (uploadMethod === "camera" && capturedImage) {
      imageBlob = dataURLtoBlob(capturedImage);
      sourceName = "capture.jpg";
    }

    if (!imageBlob) {
      setErrorMessage(uploadMethod === "file" ? "Please select a file or capture an image." : "Please capture an image.");
      return;
    }
    if (!title.trim()){
      setErrorMessage("Please provide a title for the fingerprint.");
      return;
    }
    // Add similar checks for handType and fingerPosition if they are mandatory

    setUploadStatus("uploading");
    setErrorMessage(null);
    setAnalysisResult(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('image', imageBlob, sourceName);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('hand_type', handType);
    formData.append('finger_position', fingerPosition);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev < 90 ? prev + 10 : 90));
    }, 200);

    try {
      // Assuming fingerprintService is imported and configured
      const uploadResponse = await fingerprintService.uploadFingerprint(formData);
      clearInterval(progressInterval);
      setUploadProgress(95);

      if (uploadResponse && uploadResponse.id) {
        const analysisResponse = await fingerprintService.analyzeFingerprint(uploadResponse.id);
        setUploadProgress(100);

        const result: AnalysisResult = {
          classification: analysisResponse.classification || "N/A",
          ridgeCount: analysisResponse.ridge_count || analysisResponse.ridgeCount || 0,
          confidence: analysisResponse.confidence ? (analysisResponse.confidence * 100) : 0,
          processingTime: analysisResponse.processing_time || analysisResponse.processingTime || "N/A",
        };
        
        setAnalysisResult(result);
        setUploadStatus("success");
        setActiveTab("results");
      } else {
        throw new Error("Fingerprint upload failed or did not return an ID.");
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      console.error("Analysis or Upload Error:", err);
      
      let specificError = "Failed to upload or analyze fingerprint. Please try again.";
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.detail) {
          specificError = errorData.detail;
        } else if (typeof errorData === 'object') {
          const fieldErrors = Object.values(errorData).flat();
          if (fieldErrors.length > 0) {
            specificError = (fieldErrors[0] as string);
          }
        } else if (typeof errorData === 'string') {
          specificError = errorData;
        }
      } else if (err.message) {
        specificError = err.message;
      }
      
      setErrorMessage(specificError);
      setUploadStatus("error");
    }
  // Add title, description, handType, fingerPosition to dependency array
  }, [uploadMethod, selectedFile, capturedImage, title, description, handType, fingerPosition, setActiveTab]);


  // ... (containerVariants, itemVariants, fileUploadProps, cameraUploadProps, resultsViewProps memos remain the same)
  const fileUploadProps = useMemo(
    () => ({
      dragActive, selectedFile, previewUrl, uploadStatus, uploadProgress, errorMessage, fileInputRef,
      handleDrag, handleDrop, handleFileInputChange, handleUploadClick, handleClearSelection, handleAnalyze,
    }),
    [dragActive, selectedFile, previewUrl, uploadStatus, uploadProgress, errorMessage, handleDrag, handleDrop, handleFileInputChange, handleUploadClick, handleClearSelection, handleAnalyze]
  );

  const cameraUploadProps = useMemo(
    () => ({
      cameraEnabled, capturedImage, uploadStatus, errorMessage, webcamRef, videoConstraints,
      capture, handleCameraEnable, handleCloseCamera, handleAnalyze, WebcamComponent: React.lazy(() => import("react-webcam")) // Pass the dynamically imported Webcam
    }),
    [cameraEnabled, capturedImage, uploadStatus, errorMessage, videoConstraints, capture, handleCameraEnable, handleCloseCamera, handleAnalyze, webcamRef]
  );

  const resultsViewProps = useMemo(
    () => ({ analysisResult, previewUrl, capturedImage, onUploadAnother: handleClearSelection }),
    [analysisResult, previewUrl, capturedImage, handleClearSelection]
  );

  const containerVariants = { /* ... */ };
  const itemVariants = { /* ... */ };

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* ... (Header and Tabs remain the same) ... */}
      <motion.div className="space-y-2" variants={itemVariants}>
        <h2 className="text-2xl font-bold tracking-tight">Upload Fingerprint</h2>
        <p className="text-muted-foreground">
          Upload or capture a fingerprint image for classification and ridge counting.
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
        <AnimatePresence mode="wait">
         {activeTab === "upload" && (
          <motion.div /* ... */ >
            <TabsContent value="upload" className="space-y-4 mt-0">
                {/* ... (Upload Method Selection Card remains the same) ... */}
                <Card className="hover-card-effect overflow-hidden">
                  <CardHeader>
                    <CardTitle>Select Upload Method</CardTitle>
                    <CardDescription>Choose how you want to upload your fingerprint image</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        variant={uploadMethod === "file" ? "default" : "outline"}
                        className={`flex flex-col h-20 gap-1 transition-all ${uploadMethod === "file" ? "shadow-md" : ""}`}
                        onClick={() => { setUploadMethod("file"); handleClearSelection(); }}
                      >
                        <File className={`h-5 w-5 ${uploadMethod === "file" ? "animate-pulse-slow" : ""}`} />
                        <span>Upload File</span>
                      </Button>
                      <Button
                        variant={uploadMethod === "camera" ? "default" : "outline"}
                        className={`flex flex-col h-20 gap-1 transition-all ${uploadMethod === "camera" ? "shadow-md" : ""}`}
                        onClick={() => { setUploadMethod("camera"); handleClearSelection(); }}
                      >
                        <Camera className={`h-5 w-5 ${uploadMethod === "camera" ? "animate-pulse-slow" : ""}`} />
                        <span>Use Camera</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

              {/* Metadata Form Card - ADD THIS SECTION */}
              <Card className="hover-card-effect overflow-hidden">
                <CardHeader>
                  <CardTitle>Fingerprint Details</CardTitle>
                  <CardDescription>Provide details for the fingerprint image.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="fp-title">Title</Label>
                    <Input 
                      id="fp-title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="e.g., Left Thumb - Case 123" 
                      required 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fp-description">Description (Optional)</Label>
                    <Textarea 
                      id="fp-description" 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      placeholder="Any relevant notes" 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="fp-hand">Hand Type</Label>
                      <Select value={handType} onValueChange={setHandType}>
                        <SelectTrigger id="fp-hand">
                          <SelectValue placeholder="Select hand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left Hand</SelectItem>
                          <SelectItem value="right">Right Hand</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="fp-finger">Finger Position</Label>
                      <Select value={fingerPosition} onValueChange={setFingerPosition}>
                        <SelectTrigger id="fp-finger">
                          <SelectValue placeholder="Select finger" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="thumb">Thumb</SelectItem>
                          <SelectItem value="index">Index Finger</SelectItem>
                          <SelectItem value="middle">Middle Finger</SelectItem>
                          <SelectItem value="ring">Ring Finger</SelectItem>
                          <SelectItem value="pinky">Pinky Finger</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* End Metadata Form Card */}

              {uploadMethod === "file" && (
                <Suspense fallback={<div>Loading File Upload...</div>}>
                  <FileUploadArea {...fileUploadProps} />
                </Suspense>
              )}
              {uploadMethod === "camera" && (
                <Suspense fallback={<div>Loading Camera...</div>}>
                  <CameraUploadArea {...cameraUploadProps} ref={webcamRef} />
                </Suspense>
              )}
              <Suspense fallback={<div>Loading Guidelines...</div>}>
                <UploadGuidelines />
              </Suspense>
            </TabsContent>
          </motion.div>
        )}
        {activeTab === "results" && analysisResult && (
            <motion.div /* ... */ >
                <TabsContent value="results" className="mt-0">
                    <Suspense fallback={<div>Loading Results...</div>}>
                        <ResultsView {...resultsViewProps} />
                    </Suspense>
                </TabsContent>
            </motion.div>
        )}
        </AnimatePresence>
      </Tabs>
    </motion.div>
  )
}