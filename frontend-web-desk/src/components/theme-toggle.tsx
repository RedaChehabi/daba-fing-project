"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only run animations after component is mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // Render static version during SSR and initial hydration
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="relative overflow-hidden text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10"
        aria-label="Toggle theme"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] opacity-0" />
        <Moon className="h-[1.2rem] w-[1.2rem] absolute" />
      </Button>
    )
  }

  // Client-side animated version
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "dark" ? 45 : 0,
          scale: theme === "dark" ? 0 : 1,
          opacity: theme === "dark" ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute"
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          rotate: theme === "light" ? -45 : 0,
          scale: theme === "light" ? 0 : 1,
          opacity: theme === "light" ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute"
      >
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      </motion.div>
    </Button>
  )
}

