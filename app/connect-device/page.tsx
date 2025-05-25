"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ConnectionScreen from "@/components/ConnectionScreen"
import { AuthProvider } from "@/context/AuthContext"

export default function ConnectDevicePage() {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) {
    return null // Return nothing during server-side rendering
  }

  return (
    <AuthProvider>
      <ConnectionScreen />
    </AuthProvider>
  )
}
