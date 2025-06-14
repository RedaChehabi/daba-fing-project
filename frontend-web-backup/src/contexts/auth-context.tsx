// File: frontend-web/src/contexts/auth-context.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService } from '@/services/api' // Assuming your auth utilities are aliased or directly imported

// Use NEXT_PUBLIC_ environment variable for the API base URL
const API_BASE_URL_CONTEXT = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL_CONTEXT) {
  console.error("FATAL ERROR in AuthContext: NEXT_PUBLIC_API_URL is not defined. Please set it in your .env.local file in the frontend-web directory.");
  // Consider throwing an error or setting a default for local dev,
  // but it's crucial this is set for the app to function.
}

// Define UserRole based on consistent values expected from backend
export type UserRole = "Regular" | "Expert" | "Admin" | string; // Added string for flexibility

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  // Optional detailed profile fields that might be fetched by fetchUserProfile
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void; // For local UI updates after profile edit, etc.
  fetchUserProfile: (token?: string) => Promise<void>; // To refresh or initially fetch user profile
  setUserRole: (role: UserRole) => void; // For demo/admin role switching (simulated client-side)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start true for initial auth check
  const router = useRouter();

  const fetchUserProfile = useCallback(async (tokenOverride?: string) => {
    if (!API_BASE_URL_CONTEXT) {
        console.error("AuthContext: Cannot fetch user profile - API_BASE_URL_CONTEXT is not configured.");
        // Clear user state if API URL is missing, as we can't verify auth
        setUser(null);
        localStorage.removeItem("user_data");
        localStorage.removeItem("token");
        // setLoading(false); // Caller should handle this or the initial useEffect
        return;
    }

    const tokenToUse = tokenOverride || localStorage.getItem("token");

    if (!tokenToUse) {
      setUser(null);
      localStorage.removeItem("user_data"); // Ensure consistency
      // setLoading(false); // Handled by initial useEffect or calling function
      return; // No token, so no user
    }

    try {
      const response = await fetch(`${API_BASE_URL_CONTEXT}/api/userprofile/`, {
        headers: { "Authorization": `Token ${tokenToUse}` }
      });

      if (response.ok) {
        const profileData = await response.json();
        const fetchedUser: User = {
          id: profileData.id || "",
          username: profileData.username || "",
          email: profileData.email || "",
          role: profileData.role || "Regular", // Ensure backend sends "Regular", "Expert", "Admin"
          first_name: profileData.profile?.first_name, // Assuming profile details are nested
          last_name: profileData.profile?.last_name,
        };
        setUser(fetchedUser);
        localStorage.setItem("user_data", JSON.stringify(fetchedUser));
      } else {
        console.warn("AuthContext: Failed to fetch user profile, token might be invalid or expired.");
        authService.logout(); // Use the utility to clear localStorage
        setUser(null);
        // Optionally, redirect to login if this happens on a protected route,
        // though layout should handle redirects based on isAuthenticated.
        // router.push("/auth/login");
      }
    } catch (error) {
      console.error("AuthContext: Error fetching user profile:", error);
      authService.logout(); // Clear local auth state on any fetch error
      setUser(null);
    }
  }, [router]); // Removed API_BASE_URL_CONTEXT from deps as it's module-level const

  useEffect(() => {
    const attemptAutoLogin = async () => {
      setLoading(true);
      const localToken = localStorage.getItem("token");
      if (localToken) {
        await fetchUserProfile(localToken);
      }
      setLoading(false);
    };
    attemptAutoLogin();
  }, [fetchUserProfile]); // fetchUserProfile is memoized with useCallback

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const loginResponse = await authService.login(username, password);
      // apiAuthUtils.login now stores token and basic user_data in localStorage
      await fetchUserProfile(loginResponse.token); // Fetch full profile using the new token
      // Navigation to "/dashboard" should be handled by the calling page (e.g., LoginPage)
    } catch (error) {
      console.error("AuthContext: Login failed:", error);
      setUser(null); // Ensure user state is cleared on login failure
      // Error is re-thrown by apiAuthUtils.login, so the calling page can display it
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const registerResponse = await authService.register(username, email, password);
      // apiAuthUtils.register now stores token and basic user_data in localStorage
      await fetchUserProfile(registerResponse.token); // Fetch full profile using the new token
      // Navigation to "/dashboard" should be handled by the calling page (e.g., RegisterPage)
    } catch (error) {
      console.error("AuthContext: Registration failed:", error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // --- Functions you asked for ---
  const logout = useCallback(() => {
    authService.logout(); // This function should clear localStorage (token, user_data)
    setUser(null); // Clear user state in the context
    router.push("/auth/login"); // Navigate to login page
  }, [router]); // Add router to dependency array

  const updateUser = (userData: Partial<User>) => {
    setUser(prevUser => {
      if (prevUser) {
        const updatedUser = { ...prevUser, ...userData };
        localStorage.setItem("user_data", JSON.stringify(updatedUser)); // Keep localStorage in sync
        return updatedUser;
      }
      return null; // Should not happen if updateUser is called when user exists
    });
  };

  // This is a client-side simulation of role change for UI/demo purposes.
  // A real role change would require a backend API call and re-fetching the user profile.
  const setUserRole = (role: UserRole) => {
    if (user) {
      console.warn(
        `AuthContext: Simulating local role change for user "${user.username}" to "${role}". This is not saved to the backend.`
      );
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem("user_data", JSON.stringify(updatedUser)); // Also update localStorage if you rely on it
    }
  };
  // --- End functions you asked for ---

  const value = {
    user,
    isAuthenticated: !!user && !!localStorage.getItem("token"), // Check both context user and token presence
    loading,
    login,
    logout,
    register,
    updateUser,
    fetchUserProfile,
    setUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}