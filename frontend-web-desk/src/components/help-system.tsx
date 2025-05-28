"use client"

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  FileText, 
  Settings, 
  Upload, 
  BarChart3,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: 'getting-started' | 'upload' | 'analysis' | 'troubleshooting' | 'security' | 'advanced';
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  popular: boolean;
}

const helpArticles: HelpArticle[] = [
  {
    id: 'fingerprint-quality',
    title: 'How to Capture High-Quality Fingerprints',
    content: `For best analysis results, follow these guidelines:

**Lighting**: Ensure good, even lighting without harsh shadows
**Cleanliness**: Clean the finger and scanner surface before capture
**Pressure**: Apply moderate, even pressure - not too light or heavy
**Position**: Center the finger on the scanner with proper alignment
**Multiple Attempts**: Take several captures and choose the clearest one

**Common Issues to Avoid:**
- Wet or overly dry fingers
- Cuts, scars, or bandages on the fingertip
- Motion blur from moving during capture
- Partial fingerprint captures`,
    category: 'getting-started',
    tags: ['quality', 'capture', 'best-practices'],
    difficulty: 'beginner'
  },
  {
    id: 'pattern-types',
    title: 'Understanding Fingerprint Pattern Types',
    content: `DabaFing identifies three main fingerprint pattern types:

**Loop Patterns (60-65% of population)**
- Ridges enter from one side, curve around, and exit the same side
- Subtypes: Ulnar loops (toward pinky) and Radial loops (toward thumb)

**Whorl Patterns (30-35% of population)**
- Circular or spiral ridge patterns
- Subtypes: Plain whorls, Central pocket loops, Double loops, Accidental whorls

**Arch Patterns (5% of population)**
- Ridges enter from one side and exit the other in a wave-like pattern
- Subtypes: Plain arches and Tented arches

Each pattern type has unique characteristics that help with identification and classification.`,
    category: 'analysis',
    tags: ['patterns', 'classification', 'identification'],
    difficulty: 'intermediate'
  },
  {
    id: 'security-privacy',
    title: 'Data Security and Privacy',
    content: `DabaFing takes your privacy and data security seriously:

**Data Encryption**
- All fingerprint data is encrypted at rest and in transit
- Industry-standard AES-256 encryption protocols
- Secure key management systems

**Access Controls**
- Role-based access control (RBAC)
- Multi-factor authentication available
- Audit logs for all data access

**Data Retention**
- Configurable retention policies
- Secure deletion procedures
- Compliance with privacy regulations

**Privacy Rights**
- Right to data portability
- Right to deletion
- Transparent data usage policies

Your biometric data is never shared with third parties without explicit consent.`,
    category: 'security',
    tags: ['privacy', 'encryption', 'compliance'],
    difficulty: 'intermediate'
  }
];

const faqs: FAQ[] = [
  {
    id: 'supported-formats',
    question: 'What image formats are supported for fingerprint upload?',
    answer: 'DabaFing supports JPEG, PNG, BMP, TIFF, and WebP formats. For best results, use high-resolution images (at least 500 DPI) with minimal compression.',
    category: 'upload',
    popular: true
  },
  {
    id: 'analysis-time',
    question: 'How long does fingerprint analysis take?',
    answer: 'Analysis typically takes 10-30 seconds depending on image quality and system load. Complex patterns or lower quality images may take longer to process.',
    category: 'analysis',
    popular: true
  },
  {
    id: 'accuracy-rate',
    question: 'How accurate is the fingerprint analysis?',
    answer: 'Our AI system achieves 95-98% accuracy on high-quality fingerprints. Accuracy depends on image quality, pattern clarity, and the presence of scars or distortions.',
    category: 'analysis',
    popular: true
  },
  {
    id: 'file-size-limit',
    question: 'What is the maximum file size for uploads?',
    answer: 'The maximum file size is 10MB per image. If your file is larger, try compressing it or reducing the resolution while maintaining clarity.',
    category: 'upload',
    popular: false
  },
  {
    id: 'multiple-fingers',
    question: 'Can I upload multiple fingerprints at once?',
    answer: 'Currently, you need to upload fingerprints one at a time. Each upload allows you to specify which hand and finger the print belongs to for proper classification.',
    category: 'upload',
    popular: false
  },
  {
    id: 'export-results',
    question: 'Can I export analysis results?',
    answer: 'Yes, you can export analysis results in PDF or JSON format from the results page. This includes pattern classification, confidence scores, and minutiae data.',
    category: 'analysis',
    popular: false
  }
];

