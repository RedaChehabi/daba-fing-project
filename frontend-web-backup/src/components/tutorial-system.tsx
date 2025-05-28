"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ChevronLeft, ChevronRight, Play, SkipForward, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS selector for the element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'hover' | 'focus' | 'none';
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: 'getting-started' | 'upload' | 'analysis' | 'dashboard' | 'advanced';
  steps: TutorialStep[];
  estimatedTime: number; // in minutes
}

const tutorials: Tutorial[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with DabaFing',
    description: 'Learn the basics of fingerprint analysis',
    category: 'getting-started',
    estimatedTime: 5,
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to DabaFing',
        content: 'DabaFing is an advanced fingerprint analysis system. This tutorial will guide you through the basic features and help you get started.',
        position: 'bottom'
      },
      {
        id: 'navigation',
        title: 'Navigation',
        content: 'Use the navigation bar to access different sections of the application. The dashboard is your main workspace.',
        target: 'nav',
        position: 'bottom'
      },
      {
        id: 'upload-intro',
        title: 'Uploading Fingerprints',
        content: 'The upload section allows you to submit fingerprint images for analysis. We support JPEG and PNG formats.',
        position: 'bottom'
      }
    ]
  },
  {
    id: 'fingerprint-upload',
    title: 'How to Upload Fingerprints',
    description: 'Step-by-step guide to uploading fingerprint images',
    category: 'upload',
    estimatedTime: 3,
    steps: [
      {
        id: 'select-file',
        title: 'Select Your Image',
        content: 'Click the upload area or drag and drop your fingerprint image. Ensure the image is clear and well-lit for best results.',
        target: '[data-tutorial="upload-area"]',
        position: 'top'
      },
      {
        id: 'fill-details',
        title: 'Fill in Details',
        content: 'Provide a descriptive title and select the correct hand and finger. This information helps with accurate classification.',
        target: '[data-tutorial="form-fields"]',
        position: 'right'
      },
      {
        id: 'submit-upload',
        title: 'Upload Your Fingerprint',
        content: 'Click the upload button to securely store your fingerprint in the system.',
        target: '[data-tutorial="upload-button"]',
        position: 'top'
      }
    ]
  },
  {
    id: 'analysis-process',
    title: 'Understanding Analysis Results',
    description: 'Learn how to interpret fingerprint analysis results',
    category: 'analysis',
    estimatedTime: 4,
    steps: [
      {
        id: 'start-analysis',
        title: 'Start Analysis',
        content: 'After uploading, click the "Analyze Fingerprint" button to begin AI-powered pattern recognition.',
        position: 'bottom'
      },
      {
        id: 'pattern-types',
        title: 'Pattern Types',
        content: 'The system identifies patterns like loops, whorls, and arches. Each pattern type has unique characteristics.',
        position: 'bottom'
      },
      {
        id: 'confidence-score',
        title: 'Confidence Score',
        content: 'The confidence score indicates how certain the AI is about its classification. Higher scores mean more reliable results.',
        position: 'bottom'
      },
      {
        id: 'minutiae-points',
        title: 'Minutiae Points',
        content: 'These are unique ridge characteristics used for identification. More minutiae points generally mean better identification accuracy.',
        position: 'bottom'
      }
    ]
  }
];

interface TutorialSystemProps {
  onClose?: () => void;
  autoStart?: boolean;
  tutorialId?: string;
}

export function TutorialSystem({ onClose, autoStart = false, tutorialId }: TutorialSystemProps) {
  const [isOpen, setIsOpen] = useState(autoStart);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tutorialId) {
      const tutorial = tutorials.find(t => t.id === tutorialId);
      if (tutorial) {
        setSelectedTutorial(tutorial);
        setIsOpen(true);
        setIsPlaying(true);
      }
    }
  }, [tutorialId]);

  useEffect(() => {
    if (isPlaying && selectedTutorial) {
      const step = selectedTutorial.steps[currentStep];
      if (step?.target) {
        const element = document.querySelector(step.target);
        if (element) {
          setHighlightedElement(element);
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        setHighlightedElement(null);
      }
    } else {
      setHighlightedElement(null);
    }
  }, [isPlaying, selectedTutorial, currentStep]);

  const handleClose = () => {
    setIsOpen(false);
    setIsPlaying(false);
    setSelectedTutorial(null);
    setCurrentStep(0);
    setHighlightedElement(null);
    onClose?.();
  };

  const handleStartTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const handleNextStep = () => {
    if (selectedTutorial && currentStep < selectedTutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipTutorial = () => {
    handleClose();
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 shadow-lg"
      >
        <BookOpen className="h-4 w-4 mr-2" />
        Tutorials
      </Button>
    );
  }

  return (
    <>
      {/* Overlay for highlighting elements */}
      {isPlaying && highlightedElement && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 pointer-events-none"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            clipPath: highlightedElement
              ? `polygon(0% 0%, 0% 100%, ${highlightedElement.getBoundingClientRect().left}px 100%, ${highlightedElement.getBoundingClientRect().left}px ${highlightedElement.getBoundingClientRect().top}px, ${highlightedElement.getBoundingClientRect().right}px ${highlightedElement.getBoundingClientRect().top}px, ${highlightedElement.getBoundingClientRect().right}px ${highlightedElement.getBoundingClientRect().bottom}px, ${highlightedElement.getBoundingClientRect().left}px ${highlightedElement.getBoundingClientRect().bottom}px, ${highlightedElement.getBoundingClientRect().left}px 100%, 100% 100%, 100% 0%)`
              : 'none'
          }}
        />
      )}

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-4 z-50 flex items-center justify-center"
        >
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-xl">
                  {selectedTutorial ? selectedTutorial.title : 'Interactive Tutorials'}
                </CardTitle>
                <CardDescription>
                  {selectedTutorial 
                    ? `Step ${currentStep + 1} of ${selectedTutorial.steps.length}`
                    : 'Choose a tutorial to get started'
                  }
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent>
              {!selectedTutorial ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground mb-6">
                    Welcome to DabaFing tutorials! Select a tutorial below to learn about different features of the system.
                  </p>
                  
                  <div className="grid gap-4">
                    {tutorials.map((tutorial) => (
                      <Card key={tutorial.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{tutorial.title}</h3>
                                <Badge variant="secondary" className="text-xs">
                                  {tutorial.estimatedTime} min
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {tutorial.description}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {tutorial.category.replace('-', ' ')}
                              </Badge>
                            </div>
                            <Button
                              onClick={() => handleStartTutorial(tutorial)}
                              size="sm"
                              className="ml-4"
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Start
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      {selectedTutorial.steps[currentStep].title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedTutorial.steps[currentStep].content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevStep}
                        disabled={currentStep === 0}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSkipTutorial}
                      >
                        <SkipForward className="h-4 w-4 mr-1" />
                        Skip Tutorial
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {currentStep + 1} / {selectedTutorial.steps.length}
                      </span>
                      <Button onClick={handleNextStep} size="sm">
                        {currentStep === selectedTutorial.steps.length - 1 ? 'Finish' : 'Next'}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default TutorialSystem; 