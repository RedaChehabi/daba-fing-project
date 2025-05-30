'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { downloadUtils } from '@/services/api';
import { Download, FileText, Table, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface ExportMenuProps {
  analysisId?: number;
  analysisIds?: number[];
  analysisTitle?: string;
  showBulkOptions?: boolean;
}

const ExportMenu: React.FC<ExportMenuProps> = ({
  analysisId,
  analysisIds = [],
  analysisTitle,
  showBulkOptions = false
}) => {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [exportType, setExportType] = useState<string>('');

  const handleExport = async (type: 'pdf' | 'csv' | 'bulk-pdf') => {
    setIsExporting(true);
    setExportStatus('idle');
    setExportType(type);

    try {
      switch (type) {
        case 'pdf':
          if (analysisId) {
            await downloadUtils.downloadAnalysisPDF(
              analysisId,
              `${analysisTitle || 'analysis'}_report.pdf`
            );
          }
          break;

        case 'csv':
          await downloadUtils.downloadUserHistoryCSV(user?.username);
          break;

        case 'bulk-pdf':
          if (analysisIds.length > 0) {
            await downloadUtils.downloadBulkAnalysisPDF(
              analysisIds,
              `bulk_analysis_${analysisIds.length}_items.pdf`
            );
          }
          break;
      }
      
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 3000);

    } catch (error) {
      console.error(`Failed to export ${type}:`, error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  const ExportStatusDialog = () => (
    <Dialog open={exportStatus !== 'idle'} onOpenChange={() => setExportStatus('idle')}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {exportStatus === 'success' ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                Export Successful
              </>
            ) : exportStatus === 'error' ? (
              <>
                <AlertCircle className="h-5 w-5 text-red-500" />
                Export Failed
              </>
            ) : null}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {exportStatus === 'success' && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Your {exportType === 'csv' ? 'CSV' : 'PDF'} file has been downloaded successfully.
              </p>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Download Complete
              </Badge>
            </div>
          )}
          
          {exportStatus === 'error' && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Failed to export your data. Please try again.
              </p>
              <Badge variant="outline" className="text-red-600 border-red-600">
                Export Error
              </Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isExporting} className="gap-2">
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          {/* Single Analysis PDF Export */}
          {analysisId && (
            <DropdownMenuItem
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Export Analysis as PDF
            </DropdownMenuItem>
          )}

          {/* Bulk Analysis PDF Export */}
          {showBulkOptions && analysisIds.length > 0 && (
            <DropdownMenuItem
              onClick={() => handleExport('bulk-pdf')}
              disabled={isExporting}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Export Selected as PDF
              <Badge variant="secondary" className="ml-auto">
                {analysisIds.length}
              </Badge>
            </DropdownMenuItem>
          )}

          {/* Separator if both single and bulk options are present */}
          {analysisId && showBulkOptions && analysisIds.length > 0 && (
            <DropdownMenuSeparator />
          )}

          {/* CSV Export */}
          <DropdownMenuItem
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="gap-2"
          >
            <Table className="h-4 w-4" />
            Export History as CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ExportStatusDialog />
    </>
  );
};

export default ExportMenu; 