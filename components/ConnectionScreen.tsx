"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Wifi, Bluetooth, AlertCircle, HelpCircle, X, LogOut } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { HelpModal } from "@/components/modals/help-modal"

const ConnectionScreen = () => {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState("")
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [deviceType, setDeviceType] = useState("bluetooth") // bluetooth or wifi
  const [availableDevices, setAvailableDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const [isFirstTimeAccess, setIsFirstTimeAccess] = useState(true)

  // Use a ref to track connection attempts and prevent infinite loops
  const connectionAttemptRef = useRef(0)
  const isInitialMount = useRef(true)

  // Auto-initiate device scan on component mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false

      // Check if this is first time access
      const hasAccessedBefore = localStorage.getItem("qvuew_has_accessed_before")
      if (!hasAccessedBefore) {
        setShowPermissionModal(true)
        localStorage.setItem("qvuew_has_accessed_before", "true")
      } else {
        // Auto-initiate device scanning
        scanForDevices()
      }
    }
  }, [])

  // Simulate device scanning
  const scanForDevices = async () => {
    if (connectionAttemptRef.current === 0) {
      connectionAttemptRef.current += 1
      setIsConnecting(true)
      setConnectionError("")

      try {
        // Simulate API call to get nearby devices
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Check for paired devices first
        const pairedDevices = localStorage.getItem("qvuew_paired_devices")
        if (pairedDevices) {
          const devices = JSON.parse(pairedDevices)
          if (devices.length > 0) {
            // Auto-connect to the first paired device
            setSelectedDevice(devices[0])
            await connectToDevice(devices[0])
            return
          }
        }

        // If no paired devices or auto-connect failed, show available devices
        const mockDevices = [
          { id: "QV001", name: "QVuew Display 1", type: "bluetooth", status: "available" },
          { id: "QV002", name: "QVuew Display 2", type: "bluetooth", status: "available" },
          { id: "QV003", name: "QVuew WiFi Display", type: "wifi", status: "available" },
        ]

        setAvailableDevices(mockDevices)
        setIsConnecting(false)
      } catch (error) {
        console.error("Error scanning for devices:", error)
        setConnectionError("Failed to scan for devices. Please try again.")
        setIsConnecting(false)
      }
    }
  }

  // Handle device selection
  const handleDeviceSelect = (device) => {
    setSelectedDevice(device)
  }

  // Handle connection to device
  const connectToDevice = async (device) => {
    if (!device) {
      setConnectionError("Please select a device to connect")
      return
    }

    setIsConnecting(true)
    setConnectionError("")

    try {
      // Simulate connection process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Save as paired device
      const pairedDevices = localStorage.getItem("qvuew_paired_devices")
      const devices = pairedDevices ? JSON.parse(pairedDevices) : []
      if (!devices.some((d) => d.id === device.id)) {
        devices.push(device)
        localStorage.setItem("qvuew_paired_devices", JSON.stringify(devices))
      }

      // Simulate successful connection
      router.push("/dashboard")
    } catch (error) {
      console.error("Connection error:", error)
      setConnectionError("Failed to connect to the device. Please try again.")
      setIsConnecting(false)
    }
  }

  // Handle connect button click
  const handleConnect = () => {
    connectToDevice(selectedDevice)
  }

  // Handle device type toggle
  const toggleDeviceType = (type) => {
    setDeviceType(type)
    setSelectedDevice(null)
  }

  // Handle manual refresh
  const handleRefresh = async () => {
    connectionAttemptRef.current = 0
    scanForDevices()
  }

  // Handle permission responses
  const handlePermissionResponse = (response) => {
    setShowPermissionModal(false)

    if (response === "deny") {
      setConnectionError("Connection features may be limited without access.")
    } else {
      // Start scanning for devices
      scanForDevices()

      if (response === "always") {
        localStorage.setItem("qvuew_permission_always", "true")
      }
    }
  }

  // Handle logout
  const handleLogout = () => {
    setShowLogoutConfirmation(true)
  }

  // Confirm logout
  const confirmLogout = () => {
    logout()
    router.push("/auth")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col p-6">
      {/* Header with Logout Button */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={handleLogout}
          className="flex items-center text-blue-700 dark:text-green-300 hover:text-blue-900 dark:text-green-100 transition-colors"
        >
          <LogOut size={20} className="mr-1" />
          <span>Logout</span>
        </button>
        <button
          onClick={() => setShowHelpModal(true)}
          className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-green-800 dark:text-green-500 hover:bg-blue-200 transition-colors"
        >
          <HelpCircle size={20} />
        </button>
      </div>

      {/* Connection Animation */}
      <div className="flex flex-col items-center justify-center flex-grow mb-8">
        <div className="relative mb-8">
          <div className="w-48 h-48 rounded-full bg-blue-500 bg-opacity-10 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-blue-500 bg-opacity-30 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white">
                  {deviceType === "bluetooth" ? <Bluetooth size={32} /> : <Wifi size={32} />}
                </div>
              </div>
            </div>
          </div>

          {/* Ripple Animation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="ripple"></div>
            <div className="ripple delay-1"></div>
            <div className="ripple delay-2"></div>
            <div className="ripple delay-3"></div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-blue-900 dark:text-white mb-2">
          {isConnecting ? "Scanning for devices..." : "Select a QVuew Display"}
        </h2>
        <p className="text-blue-700 dark:text-green-500 text-center mb-6">Make sure your QVuew display is powered on and within range</p>

        {/* Connection Type Toggle */}
        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm mb-6">
          <button
            onClick={() => toggleDeviceType("bluetooth")}
            className={`flex items-center px-4 py-2 rounded-md ${
              deviceType === "bluetooth" ? "bg-blue-600 text-white" : "bg-transparent text-blue-600"
            }`}
          >
            <Bluetooth size={18} className="mr-2" />
            Bluetooth
          </button>
          <button
            onClick={() => toggleDeviceType("wifi")}
            className={`flex items-center px-4 py-2 rounded-md ${
              deviceType === "wifi" ? "bg-blue-600 text-white" : "bg-transparent text-blue-600"
            }`}
          >
            <Wifi size={18} className="mr-2" />
            WiFi
          </button>
        </div>

        {/* Device List */}
        {connectionError && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
            <AlertCircle size={18} className="mr-2" />
            <span>{connectionError}</span>
            <button onClick={() => setConnectionError("")} className="ml-auto text-red-500 hover:text-red-700">
              <X size={16} />
            </button>
          </div>
        )}

        <div className="w-full max-w-md">
          {isConnecting ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : availableDevices.length > 0 ? (
            <div className="space-y-3 w-full">
              {availableDevices
                .filter((device) => device.type === deviceType)
                .map((device) => (
                  <button
                    key={device.id}
                    onClick={() => handleDeviceSelect(device)}
                    className={`w-full bg-white dark:border-green-500 rounded-xl p-4 shadow-sm text-left transition-all ${
                      selectedDevice?.id === device.id
                        ? "border-2 border-blue-500"
                        : "border border-transparent hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-center">
                      {device.type === "bluetooth" ? (
                        <Bluetooth size={20} className="text-blue-600 mr-3" />
                      ) : (
                        <Wifi size={20} className="text-blue-600 mr-3" />
                      )}
                      <div>
                        <h3 className="font-medium text-blue-900 dark:text-white">{device.name}</h3>
                        <p className="text-sm text-blue-600">
                          ID: {device.id} • {device.status}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-center">
              <p className="text-blue-900 dark:text-orange-100 mb-2">No devices found</p>
              <p className="text-sm text-blue-600 mb-4">Make sure your QVuew display is powered on and within range</p>
            </div>
          )}

          <div className="flex mt-6 space-x-4">
            <button
              onClick={handleRefresh}
              disabled={isConnecting}
              className="flex-1 py-3 px-4 bg-white dark:bg-gray-800 border border-blue-600 dark:border-green-500 text-blue-600 dark:text-green-400 font-medium rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Refresh
            </button>
            <button
              onClick={handleConnect}
              disabled={isConnecting || !selectedDevice}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-green-700 dark:to-green-900 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Connect
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="mt-auto pt-6">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm text-blue-600 text-center">
            Having trouble connecting? Check our{" "}
            <button onClick={() => setShowHelpModal(true)} className="text-blue-800 dark:text-white font-medium underline">
              troubleshooting guide
            </button>
          </p>
        </div>
      </div>

      {/* Help Modal */}
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[80vh]">
            <div className="p-6">
              <h3 className="text-xl font-bold text-blue-900 dark:text-green-100 mb-4">Allow QVuew to access Bluetooth and Wi-Fi?</h3>
              <p className="text-blue-700 dark:text-white mb-6">
                QVuew needs access to Bluetooth and Wi-Fi to connect to your display device.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handlePermissionResponse("always")}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition duration-300"
                >
                  Always Allow
                </button>
                <button
                  onClick={() => handlePermissionResponse("once")}
                  className="w-full py-3 px-4 bg-white dark:bg-gray-800 border border-blue-600 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition duration-300"
                >
                  Allow This Time Only
                </button>
                <button
                  onClick={() => handlePermissionResponse("deny")}
                  className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition duration-300"
                >
                  Deny
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm">
            <div className="p-6">
              <h3 className="text-xl font-bold text-blue-900 dark:text-orange-100 mb-4">Are you sure you want to log out?</h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirmation(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition duration-300"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .ripple {
          position: absolute;
          border: 2px solid #3b82f6;
          border-radius: 50%;
          animation: ripple-effect 2s ease-out infinite;
          opacity: 0;
        }
        
        .delay-1 {
          animation-delay: 0.5s;
        }
        
        .delay-2 {
          animation-delay: 1s;
        }
        
        .delay-3 {
          animation-delay: 1.5s;
        }
        
        @keyframes ripple-effect {
          0% {
            width: 16px;
            height: 16px;
            opacity: 0.3;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default ConnectionScreen
