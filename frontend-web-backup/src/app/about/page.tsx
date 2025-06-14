import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Fingerprint, Shield, Zap, Users, CheckCircle, ArrowRight, Globe, Award, Lightbulb } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-5xl space-y-16">
        {/* Hero Section */}
        <div className="space-y-6 text-center animate-slide-up">
          <Badge className="mx-auto bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300">
            About DabaFing
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            <span className="gradient-text">Revolutionizing</span> Fingerprint Analysis
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            A cutting-edge solution for fingerprint classification and ridge counting using Interactive Reinforcement
            Learning.
          </p>
        </div>

        {/* Main Image */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-blue-600 opacity-30 blur-xl animate-pulse-slow"></div>
            <div className="relative rounded-2xl overflow-hidden animate-float">
              <Image
                src="/fing_tech.jpg?height=400&width=800"
                width={800}
                height={400}
                alt="DabaFing Technology"
                className="rounded-2xl object-cover shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300">
              Our Mission
            </Badge>
            <h2 className="text-3xl font-bold">Transforming Fingerprint Analysis</h2>
            <p className="text-muted-foreground text-lg">
              DabaFing aims to revolutionize fingerprint analysis by leveraging Interactive Reinforcement Learning (IRL)
              and Learning from Human Feedback (LHF) to provide accurate, adaptable, and user-centric solutions for
              fingerprint classification and ridge counting.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 stagger-animation">
            <Card className="hover-card-effect animate-scale-in">
              <CardContent className="flex flex-col items-center text-center space-y-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Lightbulb className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold">Innovation</h3>
                <p className="text-muted-foreground">
                  Pioneering new approaches to fingerprint analysis through machine learning and AI
                </p>
              </CardContent>
            </Card>

            <Card className="hover-card-effect animate-scale-in">
              <CardContent className="flex flex-col items-center text-center space-y-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Award className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold">Excellence</h3>
                <p className="text-muted-foreground">
                  Committed to delivering the highest quality analysis with continuous improvement
                </p>
              </CardContent>
            </Card>

            <Card className="hover-card-effect animate-scale-in">
              <CardContent className="flex flex-col items-center text-center space-y-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Globe className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold">Accessibility</h3>
                <p className="text-muted-foreground">
                  Making advanced fingerprint analysis technology available across all platforms
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Technology Section */}
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-blue-600 opacity-30 blur-xl animate-pulse-slow"></div>
            <div className="relative rounded-2xl overflow-hidden animate-float">
              <Image
                src="/ml.avif?height=400&width=500"
                width={500}
                height={400}
                alt="DabaFing Technology"
                className="rounded-2xl object-cover shadow-xl"
              />
            </div>
          </div>

          <div className="space-y-6 order-1 lg:order-2 animate-slide-up">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300">
              Technology
            </Badge>
            <h2 className="text-3xl font-bold">Advanced Machine Learning</h2>
            <p className="text-muted-foreground text-lg">
              Our application uses advanced machine learning techniques to analyze fingerprint images with high
              accuracy. The system continuously improves through user feedback, making it more precise and reliable over
              time.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold">Interactive Reinforcement Learning</h3>
                  <p className="text-muted-foreground">Model learns and adapts based on user interactions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold">Computer Vision</h3>
                  <p className="text-muted-foreground">Advanced image processing for detailed ridge detection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold">Neural Networks</h3>
                  <p className="text-muted-foreground">Deep learning models trained on diverse fingerprint datasets</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cross-Platform Section */}
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6 animate-slide-up">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300">
              Cross-Platform Solution
            </Badge>
            <h2 className="text-3xl font-bold">Available Everywhere You Need It</h2>
            <p className="text-muted-foreground text-lg">
              DabaFing is available as a web application, desktop software, and mobile app, providing a seamless
              experience across all platforms. Whether you're in the field or at your desk, DabaFing delivers
              consistent, high-quality fingerprint analysis.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold">Web Application</h3>
                  <p className="text-muted-foreground">Access from any browser with no installation required</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold">Desktop Software</h3>
                  <p className="text-muted-foreground">Windows, macOS, and Linux with offline capabilities</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold">Mobile Applications</h3>
                  <p className="text-muted-foreground">iOS and Android apps for on-the-go analysis</p>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <Link href="/download">
                <Button className="gap-2 button-hover-effect">
                  Download Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-blue-600 opacity-30 blur-xl animate-pulse-slow"></div>
            <div className="relative rounded-2xl overflow-hidden animate-float">
              <Image
                src="/availbility.jpg?height=400&width=500"
                width={500}
                height={400}
                alt="Cross-Platform Solution"
                className="rounded-2xl object-cover shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-4 text-center">
            <Badge className="mx-auto bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300">
              Key Features
            </Badge>
            <h2 className="text-3xl font-bold">Comprehensive Fingerprint Analysis</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground text-lg">
              DabaFing offers a complete suite of tools for fingerprint analysis and management
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-animation">
            <Card className="hover-card-effect animate-scale-in">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Fingerprint className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Multi-Source Upload</h3>
                <p className="text-muted-foreground">
                  Upload fingerprint images from various sources including scanners, cameras, and files
                </p>
              </CardContent>
            </Card>

            <Card className="hover-card-effect animate-scale-in">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Automatic Preprocessing</h3>
                <p className="text-muted-foreground">
                  Intelligent image enhancement and normalization for optimal analysis results
                </p>
              </CardContent>
            </Card>

            <Card className="hover-card-effect animate-scale-in">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Partial Fingerprint Merging</h3>
                <p className="text-muted-foreground">
                  Combine multiple partial fingerprints to create a complete image for analysis
                </p>
              </CardContent>
            </Card>

            <Card className="hover-card-effect animate-scale-in">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">93%+ Accuracy</h3>
                <p className="text-muted-foreground">
                  High-precision classification and ridge counting with continuous improvement
                </p>
              </CardContent>
            </Card>

            <Card className="hover-card-effect animate-scale-in">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">User Feedback System</h3>
                <p className="text-muted-foreground">
                  Integrated mechanism for users to provide feedback and improve the model
                </p>
              </CardContent>
            </Card>

            <Card className="hover-card-effect animate-scale-in">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Multi-Format Export</h3>
                <p className="text-muted-foreground">
                  Export analysis results in various formats for integration with other systems
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security & Privacy Section */}
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300">
              Security & Privacy
            </Badge>
            <h2 className="text-3xl font-bold">Your Data, Protected</h2>
            <p className="text-muted-foreground text-lg">
              We prioritize the security and privacy of your data. DabaFing implements robust encryption and complies
              with data protection regulations to ensure your fingerprint data remains secure.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 stagger-animation">
            <Card className="hover-card-effect animate-scale-in">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">End-to-End Encryption</h3>
                <p className="text-muted-foreground">
                  All data is encrypted during transmission and storage to prevent unauthorized access
                </p>
              </CardContent>
            </Card>

            <Card className="hover-card-effect animate-scale-in">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Compliance</h3>
                <p className="text-muted-foreground">
                  Adherence to GDPR, CCPA, and other data protection regulations worldwide
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-blue-600/10 p-8 animate-gradient">
          <div className="flex flex-col items-center text-center space-y-6">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40 transition-all duration-300">
              Get In Touch
            </Badge>
            <h2 className="text-2xl font-bold">Want to Learn More?</h2>
            <p className="text-muted-foreground">
              Contact our team for more information about DabaFing and how it can benefit your organization.
            </p>
            <Link href="/contact">
              <Button size="lg" className="gap-2 button-hover-effect">
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="border-t pt-8">
          <p className="text-sm text-muted-foreground">
            ©Copyright DabaFing 2025 • mail@email.com • +2126XXXXXXXX
          </p>
        </div>
      </div>
    </div>
  )
}