interface HelpSystemProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export function HelpSystem({ isOpen, onClose, initialTab = 'faq' }: HelpSystemProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFAQs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const filteredArticles = useMemo(() => {
    return helpArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const popularFAQs = faqs.filter(faq => faq.popular);

  const categories = [
    { id: 'all', label: 'All', icon: BookOpen },
    { id: 'getting-started', label: 'Getting Started', icon: Zap },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertTriangle }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-background rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Help Center</h2>
                <p className="text-sm text-muted-foreground">Find answers and learn about DabaFing</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search help articles and FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {category.label}
                  </Button>
                );
              })}
            </div>

            <Tabs defaultValue={initialTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="faq" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  FAQ
                </TabsTrigger>
                <TabsTrigger value="guides" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Guides
                </TabsTrigger>
                <TabsTrigger value="quick-help" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Quick Help
                </TabsTrigger>
              </TabsList>

              <TabsContent value="faq" className="space-y-4">
                {searchQuery === '' && selectedCategory === 'all' && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Popular Questions
                    </h3>
                    <Accordion type="single" collapsible className="space-y-2">
                      {popularFAQs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                          <AccordionTrigger className="text-left hover:no-underline">
                            <div className="flex items-center gap-2">
                              <span>{faq.question}</span>
                              <Badge variant="secondary" className="text-xs">Popular</Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {searchQuery ? `Search Results (${filteredFAQs.length})` : 'All Questions'}
                  </h3>
                  {filteredFAQs.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No FAQs found matching your search.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Accordion type="single" collapsible className="space-y-2">
                      {filteredFAQs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                          <AccordionTrigger className="text-left hover:no-underline">
                            <div className="flex items-center gap-2">
                              <span>{faq.question}</span>
                              <Badge variant="outline" className="text-xs">
                                {faq.category}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="guides" className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">
                  {searchQuery ? `Search Results (${filteredArticles.length})` : 'Help Articles'}
                </h3>
                {filteredArticles.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No articles found matching your search.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredArticles.map((article) => (
                      <Card key={article.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{article.title}</CardTitle>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {article.category.replace('-', ' ')}
                                </Badge>
                                <Badge 
                                  variant={article.difficulty === 'beginner' ? 'default' : 
                                          article.difficulty === 'intermediate' ? 'secondary' : 'destructive'}
                                  className="text-xs"
                                >
                                  {article.difficulty}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-sm max-w-none text-muted-foreground">
                            {article.content.split('\n').map((paragraph, index) => (
                              <p key={index} className="mb-2 last:mb-0">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-4">
                            {article.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="quick-help" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Quick Upload Guide
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>1. Click the upload area or drag &amp; drop your image</p>
                      <p>2. Fill in the title and select hand/finger</p>
                      <p>3. Click &quot;Upload Fingerprint&quot;</p>
                      <p>4. Wait for upload confirmation</p>
                      <p>5. Click &quot;Analyze Fingerprint&quot; to start analysis</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Understanding Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><strong>Pattern Type:</strong> Loop, Whorl, or Arch classification</p>
                      <p><strong>Confidence:</strong> AI certainty level (0-100%)</p>
                      <p><strong>Quality Score:</strong> Image clarity assessment</p>
                      <p><strong>Minutiae Points:</strong> Unique ridge characteristics</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Common Issues
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><strong>Blurry images:</strong> Ensure steady capture</p>
                      <p><strong>Low confidence:</strong> Try better lighting</p>
                      <p><strong>Upload fails:</strong> Check file size & format</p>
                      <p><strong>Slow analysis:</strong> Wait for system processing</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Best Practices
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>• Use high-resolution images (500+ DPI)</p>
                      <p>• Ensure good lighting and clean surfaces</p>
                      <p>• Center the fingerprint in the frame</p>
                      <p>• Avoid motion blur during capture</p>
                      <p>• Take multiple shots and choose the best</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default HelpSystem; 