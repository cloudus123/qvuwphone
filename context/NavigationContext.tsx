"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import { useRouter } from "next/navigation"

type Screen = "auth" | "connect-device" | "dashboard"

interface NavigationContextType {
  currentScreen: Screen
  navigateTo: (screen: Screen) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState<Screen>("auth")

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen)

    switch (screen) {
      case "auth":
        router.push("/auth")
        break
      case "connect-device":
        router.push("/connect-device")
        break
      case "dashboard":
        router.push("/dashboard")
        break
    }
  }

  return <NavigationContext.Provider value={{ currentScreen, navigateTo }}>{children}</NavigationContext.Provider>
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider")
  }
  return context
}
