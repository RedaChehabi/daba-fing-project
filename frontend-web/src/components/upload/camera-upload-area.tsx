// File: frontend-web/src/components/upload/camera-upload-area.tsx
"use client";

import React, { forwardRef } from 'react'; // Added forwardRef
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, Camera as CameraIcon } from "lucide-react"; // Renamed Camera to CameraIcon

// Dynamically imported in parent, so we receive Webcam as a prop
interface CameraUploadAreaProps {
  cameraEnabled: boolean;
  capturedImage: string | null;
  uploadStatus: string; // 'idle', 'uploading', 'success', 'error'
  errorMessage: string | null;
  webcamRef: React.RefObject<any>; // From react-webcam
  videoConstraints: MediaStreamConstraints['video'];
  capture: () => void;
  handleCameraEnable: () => void;
  handleCloseCamera: () => void;
  handleAnalyze: () => void;
  WebcamComponent: any; // Passed dynamically imported Webcam
}

// Use forwardRef to pass the webcamRef correctly
const CameraUploadArea = forwardRef<any, CameraUploadAreaProps>(({
  cameraEnabled,
  capturedImage,
  uploadStatus,
  errorMessage, // Make sure to display this if present
  // webcamRef, // Ref is now handled by forwardRef and passed to WebcamComponent
  videoConstraints,
  capture,
  handleCameraEnable,
  handleCloseCamera,
  handleAnalyze,
  WebcamComponent // Receive the dynamically imported Webcam component
}, ref) => {

  return (
    <Card className="hover-card-effect overflow-hidden">
      <CardHeader>
        <CardTitle>Capture via Camera</CardTitle>
        <CardDescription>Position the fingerprint clearly in the camera view.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {!cameraEnabled && (
          <Button onClick={handleCameraEnable} className="my-4 button-hover-effect">
            <CameraIcon className="mr-2 h-4 w-4" /> Enable Camera
          </Button>
        )}

        {cameraEnabled && !capturedImage && WebcamComponent && (
          <div className="w-full max-w-2xl mx-auto">
            <WebcamComponent
              audio={false}
              ref={ref} // Use the forwarded ref here
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="rounded-md border bg-muted h-auto w-full"
              mirrored={true} // Or false, depending on preference
            />
            <Button onClick={capture} className="mt-4 w-full button-hover-effect">
              Capture Photo
            </Button>
          </div>
        )}

        {capturedImage && (
          <div className="my-4 flex flex-col items-center">
            <img src={capturedImage} alt="Captured fingerprint" className="rounded-md border max-w-full max-h-[300px] mb-4" />
            <Button onClick={() => handleCameraEnable()} variant="outline"> {/* Simplified to just re-enable camera flow */}
              Retake Photo
            </Button>
          </div>
        )}
         {errorMessage && ( // Display error message if any
          <p className="text-sm text-destructive mt-2">{errorMessage}</p>
        )}
        {cameraEnabled && (
          <Button variant="outline" onClick={handleCloseCamera} className="mt-2">
            Close Camera
          </Button>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleAnalyze}
          disabled={!capturedImage || uploadStatus === "uploading"}
          className="w-full gap-2 button-hover-effect"
          size="lg"
        >
          {uploadStatus === "uploading" ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
          ) : (
            <><CheckCircle2 className="h-4 w-4" /> Analyze Captured Image</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
});

CameraUploadArea.displayName = "CameraUploadArea"; // for better debugging
export default CameraUploadArea;