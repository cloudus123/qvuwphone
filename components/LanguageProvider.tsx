"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { translate, changeLanguage as changeAppLanguage } from "@/utils/i18n"

type LanguageContextType = {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      try {
        const savedLanguage = localStorage.getItem("app_language")
        return savedLanguage || "English"
      } catch (e) {
        console.error("Error accessing localStorage:", e)
        return "English"
      }
    }
    return "English"
  })

  const [forceUpdate, setForceUpdate] = useState(0) // Add this to force re-renders

  useEffect(() => {
    // Check for saved language preference
    try {
      const savedLanguage = localStorage.getItem("app_language")
      if (savedLanguage && savedLanguage !== language) {
        setLanguage(savedLanguage)
        changeAppLanguage(savedLanguage)

        // Update document language attribute
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("lang", savedLanguage.toLowerCase().split(" ")[0])
          document.documentElement.setAttribute("data-language", savedLanguage)
        }
      }
    } catch (e) {
      console.error("Error accessing localStorage:", e)
    }

    // Listen for language change events
    const handleLanguageChange = (e: CustomEvent) => {
      if (e.detail) {
        setLanguage(e.detail)
        setForceUpdate((prev) => prev + 1) // Force re-render when language changes
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("languageChange", handleLanguageChange as EventListener)
      return () => {
        window.removeEventListener("languageChange", handleLanguageChange as EventListener)
      }
    }
  }, [language])

  const changeLanguage = useCallback((lang: string) => {
    try {
      // Store in localStorage
      localStorage.setItem("app_language", lang)

      // Update document language attribute
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("lang", lang.toLowerCase().split(" ")[0])
        document.documentElement.setAttribute("data-language", lang)
      }

      // Update state
      setLanguage(lang)

      // Update i18n utility
      changeAppLanguage(lang)

      // Dispatch global event for all components to refresh
      if (typeof window !== "undefined") {
        const event = new CustomEvent("languageChange", { detail: lang })
        window.dispatchEvent(event)

        // Force reload the page to ensure all components update
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
    } catch (e) {
      console.error("Error changing language:", e)
    }
  }, [])

  // Translation function - memoize to prevent unnecessary re-renders
  const t = useCallback(
    (key: string): string => {
      return translate(key, language)
    },
    [language, forceUpdate],
  )

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      language,
      setLanguage: changeLanguage,
      t,
    }),
    [language, changeLanguage, t, forceUpdate],
  )

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
