'use client';

import React, { useState } from 'react';
import { fingerprintService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Upload, AlertCircle, CheckCircle } from 'lucide-react';

function FingerprintUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hand, setHand] = useState('right');
  const [finger, setFinger] = useState('index');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFingerprintId, setUploadedFingerprintId] = useState<number | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setAnalysisResult(null);
      setError(null);
      setUploadSuccess(false);
      
      // Create a preview URL for the image
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

    if (!title) {
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
      // Upload the fingerprint
      const response = await fingerprintService.uploadFingerprint(formData);
      setUploadSuccess(true);
      setUploadedFingerprintId(response.id);
    } catch (err: any) {
      console.error('Upload Error:', err);
      setError(err.response?.data?.message || 'Failed to upload fingerprint.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFingerprintId) {
      setError('Please upload a fingerprint first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Analyze the fingerprint
      const result = await fingerprintService.analyzeFingerprint(uploadedFingerprintId);
      setAnalysisResult(result);
    } catch (err: any) {
      console.error('Analysis Error:', err);
      setError(err.response?.data?.message || 'Failed to analyze fingerprint.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Fingerprint</CardTitle>
        <CardDescription>
          Upload a fingerprint image for analysis. Supported formats: JPEG, PNG.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this fingerprint"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any additional details about this fingerprint"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="hand" className="text-sm font-medium">Hand</label>
              <Select value={hand} onValueChange={setHand}>
                <SelectTrigger id="hand">
                  <SelectValue placeholder="Select hand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left Hand</SelectItem>
                  <SelectItem value="right">Right Hand</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="finger" className="text-sm font-medium">Finger</label>
              <Select value={finger} onValueChange={setFinger}>
                <SelectTrigger id="finger">
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
          
          <div className="space-y-2">
            <label htmlFor="fingerprint" className="text-sm font-medium">Fingerprint Image</label>
            <div className="flex items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer" onClick={() => document.getElementById('fingerprint')?.click()}>
              {preview ? (
                <div className="text-center">
                  <img src={preview} alt="Fingerprint preview" className="max-h-64 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to change image</p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Click to select a fingerprint image</p>
                </div>
              )}
              <Input 
                type="file" 
                id="fingerprint"
                onChange={handleFileChange} 
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {uploadSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">
                Fingerprint uploaded successfully! You can now analyze it.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="submit" 
              disabled={!file || isLoading}
            >
              {isLoading ? (
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
        
        {uploadSuccess && (
          <div className="mt-6">
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading}
              className="w-full"
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
          </div>
        )}
      </CardContent>
      
      {analysisResult && (
        <CardFooter className="flex flex-col">
          <div className="w-full p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium mb-2">Analysis Results</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Pattern Type:</div>
                <div className="text-sm">{analysisResult.pattern_type || 'Not available'}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Minutiae Count:</div>
                <div className="text-sm">{analysisResult.minutiae_count || 'Not available'}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Ridge Count:</div>
                <div className="text-sm">{analysisResult.ridge_count || 'Not available'}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Quality Score:</div>
                <div className="text-sm">{analysisResult.quality_score || 'Not available'}</div>
              </div>
              
              {analysisResult.additional_details && (
                <div className="mt-2">
                  <div className="text-sm font-medium mb-1">Additional Details:</div>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(analysisResult.additional_details, null, 2)}
                  </pre>
                </div>
              )}
              
              <Alert className="mt-2 bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-700">
                  Note: This is a placeholder result. The actual fingerprint analysis model is not yet implemented.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

export default FingerprintUploader;