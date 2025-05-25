"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  email: string
  fullName: string
  businessName?: string
  businessType?: string
  businessAddress?: string
  phoneNumber?: string
  countryCode?: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>
  signup: (userData: any) => Promise<{ success: boolean; error?: string }>
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("qvuew_user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (e) {
        console.error("Error parsing stored user:", e)
        localStorage.removeItem("qvuew_user")
      }
    }
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a mock user
      const mockUser = {
        id: "user_" + Date.now(),
        email: credentials.email,
        fullName: "Demo User",
        businessName: "Demo Business",
      }

      // Store user in localStorage
      localStorage.setItem("qvuew_user", JSON.stringify(mockUser))

      // Update state
      setUser(mockUser)
      setIsAuthenticated(true)

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Invalid credentials" }
    }
  }

  const signup = async (userData: any) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful signup
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create a user object from the provided data
      const newUser = {
        id: "user_" + Date.now(),
        email: userData.email,
        fullName: userData.fullName || "New User",
        businessName: userData.businessName || "New Business",
        businessType: userData.businessType,
        businessAddress: userData.businessAddress,
        phoneNumber: userData.phoneNumber,
        countryCode: userData.countryCode,
      }

      // Store user in localStorage
      localStorage.setItem("qvuew_user", JSON.stringify(newUser))

      // Update state
      setUser(newUser)
      setIsAuthenticated(true)

      return { success: true }
    } catch (error) {
      console.error("Signup error:", error)
      return { success: false, error: "Failed to create account" }
    }
  }

  const resetPassword = async (email: string, newPassword: string) => {
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { success: true }
    } catch (error) {
      console.error("Password reset error:", error)
      return { success: false, error: "Failed to reset password" }
    }
  }

  const logout = () => {
    // Clear user data
    localStorage.removeItem("qvuew_user")
    setUser(null)
    setIsAuthenticated(false)

    // Redirect to auth page
    router.push("/auth")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthContext }
