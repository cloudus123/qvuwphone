"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, QrCode } from "lucide-react"
import QRCodeDisplay from "@/components/QRCodeDisplay"
import { useAuth } from "@/context/AuthContext"

export default function QRCodePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [businessName, setBusinessName] = useState("")

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }

    // Set business name
    if (user?.businessName) {
      setBusinessName(user.businessName)
    }
  }, [isAuthenticated, router, user])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="flex items-center">
          <button onClick={() => router.push("/dashboard")} className="mr-4 text-blue-600 hover:text-blue-800">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-blue-900">QR Code Display</h1>
            <p className="text-xs text-blue-600">{businessName}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col items-center justify-center dark:bg-slate-900">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-4">
            <div className="p-3 bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300 border-b border-blue-100 dark:border-gray-600 font-medium flex items-center">
              <QrCode size={18} className="mr-2" />
              <span>Customer Queue QR Code</span>
            </div>

            <div className="p-4">
              <QRCodeDisplay />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <h3 className="text-blue-800 dark:text-blue-300 font-medium mb-2">How it works</h3>
            <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-200">
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>Display this QR code to your customers</span>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>When scanned, customers will be added to your queue</span>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>The QR code refreshes automatically after each scan</span>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                  4
                </span>
                <span>If connected to a display device, both screens will stay in sync</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
