import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Fingerprint, Download, BarChart, Users, ArrowRight, Shield, Zap, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 hero-gradient overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="absolute top-0 right-0 -z-10 opacity-70 dark:opacity-40">
            <div className="w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-float"></div>
          </div>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-6 animate-slide-up">
              <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300">
                Innovative Fingerprint Technology
              </Badge>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  <span className="gradient-text">Fingerprint Classification</span> & Ridge Counting
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  DabaFing uses Interactive Reinforcement Learning to provide accurate fingerprint analysis across
                  desktop, web, and mobile platforms.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link href="/auth/login">
                  <Button size="lg" className="gap-2 button-hover-effect">
                    <Fingerprint className="h-5 w-5" />
                    Get Started
                  </Button>
                </Link>
                <Link href="/download">
                  <Button size="lg" variant="outline" className="gap-2 button-hover-effect">
                    <Download className="h-5 w-5" />
                    Download App
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-blue-600 opacity-30 blur-xl animate-pulse-slow"></div>
                <div className="relative rounded-2xl overflow-hidden animate-float">
                  <Image
                    src="/fing_home.jpg?height=400&width=400"
                    width={400}
                    height={400}
                    alt="Fingerprint Analysis"
                    className="rounded-2xl object-cover shadow-xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 animate-fade-in">
            <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300">
              Key Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Powerful Fingerprint Analysis
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              DabaFing provides powerful tools for fingerprint analysis with continuous improvement through user
              feedback.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-8 py-8 lg:grid-cols-3 lg:gap-12 stagger-animation">
            <Card className="hover-card-effect animate-scale-in">
              <CardContent className="flex flex-col justify-center space-y-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Fingerprint className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Advanced Classification</h3>
                  <p className="text-muted-foreground">
                    Accurately classify fingerprints with at least 93% accuracy using our reinforcement learning model.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-card-effect animate-scale-in">
              <CardContent className="flex flex-col justify-center space-y-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BarChart className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Ridge Counting</h3>
                  <p className="text-muted-foreground">
                    Precise ridge counting with visual overlays to highlight detected ridges on fingerprint images.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-card-effect animate-scale-in">
              <CardContent className="flex flex-col justify-center space-y-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Human Feedback</h3>
                  <p className="text-muted-foreground">
                    Our model continuously improves through expert and user feedback for better accuracy over time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 animate-fade-in">
            <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300">
              How It Works
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Simple Process, Powerful Results
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our streamlined workflow makes fingerprint analysis accessible to everyone
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4 stagger-animation">
            <div className="flex flex-col items-center text-center animate-scale-in">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Upload</h3>
              <p className="text-muted-foreground">Upload fingerprint images from any device or capture directly</p>
            </div>

            <div className="flex flex-col items-center text-center animate-scale-in">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Analyze</h3>
              <p className="text-muted-foreground">Our AI processes the image for classification and ridge counting</p>
            </div>

            <div className="flex flex-col items-center text-center animate-scale-in">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Review</h3>
              <p className="text-muted-foreground">Get detailed results with visual overlays and confidence scores</p>
            </div>

            <div className="flex flex-col items-center text-center animate-scale-in">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <span className="text-xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Feedback</h3>
              <p className="text-muted-foreground">Provide feedback to improve the model's accuracy over time</p>
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <Link href="/help">
              <Button variant="outline" size="lg" className="gap-2 button-hover-effect">
                Learn More About The Process
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="flex flex-col space-y-6 animate-slide-up">
              <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300">
                Benefits
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Choose DabaFing?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold">High Accuracy</h3>
                    <p className="text-muted-foreground">
                      93%+ accuracy in fingerprint classification and ridge counting
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold">Secure & Private</h3>
                    <p className="text-muted-foreground">
                      End-to-end encryption and compliance with data protection regulations
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold">Fast Processing</h3>
                    <p className="text-muted-foreground">
                      Get results in seconds, even with complex fingerprint patterns
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold">Collaborative Learning</h3>
                    <p className="text-muted-foreground">System improves with each analysis through user feedback</p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/about">
                  <Button className="gap-2 button-hover-effect">
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-blue-600 opacity-30 blur-xl animate-pulse-slow"></div>
              <div className="relative rounded-2xl overflow-hidden animate-float">
                <Image
                  src="/fing_bene.jpg?height=500&width=600"
                  width={600}
                  height={500}
                  alt="DabaFing Benefits"
                  className="rounded-2xl object-cover shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-r from-primary/10 to-blue-600/10 animate-gradient">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <Badge className="mb-2 bg-primary/20 text-primary hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40 transition-all duration-300">
              Get Started Today
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Transform Your Fingerprint Analysis?
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join DabaFing today and experience the power of AI-driven fingerprint analysis with continuous
              improvement.
            </p>
            <div className="flex flex-col gap-3 min-[400px]:flex-row pt-4">
              <Link href="/auth/register">
                <Button size="lg" className="gap-2 button-hover-effect">
                  Create an Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="gap-2 button-hover-effect">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

