// File: frontend-web/src/components/FingerprintUploader.tsx
'use client';

import React, { useState } from 'react';
// Make sure this import points to your centralized Axios service
import { fingerprintService } from '@/services/api';
// ... other imports (Button, Input, etc.)
import { Loader2, Upload, AlertCircle, CheckCircle, HelpCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Define proper interface for analysis result
interface AnalysisResult {
  pattern_type?: string;
  confidence?: number;
  quality_score?: string;
  minutiae_count?: number;
  classification?: string;
  ridge_count?: number;
  processing_time?: string;
  additional_details?: Record<string, unknown>;
}

function FingerprintUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hand, setHand] = useState('right');
  const [finger, setFinger] = useState('index');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFingerprintId, setUploadedFingerprintId] = useState<number | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        setFile(null);
        setPreview(null);
        return;
      }
      setFile(selectedFile);
      setAnalysisResult(null);
      setError(null);
      setUploadSuccess(false);
      setUploadedFingerprintId(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    if (!title.trim()) {
      setError('Please provide a title for the fingerprint.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('hand_type', hand);
    formData.append('finger_position', finger);

    try {
      const response = await fingerprintService.uploadFingerprint(formData); // Use the service
      setUploadSuccess(true);
      setUploadedFingerprintId(response.id); // Assuming the service returns the uploaded object with an id
      setTitle(''); // Clear form on successful upload
      setDescription('');
      setFile(null);
      setPreview(null);
    } catch (err: unknown) {
      console.error('Upload Error:', err);
      const errorMsg = err instanceof Error && 'response' in err 
        ? (err as { response?: { data?: { detail?: string; error?: string } } }).response?.data?.detail || 
          (err as { response?: { data?: { detail?: string; error?: string } } }).response?.data?.error || 
          err.message || 'Failed to upload fingerprint.'
        : 'Failed to upload fingerprint.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFingerprintId) {
      setError('Please upload a fingerprint first or ensure the previous upload was successful.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null); // Clear previous results

    try {
      const result = await fingerprintService.analyzeFingerprint(uploadedFingerprintId); // Use the service
      setAnalysisResult(result); // Store the actual API response
    } catch (err: unknown) {
      console.error('Analysis Error:', err);
      const errorMsg = err instanceof Error && 'response' in err 
        ? (err as { response?: { data?: { detail?: string; error?: string } } }).response?.data?.detail || 
          (err as { response?: { data?: { detail?: string; error?: string } } }).response?.data?.error || 
          err.message || 'Failed to analyze fingerprint.'
        : 'Failed to analyze fingerprint.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // The JSX for the form remains largely the same, just ensure it uses the state variables above.
  // ... (rest of your JSX from FingerprintUploader.tsx)
  // Update the analysis result display to use actual fields from your API if they differ from the mock
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Fingerprint (Detailed Form)</CardTitle>
        <CardDescription>
          Upload a fingerprint image for analysis. Supported formats: JPEG, PNG.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-4">
          {/* Title Input */}
          <div className="space-y-2" data-tutorial="form-fields">
            <div className="flex items-center gap-2">
              <label htmlFor="fp-title" className="text-sm font-medium">Title</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Give your fingerprint a descriptive title for easy identification</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input 
              id="fp-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this fingerprint"
              required
            />
          </div>
          
          {/* Description Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label htmlFor="fp-description" className="text-sm font-medium">Description (Optional)</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add context like case number, date collected, or other relevant details</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Textarea 
              id="fp-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any additional details"
              rows={3}
            />
          </div>
          
          {/* Hand and Finger Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label htmlFor="fp-hand" className="text-sm font-medium">Hand</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select which hand the fingerprint was taken from</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={hand} onValueChange={setHand}>
                <SelectTrigger id="fp-hand">
                  <SelectValue placeholder="Select hand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left Hand</SelectItem>
                  <SelectItem value="right">Right Hand</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label htmlFor="fp-finger" className="text-sm font-medium">Finger</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Specify which finger the print belongs to for accurate classification</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={finger} onValueChange={setFinger}>
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
          
          {/* File Input Area */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label htmlFor="fp-image-upload" className="text-sm font-medium">Fingerprint Image</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload a clear, high-resolution fingerprint image (JPEG or PNG). Ensure good lighting and minimal noise for best analysis results.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div 
              className="flex items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer min-h-[150px] hover:border-primary transition-colors"
              onClick={() => document.getElementById('fp-image-upload-input')?.click()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const fakeEvent = {
                    target: { files: e.dataTransfer.files }
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleFileChange(fakeEvent);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
              data-tutorial="upload-area"
            >
              {preview ? (
                <div className="text-center">
                  <img src={preview} alt="Fingerprint preview" className="max-h-40 sm:max-h-64 mx-auto mb-2 rounded" />
                  <p className="text-sm text-muted-foreground">Click to change image</p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">JPEG, PNG up to 10MB</p>
                </div>
              )}
            </div>
            <input
              id="fp-image-upload-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload fingerprint image"
              title="Upload fingerprint image file"
            />
          </div>
          
          {/* Upload Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="submit" 
                disabled={isLoading || !file || !title.trim()}
                className="w-full"
                data-tutorial="upload-button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Fingerprint
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload your fingerprint for secure storage and analysis</p>
            </TooltipContent>
          </Tooltip>
        </form>
        
        {/* Success Message */}
        {uploadSuccess && (
          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Upload Successful!</AlertTitle>
            <AlertDescription>
              Your fingerprint has been uploaded successfully. You can now analyze it.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      {/* Analysis Section */}
      {uploadSuccess && uploadedFingerprintId && (
        <CardFooter className="flex flex-col space-y-4">
          <div className="w-full border-t pt-4">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">Analysis</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Our AI analyzes ridge patterns, minutiae points, and other unique characteristics to classify your fingerprint</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isLoading}
                  className="w-full"
                  variant="outline"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Fingerprint'
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start AI-powered analysis to identify patterns and characteristics</p>
              </TooltipContent>
            </Tooltip>

            {/* Analysis Results */}
            {analysisResult && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  Analysis Results
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>These results show the AI&apos;s classification and confidence levels for your fingerprint</p>
                    </TooltipContent>
                  </Tooltip>
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Pattern Type:</span>
                    <span className="font-medium">{analysisResult.pattern_type || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence:</span>
                    <span className="font-medium">{analysisResult.confidence ? `${(analysisResult.confidence * 100).toFixed(1)}%` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality Score:</span>
                    <span className="font-medium">{analysisResult.quality_score || 'N/A'}</span>
                  </div>
                  {analysisResult.minutiae_count && (
                    <div className="flex justify-between">
                      <span>Minutiae Points:</span>
                      <span className="font-medium">{analysisResult.minutiae_count}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

export default FingerprintUploader;