// File: frontend-web/src/contexts/auth-context.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { auth as apiAuth } from "@/utils/api"; // Import the refined auth utility

// Define UserRole based on consistent values expected from backend
export type UserRole = "Regular" | "Expert" | "Admin" | string; // string for flexibility

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  // Add other user properties fetched from /userprofile/ if needed
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
  updateUser: (userData: Partial<User>) => void; // For local updates, e.g., after profile edit
  fetchUserProfile: (token?: string) => Promise<void>; // To refresh or fetch user profile
  setUserRole: (role: UserRole) => void; // For demo/admin role switching (simulated)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start true for initial auth check
  const router = useRouter();

  const fetchUserProfile = useCallback(async (tokenOverride?: string) => {
    const tokenToUse = tokenOverride || localStorage.getItem("token");

    if (!tokenToUse) {
      setUser(null);
      localStorage.removeItem("user_data"); // Ensure consistency
      // setLoading(false); // setLoading will be handled by the caller or initial effect
      return; // No token, so no user
    }

    // setLoading(true); // Indicate fetching profile
    try {
      const response = await fetch(`${API_BASE_URL}/userprofile/`, {
        headers: { "Authorization": `Token ${tokenToUse}` }
      });

      if (response.ok) {
        const profileData = await response.json();
        // Map backend response to frontend User interface
        const fetchedUser: User = {
          id: profileData.id,
          username: profileData.username,
          email: profileData.email,
          role: profileData.role, // Assuming backend sends "Regular", "Expert", "Admin"
          first_name: profileData.profile?.first_name,
          last_name: profileData.profile?.last_name,
        };
        setUser(fetchedUser);
        localStorage.setItem("user_data", JSON.stringify(fetchedUser)); // Update with fresh data
      } else {
        // Token might be invalid or expired
        console.warn("Failed to fetch user profile, token might be invalid.");
        apiAuth.logout(); // Clear token and user_data
        setUser(null);
        // router.push("/auth/login"); // Optional: redirect if profile fetch fails for authenticated route
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      apiAuth.logout(); // Clear token and user_data on error
      setUser(null);
    }
    // finally {
    //   setLoading(false);
    // }
  }, [router]); // API_BASE_URL is stable

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
  }, [fetchUserProfile]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const loginResponse = await apiAuth.login(username, password); // Uses utils/api.ts
      // loginResponse contains the token and basic user data
      // fetchUserProfile will use the token set by apiAuth.login and update the context user
      await fetchUserProfile(loginResponse.token);
      // router.push("/dashboard"); // Navigation should happen in the component calling login
    } catch (error) {
      // Error is already thrown by apiAuth.login, just re-throw for component to handle
      console.error("AuthContext login failed:", error);
      setUser(null); // Ensure user is cleared
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const registerResponse = await apiAuth.register(username, email, password); // Uses utils/api.ts
      // registerResponse contains the token and basic user data
      // fetchUserProfile will use the token set by apiAuth.register
      await fetchUserProfile(registerResponse.token);
      // router.push("/dashboard"); // Navigation should happen in the component calling register
    } catch (error) {
      console.error("AuthContext registration failed:", error);
      setUser(null); // Ensure user is cleared
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    apiAuth.logout(); // Clears localStorage
    setUser(null);
    router.push("/auth/login"); // Navigate after state update
  }, [router]);

  const updateUser = (userData: Partial<User>) => {
    setUser(prevUser => {
      if (prevUser) {
        const updated = { ...prevUser, ...userData };
        localStorage.setItem("user_data", JSON.stringify(updated)); // Keep localStorage in sync
        return updated;
      }
      return null;
    });
  };

  // This is a simulated role change for demo/admin UI purposes.
  // A real implementation would require a backend API endpoint and likely re-fetching the user profile.
  const setUserRole = (role: UserRole) => {
    if (user) {
      console.warn(
        "Simulating local role change for user:",
        user.username,
        "to",
        role,
        "This does NOT persist to the backend without an API call."
      );
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    isAuthenticated: !!user && !!localStorage.getItem("token"), // More robust check
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