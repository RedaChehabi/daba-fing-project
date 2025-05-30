'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { 
  Combine, 
  Upload, 
  Image as ImageIcon, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  RotateCcw,
  Zap
} from 'lucide-react';
import { api } from '@/services/api';

interface FingerprintImage {
  id: number;
  title: string;
  image: string;
  upload_date: string;
  is_processed: boolean;
}

interface MergeResult {
  merged_fingerprint_id: number;
  merged_image_path: string;
  merge_quality: {
    merge_success: number;
    edge_continuity: number;
    overall_quality: number;
  };
  merged_dimensions: [number, number];
}

interface FingerprintMergerProps {
  userFingerprints: FingerprintImage[];
  onMergeComplete?: (result: MergeResult) => void;
  className?: string;
}

const FingerprintMerger: React.FC<FingerprintMergerProps> = ({
  userFingerprints = [],
  onMergeComplete,
  className = ''
}) => {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedMiddle, setSelectedMiddle] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mergeResult, setMergeResult] = useState<MergeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const selectedImages = {
    left: userFingerprints.find(img => img.id === selectedLeft),
    middle: userFingerprints.find(img => img.id === selectedMiddle),
    right: userFingerprints.find(img => img.id === selectedRight)
  };

  const canMerge = selectedLeft && selectedRight;
  const hasMiddle = selectedMiddle !== null;

  const handleMerge = useCallback(async () => {
    if (!canMerge) return;

    setIsLoading(true);
    setError(null);

    try {
      const mergeData: any = {
        left_image_id: selectedLeft,
        right_image_id: selectedRight
      };

      if (selectedMiddle) {
        mergeData.middle_image_id = selectedMiddle;
      }

      const result = await api.post('/fingerprint/merge/', mergeData);
      
      if (result.status === 'success') {
        setMergeResult(result);
        onMergeComplete?.(result);
      } else {
        setError(result.detail || 'Merge operation failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to merge fingerprint parts');
    } finally {
      setIsLoading(false);
    }
  }, [selectedLeft, selectedMiddle, selectedRight, canMerge, onMergeComplete]);

  const resetSelection = () => {
    setSelectedLeft(null);
    setSelectedMiddle(null);
    setSelectedRight(null);
    setMergeResult(null);
    setError(null);
  };

  const getQualityBadge = (quality: number) => {
    if (quality >= 85) return { variant: 'default' as const, text: 'Excellent', color: 'text-green-600' };
    if (quality >= 70) return { variant: 'secondary' as const, text: 'Good', color: 'text-blue-600' };
    if (quality >= 50) return { variant: 'outline' as const, text: 'Fair', color: 'text-yellow-600' };
    return { variant: 'destructive' as const, text: 'Poor', color: 'text-red-600' };
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Combine className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Fingerprint Merger</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Combine left, middle (optional), and right parts into a complete fingerprint
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={resetSelection}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Image Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Image */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-blue-600">Left Part</Label>
              <Select
                value={selectedLeft?.toString() || ''}
                onValueChange={(value) => setSelectedLeft(value ? parseInt(value) : null)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select left part" />
                </SelectTrigger>
                <SelectContent>
                  {userFingerprints.map((img) => (
                    <SelectItem key={img.id} value={img.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>{img.title || `Image ${img.id}`}</span>
                        {img.is_processed && <CheckCircle className="h-3 w-3 text-green-500" />}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedImages.left && (
                <div className="relative aspect-square border rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={selectedImages.left.image}
                    alt="Left part"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary">LEFT</Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Middle Image (Optional) */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-green-600">
                Middle Part <span className="text-sm text-muted-foreground">(Optional)</span>
              </Label>
              <Select
                value={selectedMiddle?.toString() || ''}
                onValueChange={(value) => setSelectedMiddle(value ? parseInt(value) : null)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select middle part" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    <span className="text-muted-foreground">None (Skip middle part)</span>
                  </SelectItem>
                  {userFingerprints.map((img) => (
                    <SelectItem key={img.id} value={img.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>{img.title || `Image ${img.id}`}</span>
                        {img.is_processed && <CheckCircle className="h-3 w-3 text-green-500" />}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedImages.middle && (
                <div className="relative aspect-square border rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={selectedImages.middle.image}
                    alt="Middle part"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary">MIDDLE</Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Right Image */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-orange-600">Right Part</Label>
              <Select
                value={selectedRight?.toString() || ''}
                onValueChange={(value) => setSelectedRight(value ? parseInt(value) : null)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select right part" />
                </SelectTrigger>
                <SelectContent>
                  {userFingerprints.map((img) => (
                    <SelectItem key={img.id} value={img.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>{img.title || `Image ${img.id}`}</span>
                        {img.is_processed && <CheckCircle className="h-3 w-3 text-green-500" />}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedImages.right && (
                <div className="relative aspect-square border rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={selectedImages.right.image}
                    alt="Right part"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary">RIGHT</Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Merge Flow Visualization */}
          {canMerge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-4 p-4 bg-blue-50 rounded-lg"
            >
              <Badge variant="outline">LEFT</Badge>
              <ArrowRight className="h-4 w-4 text-blue-600" />
              {hasMiddle && (
                <>
                  <Badge variant="outline">MIDDLE</Badge>
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                </>
              )}
              <Badge variant="outline">RIGHT</Badge>
              <ArrowRight className="h-4 w-4 text-blue-600" />
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-md">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">MERGED</span>
              </div>
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Merge Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleMerge}
              disabled={!canMerge || isLoading}
              size="lg"
              className="px-8"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Merging...
                </>
              ) : (
                <>
                  <Combine className="h-4 w-4 mr-2" />
                  Merge Fingerprint Parts
                </>
              )}
            </Button>
          </div>

          {/* Merge Result */}
          {mergeResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <Separator />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Result Image */}
                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-green-600">Merged Result</Label>
                  <div className="relative aspect-[4/3] border rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={mergeResult.merged_image_path}
                      alt="Merged fingerprint"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        MERGED
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Quality Metrics */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Merge Quality</Label>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Overall Quality</span>
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${getQualityBadge(mergeResult.merge_quality.overall_quality).color}`}>
                          {mergeResult.merge_quality.overall_quality.toFixed(1)}%
                        </span>
                        <Badge {...getQualityBadge(mergeResult.merge_quality.overall_quality)}>
                          {getQualityBadge(mergeResult.merge_quality.overall_quality).text}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Edge Continuity</span>
                      <span className="font-bold text-blue-600">
                        {mergeResult.merge_quality.edge_continuity.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Merge Success</span>
                      <span className="font-bold text-green-600">
                        {mergeResult.merge_quality.merge_success.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Dimensions</span>
                      <span className="font-mono text-sm">
                        {mergeResult.merged_dimensions[1]} × {mergeResult.merged_dimensions[0]}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FingerprintMerger; 