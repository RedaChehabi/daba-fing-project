import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  Laptop,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Apple,
  ComputerIcon as Windows,
  LaptopIcon as Linux,
} from "lucide-react"

export default function DownloadPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-24">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Download DabaFing</h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Get DabaFing on your preferred platform for fingerprint classification and ridge counting.
          </p>
        </div>

        <Tabs defaultValue="desktop" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="desktop" className="flex items-center gap-2">
              <Laptop className="h-4 w-4" />
              Desktop
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Mobile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="desktop" className="mt-6">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col rounded-lg border p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Windows className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Windows</h3>
                <p className="mt-2 flex-1 text-muted-foreground">Compatible with Windows 10 and Windows 11.</p>
                <div className="mt-6 space-y-4">
                  <Button className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download for Windows
                  </Button>
                  <div className="text-xs text-muted-foreground">Version 1.0.0 • 64-bit • 45MB</div>
                </div>
              </div>

              <div className="flex flex-col rounded-lg border p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Apple className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">macOS</h3>
                <p className="mt-2 flex-1 text-muted-foreground">Compatible with macOS 11 Big Sur and newer.</p>
                <div className="mt-6 space-y-4">
                  <Button className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download for macOS
                  </Button>
                  <div className="text-xs text-muted-foreground">Version 1.0.0 • Universal • 50MB</div>
                </div>
              </div>

              <div className="flex flex-col rounded-lg border p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Linux className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Linux</h3>
                <p className="mt-2 flex-1 text-muted-foreground">Available as .deb, .rpm, and AppImage.</p>
                <div className="mt-6 space-y-4">
                  <Button className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download for Linux
                  </Button>
                  <div className="text-xs text-muted-foreground">Version 1.0.0 • Various formats • 40MB</div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-lg border p-6 bg-muted">
              <h3 className="text-xl font-bold mb-4">System Requirements</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium">Minimum Requirements:</h4>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>2 GHz dual-core processor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>4 GB RAM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>500 MB available storage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>1280 x 720 display resolution</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Recommended:</h4>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>2.5 GHz quad-core processor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>8 GB RAM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>1 GB available storage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>1920 x 1080 display resolution</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mobile" className="mt-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col rounded-lg border p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Apple className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">iOS</h3>
                <p className="mt-2 flex-1 text-muted-foreground">
                  Compatible with iOS 14 and newer. Available on iPhone and iPad.
                </p>
                <div className="mt-6 space-y-4">
                  <Button className="w-full gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Download on App Store
                  </Button>
                  <div className="text-xs text-muted-foreground">Version 1.0.0 • 80MB</div>
                </div>
              </div>

              <div className="flex flex-col rounded-lg border p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Android</h3>
                <p className="mt-2 flex-1 text-muted-foreground">Compatible with Android 8.0 and newer.</p>
                <div className="mt-6 space-y-4">
                  <Button className="w-full gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Download on Google Play
                  </Button>
                  <div className="text-xs text-muted-foreground">Version 1.0.0 • 75MB</div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-lg border p-6 bg-muted">
              <h3 className="text-xl font-bold mb-4">Mobile Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">Camera Integration</span>
                    <p className="text-sm text-muted-foreground">
                      Capture fingerprints directly using your device's camera
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">Offline Mode</span>
                    <p className="text-sm text-muted-foreground">Process fingerprints without an internet connection</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">Cloud Sync</span>
                    <p className="text-sm text-muted-foreground">Synchronize your data across all your devices</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">Biometric Authentication</span>
                    <p className="text-sm text-muted-foreground">
                      Secure your data with fingerprint or face recognition
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-bold mb-4">Web Application</h2>
          <p className="mb-6 text-muted-foreground">
            Don't want to download anything? Use our web application for instant access to DabaFing from any browser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/register">
              <Button size="lg">Create an Account</Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

