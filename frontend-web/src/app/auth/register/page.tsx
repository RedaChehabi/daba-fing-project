// File: frontend-web/src/app/auth/register/page.tsx
"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" // Added AlertTitle
import { motion } from "framer-motion"
import { Fingerprint, Loader2, User, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { register } = useAuth(); // Removed login, as AuthContext's register now handles login after
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 8) { // Example basic client-side validation
        setError("Password must be at least 8 characters long.");
        return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsLoading(true)
    try {
      // AuthContext's register function should handle both registration and subsequent login/profile fetching
      await register(username, email, password)
      router.push("/dashboard") // Navigate on successful registration & auto-login
    } catch (err: any) {
      console.error("Registration page error:", err)
      let errorMessage = "An unexpected error occurred during registration.";
       if (err.message) {
        if (err.message.toLowerCase().includes("failed to fetch") || err.message.toLowerCase().includes("networkerror")) {
          errorMessage = "Cannot connect to the server. Please check your internet connection or try again later.";
        } else if (err.message.length < 200) { // Show backend's message if it's reasonably short
            errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted/40 p-4">
      <motion.div /* ... DabaFing Logo ... */ >
        {/* ... existing logo JSX ... */}
         <Link href="/" className="flex items-center gap-3 px-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Fingerprint className="h-10 w-10" />
          </motion.div>
          <span className="font-bold text-3xl">DabaFing</span>
        </Link>
      </motion.div>

      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="items-center text-center space-y-2">
          <CardTitle className="text-2xl font-semibold">Create Account</CardTitle>
          <CardDescription>Sign up to get started with DabaFing</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Registration Error</AlertTitle> {/* Added AlertTitle */}
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {/* Username Input */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="pl-10"
                aria-describedby={error ? "register-error-description" : undefined}
              />
            </div>
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="pl-10"
                aria-describedby={error ? "register-error-description" : undefined}
              />
            </div>
            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password (min. 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="pl-10 pr-10"
                aria-describedby={error ? "register-error-description" : undefined}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-primary"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {/* Confirm Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="pl-10 pr-10" // No right padding needed if no toggle here, but fine for consistency
                aria-describedby={error ? "register-error-description" : undefined}
              />
            </div>
             {error && <p id="register-error-description" className="sr-only">{error}</p>} {/* For screen readers */}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4 pt-4 pb-6">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}