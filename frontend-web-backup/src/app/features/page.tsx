import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Fingerprint,
  BarChart,
  Zap,
  Shield,
  Users,
  Globe,
  ArrowRight,
  CheckCircle2,
  Laptop,
  Smartphone,
  Database,
  FileText,
  Share2,
  Lock,
  Code,
  Layers,
} from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-5xl space-y-16">
        {/* Hero Section */}
        <div className="space-y-6 text-center animate-slide-up">
          <Badge className="mx-auto bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300">
            Features
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Powerful <span className="gradient-text">Fingerprint Analysis</span> Tools
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Discover the comprehensive suite of features that make DabaFing the leading solution for fingerprint
            classification and ridge counting.
          </p>
        </div>

        {/* Feature Categories Tabs */}
        <Tabs defaultValue="classification" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="classification">Classification</TabsTrigger>
              <TabsTrigger value="ridge-counting">Ridge Counting</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="classification" className="space-y-8">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6 animate-slide-up">
                <h2 className="text-3xl font-bold">Advanced Fingerprint Classification</h2>
                <p className="text-muted-foreground text-lg">
                  Our state-of-the-art machine learning algorithms provide highly accurate fingerprint classification
                  with continuous improvement through user feedback.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold">93%+ Accuracy</h3>
                      <p className="text-muted-foreground">
                        Industry-leading classification accuracy that improves over time
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold">Multiple Pattern Types</h3>
                      <p className="text-muted-foreground">
                        Accurately identifies loops, whorls, arches, and tented arches
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold">Interactive Learning</h3>
                      <p className="text-muted-foreground">
                        System learns from expert feedback to continuously improve accuracy
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="gap-2 button-hover-effect">
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-blue-600 opacity-30 blur-xl animate-pulse-slow"></div>
                <div className="relative rounded-2xl overflow-hidden animate-float">
                  <Image
                    src="/placeholder.svg?height=400&width=500"
                    width={500}
                    height={400}
                    alt="Fingerprint Classification"
                    className="rounded-2xl object-cover shadow-xl"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ridge-counting" className="space-y-8">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-blue-600 opacity-30 blur-xl animate-pulse-slow"></div>
                <div className="relative rounded-2xl overflow-hidden animate-float">
                  <Image
                    src="/placeholder.svg?height=400&width=500"
                    width={500}
                    height={400}
                    alt="Ridge Counting"
                    className="rounded-2xl object-cover shadow-xl"
                  />
                </div>
              </div>
              <div className="space-y-6 animate-slide-up order-1 lg:order-2">
                <h2 className="text-3xl font-bold">Precise Ridge Counting</h2>
                <p className="text-muted-foreground text-lg">
                  Our advanced algorithms accurately count ridges between core and delta points, providing essential
                  data for fingerprint analysis.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold">Automated Detection</h3>
                      <p className="text-muted-foreground">
                        Automatically identifies core and delta points for accurate counting
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold">Visual Overlays</h3>
                      <p className="text-muted-foreground">
                        Clear visual representation of ridge paths and count points
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold">Manual Adjustment</h3>
                      <p className="text-muted-foreground">
                        Expert users can fine-tune ridge counts for maximum accuracy
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="gap-2 button-hover-effect">
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-3 stagger-animation">
              <Card className="hover-card-effect">
                <CardContent className="flex flex-col justify-center space-y-4 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Laptop className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Desktop Application</h3>
                    <p className="text-muted-foreground">
                      Powerful desktop software for Windows, macOS, and Linux with offline capabilities and advanced
                      features.
                    </p>
                    <ul className="space-y-2 pt-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                        <span>Offline processing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                        <span>Batch processing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                        <span>Advanced visualization</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-card-effect">
                <CardContent className="flex flex-col justify-center space-y-4 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Globe className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Web Application</h3>
                    <p className="text-muted-foreground">
                      Access DabaFing from any browser with no installation required, perfect for collaborative work.
                    </p>
                    <ul className="space-y-2 pt-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                        <span>No installation needed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                        <span>Cross-platform compatibility</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                        <span>Cloud storage integration</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-card-effect">
                <CardContent className="flex flex-col justify-center space-y-4 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Smartphone className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Mobile Application</h3>
                    <p className="text-muted-foreground">
                      Capture and analyze fingerprints on the go with our iOS and Android applications.
                    </p>
                    <ul className="space-y-2 pt-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                        <span>Camera integration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                        <span>Field-ready interface</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                        <span>Sync across devices</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-8">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6 animate-slide-up">
                <h2 className="text-3xl font-bold">Enterprise-Grade Security</h2>
                <p className="text-muted-foreground text-lg">
                  We prioritize the security and privacy of your fingerprint data with robust encryption and compliance
                  with data protection regulations.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold">End-to-End Encryption</h3>
                      <p className="text-muted-foreground">All data is encrypted during transmission and storage</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold">Compliance</h3>
                      <p className="text-muted-foreground">GDPR, CCPA, and other data protection regulations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold">Role-Based Access</h3>
                      <p className="text-muted-foreground">Granular control over who can access and modify data</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="gap-2 button-hover-effect">
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-blue-600 opacity-30 blur-xl animate-pulse-slow"></div>
                <div className="relative rounded-2xl overflow-hidden animate-float">
                  <Image
                    src="/placeholder.svg?height=400&width=500"
                    width={500}
                    height={400}
                    alt="Security Features"
                    className="rounded-2xl object-cover shadow-xl"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* All Features Grid */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">All Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the comprehensive set of features that make DabaFing the leading solution for fingerprint
              analysis.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-animation">
            <div className="flex flex-col space-y-3 p-6 border rounded-lg hover-card-effect animate-scale-in">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Fingerprint className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Multi-Pattern Classification</h3>
              <p className="text-muted-foreground">
                Accurately classify fingerprints into loops, whorls, arches, and tented arches with high precision.
              </p>
            </div>

            <div className="flex flex-col space-y-3 p-6 border rounded-lg hover-card-effect animate-scale-in">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BarChart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Ridge Counting</h3>
              <p className="text-muted-foreground">
                Precise ridge counting between core and delta points with visual overlays and manual adjustment options.
              </p>
            </div>

            <div className="flex flex-col space-y-3 p-6 border rounded-lg hover-card-effect animate-scale-in">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Image Enhancement</h3>
              <p className="text-muted-foreground">
                Automatic preprocessing to enhance image quality for better analysis results, even with low-quality
                inputs.
              </p>
            </div>

            <div className="flex flex-col space-y-3 p-6 border rounded-lg hover-card-effect animate-scale-in">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Partial Fingerprint Merging</h3>
              <p className="text-muted-foreground">
                Combine multiple partial fingerprints to create a complete image for more accurate analysis.
              </p>
            </div>

            <div className="flex flex-col space-y-3 p-6 border rounded-lg hover-card-effect animate-scale-in">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Secure Storage</h3>
              <p className="text-muted-foreground">
                Encrypted storage of fingerprint data with role-based access control and compliance with regulations.
              </p>
            </div>

            <div className="flex flex-col space-y-3 p-6 border rounded-lg hover-card-effect animate-scale-in">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Comprehensive Reporting</h3>
              <p className="text-muted-foreground">
                Generate detailed reports with analysis results, visualizations, and statistical data.
              </p>
            </div>

            <div className="flex flex-col space-y-3 p-6 border rounded-lg hover-card-effect animate-scale-in">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Collaboration Tools</h3>
              <p className="text-muted-foreground">
                Share analyses with team members, add comments, and collaborate on fingerprint identification.
              </p>
            </div>

            <div className="flex flex-col space-y-3 p-6 border rounded-lg hover-card-effect animate-scale-in">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">API Integration</h3>
              <p className="text-muted-foreground">
                Integrate DabaFing's powerful analysis capabilities into your own applications with our comprehensive
                API.
              </p>
            </div>

            <div className="flex flex-col space-y-3 p-6 border rounded-lg hover-card-effect animate-scale-in">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">User Feedback System</h3>
              <p className="text-muted-foreground">
                Integrated mechanism for users to provide feedback and improve the model's accuracy over time.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-blue-600/10 p-8 animate-gradient">
          <div className="flex flex-col items-center text-center space-y-6">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40 transition-all duration-300">
              Get Started Today
            </Badge>
            <h2 className="text-2xl font-bold">Ready to Experience DabaFing?</h2>
            <p className="text-muted-foreground max-w-xl">
              Start using our powerful fingerprint analysis tools today and see the difference for yourself.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="gap-2 button-hover-effect">
                  Create an Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/download">
                <Button variant="outline" size="lg" className="gap-2">
                  Download App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

