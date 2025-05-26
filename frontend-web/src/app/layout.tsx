import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { cn } from "@/lib/utils"
import { fontSans } from "@/lib/fonts"
import { ErrorBoundary } from "@/components/error-boundary"
import { ElectronRouteGuard } from "@/components/protection/ElectronRouteGuard"
import { ElectronNavigation } from "@/components/electron/ElectronNavigation"

export const metadata: Metadata = {
  title: "DabaFing - Fingerprint Analysis",
  description: "Advanced fingerprint analysis and identification system",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ErrorBoundary>
              <ElectronRouteGuard>
                <div className="relative flex min-h-screen flex-col">
                  <SiteHeader />
                  <ElectronNavigation />
                  <main className="flex-1">{children}</main>
                  <SiteFooter />
                </div>
              </ElectronRouteGuard>
            </ErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
