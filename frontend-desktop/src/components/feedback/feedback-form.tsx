'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { feedbackService, type FeedbackSubmission } from '@/services/api';
import { MessageCircle, Star, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface FeedbackFormProps {
  analysisId: number;
  currentClassification: string;
  currentRidgeCount: number;
  confidence: number;
  onFeedbackSubmitted?: () => void;
}

interface FeedbackFormData {
  feedback_type: 'correction' | 'validation' | 'improvement';
  correction_details: string;
  corrected_ridge_count: string;
  corrected_classification: string;
  helpfulness_rating: number;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  analysisId,
  currentClassification,
  currentRidgeCount,
  confidence,
  onFeedbackSubmitted
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<FeedbackFormData>({
    feedback_type: 'validation',
    correction_details: '',
    corrected_ridge_count: '',
    corrected_classification: '',
    helpfulness_rating: 5
  });

  const isExpert = user?.role === 'Expert' || user?.role === 'Admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const submissionData: FeedbackSubmission = {
        analysis_id: analysisId,
        feedback_type: formData.feedback_type,
        correction_details: formData.correction_details,
        helpfulness_rating: formData.helpfulness_rating
      };

      // Add corrections if provided
      if (formData.corrected_ridge_count && !isNaN(parseInt(formData.corrected_ridge_count))) {
        submissionData.corrected_ridge_count = parseInt(formData.corrected_ridge_count);
      }

      if (formData.corrected_classification) {
        submissionData.corrected_classification = formData.corrected_classification;
      }

      await feedbackService.submitFeedback(submissionData);
      
      setSubmitStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        setSubmitStatus('idle');
        setFormData({
          feedback_type: 'validation',
          correction_details: '',
          corrected_ridge_count: '',
          corrected_classification: '',
          helpfulness_rating: 5
        });
        onFeedbackSubmitted?.();
      }, 2000);

    } catch (error) {
      console.error('Failed to submit feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer transition-colors ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => onRatingChange?.(star)}
          />
        ))}
      </div>
    );
  };

  if (submitStatus === 'success') {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <DialogTitle className="text-xl font-semibold text-green-700 mb-2">
              Feedback Submitted Successfully!
            </DialogTitle>
            <p className="text-sm text-gray-600">
              Thank you for your feedback. It will help improve our analysis accuracy.
            </p>
            {isExpert && (
              <Badge variant="outline" className="mt-2 text-blue-600 border-blue-600">
                Expert Feedback Recorded
              </Badge>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="gap-2"
      >
        <MessageCircle className="h-4 w-4" />
        Provide Feedback
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Analysis Feedback
              {isExpert && (
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  Expert User
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Help us improve our fingerprint analysis by providing feedback on the results.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Analysis Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Current Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-gray-500">Classification</Label>
                    <p className="font-medium">{currentClassification}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Ridge Count</Label>
                    <p className="font-medium">{currentRidgeCount}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-gray-500">Confidence Score</Label>
                    <p className="font-medium">{confidence.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Feedback Type */}
            <div className="space-y-2">
              <Label htmlFor="feedback_type">Feedback Type</Label>
              <Select
                value={formData.feedback_type}
                onValueChange={(value: 'correction' | 'validation' | 'improvement') =>
                  setFormData({ ...formData, feedback_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="validation">Validation - Results are correct</SelectItem>
                  <SelectItem value="correction">Correction - Results need adjustment</SelectItem>
                  <SelectItem value="improvement">Improvement - General suggestions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Corrections (only for correction type) */}
            {formData.feedback_type === 'correction' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm">Provide Corrections</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="corrected_classification">Correct Classification</Label>
                    <Select
                      value={formData.corrected_classification}
                      onValueChange={(value) =>
                        setFormData({ ...formData, corrected_classification: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct classification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Whorl">Whorl</SelectItem>
                        <SelectItem value="Loop">Loop</SelectItem>
                        <SelectItem value="Arch">Arch</SelectItem>
                        <SelectItem value="Tented Arch">Tented Arch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="corrected_ridge_count">Correct Ridge Count</Label>
                    <Input
                      id="corrected_ridge_count"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.corrected_ridge_count}
                      onChange={(e) =>
                        setFormData({ ...formData, corrected_ridge_count: e.target.value })
                      }
                      placeholder="e.g., 15"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Feedback Details */}
            <div className="space-y-2">
              <Label htmlFor="correction_details">
                {formData.feedback_type === 'correction' ? 'Explanation of Corrections' : 'Additional Comments'}
              </Label>
              <Textarea
                id="correction_details"
                value={formData.correction_details}
                onChange={(e) =>
                  setFormData({ ...formData, correction_details: e.target.value })
                }
                placeholder={
                  formData.feedback_type === 'correction'
                    ? "Please explain why you believe the analysis needs correction..."
                    : "Any additional feedback or suggestions..."
                }
                rows={4}
              />
            </div>

            {/* Helpfulness Rating */}
            <div className="space-y-2">
              <Label>How helpful was this analysis? (1-5 stars)</Label>
              <div className="flex items-center gap-2">
                {renderStars(formData.helpfulness_rating, (rating) =>
                  setFormData({ ...formData, helpfulness_rating: rating })
                )}
                <span className="text-sm text-gray-500 ml-2">
                  {formData.helpfulness_rating}/5
                </span>
              </div>
            </div>

            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-sm text-red-700">
                  Failed to submit feedback. Please try again.
                </p>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Submit Feedback
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeedbackForm; 