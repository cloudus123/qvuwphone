"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Bell,
  Clock,
  Moon,
  Globe,
  Shield,
  Users,
  Star,
  BarChart2,
  LogOut,
  SettingsIcon,
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Navigation,
  Monitor,
  Info,
  HelpCircle,
  Calendar,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { useTranslation } from "@/utils/i18n"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const [settings, setSettings] = useState({
    notifications: true,
    language: localStorage.getItem("app_language") || "English",
    inactivityReminder: true,
    inactivityTimeout: 5,
    privacyMode: false,
  })

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    businessName: user?.businessName || "",
    businessType: user?.businessType || "",
    businessAddress: user?.businessAddress || "",
    phoneNumber: user?.phoneNumber || "",
    workingHours: {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "17:00", closed: false },
      saturday: { open: "10:00", close: "15:00", closed: false },
      sunday: { open: "10:00", close: "15:00", closed: true },
    },
  })

  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [showLocationPermission, setShowLocationPermission] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [businessLogo, setBusinessLogo] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const [displaySettings, setDisplaySettings] = useState({
    showCustomerNames: true,
    showEstimatedWaitTime: true,
    autoRotateAnnouncements: false,
    refreshRate: "10",
  })

  // New state for modals
  const [showDisplayDeviceModal, setShowDisplayDeviceModal] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [showWorkingHoursModal, setShowWorkingHoursModal] = useState(false)
  const { t, changeLanguage } = useTranslation(settings.language)

  const [showTimePicker, setShowTimePicker] = useState<{
    isOpen: boolean
    day: string
    field: "open" | "close"
    value: string
  } | null>(null)

  // Replace these two useEffect blocks with a single, properly controlled one
  useEffect(() => {
    // Initialize language from localStorage on mount only
    const savedLanguage = localStorage.getItem("app_language")
    if (savedLanguage && !settings.language) {
      setSettings((prev) => ({
        ...prev,
        language: savedLanguage,
      }))
      changeLanguage(savedLanguage)
    }

    // Set up event listener for language changes from other components
    const handleLanguageChange = (e) => {
      const newLang = e.detail
      if (newLang !== settings.language) {
        setSettings((prev) => ({
          ...prev,
          language: newLang,
        }))
      }
    }

    window.addEventListener("languageChange", handleLanguageChange)
    return () => {
      window.removeEventListener("languageChange", handleLanguageChange)
    }
  }, []) // Empty dependency array means this only runs once on mount

  const handleToggle = (setting) => {
    if (setting === "darkMode") {
      toggleDarkMode()
    } else {
      setSettings((prev) => ({
        ...prev,
        [setting]: !prev[setting],
      }))
    }
  }

  const handleTimeoutChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      inactivityTimeout: Number.parseInt(e.target.value) || 5,
    }))
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProfileUpdate = () => {
    console.log("Profile updated:", profileData)
    setIsEditingProfile(false)
  }

  const detectLocation = () => {
    setIsDetectingLocation(true)
    setShowLocationPermission(true)
  }

  const handleLocationPermission = (allow) => {
    setShowLocationPermission(false)

    if (allow) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const lat = position.coords.latitude
              const lng = position.coords.longitude

              // Use OpenStreetMap's Nominatim API to get address from coordinates
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
                { headers: { "Accept-Language": "en" } },
              )

              if (!response.ok) {
                throw new Error("Failed to fetch address")
              }

              const data = await response.json()

              // Format the address from the response
              const address = data.address
              let formattedAddress = ""

              // Build address string from components
              if (address.building) formattedAddress += address.building + ", "
              if (address.house_number) formattedAddress += address.house_number + " "
              if (address.road) formattedAddress += address.road + ", "
              if (address.suburb) formattedAddress += address.suburb + ", "
              if (address.city || address.town || address.village)
                formattedAddress += (address.city || address.town || address.village) + ", "
              if (address.county) formattedAddress += address.county + ", "
              if (address.state) formattedAddress += address.state + ", "
              if (address.postcode) formattedAddress += address.postcode + ", "
              if (address.country) formattedAddress += address.country

              // Remove trailing comma and space if present
              formattedAddress = formattedAddress.replace(/,\s*$/, "")

              setProfileData((prev) => ({
                ...prev,
                businessAddress: formattedAddress,
              }))
            } catch (error) {
              console.error("Error getting address:", error)
              // Fallback to coordinates if geocoding fails
              setProfileData((prev) => ({
                ...prev,
                businessAddress: `Location detected (Address lookup failed)`,
              }))
            } finally {
              setIsDetectingLocation(false)
            }
          },
          (error) => {
            console.error("Error getting location:", error)
            setIsDetectingLocation(false)
            alert("Could not detect your location. Please enter manually.")
          },
          { enableHighAccuracy: true },
        )
      } else {
        setIsDetectingLocation(false)
        alert("Geolocation is not supported by your browser. Please enter address manually.")
      }
    } else {
      setIsDetectingLocation(false)
    }
  }

  // Also modify the handleLanguageChange function to avoid the page reload which can cause issues
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value

    // Don't update if it's the same language
    if (newLanguage === settings.language) return

    // Update local state
    setSettings((prev) => ({
      ...prev,
      language: newLanguage,
    }))

    // Save to localStorage
    localStorage.setItem("app_language", newLanguage)

    // Update document language attribute for accessibility
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", newLanguage.toLowerCase().split(" ")[0])
    }

    // Update translations throughout the app
    changeLanguage(newLanguage)

    // Force refresh all components that use translations
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("languageChange", { detail: newLanguage }))
    }

    // Show toast notification
    setToastMessage(`${t("language.changed")} ${newLanguage} ✅`)
    setShowToast(true)

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  // Function to handle working hours changes
  const handleWorkingHoursChange = (day, field, value) => {
    setProfileData((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: field === "closed" ? !prev.workingHours[day].closed : value,
        },
      },
    }))
  }

  // Function to show a toast message
  const showToastMessage = (message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        showToastMessage("Image size must be less than 2MB")
        return
      }

      setIsUploading(true)

      const reader = new FileReader()
      reader.onload = (event) => {
        setBusinessLogo(event.target?.result as string)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTimeSelection = (hours: number, minutes: number) => {
    if (!showTimePicker) return

    const { day, field } = showTimePicker
    const formattedHours = hours.toString().padStart(2, "0")
    const formattedMinutes = minutes.toString().padStart(2, "0")
    const timeValue = `${formattedHours}:${formattedMinutes}`

    handleWorkingHoursChange(day, field, timeValue)
    setShowTimePicker(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="flex items-center">
          <button onClick={() => router.push("/dashboard")} className="mr-3">
            <ArrowLeft size={20} className="text-blue-600 dark:text-blue-400" />
          </button>
          <h1 className="text-lg font-bold text-blue-900 dark:text-white">{t("settings.title")}</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 pb-16">
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-blue-800 dark:text-blue-300 font-medium">Profile Information</h3>
              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="text-blue-600 dark:text-blue-400 flex items-center text-sm"
                >
                  <Edit2 size={16} className="mr-1" />
                  {t("settings.edit")}
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleProfileUpdate}
                    className="text-green-600 dark:text-green-400 flex items-center text-sm"
                  >
                    <Save size={16} className="mr-1" />
                    {t("settings.save")}
                  </button>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="text-red-600 dark:text-red-400 flex items-center text-sm"
                  >
                    <X size={16} className="mr-1" />
                    {t("settings.cancel")}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Business Logo - Centered at top */}
              <div className="flex flex-col items-center my-4">
                <Avatar className="h-20 w-20 border-2 border-blue-200 dark:border-gray-600">
                  <AvatarImage src={businessLogo || ""} alt="Business logo" />
                  <AvatarFallback className="bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 text-xl">
                    <Star size={24} />
                  </AvatarFallback>
                </Avatar>

                <span className="text-sm text-blue-600 dark:text-blue-400 mt-2">Business Logo</span>

                {isEditingProfile && (
                  <div className="mt-2 flex flex-col items-center">
                    <label
                      htmlFor="logo-upload"
                      className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      {isUploading ? "Uploading..." : "Upload Business Logo"}
                    </label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG (max 2MB)</span>
                  </div>
                )}
              </div>

              {/* Full Name - Now below the business logo */}
              <div className="flex items-center">
                <User size={18} className="text-blue-500 dark:text-blue-400 mr-3" />
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    className="flex-1 border border-blue-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-2 text-sm text-blue-900 dark:text-white"
                    placeholder="Full Name"
                  />
                ) : (
                  <div>
                    <span className="text-xs text-blue-600 dark:text-blue-300">Full Name</span>
                    <p className="text-blue-900 dark:text-gray-100">{profileData.fullName || "Not provided"}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <Mail size={18} className="text-blue-500 mr-3" />
                {isEditingProfile ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="flex-1 border border-blue-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-2 text-sm text-blue-900 dark:text-white"
                    placeholder="Email Address"
                  />
                ) : (
                  <div>
                    <span className="text-xs text-blue-600 dark:text-blue-300">Email</span>
                    <p className="text-blue-900 dark:text-gray-100">{profileData.email || "Not provided"}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <Star size={18} className="text-blue-500 mr-3" />
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="businessName"
                    value={profileData.businessName}
                    onChange={handleProfileChange}
                    className="flex-1 border border-blue-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-2 text-sm text-blue-900 dark:text-white"
                    placeholder="Business Name"
                  />
                ) : (
                  <div>
                    <span className="text-xs text-blue-600 dark:text-blue-300">Business Name</span>
                    <p className="text-blue-900 dark:text-gray-100">{profileData.businessName || "Not provided"}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <BarChart2 size={18} className="text-blue-500 mr-3" />
                {isEditingProfile ? (
                  <select
                    name="businessType"
                    value={profileData.businessType}
                    onChange={handleProfileChange}
                    className="flex-1 border border-blue-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-2 text-sm text-blue-900 dark:text-white"
                  >
                    <option value="">Select Business Type</option>
                    <option value="Retail">Retail</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Banking">Banking</option>
                    <option value="Government">Government</option>
                    <option value="Education">Education</option>
                    <option value="Others">Others</option>
                  </select>
                ) : (
                  <div>
                    <span className="text-xs text-blue-600 dark:text-blue-300">Business Type</span>
                    <p className="text-blue-900 dark:text-gray-100">{profileData.businessType || "Not provided"}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <MapPin size={18} className="text-blue-500 mr-3" />
                {isEditingProfile ? (
                  <div className="flex-1 flex items-center">
                    <input
                      type="text"
                      name="businessAddress"
                      value={profileData.businessAddress}
                      onChange={handleProfileChange}
                      className="flex-1 border border-blue-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-2 text-sm text-blue-900 dark:text-white"
                      placeholder="Business Address"
                    />
                    <button
                      type="button"
                      onClick={detectLocation}
                      className="ml-2 bg-blue-100 text-blue-600 p-2 rounded-lg flex items-center text-xs"
                      disabled={isDetectingLocation}
                    >
                      <Navigation size={14} className="mr-1" />
                      {isDetectingLocation ? "Getting address..." : "Detect Location"}
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs text-blue-600 dark:text-blue-300">Business Address</span>
                    <p className="text-blue-900 dark:text-gray-100">{profileData.businessAddress || "Not provided"}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <Phone size={18} className="text-blue-500 mr-3" />
                {isEditingProfile ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleProfileChange}
                    className="flex-1 border border-blue-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-2 text-sm text-blue-900 dark:text-white"
                    placeholder="Phone Number"
                  />
                ) : (
                  <div>
                    <span className="text-xs text-blue-600 dark:text-blue-300">Phone Number</span>
                    <p className="text-blue-900 dark:text-gray-100">{profileData.phoneNumber || "Not provided"}</p>
                  </div>
                )}
              </div>

              {/* Working Hours Section */}
              <div className="flex items-center">
                <Calendar size={18} className="text-blue-500 mr-3" />
                <div className="flex-1">
                  <span className="text-xs text-blue-600 dark:text-blue-300">Working Hours</span>
                  <button
                    onClick={() => setShowWorkingHoursModal(true)}
                    className="flex items-center justify-between w-full text-blue-900 dark:text-gray-100 mt-1"
                  >
                    <p className="text-sm">
                      {profileData.workingHours.monday.closed
                        ? "Closed"
                        : (() => {
                            const openTime = profileData.workingHours.monday.open.split(":")
                            const openHour = Number.parseInt(openTime[0])
                            const openMinute = openTime[1]
                            const openIsPM = openHour >= 12
                            const displayOpenHour = openIsPM
                              ? openHour === 12
                                ? 12
                                : openHour - 12
                              : openHour === 0
                                ? 12
                                : openHour

                            const closeTime = profileData.workingHours.monday.close.split(":")
                            const closeHour = Number.parseInt(closeTime[0])
                            const closeMinute = closeTime[1]
                            const closeIsPM = closeHour >= 12
                            const displayCloseHour = closeIsPM
                              ? closeHour === 12
                                ? 12
                                : closeHour - 12
                              : closeHour === 0
                                ? 12
                                : closeHour

                            return `${displayOpenHour}:${openMinute} ${openIsPM ? "PM" : "AM"} - ${displayCloseHour}:${closeMinute} ${closeIsPM ? "PM" : "AM"}`
                          })()}{" "}
                      (Mon) •
                      {profileData.workingHours.sunday.closed
                        ? " Closed"
                        : (() => {
                            const openTime = profileData.workingHours.sunday.open.split(":")
                            const openHour = Number.parseInt(openTime[0])
                            const openMinute = openTime[1]
                            const openIsPM = openHour >= 12
                            const displayOpenHour = openIsPM
                              ? openHour === 12
                                ? 12
                                : openHour - 12
                              : openHour === 0
                                ? 12
                                : openHour

                            const closeTime = profileData.workingHours.sunday.close.split(":")
                            const closeHour = Number.parseInt(closeTime[0])
                            const closeMinute = closeTime[1]
                            const closeIsPM = closeHour >= 12
                            const displayCloseHour = closeIsPM
                              ? closeHour === 12
                                ? 12
                                : closeHour - 12
                              : closeHour === 0
                                ? 12
                                : closeHour

                            return ` ${displayOpenHour}:${openMinute} ${openIsPM ? "PM" : "AM"} - ${displayCloseHour}:${closeMinute} ${closeIsPM ? "PM" : "AM"}`
                          })()}{" "}
                      (Sun)
                    </p>
                    <ChevronRight size={16} className="text-blue-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* General Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4">
            <h3 className="text-blue-800 dark:text-blue-300 font-medium mb-3">{t("settings.general")}</h3>

            <div className="space-y-4">
              {/* Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell size={18} className="text-blue-500 dark:text-blue-400 mr-3" />
                  <span className="text-blue-900 dark:text-white">{t("settings.notifications")}</span>
                </div>
                <button
                  onClick={() => handleToggle("notifications")}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                    settings.notifications ? "bg-blue-600 justify-end" : "bg-gray-300 dark:bg-gray-600 justify-start"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-sm mx-0.5"></span>
                </button>
              </div>

              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Moon size={18} className="text-blue-500 dark:text-blue-400 mr-3" />
                  <span className="text-blue-900 dark:text-gray-100">{t("settings.darkMode")}</span>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                    darkMode ? "bg-blue-600 justify-end" : "bg-gray-300 dark:bg-gray-600 justify-start"
                  }`}
                  aria-pressed={darkMode}
                  aria-label="Toggle dark mode"
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-sm mx-0.5"></span>
                </button>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Globe size={18} className="text-blue-500 dark:text-blue-400 mr-3" />
                  <span className="text-blue-900 dark:text-gray-100">🌍 {t("settings.language")}</span>
                </div>
                <select
                  value={settings.language}
                  onChange={handleLanguageChange}
                  className="border border-blue-200 dark:border-gray-600 rounded-lg p-1 text-sm text-blue-800 dark:text-gray-100 dark:bg-gray-700"
                >
                  <option value="English">English</option>
                  <option value="हिन्दी">हिन्दी (Hindi)</option>
                  <option value="বাংলা">বাংলা (Bengali)</option>
                  <option value="తెలుగు">తెలుగు (Telugu)</option>
                  <option value="मराठी">मराठी (Marathi)</option>
                  <option value="தமிழ்">தமிழ் (Tamil)</option>
                  <option value="اردو">اردو (Urdu)</option>
                  <option value="ગુજરાતી">ગુજરાતી (Gujarati)</option>
                  <option value="ಕನ್ನಡ">ಕನ್ನಡ (Kannada)</option>
                  <option value="ଓଡ଼ିଆ">ଓଡ଼ିଆ (Odia)</option>
                  <option value="മലയാളം">മലയാളം (Malayalam)</option>
                  <option value="ਪੰਜਾਬੀ">ਪੰਜਾਬੀ (Punjabi)</option>
                  <option value="অসমীয়া">অসমীয়া (Assamese)</option>
                  <option value="मैथिली">मैथिली (Maithili)</option>
                  <option value="ᱥᱟᱱᱛᱟᱲᱤ">ᱥᱟᱱᱛᱟᱲᱤ (Santali)</option>
                </select>
              </div>

              {/* Display Device */}
              <button
                onClick={() => setShowDisplayDeviceModal(true)}
                className="w-full flex items-center justify-between py-2 text-left rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  <Monitor size={18} className="text-blue-500 dark:text-blue-400 mr-3" />
                  <div>
                    <span className="text-blue-900 dark:text-gray-100">Display Device</span>
                    <p className="text-xs text-blue-600 dark:text-blue-300">QVuew Display 1 • Connected</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-blue-500 dark:text-blue-400" />
              </button>
            </div>
          </div>

          {/* Queue Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4">
            <h3 className="text-blue-800 dark:text-blue-300 font-medium mb-3">{t("settings.queue")}</h3>

            <div className="space-y-4">
              {/* Inactivity Reminder */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock size={18} className="text-blue-500 dark:text-blue-400 mr-3" />
                  <span className="text-blue-900 dark:text-white">{t("settings.inactivityReminder")}</span>
                </div>
                <button
                  onClick={() => handleToggle("inactivityReminder")}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                    settings.inactivityReminder
                      ? "bg-blue-600 justify-end"
                      : "bg-gray-300 dark:bg-gray-600 justify-start"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-sm mx-0.5"></span>
                </button>
              </div>

              {/* Inactivity Timeout */}
              {settings.inactivityReminder && (
                <div className="flex items-center justify-between pl-7">
                  <span className="text-blue-900 dark:text-gray-100 text-sm">{t("settings.reminderAfter")}</span>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={settings.inactivityTimeout}
                      onChange={handleTimeoutChange}
                      className="w-16 border border-blue-200 dark:border-gray-600 rounded-lg p-1 text-sm text-blue-800 dark:text-gray-100 dark:bg-gray-700"
                    />
                    <span className="ml-2 text-blue-600 dark:text-blue-300 text-sm">{t("settings.minutes")}</span>
                  </div>
                </div>
              )}

              {/* Privacy Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield size={18} className="text-blue-500 dark:text-blue-400 mr-3" />
                  <span className="text-blue-900 dark:text-gray-100">{t("settings.privacyMode")}</span>
                </div>
                <button
                  onClick={() => handleToggle("privacyMode")}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                    settings.privacyMode ? "bg-blue-600 justify-end" : "bg-gray-300 justify-start"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-sm mx-0.5"></span>
                </button>
              </div>
              {settings.privacyMode && (
                <p className="text-xs text-blue-600 dark:text-blue-300 pl-7">{t("settings.privacyModeDesc")}</p>
              )}
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <h3 className="text-blue-800 dark:text-blue-300 font-medium mb-3">{t("account.title")}</h3>

            <div className="space-y-3">
              {/* About QVuew */}
              <button
                onClick={() => setShowAboutModal(true)}
                className="w-full py-2 text-left px-3 rounded-lg flex items-center justify-between text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center">
                  <Info className="mr-3" size={18} />
                  <span>About QVuew</span>
                </div>
                <ChevronRight size={18} />
              </button>

              {/* Contact Support */}
              <button
                onClick={() => setShowSupportModal(true)}
                className="w-full py-2 text-left px-3 rounded-lg flex items-center justify-between text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center">
                  <HelpCircle className="mr-3" size={18} />
                  <span>Contact Support</span>
                </div>
                <ChevronRight size={18} />
              </button>

              <button className="w-full py-2 text-left px-3 rounded-lg flex items-center text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700">
                <Shield className="mr-3" size={18} />
                <span>{t("account.privacyPolicy")}</span>
              </button>

              <button className="w-full py-2 text-left px-3 rounded-lg flex items-center text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700">
                <Globe className="mr-3" size={18} />
                <span>{t("account.termsOfService")}</span>
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("qvuew_auth")
                  router.push("/auth")
                }}
                className="w-full py-2 text-left px-3 rounded-lg flex items-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="mr-3" size={18} />
                <span>{t("account.logout")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Same as Dashboard */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-blue-100 dark:border-gray-700 p-2 z-40">
        <div className="flex justify-around">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 text-blue-400 flex flex-col items-center hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Users size={20} />
            <span className="text-xs mt-1">Queue</span>
          </button>
          <button
            onClick={() => router.push("/stats")}
            className="p-2 text-blue-400 flex flex-col items-center hover:text-blue-700 dark:hover:text-blue-300"
          >
            <BarChart2 size={20} />
            <span className="text-xs mt-1">Stats</span>
          </button>
          <button
            onClick={() => router.push("/premium")}
            className="p-2 text-blue-400 flex flex-col items-center hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Star size={20} />
            <span className="text-xs mt-1">Premium</span>
          </button>
          <button className="p-2 text-blue-800 dark:text-blue-300 flex flex-col items-center">
            <SettingsIcon size={20} />
            <span className="text-xs mt-1">Settings</span>
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("qvuew_auth")
              router.push("/auth")
            }}
            className="p-2 text-blue-400 flex flex-col items-center hover:text-blue-700 dark:hover:text-blue-300"
          >
            <LogOut size={20} />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </div>

      {/* Location Permission Dialog */}
      {showLocationPermission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 max-w-sm w-full">
            <div className="flex items-center justify-center mb-4">
              <MapPin size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-center mb-2 dark:text-white">{t("location.allow")}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">{t("location.description")}</p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleLocationPermission(false)}
                className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 dark:bg-gray-700"
              >
                {t("location.deny")}
              </button>
              <button
                onClick={() => handleLocationPermission(true)}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
              >
                {t("location.allow.button")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display Device Modal */}
      {showDisplayDeviceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium dark:text-white">Display Device</h3>
              <button
                onClick={() => setShowDisplayDeviceModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center">
                <Monitor size={24} className="text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">QVuew Display 1</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Connected • Last synced 2 minutes ago</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Display Settings</h4>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Show customer names</span>
                  <button
                    onClick={() =>
                      setDisplaySettings((prev) => ({ ...prev, showCustomerNames: !prev.showCustomerNames }))
                    }
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      displaySettings.showCustomerNames
                        ? "bg-blue-600 justify-end"
                        : "bg-gray-300 dark:bg-gray-600 justify-start"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-sm mx-0.5"></span>
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Show estimated wait time</span>
                  <button
                    onClick={() =>
                      setDisplaySettings((prev) => ({ ...prev, showEstimatedWaitTime: !prev.showEstimatedWaitTime }))
                    }
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      displaySettings.showEstimatedWaitTime
                        ? "bg-blue-600 justify-end"
                        : "bg-gray-300 dark:bg-gray-600 justify-start"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-sm mx-0.5"></span>
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Auto-rotate announcements</span>
                  <button
                    onClick={() =>
                      setDisplaySettings((prev) => ({
                        ...prev,
                        autoRotateAnnouncements: !prev.autoRotateAnnouncements,
                      }))
                    }
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      displaySettings.autoRotateAnnouncements
                        ? "bg-blue-600 justify-end"
                        : "bg-gray-300 dark:bg-gray-600 justify-start"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-sm mx-0.5"></span>
                  </button>
                </div>

                <div className="pt-2">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Display refresh rate</label>
                  <select
                    value={displaySettings.refreshRate}
                    onChange={(e) => setDisplaySettings((prev) => ({ ...prev, refreshRate: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <option value="5">Every 5 seconds</option>
                    <option value="10">Every 10 seconds</option>
                    <option value="30">Every 30 seconds</option>
                    <option value="60">Every minute</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  onClick={() => {
                    showToastMessage("Testing display connection...")
                    setTimeout(() => {
                      showToastMessage("Display connection successful!")
                    }, 2000)
                  }}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <span>Test Display Connection</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to disconnect this device?")) {
                      showToastMessage("Device disconnected successfully")
                      setShowDisplayDeviceModal(false)
                    }
                  }}
                  className="w-full py-2 border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <span>Disconnect Device</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About QVuew Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium dark:text-white">About QVuew</h3>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 bg-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">Q</span>
                </div>
              </div>

              <div className="text-center">
                <h4 className="text-xl font-bold text-blue-800 dark:text-blue-300">QVuew</h4>
                <p className="text-gray-600 dark:text-gray-400">Version 1.2.3</p>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  QVuew is a modern queue management system designed to streamline customer flow and improve service
                  efficiency.
                </p>
                <p>© 2023 QVuew Technologies. All rights reserved.</p>
              </div>

              <div className="pt-2 space-y-3">
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                  <span>Check for Updates</span>
                </button>

                <button className="w-full py-2 border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                  <ExternalLink size={16} className="mr-2" />
                  <span>Visit Website</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium dark:text-white">Contact Support</h3>
              <button
                onClick={() => setShowSupportModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                How can we help you today? Our support team is ready to assist with any questions or issues.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Subject</label>
                  <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    <option value="">Select a topic</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="account">Account Help</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Message</label>
                  <textarea
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 min-h-[100px]"
                    placeholder="Describe your issue or question..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Email for response</label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    placeholder="your@email.com"
                    defaultValue={profileData.email}
                  />
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  onClick={() => {
                    setShowSupportModal(false)
                    showToastMessage("Support request submitted successfully!")
                  }}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center"
                >
                  <span>Submit Request</span>
                </button>

                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  <p>Typical response time: 24-48 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Working Hours Modal */}
      {showWorkingHoursModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-0 max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700 z-10 bg-white dark:bg-gray-800 sticky top-0">
              <h3 className="text-lg font-medium text-blue-900 dark:text-white">Working Hours</h3>
              <button
                onClick={() => setShowWorkingHoursModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white bg-gray-100 dark:bg-gray-700 rounded-full p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 overflow-auto flex-1">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Set your business hours to help customers know when you're available.
              </p>

              <div className="space-y-3">
                {Object.entries(profileData.workingHours).map(([day, hours], index) => (
                  <div
                    key={day}
                    className={`p-3 rounded-lg ${index % 2 === 0 ? "bg-blue-50 dark:bg-blue-900/10" : "bg-white dark:bg-gray-800"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-blue-800 dark:text-blue-300 capitalize">{day}</div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`closed-${day}`}
                          checked={hours.closed}
                          onChange={() => handleWorkingHoursChange(day, "closed", !hours.closed)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        />
                        <label htmlFor={`closed-${day}`} className="text-sm text-gray-600 dark:text-gray-400">
                          Closed
                        </label>
                      </div>
                    </div>

                    {!hours.closed && (
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-col relative">
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">Open</label>
                          <button
                            type="button"
                            onClick={() => setShowTimePicker({ isOpen: true, day, field: "open", value: hours.open })}
                            className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 w-[120px] text-left"
                          >
                            {(() => {
                              const time = hours.open.split(":")
                              const hour = Number.parseInt(time[0])
                              const minute = time[1]
                              const isPM = hour >= 12
                              const displayHour = isPM ? (hour === 12 ? 12 : hour - 12) : hour === 0 ? 12 : hour
                              return `${displayHour}:${minute} ${isPM ? "PM" : "AM"}`
                            })()}
                          </button>
                        </div>
                        <div className="flex items-center justify-center h-full">
                          <span className="text-gray-500 dark:text-gray-400 mx-2">to</span>
                        </div>
                        <div className="flex flex-col relative">
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">Close</label>
                          <button
                            type="button"
                            onClick={() => setShowTimePicker({ isOpen: true, day, field: "close", value: hours.close })}
                            className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 w-[120px] text-left"
                          >
                            {(() => {
                              const time = hours.close.split(":")
                              const hour = Number.parseInt(time[0])
                              const minute = time[1]
                              const isPM = hour >= 12
                              const displayHour = isPM ? (hour === 12 ? 12 : hour - 12) : hour === 0 ? 12 : hour
                              return `${displayHour}:${minute} ${isPM ? "PM" : "AM"}`
                            })()}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 sticky bottom-0">
              <button
                onClick={() => {
                  setShowWorkingHoursModal(false)
                  showToastMessage("Working hours updated successfully!")
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center font-medium transition-colors"
              >
                <Save size={18} className="mr-2" />
                <span>Save Hours</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clock Time Picker */}
      {showTimePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 max-w-xs w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-blue-900 dark:text-white">
                Select {showTimePicker.field === "open" ? "Opening" : "Closing"} Time
              </h3>
              <button
                onClick={() => setShowTimePicker(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center">
              {/* Digital Time Display */}
              <div className="flex items-center justify-center mb-6 bg-blue-50 dark:bg-gray-700 px-6 py-4 rounded-lg shadow-sm w-full">
                <div className="text-4xl font-medium text-blue-800 dark:text-blue-300 tabular-nums">
                  {(() => {
                    const time = showTimePicker.value.split(":")
                    const hours = Number.parseInt(time[0])
                    const minutes = time[1].padStart(2, "0")
                    const isPM = hours >= 12
                    const displayHour = isPM ? (hours === 12 ? 12 : hours - 12) : hours === 0 ? 12 : hours
                    return `${displayHour}:${minutes} ${isPM ? "PM" : "AM"}`
                  })()}
                </div>
              </div>

              {/* Time Selection Controls */}
              <div className="flex items-center space-x-4 mb-6 w-full justify-center">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 text-center">Hour</label>
                  <select
                    value={(() => {
                      const hours = Number.parseInt(showTimePicker.value.split(":")[0])
                      const isPM = hours >= 12
                      return isPM ? (hours === 12 ? 12 : hours - 12) : hours === 0 ? 12 : hours
                    })()}
                    onChange={(e) => {
                      let hours = Number.parseInt(e.target.value)
                      const minutes = Number.parseInt(showTimePicker.value.split(":")[1])
                      const isPM = Number.parseInt(showTimePicker.value.split(":")[0]) >= 12

                      // Convert to 24-hour format
                      if (isPM && hours < 12) hours += 12
                      if (!isPM && hours === 12) hours = 0

                      // Update the time value but don't close the modal
                      const formattedHours = hours.toString().padStart(2, "0")
                      const formattedMinutes = minutes.toString().padStart(2, "0")
                      const timeValue = `${formattedHours}:${formattedMinutes}`

                      // Update the time picker state
                      setShowTimePicker((prev) =>
                        prev
                          ? {
                              ...prev,
                              value: timeValue,
                            }
                          : null,
                      )
                    }}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 w-16"
                  >
                    {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-xl text-blue-800 dark:text-blue-300">:</span>

                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 text-center">Minute</label>
                  <select
                    value={Number.parseInt(showTimePicker.value.split(":")[1])}
                    onChange={(e) => {
                      const hours = Number.parseInt(showTimePicker.value.split(":")[0])
                      const minutes = Number.parseInt(e.target.value)

                      // Update the time value but don't close the modal
                      const formattedHours = hours.toString().padStart(2, "0")
                      const formattedMinutes = minutes.toString().padStart(2, "0")
                      const timeValue = `${formattedHours}:${formattedMinutes}`

                      // Update the time picker state
                      setShowTimePicker((prev) =>
                        prev
                          ? {
                              ...prev,
                              value: timeValue,
                            }
                          : null,
                      )
                    }}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 w-16"
                  >
                    {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((minute) => (
                      <option key={minute} value={minute}>
                        {minute.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 text-center">AM/PM</label>
                  <select
                    value={Number.parseInt(showTimePicker.value.split(":")[0]) >= 12 ? "PM" : "AM"}
                    onChange={(e) => {
                      let hours = Number.parseInt(showTimePicker.value.split(":")[0])
                      const minutes = Number.parseInt(showTimePicker.value.split(":")[1])
                      const isPM = e.target.value === "PM"

                      // Convert between AM/PM
                      if (isPM && hours < 12) hours += 12
                      if (!isPM && hours >= 12) hours -= 12

                      // Update the time value but don't close the modal
                      const formattedHours = hours.toString().padStart(2, "0")
                      const formattedMinutes = minutes.toString().padStart(2, "0")
                      const timeValue = `${formattedHours}:${formattedMinutes}`

                      // Update the time picker state
                      setShowTimePicker((prev) =>
                        prev
                          ? {
                              ...prev,
                              value: timeValue,
                            }
                          : null,
                      )
                    }}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 w-16"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              {/* Quick time presets */}
              <div className="w-full mb-6">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">Common Times</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "9:00 AM", hour: 9, minute: 0 },
                    { label: "12:00 PM", hour: 12, minute: 0 },
                    { label: "5:00 PM", hour: 17, minute: 0 },
                    { label: "8:30 AM", hour: 8, minute: 30 },
                    { label: "1:30 PM", hour: 13, minute: 30 },
                    { label: "6:30 PM", hour: 18, minute: 30 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        // Update the time value but don't close the modal
                        const formattedHours = preset.hour.toString().padStart(2, "0")
                        const formattedMinutes = preset.minute.toString().padStart(2, "0")
                        const timeValue = `${formattedHours}:${formattedMinutes}`

                        // Update the time picker state
                        setShowTimePicker((prev) =>
                          prev
                            ? {
                                ...prev,
                                value: timeValue,
                              }
                            : null,
                        )
                      }}
                      className="py-1 px-2 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 w-full">
                <button
                  onClick={() => setShowTimePicker(null)}
                  className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const time = showTimePicker.value.split(":")
                    handleTimeSelection(Number.parseInt(time[0]), Number.parseInt(time[1]))
                  }}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Set Time
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
