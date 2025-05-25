"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

// Update the ThemeContextType to include language
type ThemeContextType = {
  darkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// In the ThemeProvider component, add language support
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)

  // Initialize on mount
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme")

    // Default to light mode unless explicitly set to dark
    const isDark = savedTheme === "dark"

    setDarkMode(isDark)

    // Apply theme class to document
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")

      // If no theme is set, initialize to light
      if (!savedTheme) {
        localStorage.setItem("theme", "light")
      }
    }
  }, [])

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = (e: MediaQueryListEvent) => {
      // Only apply system preference if user hasn't set a preference
      if (!localStorage.getItem("theme")) {
        setDarkMode(e.matches)
        document.documentElement.classList.toggle("dark", e.matches)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)

    // Save to localStorage
    localStorage.setItem("theme", newDarkMode ? "dark" : "light")

    // Apply to document
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Force re-render of all components
    window.dispatchEvent(new Event("storage"))
  }

  return <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
