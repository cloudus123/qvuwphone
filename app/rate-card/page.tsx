"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RateCardPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the preview page
    router.push("/rate-card/preview")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to Rate Card...</p>
    </div>
  )
}
