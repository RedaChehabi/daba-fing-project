"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Fingerprint, LogOut, Settings, User, Home } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { isElectron } from "@/lib/is-electron";

export function ElectronNavigation() {
  const pathname = usePathname();
  
  // Only show this navigation in electron
  if (!isElectron()) {
    return null;
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(path);
  const isAuthPage = pathname.startsWith("/auth");
  const isDashboardPage = pathname.startsWith("/dashboard");

  // Don't show this navigation on dashboard pages - they have their own sidebar
  if (isDashboardPage) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
    >
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={isDashboardPage ? "/dashboard" : "/auth/login"} className="flex items-center gap-2">
            <Fingerprint className="h-6 w-6" />
            <span className="font-bold text-lg">DabaFing</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Auth Navigation */}
          {isAuthPage && (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button
                  variant={isActive("/auth/login") ? "default" : "ghost"}
                  size="sm"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  variant={isActive("/auth/register") ? "default" : "ghost"}
                  size="sm"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Dashboard Navigation */}
          {isDashboardPage && (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button
                  variant={pathname === "/dashboard" ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/profile">
                <Button
                  variant={isActive("/dashboard/profile") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button
                  variant={isActive("/dashboard/settings") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-destructive hover:text-destructive"
                onClick={() => {
                  // Handle logout logic here
                  window.location.href = "/auth/login";
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          )}

          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
} 