import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  FileText,
  Code,
  Terminal,
  Book,
  Fingerprint,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  BarChart,
} from "lucide-react"

export default function DocumentationPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Hero Section */}
        <div className="space-y-6 text-center animate-slide-up">
          <Badge className="mx-auto bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300">
            Documentation
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            DabaFing <span className="gradient-text">Documentation</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Comprehensive guides and resources to help you get the most out of DabaFing's fingerprint analysis
            capabilities.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input type="search" placeholder="Search documentation..." className="pl-10 h-12 w-full" />
          </div>
        </div>

        {/* Documentation Categories */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 stagger-animation">
          <Link href="#getting-started">
            <Card className="hover-card-effect animate-scale-in h-full">
              <CardContent className="flex flex-col justify-center space-y-4 p-6 h-full">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Book className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Getting Started</h3>
                  <p className="text-muted-foreground">
                    Learn the basics of DabaFing and how to set up your first fingerprint analysis project.
                  </p>
                  <div className="flex items-center text-primary pt-2 text-sm font-medium">
                    <span>Read guide</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="#user-guides">
            <Card className="hover-card-effect animate-scale-in h-full">
              <CardContent className="flex flex-col justify-center space-y-4 p-6 h-full">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FileText className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">User Guides</h3>
                  <p className="text-muted-foreground">
                    Detailed guides on using DabaFing's features for fingerprint classification and ridge counting.
                  </p>
                  <div className="flex items-center text-primary pt-2 text-sm font-medium">
                    <span>Read guides</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="#api-reference">
            <Card className="hover-card-effect animate-scale-in h-full">
              <CardContent className="flex flex-col justify-center space-y-4 p-6 h-full">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Code className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">API Reference</h3>
                  <p className="text-muted-foreground">
                    Comprehensive API documentation for integrating DabaFing into your applications.
                  </p>
                  <div className="flex items-center text-primary pt-2 text-sm font-medium">
                    <span>View reference</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Getting Started Section */}
        <div id="getting-started" className="scroll-mt-24 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Getting Started</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know to get started with DabaFing's fingerprint analysis tools.
            </p>
          </div>

          <Tabs defaultValue="web" className="space-y-4">
            <TabsList>
              <TabsTrigger value="web">Web Application</TabsTrigger>
              <TabsTrigger value="desktop">Desktop Application</TabsTrigger>
              <TabsTrigger value="mobile">Mobile Application</TabsTrigger>
            </TabsList>
            <TabsContent value="web" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Web Application Setup</h3>
                <ol className="space-y-4 list-decimal list-inside">
                  <li className="pl-2">
                    <span className="font-medium">Create an account</span>
                    <p className="mt-1 text-muted-foreground pl-6">
                      Visit{" "}
                      <Link href="/auth/register" className="text-primary underline">
                        register page
                      </Link>{" "}
                      and create a new account using your email address.
                    </p>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Verify your email</span>
                    <p className="mt-1 text-muted-foreground pl-6">
                      Check your inbox for a verification email and click the link to verify your account.
                    </p>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Log in to your account</span>
                    <p className="mt-1 text-muted-foreground pl-6">
                      Once verified, log in to access the DabaFing dashboard.
                    </p>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Upload your first fingerprint</span>
                    <p className="mt-1 text-muted-foreground pl-6">
                      Navigate to the Upload section and upload your first fingerprint image for analysis.
                    </p>
                  </li>
                </ol>
                <div className="pt-4">
                  <Button className="gap-2">
                    View Web Application Guide
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="desktop" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Desktop Application Setup</h3>
                <ol className="space-y-4 list-decimal list-inside">
                  <li className="pl-2">
                    <span className="font-medium">Download the application</span>
                    <p className="mt-1 text-muted-foreground pl-6">
                      Visit the{" "}
                      <Link href="/download" className="text-primary underline">
                        download page
                      </Link>{" "}
                      and select the version for your operating system (Windows, macOS, or Linux).
                    </p>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Install the application</span>
                    <p className="mt-1 text-muted-foreground pl-6">
                      Run the installer and follow the on-screen instructions to complete the installation.
                    </p>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Launch DabaFing</span>
                    <p className="mt-1 text-muted-foreground pl-6">
                      Open the installed application and log in with your account credentials.
                    </p>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Set up preferences</span>
                    <p className="mt-1 text-muted-foreground pl-6">
                      Configure your preferences for analysis and storage in the Settings menu.
                    </p>
                  </li>
                </ol>
                <div className="pt-4">
                  <Button className="gap-2">
                    View Desktop Application Guide
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="mobile" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Mobile Application Setup</h3>
                <ol className="space-y-4 list-decimal list-inside">
                  <li className="pl-2">
                    <span className="font-medium">Download from app store</span>
                    <p className="mt-1 text-muted-foreground pl-6">
                      Download DabaFing from the App Store (iOS) or Google Play Store (Android).
                    </p>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Install the application</span>
                    <p className="mt-1 text-muted-foreground pl-6">
                      Follow your device's standard installation process.
                    </p>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Launch and log in</span>
                    <p className="mt-1 text-muted-foreground pl-6">
                      Open the app and log in with your DabaFing account.
                    </p>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Grant permissions</span>
                    <p className="mt-1 text-muted-foreground pl-6">
                      Allow camera and storage permissions for full functionality.
                    </p>
                  </li>
                </ol>
                <div className="pt-4">
                  <Button className="gap-2">
                    View Mobile Application Guide
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* User Guides Section */}
        <div id="user-guides" className="scroll-mt-24 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">User Guides</h2>
            <p className="text-muted-foreground text-lg">
              Detailed guides on using DabaFing's features for fingerprint analysis.
            </p>
          </div>

          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Uploading Fingerprints</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p>
                      Learn how to upload fingerprint images for analysis, including supported formats and best
                      practices for image quality.
                    </p>
                    <h4 className="font-medium">Supported Formats</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>JPEG/JPG</li>
                      <li>PNG</li>
                      <li>BMP</li>
                      <li>TIFF/TIF</li>
                      <li>WebP</li>
                    </ul>
                    <h4 className="font-medium mt-4">Best Practices</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>Use high-resolution images (at least 500 DPI)</li>
                      <li>Ensure good lighting conditions</li>
                      <li>Center the fingerprint in the frame</li>
                      <li>Avoid blurry or smudged images</li>
                    </ul>
                    <Button variant="outline" className="mt-4 gap-2">
                      Read Full Guide
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Fingerprint Classification</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p>
                      Understand how DabaFing classifies fingerprints into different pattern types and how to interpret
                      the results.
                    </p>
                    <h4 className="font-medium">Pattern Types</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>Loops (Ulnar and Radial)</li>
                      <li>Whorls (Plain, Central Pocket, Double Loop, Accidental)</li>
                      <li>Arches (Plain and Tented)</li>
                    </ul>
                    <h4 className="font-medium mt-4">Classification Process</h4>
                    <p>
                      DabaFing uses a machine learning model trained on thousands of fingerprint images to identify the
                      pattern type. The classification process involves:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 pl-4">
                      <li>Image preprocessing and enhancement</li>
                      <li>Feature extraction</li>
                      <li>Pattern recognition</li>
                      <li>Confidence scoring</li>
                    </ol>
                    <Button variant="outline" className="mt-4 gap-2">
                      Read Full Guide
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Ridge Counting</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p>
                      Learn how to use DabaFing's ridge counting feature to count ridges between core and delta points.
                    </p>
                    <h4 className="font-medium">Ridge Counting Process</h4>
                    <ol className="list-decimal list-inside space-y-1 pl-4">
                      <li>Automatic detection of core and delta points</li>
                      <li>Tracing the shortest path between points</li>
                      <li>Counting ridges that intersect the path</li>
                      <li>Manual adjustment of points and path if needed</li>
                    </ol>
                    <h4 className="font-medium mt-4">Manual Adjustments</h4>
                    <p>
                      For expert users, DabaFing allows manual adjustment of core and delta points, as well as the path
                      used for ridge counting. This ensures maximum accuracy in cases where automatic detection may not
                      be optimal.
                    </p>
                    <Button variant="outline" className="mt-4 gap-2">
                      Read Full Guide
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Exporting Results</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p>Discover how to export and share your fingerprint analysis results in various formats.</p>
                    <h4 className="font-medium">Export Formats</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>PDF Reports</li>
                      <li>CSV Data</li>
                      <li>JSON Data</li>
                      <li>Image Files (PNG, JPEG)</li>
                    </ul>
                    <h4 className="font-medium mt-4">Sharing Options</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>Email sharing</li>
                      <li>Direct link sharing</li>
                      <li>Team collaboration</li>
                      <li>API integration</li>
                    </ul>
                    <Button variant="outline" className="mt-4 gap-2">
                      Read Full Guide
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Providing Feedback</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p>
                      Learn how to provide feedback on analysis results to help improve the system's accuracy over time.
                    </p>
                    <h4 className="font-medium">Feedback Types</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>Classification correction</li>
                      <li>Ridge count adjustment</li>
                      <li>Core and delta point repositioning</li>
                      <li>Image quality feedback</li>
                    </ul>
                    <h4 className="font-medium mt-4">How Feedback Improves the System</h4>
                    <p>
                      DabaFing uses a reinforcement learning approach that incorporates user feedback to continuously
                      improve the accuracy of the system. Your feedback helps train the model to better recognize
                      patterns and features in fingerprints.
                    </p>
                    <Button variant="outline" className="mt-4 gap-2">
                      Read Full Guide
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* API Reference Section */}
        <div id="api-reference" className="scroll-mt-24 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">API Reference</h2>
            <p className="text-muted-foreground text-lg">
              Comprehensive API documentation for integrating DabaFing into your applications.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 stagger-animation">
            <Link href="/api">
              <Card className="hover-card-effect animate-scale-in h-full">
                <CardContent className="flex flex-col justify-center space-y-4 p-6 h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Fingerprint className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">Classification API</h3>
                    <p className="text-muted-foreground">
                      API endpoints for fingerprint classification and pattern recognition.
                    </p>
                    <div className="flex items-center text-primary pt-2 text-sm font-medium">
                      <span>View documentation</span>
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/api">
              <Card className="hover-card-effect animate-scale-in h-full">
                <CardContent className="flex flex-col justify-center space-y-4 p-6 h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <BarChart className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">Ridge Counting API</h3>
                    <p className="text-muted-foreground">API endpoints for ridge counting and feature extraction.</p>
                    <div className="flex items-center text-primary pt-2 text-sm font-medium">
                      <span>View documentation</span>
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/api">
              <Card className="hover-card-effect animate-scale-in h-full">
                <CardContent className="flex flex-col justify-center space-y-4 p-6 h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Terminal className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">SDK Documentation</h3>
                    <p className="text-muted-foreground">
                      Software Development Kits for various programming languages.
                    </p>
                    <div className="flex items-center text-primary pt-2 text-sm font-medium">
                      <span>View documentation</span>
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="pt-4 text-center">
            <Link href="/api">
              <Button size="lg" className="gap-2">
                View Full API Documentation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-blue-600/10 p-8 animate-gradient">
          <div className="flex flex-col items-center text-center space-y-6">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40 transition-all duration-300">
              Need Help?
            </Badge>
            <h2 className="text-2xl font-bold">Can't Find What You're Looking For?</h2>
            <p className="text-muted-foreground max-w-xl">
              Our support team is ready to help you with any questions or issues you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2 button-hover-effect">
                  Contact Support
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/help">
                <Button variant="outline" size="lg" className="gap-2">
                  Visit Help Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

