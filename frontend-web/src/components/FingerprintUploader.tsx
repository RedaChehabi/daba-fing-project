// File: frontend-web/src/components/FingerprintUploader.tsx
'use client';

import React, { useState } from 'react';
// Make sure this import points to your centralized Axios service
import { fingerprintService } from '@/services/api';
// ... other imports (Button, Input, etc.)
import { Loader2, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';


function FingerprintUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hand, setHand] = useState('right');
  const [finger, setFinger] = useState('index');
  const [analysisResult, setAnalysisResult] = useState<any>(null); // Define a proper interface later
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
    } catch (err: any) {
      console.error('Upload Error:', err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || err.message || 'Failed to upload fingerprint.';
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
    } catch (err: any) {
      console.error('Analysis Error:', err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || err.message || 'Failed to analyze fingerprint.';
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
          <div className="space-y-2">
            <label htmlFor="fp-title" className="text-sm font-medium">Title</label>
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
            <label htmlFor="fp-description" className="text-sm font-medium">Description (Optional)</label>
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
              <label htmlFor="fp-hand" className="text-sm font-medium">Hand</label>
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
              <label htmlFor="fp-finger" className="text-sm font-medium">Finger</label>
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
            <label htmlFor="fp-image-upload" className="text-sm font-medium">Fingerprint Image</label>
            <div 
              className="flex items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer min-h-[150px] hover:border-primary"
              onClick={() => document.getElementById('fp-image-upload-input')?.click()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileChange({ target: { files: e.dataTransfer.files } } as any);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              {preview ? (
                <div className="text-center">
                  <img src={preview} alt="Fingerprint preview" className="max-h-40 sm:max-h-64 mx-auto mb-2 rounded" />
                  <p className="text-xs text-muted-foreground">Click or drag new image to change</p>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Upload className="mx-auto h-10 w-10" />
                  <p className="mt-2 text-sm">Click to select or drag & drop image</p>
                  <p className="text-xs mt-1">Supports JPEG, PNG, BMP, TIFF, WebP</p>
                </div>
              )}
              <Input 
                type="file" 
                id="fp-image-upload-input"
                onChange={handleFileChange} 
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          
          {/* Error and Success Alerts */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {uploadSuccess && uploadedFingerprintId && (
            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-800 dark:text-green-300">Success</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-400">
                Fingerprint uploaded successfully (ID: {uploadedFingerprintId})! You can now analyze it.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Upload Button */}
          <div className="flex justify-end space-x-2">
            <Button 
              type="submit" 
              disabled={!file || isLoading}
            >
              {isLoading && !analysisResult ? ( // Show "Uploading" only during upload phase
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Fingerprint'
              )}
            </Button>
          </div>
        </form>
        
        {/* Analyze Button - shows after successful upload */}
        {uploadSuccess && uploadedFingerprintId && (
          <div className="mt-6 border-t pt-4">
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading && !analysisResult ? ( // Show "Analyzing" if loading and no results yet
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Fingerprint'
              )}
            </Button>
          </div>
        )}
      </CardContent>
      
      {/* Analysis Results Display */}
      {analysisResult && (
        <CardFooter className="flex flex-col mt-6 border-t pt-4">
          <div className="w-full p-4 bg-muted/50 rounded-md">
            <h3 className="text-lg font-medium mb-2">Analysis Results for ID: {uploadedFingerprintId}</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Classification:</div>
                <div className="text-sm">{analysisResult.classification || 'Not available'}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Ridge Count:</div>
                <div className="text-sm">{analysisResult.ridge_count || analysisResult.ridgeCount || 'Not available'}</div>
              </div>
               <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Confidence:</div>
                <div className="text-sm">{analysisResult.confidence !== undefined ? `${analysisResult.confidence.toFixed(1)}%` : 'Not available'}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Processing Time:</div>
                <div className="text-sm">{analysisResult.processing_time || analysisResult.processingTime || 'Not available'}</div>
              </div>
              
              {analysisResult.additional_details && Object.keys(analysisResult.additional_details).length > 0 && (
                <div className="mt-2">
                  <div className="text-sm font-medium mb-1">Additional Details:</div>
                  <pre className="text-xs bg-background p-2 rounded overflow-x-auto border">
                    {JSON.stringify(analysisResult.additional_details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

export default FingerprintUploader;