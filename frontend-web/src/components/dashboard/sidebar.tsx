"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
// Import necessary components and icons
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes" // Import useTheme
// Added ChevronsLeft, ChevronsRight
import { BarChart, ChevronsLeft, ChevronsRight, FileText, Fingerprint, History, Home, LogOut, Moon, Search, Settings, Sun, Upload, User, Users } from "lucide-react"
import { useEffect, useState } from "react" // Import useEffect and useState for theme toggle

const userNavItems = [
  // Moved Upload to the top
  {
    title: "Upload",
    href: "/dashboard/upload",
    icon: Upload,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "History",
    href: "/dashboard/history",
    icon: History,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

const expertNavItems = [
  {
    title: "Upload",
    href: "/dashboard/upload",
    icon: Upload,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Verify",
    href: "/dashboard/verify",
    icon: Fingerprint,
  },
  {
    title: "History",
    href: "/dashboard/history",
    icon: History,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: BarChart,
  },
  {
    title: "Reports",
    href: "/dashboard/admin/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
]


export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isDark, setIsDark] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false) // State for collapse toggle

  // Sync theme state
  useEffect(() => {
    setIsDark(theme === 'dark')
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme)
    setIsDark(newTheme === 'dark')
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }


  // Determine which navigation items to show based on user role
  let currentNavItems = userNavItems
  // Check user.role directly (assuming it's 'expert' or 'admin')
  if (user?.role === "expert") { // Changed from user?.role?.role_name
    currentNavItems = expertNavItems
  } else if (user?.role === "admin") { // Changed from user?.role?.role_name
    currentNavItems = adminNavItems
  }

  return (
    // Adjusted width based on isCollapsed state, added transition
    <div
      className={cn(
        "flex h-full flex-col border-r bg-card text-card-foreground transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20 p-2" : "w-80 p-4"
      )}
    >
      {/* Logo/User Area */}
      {/* Changed justify-between to justify-start and added gap when collapsed */}
      <div className={cn(
          "flex h-16 items-center border-b mb-4",
          isCollapsed ? "justify-start gap-3" : "justify-between pb-4" // Use justify-start and gap-2 when collapsed
      )}>
        {/* Removed conditional justify-center from Link */}
        <Link href="/" className={cn("flex items-center gap-3 font-semibold text-primary")}>
          <Fingerprint className="h-8 w-8 flex-shrink-0" />
          <span className={cn("text-xl font-bold", isCollapsed && "hidden")}>DabaFing</span>
        </Link>

        {/* ChevronsRight button - shown only when collapsed */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(!isCollapsed && "hidden")} // Show only when collapsed
        >
          <ChevronsRight className="h-5 w-5" />
        </Button>

        {/* ChevronsLeft button - shown only when expanded */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn("ml-auto", isCollapsed && "hidden")} // Hide button when collapsed
        >
           <ChevronsLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Search Bar - Hide input when collapsed */}
      <div className={cn("relative mb-4", isCollapsed && "hidden")}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-9 h-9" />
      </div>

      {/* Navigation Area */}
      <div className="flex-1 overflow-auto">
        <nav className="grid items-start gap-1 text-sm font-medium">
          {currentNavItems.map((item, index) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={index}
                href={item.href}
                title={isCollapsed ? item.title : undefined} // Add tooltip when collapsed
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                  isCollapsed && "justify-center", // Center icon when collapsed
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" /> {/* Added flex-shrink-0 */}
                <span className={cn(isCollapsed && "hidden")}>{item.title}</span> {/* Hide text when collapsed */}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className={cn("mt-auto border-t pt-4 space-y-2", isCollapsed ? "border-none pt-2" : "pt-4")}>
         {/* Logout Item */}
         <Button
           variant="ghost"
           title={isCollapsed ? "Logout" : undefined} // Add tooltip when collapsed
           className={cn(
             "w-full justify-start gap-3 px-3 py-2.5 text-muted-foreground hover:bg-accent hover:text-foreground",
             isCollapsed && "justify-center" // Center icon when collapsed
           )}
           onClick={logout}
         >
           <LogOut className="h-5 w-5 flex-shrink-0" /> {/* Added flex-shrink-0 */}
           <span className={cn(isCollapsed && "hidden")}>Logout</span> {/* Hide text when collapsed */}
         </Button>

         {/* Dark Mode Toggle */}
         <div className={cn(
             "flex items-center justify-between rounded-lg px-3 py-2.5 bg-muted/50",
             isCollapsed && "flex-col gap-2 p-2" // Adjust layout when collapsed
             )}>
            <Label
              htmlFor="dark-mode"
              title={isCollapsed ? (isDark ? "Dark Mode" : "Light Mode") : undefined} // Add tooltip when collapsed
              className={cn(
                "flex items-center gap-3 text-sm font-medium text-muted-foreground cursor-pointer",
                isCollapsed && "gap-0" // Remove gap when collapsed
                )}
            >
              {isDark ? <Moon className="h-5 w-5 flex-shrink-0" /> : <Sun className="h-5 w-5 flex-shrink-0" />}
              <span className={cn("ml-3", isCollapsed && "hidden")}>{isDark ? "Dark Mode" : "Light Mode"}</span> {/* Hide text when collapsed */}
            </Label>
            <Switch
              id="dark-mode"
              checked={isDark}
              onCheckedChange={toggleTheme}
              aria-label="Toggle dark mode"
              className={cn(isCollapsed && "mt-1")} // Add margin top when collapsed
            />
          </div>
      </div>
    </div>
  )
}
