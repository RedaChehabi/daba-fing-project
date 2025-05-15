"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

// Define types
type UserRole = "Regular" | "Expert" | "Admin"

interface User {
  id: string
  username: string
  email: string
  role: UserRole
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  register: (username: string, email: string, password: string) => Promise<void>
  updateUser: (userData: Partial<User>) => void  // Add this line
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  // Define API base URL
  const API_BASE_URL = "http://localhost:8000/api";

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem("token")
        if (token) {
          // Fetch user data from API
          const response = await fetch(`${API_BASE_URL}/userprofile/`, {
            headers: {
              "Authorization": `Token ${token}` // Use Token instead of Bearer
            }
          })
          
          if (response.ok) {
            const userData = await response.json()
            setUser({
              id: userData.id || "",
              username: userData.username || "",
              email: userData.email || "",
              role: userData.role || "Regular",  // Changed from "user" to "Regular"
              // Map other user properties as needed
            })
          } else {
            // If token is invalid, clear localStorage
            localStorage.removeItem("token")
            localStorage.removeItem("refreshToken")
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  // Login function
  const login = async (username: string, password: string) => {
    try {
      // Use the correct login endpoint from your URLs
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || JSON.stringify(errorData) || "Login failed")
      }
      
      const data = await response.json()
      
      // Store token (CustomAuthToken typically returns a token key)
      if (data.token) {
        localStorage.setItem("token", data.token)
      }
      
      // Fetch user data
      const userResponse = await fetch(`${API_BASE_URL}/userprofile/`, {
        headers: {
          "Authorization": `Token ${data.token}` // Use Token instead of Bearer
        }
      })
      
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data")
      }
      
      // In the login function, after fetching user data:
      const userData = await userResponse.json()
            
      setUser({
        id: userData.id || "",
        username: userData.username || "",
        email: userData.email || "",
        role: userData.role || "Regular",  // Changed from "user" to "Regular"
        // Map other user properties as needed
      })
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    setUser(null)
    router.push("/auth/login")
  }

  // Register function
  const register = async (username: string, email: string, password: string) => {
    try {
      // Use the correct register endpoint from your URLs
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || JSON.stringify(errorData) || "Registration failed")
      }
      
      // Registration successful
      return await response.json()
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  // Context value
  // Add this function
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({
        ...user,
        ...userData
      })
    }
  }

  // Update the context value
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    register,
    updateUser  // Add this line
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
