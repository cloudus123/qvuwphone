"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Dashboard from "@/components/Dashboard"

export default function Home() {
  const router = useRouter()

  // In a real app, this would check authentication status
  // and redirect to login if not authenticated
  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated")

    if (!isAuthenticated) {
      // If not authenticated, redirect to auth page
      router.push("/auth")
    }
  }, [router])

  return <Dashboard />
}
