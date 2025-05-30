'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff, Download, Maximize2 } from 'lucide-react';

interface MinutiaePoint {
  type: 'ending' | 'bifurcation';
  x: number;
  y: number;
}

interface CoreDeltaPoint {
  x: number;
  y: number;
}

interface QualityMetrics {
  sharpness: number;
  contrast: number;
  brightness: number;
  noise_level: number;
  ridge_clarity: number;
  overall_quality: number;
}

interface RidgeVisualizationProps {
  originalImageUrl: string;
  enhancedImageUrl?: string;
  minutiaePoints?: MinutiaePoint[];
  corePoints?: CoreDeltaPoint[];
  deltaPoints?: CoreDeltaPoint[];
  ridgeCount?: number;
  classification?: string;
  qualityMetrics?: QualityMetrics;
  className?: string;
}

const RidgeVisualization: React.FC<RidgeVisualizationProps> = ({
  originalImageUrl,
  enhancedImageUrl,
  minutiaePoints = [],
  corePoints = [],
  deltaPoints = [],
  ridgeCount = 0,
  classification = 'Unknown',
  qualityMetrics,
  className = ''
}) => {
  const [currentView, setCurrentView] = useState<'original' | 'enhanced'>('enhanced');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showMinutiae, setShowMinutiae] = useState(true);
  const [showCoresDelta, setShowCoresDelta] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    drawVisualization();
  }, [currentView, zoomLevel, showMinutiae, showCoresDelta, minutiaePoints, corePoints, deltaPoints]);

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw fingerprint image
    ctx.save();
    ctx.scale(zoomLevel, zoomLevel);
    ctx.drawImage(image, 0, 0, canvas.width / zoomLevel, canvas.height / zoomLevel);
    ctx.restore();

    // Draw minutiae points
    if (showMinutiae) {
      minutiaePoints.forEach(point => {
        drawMinutiaePoint(ctx, point.x * zoomLevel, point.y * zoomLevel, point.type);
      });
    }

    // Draw core and delta points
    if (showCoresDelta) {
      corePoints.forEach(point => {
        drawCorePoint(ctx, point.x * zoomLevel, point.y * zoomLevel);
      });

      deltaPoints.forEach(point => {
        drawDeltaPoint(ctx, point.x * zoomLevel, point.y * zoomLevel);
      });
    }
  };

  const drawMinutiaePoint = (ctx: CanvasRenderingContext2D, x: number, y: number, type: 'ending' | 'bifurcation') => {
    ctx.save();
    
    if (type === 'ending') {
      // Draw red circle for ridge endings
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      // Draw blue triangle for bifurcations
      ctx.beginPath();
      ctx.moveTo(x, y - 5);
      ctx.lineTo(x - 4, y + 3);
      ctx.lineTo(x + 4, y + 3);
      ctx.closePath();
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    ctx.restore();
  };

  const drawCorePoint = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.save();
    
    // Draw green diamond for core points
    ctx.beginPath();
    ctx.moveTo(x, y - 6);
    ctx.lineTo(x + 6, y);
    ctx.lineTo(x, y + 6);
    ctx.lineTo(x - 6, y);
    ctx.closePath();
    ctx.fillStyle = '#22c55e';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add "C" label
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px bold sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('C', x, y + 3);
    
    ctx.restore();
  };

  const drawDeltaPoint = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.save();
    
    // Draw orange square for delta points
    ctx.beginPath();
    ctx.rect(x - 5, y - 5, 10, 10);
    ctx.fillStyle = '#f97316';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add "D" label
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px bold sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('D', x, y + 3);
    
    ctx.restore();
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.5));
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  const downloadVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `fingerprint_visualization_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const currentImageUrl = currentView === 'enhanced' && enhancedImageUrl ? enhancedImageUrl : originalImageUrl;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Button
            variant={currentView === 'original' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentView('original')}
          >
            Original
          </Button>
          <Button
            variant={currentView === 'enhanced' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentView('enhanced')}
            disabled={!enhancedImageUrl}
          >
            Enhanced
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={resetZoom}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600">{Math.round(zoomLevel * 100)}%</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMinutiae(!showMinutiae)}
            className={showMinutiae ? 'bg-blue-50 border-blue-300' : ''}
          >
            {showMinutiae ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            Minutiae
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCoresDelta(!showCoresDelta)}
            className={showCoresDelta ? 'bg-green-50 border-green-300' : ''}
          >
            {showCoresDelta ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            Core/Delta
          </Button>
          <Button variant="outline" size="sm" onClick={downloadVisualization}>
            <Download className="h-4 w-4" />
          </Button>
          <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Fingerprint Visualization - {classification}</DialogTitle>
              </DialogHeader>
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="border rounded-lg max-w-full"
                  style={{ 
                    background: `url(${currentImageUrl}) center/contain no-repeat`,
                    cursor: 'crosshair'
                  }}
                />
                <img
                  ref={imageRef}
                  src={currentImageUrl}
                  alt="Fingerprint"
                  style={{ display: 'none' }}
                  onLoad={drawVisualization}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Ridge Pattern Analysis</span>
            <div className="flex gap-2">
              <Badge variant="outline">{classification}</Badge>
              <Badge variant="secondary">{ridgeCount} ridges</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="border rounded-lg w-full"
              style={{ 
                background: `url(${currentImageUrl}) center/contain no-repeat`,
                cursor: 'crosshair'
              }}
            />
            <img
              ref={imageRef}
              src={currentImageUrl}
              alt="Fingerprint"
              style={{ display: 'none' }}
              onLoad={drawVisualization}
            />
          </div>

          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm">Ridge Endings ({minutiaePoints.filter(p => p.type === 'ending').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
              <span className="text-sm">Bifurcations ({minutiaePoints.filter(p => p.type === 'bifurcation').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rotate-45"></div>
              <span className="text-sm">Core Points ({corePoints.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500"></div>
              <span className="text-sm">Delta Points ({deltaPoints.length})</span>
            </div>
          </div>

          {/* Quality Metrics */}
          {qualityMetrics && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{qualityMetrics.overall_quality}%</div>
                <div className="text-sm text-gray-600">Overall Quality</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{qualityMetrics.ridge_clarity}%</div>
                <div className="text-sm text-gray-600">Ridge Clarity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{qualityMetrics.sharpness.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Sharpness</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RidgeVisualization; 