"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// Removed Label import as it's not used with inline icons
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
// Import icons for inputs, alerts, and password toggle
import { Fingerprint, Loader2, User, Lock, AlertCircle, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(username, password)
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message && err.message.includes("Unexpected token '<'")) {
        setError("Cannot connect to the server. Please make sure the backend is running.");
      } else if (err.response && err.response.data) {
        // If the error has a response with data, show that
        setError(JSON.stringify(err.response.data));
      } else {
        setError(err.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Note: Ensure backend password validation is implemented for production.
  // The demo account info suggests passwords might not be checked.

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    // Add a subtle gradient background
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted/40 p-4">
      <motion.div
        className="flex items-center gap-3 mb-8 text-primary" // Increased margin-bottom
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Link href="/" className="flex items-center gap-3 px-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Fingerprint className="h-10 w-10" /> {/* Slightly larger icon */}
          </motion.div>
          <span className="font-bold text-3xl">DabaFing</span> {/* Slightly larger text */}
        </Link>
      </motion.div>

      <Card className="w-full max-w-md shadow-xl border-0"> {/* Stronger shadow, remove border */}
        <CardHeader className="items-center text-center space-y-2"> {/* Added space-y */}
          <CardTitle className="text-2xl font-semibold">Welcome Back</CardTitle> {/* Changed title */}
          <CardDescription>Sign in to continue to DabaFing</CardDescription> {/* Updated description */}
        </CardHeader>
        <CardContent className="pt-4"> {/* Added padding-top */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="flex items-center gap-2"> {/* Added flex layout */}
                <AlertCircle className="h-4 w-4 flex-shrink-0" /> {/* Ensure icon doesn't shrink */}
                <AlertDescription className="flex-grow">{error}</AlertDescription> {/* Allow text to grow */}
              </Alert>
            )}
            {/* Username Input with Icon */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                placeholder="Username" // Simplified placeholder
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="pl-10" // Add padding for the icon
              />
            </div>
             {/* Password Input with Icon and Toggle */}
            <div className="relative">
               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                // Toggle input type based on showPassword state
                type={showPassword ? "text" : "password"}
                placeholder="Password" // Simplified placeholder
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                // Add padding for both icons (left and right)
                className="pl-10 pr-10"
              />
              {/* Password visibility toggle button */}
              <Button
                type="button" // Important: Prevent form submission
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-primary"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {/* Optional: Forgot Password Link */}
            {/* <div className="text-right text-sm">
              <Link href="/auth/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div> */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Signing In..." : "Sign In"} {/* Changed button text */}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4 pt-4 pb-6"> {/* Adjusted padding */}
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary hover:underline font-medium">
              Register Now
            </Link>
          </div>
          {/* Remove the demo accounts section since we're using real authentication now */}
        </CardFooter>
      </Card>
    </div>
  )
}
