"use client"

import { useEffect, useState, useCallback } from "react"
import { initializeApp } from "firebase/app"
import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  getDoc,
  setDoc,
  enableIndexedDbPersistence,
  increment,
} from "firebase/firestore"
import QRCode from "react-qr-code"
import { useAuth } from "@/context/AuthContext"
import { Wifi, WifiOff, RefreshCw, CheckCircle } from "lucide-react"

// Firebase configuration - in a real app, these would be environment variables
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForQVuewApp",
  authDomain: "qvuew-app.firebaseapp.com",
  projectId: "qvuew-app",
  storageBucket: "qvuew-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Enable offline persistence (this helps with offline capabilities)
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.")
    } else if (err.code === "unimplemented") {
      console.warn("The current browser does not support all of the features required to enable persistence")
    }
  })
} catch (error) {
  console.warn("Error enabling persistence:", error)
}

export default function QRCodeDisplay() {
  const { user } = useAuth()
  const [qrToken, setQrToken] = useState("")
  const [isHardwareConnected, setIsHardwareConnected] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true)
  const [scanDetected, setScanDetected] = useState(false)
  const [firestorePath, setFirestorePath] = useState("")

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Function to determine the Firestore path based on hardware connection
  const getFirestorePath = useCallback(
    (deviceSessionId) => {
      if (deviceSessionId) {
        // Hardware is connected, use session-based path
        return `sessions/${deviceSessionId}`
      } else {
        // No hardware, use mobile-only path
        return `mobile_only/${user?.businessName?.replace(/\s+/g, "_") || user?.id}`
      }
    },
    [user],
  )

  // Check if hardware is connected
  const checkHardwareConnection = useCallback(async () => {
    try {
      // In a real app, this would check localStorage or make an API call
      const pairedDevices = localStorage.getItem("qvuew_paired_devices")
      if (pairedDevices) {
        const devices = JSON.parse(pairedDevices)
        if (devices.length > 0) {
          // Get the first paired device's session ID
          const deviceSessionId = `SESSION_${devices[0].id}`
          setSessionId(deviceSessionId)
          setIsHardwareConnected(true)
          return deviceSessionId
        }
      }

      setIsHardwareConnected(false)
      return null
    } catch (error) {
      console.error("Error checking hardware connection:", error)
      setIsHardwareConnected(false)
      return null
    }
  }, [])

  // Initialize QR token document
  const initializeQRDocument = useCallback(async (path) => {
    try {
      const docRef = doc(db, path)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        // Create the document with initial values
        const initialToken = `qvuew_${Math.random().toString(36).substring(2, 7)}`
        await setDoc(docRef, {
          currentQrToken: initialToken,
          lastUpdated: serverTimestamp(),
          scanCount: 0,
          status: "active",
          createdAt: serverTimestamp(),
          scanned: false,
        })
        console.log(`Created initial document at ${path}`)
      }
    } catch (error) {
      console.warn("Could not initialize document, will try to create on first scan:", error)
    }
  }, [])

  // Set up Firestore listener for QR token updates
  useEffect(() => {
    if (!user) return

    const setupQRListener = async () => {
      setIsLoading(true)

      // Check hardware connection
      const deviceSessionId = await checkHardwareConnection()

      // Determine the Firestore path
      const path = getFirestorePath(deviceSessionId)
      setFirestorePath(path)

      // Initialize the document if it doesn't exist
      await initializeQRDocument(path)

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        doc(db, path),
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data()

            // If the token is marked as scanned, show the scan detected UI
            if (data.scanned === true && !scanDetected) {
              setScanDetected(true)

              // Reset scan detected state after 2 seconds
              setTimeout(() => {
                setScanDetected(false)
              }, 2000)
            }

            setQrToken(data.currentQrToken)
            setLastUpdated(data.lastUpdated?.toDate() || new Date())
          }
          setIsLoading(false)
        },
        (error) => {
          console.error("Error listening to QR updates:", error)
          setIsLoading(false)
          // Fallback to a static QR code in case of error
          setQrToken(`qvuew_fallback_${Date.now().toString(36)}`)
        },
      )

      return unsubscribe
    }

    const unsubscribe = setupQRListener()
    return () => {
      // Clean up listener when component unmounts
      unsubscribe.then((unsub) => unsub())
    }
  }, [user, checkHardwareConnection, getFirestorePath, initializeQRDocument])

  // Function to simulate a scan event (for testing purposes)
  const simulateScan = async () => {
    if (!qrToken || !user || !firestorePath) return

    // Don't proceed if offline
    if (!isOnline) {
      console.warn("Cannot refresh QR code while offline")
      return
    }

    try {
      // First, mark the current token as scanned
      const docRef = doc(db, firestorePath)

      // Update the document to mark it as scanned
      await updateDoc(docRef, {
        scanned: true,
        status: "used",
        lastScannedAt: serverTimestamp(),
      })

      // In a real implementation, the backend would detect this scan
      // and generate a new token automatically. Here we're simulating
      // that backend process with a slight delay.
      setTimeout(async () => {
        try {
          // Generate a new token
          const newToken = `qvuew_${Math.random().toString(36).substring(2, 7)}`

          // Update with new token
          await updateDoc(docRef, {
            currentQrToken: newToken,
            lastUpdated: serverTimestamp(),
            scanCount: increment(1),
            status: "active",
            scanned: false,
            createdAt: serverTimestamp(),
          })

          console.log(`QR code refreshed: ${newToken}`)
        } catch (error) {
          console.error("Error generating new QR code:", error)
        }
      }, 1500) // Simulate backend processing time
    } catch (error) {
      console.error("Error simulating scan:", error)
    }
  }

  // In a real implementation, this function would be called by your backend
  // when a QR code is actually scanned by a customer
  useEffect(() => {
    // Set up a listener for real scan events from your backend
    // This could be a WebSocket, Server-Sent Events, or polling

    // For demonstration, we'll create a mock backend endpoint
    const mockBackendUrl = `https://api.qvuew.app/scan-events?token=${qrToken}&businessId=${user?.id}`

    let eventSource

    const setupScanListener = () => {
      if (!qrToken || !user || !isOnline) return

      // In a real implementation, this would be a WebSocket or SSE connection
      console.log(`Setting up scan listener for token: ${qrToken}`)

      // Mock implementation - in production replace with actual backend connection
      // This simulates periodic checks to the backend to see if the QR was scanned
      const checkInterval = setInterval(() => {
        // Simulate a 5% chance that the QR was scanned
        if (Math.random() < 0.05 && !scanDetected && !isLoading) {
          console.log("Backend detected a real scan!")
          simulateScan()
        }
      }, 3000)

      return () => clearInterval(checkInterval)
    }

    const cleanup = setupScanListener()
    return cleanup
  }, [qrToken, user, isOnline, scanDetected, isLoading])

  // Generate QR code data - simple URL format for better scanner compatibility
  const qrData = qrToken
    ? `https://qvuew.app/join?token=${qrToken}&bid=${encodeURIComponent(
        user?.businessName?.replace(/\s+/g, "_") || user?.id,
      )}${isHardwareConnected ? `&sid=${sessionId}` : ""}`
    : ""

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      {isHardwareConnected ? (
        <div className="flex items-center mb-4 px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
          <Wifi size={16} className="mr-1" />
          <span>Synced with Display Device</span>
        </div>
      ) : (
        <div className="flex items-center mb-4 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
          <WifiOff size={16} className="mr-1" />
          <span>Running in Mobile-Only Mode</span>
        </div>
      )}

      {!isOnline && (
        <div className="flex items-center mb-4 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full text-sm">
          <WifiOff size={16} className="mr-1" />
          <span>Offline Mode - QR updates paused</span>
        </div>
      )}

      <div
        className={`bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 relative ${isOnline ? "cursor-pointer" : ""}`}
        onClick={isOnline ? simulateScan : undefined}
        title={isOnline ? "Click to simulate a scan" : "Cannot refresh QR while offline"}
      >
        {isLoading || scanDetected ? (
          <div className="w-64 h-64 flex flex-col items-center justify-center">
            {scanDetected ? (
              <>
                <CheckCircle size={32} className="text-green-600 mb-2" />
                <p className="text-center text-sm font-medium text-gray-700">QR Scanned! Generating new code...</p>
              </>
            ) : (
              <RefreshCw size={32} className="text-blue-600 animate-spin" />
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <QRCode
              value={qrData}
              size={256}
              level="M"
              fgColor="#000000"
              bgColor="#FFFFFF"
              renderAs="svg"
              includeMargin={true}
            />
          </div>
        )}

        {/* Shimmer effect overlay when scan is detected */}
        {scanDetected && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
        )}
      </div>

      <p className="mt-4 text-center text-blue-800 font-medium">Scan this QR to Join the Queue</p>

      <p className="mt-1 text-xs text-gray-500">Refreshing on scan...</p>

      {lastUpdated && <p className="mt-2 text-xs text-gray-500">Last refreshed: {lastUpdated.toLocaleTimeString()}</p>}
    </div>
  )
}
