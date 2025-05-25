"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Lock,
  User,
  MapPin,
  Phone,
  Mail,
  Eye,
  EyeOff,
  Shield,
  Award,
  ArrowLeft,
  X,
  AlertCircle,
  Check,
  ChevronDown,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { TermsModal } from "@/components/modals/terms-modal"
import { PrivacyModal } from "@/components/modals/privacy-modal"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// Modal Component
const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-blue-100">
          <h3 className="text-lg font-bold text-blue-900">{title}</h3>
          <button onClick={onClose} className="text-blue-500 hover:text-blue-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// Country code dropdown component
const CountryCodeDropdown = ({ value, onChange }) => {
  const countryCodes = [
    { code: "+91", country: "India" },
    { code: "+1", country: "USA" },
    { code: "+44", country: "UK" },
    { code: "+971", country: "UAE" },
    { code: "+61", country: "Australia" },
    { code: "+86", country: "China" },
    { code: "+49", country: "Germany" },
    { code: "+33", country: "France" },
    { code: "+81", country: "Japan" },
    { code: "+65", country: "Singapore" },
  ]

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        className="bg-gray-100 border border-blue-200 rounded-l-xl px-3 py-3 flex items-center justify-center text-gray-700 min-w-[70px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value} <ChevronDown size={16} className="ml-1" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-blue-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto w-[200px]">
          {countryCodes.map((item) => (
            <button
              key={item.code}
              type="button"
              className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center"
              onClick={() => {
                onChange(item.code)
                setIsOpen(false)
              }}
            >
              <span className="font-medium">{item.code}</span>
              <span className="ml-2 text-gray-600 text-sm">{item.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Define validation schemas
const signUpSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .refine((val) => /^[A-Za-z\s]+$/.test(val), "Only letters and spaces allowed"),

  businessName: z
    .string()
    .min(3, "Business name must be at least 3 characters")
    .refine((val) => /^[A-Za-z0-9\s]+$/.test(val), "Only alphanumeric characters and spaces allowed"),

  businessType: z.enum(["Retail", "Restaurant", "Healthcare", "Banking", "Government", "Education", "Others"], {
    errorMap: () => ({ message: "Please select a business type" }),
  }),

  businessAddress: z
    .string()
    .min(1, "Business address is required")
    .refine((val) => /^[A-Za-z0-9\s,.]+$/.test(val), "Only alphanumeric characters, commas, dots, and spaces allowed"),

  countryCode: z.string().default("+91"),

  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => /^\d+$/.test(val), "Only digits allowed")
    .refine((val) => val.length === 10, "Phone number must be exactly 10 digits"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .refine((val) => !val.includes("gamil.com"), {
      message: "Did you mean gmail.com?",
    }),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => /[A-Z]/.test(val), "Must contain at least one uppercase letter")
    .refine((val) => /[a-z]/.test(val), "Must contain at least one lowercase letter")
    .refine((val) => /[0-9]/.test(val), "Must contain at least one number")
    .refine((val) => /[^A-Za-z0-9]/.test(val), "Must contain at least one special character"),

  confirmPassword: z.string().min(1, "Please confirm your password"),

  agreeToTerms: z.boolean().refine((val) => val === true, "You must agree to the terms"),

  verificationCode: z.array(z.string()).optional(),
})

// Add confirmPassword validation
const signUpSchemaWithConfirmation = signUpSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

// Login schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email or phone is required")
    .refine(
      (val) => {
        // Check if it's a valid email or a phone number with digits
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^\d+$/.test(val)
      },
      {
        message: "Enter a valid email or phone number",
      },
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

// Splash Screen Component
const SplashScreen = ({ goToLogin, goToSignUp }) => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow px-6 text-center">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
          <svg
            viewBox="0 0 24 24"
            width="48"
            height="48"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            <path d="M9 9h6v6H9z"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mt-4 text-blue-900">QVuew</h1>
        <p className="text-blue-700 mt-2">Your Time Matters — Manage Queues Smartly</p>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-xs space-y-4">
        <button
          onClick={goToLogin}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition duration-300"
        >
          Log In
        </button>
        <button
          onClick={goToSignUp}
          className="w-full py-3 px-4 bg-white border border-blue-600 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition duration-300"
        >
          Sign Up
        </button>
      </div>

      {/* Bottom Banner */}
      <div className="flex flex-col items-center space-y-2 mt-12">
        <div className="flex flex-row justify-center items-center space-x-2">
          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
            <Award size={14} className="text-blue-600 mr-1" />
            <span className="text-xs text-blue-800">Used by 500+ businesses</span>
          </div>
          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
            <Shield size={14} className="text-blue-600 mr-1" />
            <span className="text-xs text-blue-800">100% Secure</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Login Screen Component
const LoginScreen = ({
  goToSignUp,
  goBack,
  goToForgotPassword,
  formData,
  handleInputChange,
  handleSubmit,
  isSubmitting,
  passwordVisible,
  setPasswordVisible,
  errors,
}) => {
  return (
    <div className="flex flex-col min-h-screen p-6">
      <button onClick={goBack} className="self-start mb-6 text-blue-700 flex items-center">
        <ArrowLeft size={20} className="mr-1" />
        Back
      </button>

      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-blue-900">Welcome Back</h1>
        <p className="text-blue-600 mt-2 mb-6">Log in to your QVuew account</p>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <div className="space-y-4">
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 flex items-center">
                <Mail size={18} className="text-blue-500 flex-shrink-0" />
                <input
                  type="text"
                  name="email"
                  placeholder="Email Address or Phone"
                  className={`w-full outline-none pl-3 text-gray-800 placeholder:text-gray-500 bg-transparent ${
                    errors.email ? "text-red-500" : ""
                  }`}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="relative">
              <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 flex items-center">
                <Lock size={18} className="text-blue-500 flex-shrink-0" />
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className={`w-full outline-none pl-3 text-gray-800 placeholder:text-gray-500 bg-transparent ${
                    errors.password ? "text-red-500" : ""
                  }`}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="flex-shrink-0">
                  {passwordVisible ? (
                    <EyeOff size={18} className="text-blue-500" />
                  ) : (
                    <Eye size={18} className="text-blue-500" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={goToForgotPassword} className="text-sm text-blue-600 hover:text-blue-800">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition duration-300 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-blue-600">
              Don't have an account?{" "}
              <button type="button" onClick={goToSignUp} className="text-blue-800 font-medium hover:underline">
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

// Sign Up Step 1 - Basic Info with validation
const SignUpStep1 = ({ nextStep, formData, handleInputChange, isSubmitting, errors, register, isValid, setValue }) => {
  const [countryCode, setCountryCode] = useState(formData.countryCode || "+91")

  // Update country code in the form
  const handleCountryCodeChange = (code) => {
    setCountryCode(code)
    setValue("countryCode", code)
    handleInputChange({
      target: {
        name: "countryCode",
        value: code,
        type: "text",
      },
    })
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold text-blue-900">Create Your Account</h1>
      <p className="text-blue-600 mt-2 mb-6">Let's get started with your information</p>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (window.syncFormData) window.syncFormData()
          nextStep()
        }}
      >
        <div className="space-y-4">
          <div className="relative">
            <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 flex items-center">
              <User size={18} className="text-blue-500 flex-shrink-0" />
              <input
                type="text"
                {...register("fullName")}
                placeholder="Full Name"
                className={`w-full outline-none pl-3 text-gray-800 placeholder:text-gray-500 bg-transparent ${
                  errors.fullName ? "text-red-500" : ""
                }`}
                required
                onChange={(e) => {
                  handleInputChange({
                    target: {
                      name: "fullName",
                      value: e.target.value,
                      type: "text",
                    },
                  })
                }}
              />
              {formData.fullName && !errors.fullName && <Check size={18} className="text-green-500 flex-shrink-0" />}
            </div>
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
          </div>

          <div className="relative">
            <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 flex items-center">
              <Mail size={18} className="text-blue-500 flex-shrink-0" />
              <input
                type="email"
                {...register("email")}
                placeholder="Email Address"
                className={`w-full outline-none pl-3 text-gray-800 placeholder:text-gray-500 bg-transparent ${
                  errors.email ? "text-red-500" : ""
                }`}
                required
                onChange={(e) => {
                  handleInputChange({
                    target: {
                      name: "email",
                      value: e.target.value,
                      type: "text",
                    },
                  })
                }}
              />
              {formData.email && !errors.email && <Check size={18} className="text-green-500 flex-shrink-0" />}
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <div className="flex items-center">
              <CountryCodeDropdown value={countryCode} onChange={handleCountryCodeChange} />
              <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 border-l-0 rounded-r-xl px-3 py-3 flex-grow focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 flex items-center">
                <Phone size={18} className="text-blue-500 flex-shrink-0" />
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  placeholder="Phone Number (10 digits)"
                  className={`w-full outline-none pl-3 text-gray-800 placeholder:text-gray-500 bg-transparent ${
                    errors.phoneNumber ? "text-red-500" : ""
                  }`}
                  required
                  maxLength={10}
                  onChange={(e) => {
                    // Allow only digits and limit to 10 characters
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                    e.target.value = value
                    setValue("phoneNumber", value)
                    handleInputChange({
                      target: {
                        name: "phoneNumber",
                        value: value,
                        type: "text",
                      },
                    })
                  }}
                  onKeyPress={(e) => {
                    // Allow only digits
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                />
                {formData.phoneNumber && !errors.phoneNumber && (
                  <Check size={18} className="text-green-500 flex-shrink-0" />
                )}
              </div>
            </div>
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition duration-300"
        >
          Continue
        </button>
      </form>
    </div>
  )
}

// Sign Up Step 2 - Business Info with validation
const SignUpStep2 = ({ nextStep, formData, handleInputChange, isSubmitting, errors, register, isValid, setValue }) => {
  // Add these state variables at the beginning of the QVuewAuth component, right after the existing useState declarations:
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [showLocationPermission, setShowLocationPermission] = useState(false)

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold text-blue-900">Business Information</h1>
      <p className="text-blue-600 mt-2 mb-6">Tell us about your business</p>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (window.syncFormData) window.syncFormData()
          nextStep()
        }}
      >
        <div className="space-y-4">
          <div className="relative">
            <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 flex items-center">
              <User size={18} className="text-blue-500 flex-shrink-0" />
              <input
                type="text"
                {...register("businessName")}
                placeholder="Business Name"
                className={`w-full outline-none pl-3 text-gray-800 placeholder:text-gray-500 bg-transparent ${
                  errors.businessName ? "text-red-500" : ""
                }`}
                required
                onChange={(e) => {
                  handleInputChange({
                    target: {
                      name: "businessName",
                      value: e.target.value,
                      type: "text",
                    },
                  })
                }}
              />
              {formData.businessName && !errors.businessName && (
                <Check size={18} className="text-green-500 flex-shrink-0" />
              )}
            </div>
            {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
          </div>

          <div className="relative">
            <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 flex items-center">
              <User size={18} className="text-blue-500 flex-shrink-0" />
              <select
                {...register("businessType")}
                className={`w-full outline-none pl-3 text-gray-800 placeholder:text-gray-500 bg-transparent appearance-none ${
                  errors.businessType ? "text-red-500" : ""
                }`}
                required
                onChange={(e) => {
                  handleInputChange({
                    target: {
                      name: "businessType",
                      value: e.target.value,
                      type: "text",
                    },
                  })
                }}
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
              {formData.businessType && !errors.businessType && (
                <Check size={18} className="text-green-500 flex-shrink-0" />
              )}
            </div>
            {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType.message}</p>}
          </div>

          {/* Replace the business address input div in SignUpStep2 with this: */}
          <div className="relative">
            <div className="flex items-center border border-blue-200 rounded-xl px-3 py-3 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <MapPin size={18} className="text-blue-500 flex-shrink-0" />
              <input
                type="text"
                {...register("businessAddress")}
                placeholder="Business Address"
                className={`w-full outline-none pl-3 text-gray-800 placeholder:text-gray-500 bg-transparent ${
                  errors.businessAddress ? "text-red-500" : ""
                }`}
                required
                onChange={(e) => {
                  handleInputChange({
                    target: {
                      name: "businessAddress",
                      value: e.target.value,
                      type: "text",
                    },
                  })
                }}
                disabled={isDetectingLocation}
                value={formData.businessAddress} // Add this line to ensure the value is displayed
              />
              {formData.businessAddress && !errors.businessAddress && (
                <Check size={18} className="text-green-500 flex-shrink-0 mr-2" />
              )}
              <button
                type="button"
                onClick={() => {
                  // Set detecting location state
                  setIsDetectingLocation(true)

                  // Update UI to show loading state
                  handleInputChange({
                    target: {
                      name: "businessAddress",
                      value: "Detecting location...",
                      type: "text",
                    },
                  })

                  // Check if geolocation is supported
                  if (!navigator.geolocation) {
                    setIsDetectingLocation(false)
                    alert("Geolocation is not supported by your browser. Please enter address manually.")
                    handleInputChange({
                      target: {
                        name: "businessAddress",
                        value: formData.businessAddress || "",
                        type: "text",
                      },
                    })
                    return
                  }

                  // Show location permission dialog and get position
                  setShowLocationPermission(true)
                }}
                disabled={isDetectingLocation}
                className={`flex items-center justify-center ${
                  isDetectingLocation ? "bg-gray-100 text-gray-400" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                } rounded-lg px-3 py-1 text-xs font-medium ml-1 transition-colors`}
              >
                <MapPin size={14} className="mr-1" />
                {isDetectingLocation ? "Getting address..." : "Detect Location"}
              </button>
            </div>
            {errors.businessAddress && <p className="text-red-500 text-xs mt-1">{errors.businessAddress.message}</p>}

            {/* Location Permission Dialog */}
            {showLocationPermission && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-4">Allow Location Access</h3>
                  <p className="text-gray-600 mb-6">
                    QVuew needs access to your location to detect your business address. This helps provide accurate
                    location information for your customers.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowLocationPermission(false)
                        setIsDetectingLocation(false)
                        handleInputChange({
                          target: {
                            name: "businessAddress",
                            value: formData.businessAddress || "",
                            type: "text",
                          },
                        })
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Deny
                    </button>
                    <button
                      onClick={() => {
                        setShowLocationPermission(false)

                        // Get position with high accuracy
                        navigator.geolocation.getCurrentPosition(
                          async (position) => {
                            try {
                              const lat = position.coords.latitude
                              const lng = position.coords.longitude

                              // Store coordinates for backend use
                              console.log("Coordinates for backend:", { lat, lng })

                              // Store coordinates in a hidden field
                              handleInputChange({
                                target: {
                                  name: "businessCoordinates",
                                  value: JSON.stringify({ latitude: lat, longitude: lng }),
                                  type: "text",
                                },
                              })

                              // Use OpenStreetMap's Nominatim API to get address from coordinates
                              const response = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`,
                                { headers: { "Accept-Language": "en" } },
                              )

                              if (!response.ok) {
                                throw new Error("Failed to fetch address")
                              }

                              const data = await response.json()
                              console.log("Location data:", data)

                              // Extract all available address components
                              const address = data.address || {}

                              // Build a detailed address string with all available components
                              let formattedAddress = ""

                              // Add building/premise details
                              if (address.building) formattedAddress += address.building + ", "
                              if (address.house_number) formattedAddress += address.house_number + " "

                              // Add street information
                              if (address.road) formattedAddress += address.road + ", "
                              if (address.neighbourhood) formattedAddress += address.neighbourhood + ", "
                              if (address.suburb) formattedAddress += address.suburb + ", "

                              // Add locality information
                              if (address.city || address.town || address.village) {
                                formattedAddress += (address.city || address.town || address.village) + ", "
                              }

                              // Add administrative areas
                              if (address.county && !formattedAddress.includes(address.county)) {
                                formattedAddress += address.county + ", "
                              }
                              if (address.state && !formattedAddress.includes(address.state)) {
                                formattedAddress += address.state + ", "
                              }

                              // Add postal code and country
                              if (address.postcode) formattedAddress += address.postcode + ", "
                              if (address.country) formattedAddress += address.country

                              // Remove trailing comma and space if present
                              formattedAddress = formattedAddress.replace(/,\s*$/, "")

                              // If we have a display name but no formatted address components
                              if (!formattedAddress && data.display_name) {
                                formattedAddress = data.display_name
                              }

                              // Update the form with the detailed address
                              handleInputChange({
                                target: {
                                  name: "businessAddress",
                                  value: formattedAddress || "Location detected (Address details unavailable)",
                                  type: "text",
                                },
                              })

                              // Add this line to ensure the form field is updated:
                              setValue(
                                "businessAddress",
                                formattedAddress || "Location detected (Address details unavailable)",
                              )
                            } catch (error) {
                              console.error("Error getting address:", error)

                              // Fallback to basic coordinates if geocoding fails
                              handleInputChange({
                                target: {
                                  name: "businessAddress",
                                  value: `Location at ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
                                  type: "text",
                                },
                              })
                            } finally {
                              setIsDetectingLocation(false)
                            }
                          },
                          (error) => {
                            console.error("Geolocation error:", error)
                            setIsDetectingLocation(false)

                            // Handle specific error codes with user-friendly messages
                            let errorMessage = "Could not detect your location. Please enter your address manually."

                            if (error.code === 1) {
                              // Permission denied
                              errorMessage =
                                "Location permission denied. Please allow location access or enter your address manually."
                            } else if (error.code === 2) {
                              // Position unavailable
                              errorMessage =
                                "Your location is currently unavailable. Please try again or enter your address manually."
                            } else if (error.code === 3) {
                              // Timeout
                              errorMessage = "Location request timed out. Please check your connection and try again."
                            }

                            alert(errorMessage)

                            // Restore previous value or clear
                            handleInputChange({
                              target: {
                                name: "businessAddress",
                                value: formData.businessAddress || "",
                                type: "text",
                              },
                            })
                          },
                          // Options for high accuracy and appropriate timeout
                          {
                            enableHighAccuracy: true,
                            timeout: 15000,
                            maximumAge: 0,
                          },
                        )
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Allow
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition duration-300"
        >
          Continue
        </button>
      </form>
    </div>
  )
}

// Password strength indicator component
const PasswordStrengthIndicator = ({ password }) => {
  // Calculate password strength
  const getPasswordStrength = (password) => {
    if (!password) return 0

    let strength = 0

    // Length check
    if (password.length >= 8) strength += 1

    // Character type checks
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    return strength
  }

  const strength = getPasswordStrength(password)

  // Determine color and label based on strength
  const getStrengthInfo = (strength) => {
    if (strength === 0) return { color: "bg-gray-200", label: "" }
    if (strength <= 2) return { color: "bg-red-500", label: "Weak" }
    if (strength <= 4) return { color: "bg-yellow-500", label: "Medium" }
    return { color: "bg-green-500", label: "Strong" }
  }

  const { color, label } = getStrengthInfo(strength)

  return (
    <div className="mt-2">
      <div className="flex space-x-1 mb-1">
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className={`h-1 flex-1 rounded-full ${index <= strength ? color : "bg-gray-200"}`}></div>
        ))}
      </div>
      {label && <p className="text-xs text-gray-600">Password strength: {label}</p>}
    </div>
  )
}

// Sign Up Step 3 - Password & Terms with validation
const SignUpStep3 = ({
  showTermsModal,
  showPrivacyModal,
  formData,
  handleInputChange,
  passwordVisible,
  setPasswordVisible,
  handleSubmit,
  isSubmitting,
  errors,
  register,
  isValid,
  watch,
}) => {
  const password = watch("password", "")

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold text-blue-900">Create Password</h1>
      <p className="text-blue-600 mt-2 mb-6">Secure your account</p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="relative">
            <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 flex items-center">
              <Lock size={18} className="text-blue-500 flex-shrink-0" />
              <input
                type={passwordVisible ? "text" : "password"}
                {...register("password")}
                placeholder="Create Password"
                className={`w-full outline-none pl-3 text-gray-800 placeholder:text-gray-500 bg-transparent ${
                  errors.password ? "text-red-500" : ""
                }`}
                required
                onChange={(e) => {
                  handleInputChange({
                    target: {
                      name: "password",
                      value: e.target.value,
                      type: "text",
                    },
                  })
                }}
              />
              <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="flex-shrink-0">
                {passwordVisible ? (
                  <EyeOff size={18} className="text-blue-500" />
                ) : (
                  <Eye size={18} className="text-blue-500" />
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            <PasswordStrengthIndicator password={password} />
          </div>

          <div className="relative">
            <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 flex items-center">
              <Lock size={18} className="text-blue-500 flex-shrink-0" />
              <input
                type={passwordVisible ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Confirm Password"
                className={`w-full outline-none pl-3 text-gray-800 placeholder:text-gray-500 bg-transparent ${
                  errors.confirmPassword ? "text-red-500" : ""
                }`}
                required
                onChange={(e) => {
                  handleInputChange({
                    target: {
                      name: "confirmPassword",
                      value: e.target.value,
                      type: "text",
                    },
                  })
                }}
              />
              {formData.confirmPassword &&
                formData.password === formData.confirmPassword &&
                !errors.confirmPassword && <Check size={18} className="text-green-500 flex-shrink-0" />}
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div className="flex items-start mt-4">
            <div className="flex items-center h-5">
              <input
                id="terms"
                {...register("agreeToTerms")}
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                required
                onChange={(e) => {
                  handleInputChange({
                    target: {
                      name: "agreeToTerms",
                      checked: e.target.checked,
                      type: "checkbox",
                    },
                  })
                }}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-blue-700">
                I agree to the{" "}
                <button type="button" className="text-blue-800 underline" onClick={showTermsModal}>
                  Terms of Service
                </button>{" "}
                and{" "}
                <button type="button" className="text-blue-800 underline" onClick={showPrivacyModal}>
                  Privacy Policy
                </button>
              </label>
              {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms.message}</p>}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition duration-300"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-blue-600">
            By signing up, you agree to receive updates and notifications from QVuew
          </p>
        </div>
      </form>
    </div>
  )
}

// Sign Up Flow Component with form validation
const SignUpFlow = ({
  currentStep,
  nextStep,
  goBack,
  totalSteps,
  showTermsModal,
  showPrivacyModal,
  formData,
  handleInputChange,
  handleOTPChange,
  handleSubmit,
  isSubmitting,
  passwordVisible,
  setPasswordVisible,
}) => {
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(signUpSchemaWithConfirmation),
    mode: "onChange",
    defaultValues: {
      ...formData,
      countryCode: formData.countryCode || "+91",
    },
  })

  // Update form with external changes - only on initial render
  const isInitialRender = useRef(true)

  useEffect(() => {
    if (isInitialRender.current) {
      // On initial render, set form values from formData
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined) {
          setValue(key, formData[key])
        }
      })
      isInitialRender.current = false
    }
  }, [setValue, formData])

  const onSubmit = (data) => {
    // Ensure we have the required fields before proceeding
    const values = getValues()

    // Log the form data for debugging
    console.log("Form data before submission:", values)

    // Manually update the parent component's state with all form values
    Object.keys(values).forEach((key) => {
      if (values[key] !== undefined) {
        handleInputChange({
          target: {
            name: key,
            value: values[key],
            type: key === "agreeToTerms" ? "checkbox" : "text",
            checked: values[key],
          },
        })
      }
    })

    // Call the submit handler
    handleSubmit()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <SignUpStep1
            nextStep={nextStep}
            formData={formData}
            handleInputChange={handleInputChange}
            isSubmitting={isSubmitting}
            errors={errors}
            register={register}
            isValid={isValid}
            setValue={setValue}
          />
        )
      case 2:
        return (
          <SignUpStep2
            nextStep={nextStep}
            formData={formData}
            handleInputChange={handleInputChange}
            isSubmitting={isSubmitting}
            errors={errors}
            register={register}
            isValid={isValid}
            setValue={setValue} // Add this line
          />
        )
      case 3:
        return (
          <SignUpStep3
            showTermsModal={showTermsModal}
            showPrivacyModal={showPrivacyModal}
            formData={formData}
            handleInputChange={handleInputChange}
            passwordVisible={passwordVisible}
            setPasswordVisible={setPasswordVisible}
            handleSubmit={handleFormSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            errors={errors}
            register={register}
            isValid={isValid}
            watch={watch}
          />
        )
      default:
        return (
          <SignUpStep1
            nextStep={nextStep}
            formData={formData}
            handleInputChange={handleInputChange}
            isSubmitting={isSubmitting}
            errors={errors}
            register={register}
            isValid={isValid}
            setValue={setValue}
          />
        )
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
      <button onClick={goBack} className="self-start mb-6 text-blue-700 flex items-center">
        <ArrowLeft size={20} className="mr-1" />
        Back
      </button>

      <div className="mt-6 mb-8">
        <div className="flex justify-between mb-2">
          {[...Array(totalSteps)].map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full flex-1 mx-1 ${i + 1 <= currentStep ? "bg-blue-600" : "bg-blue-200"}`}
            ></div>
          ))}
        </div>
        <div className="text-sm text-blue-600">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      {renderStepContent()}
    </div>
  )
}

// Forgot Password Step 1 - Enter Email
const ForgotPasswordStep1 = ({ nextStep, formData, handleInputChange, isSubmitting }) => {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold text-blue-900">Forgot Password?</h1>
      <p className="text-blue-600 mt-2 mb-6">Enter your email to reset your password</p>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          nextStep()
        }}
      >
        <div className="space-y-4">
          <div className="relative">
            <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 flex items-center">
              <Mail size={18} className="text-blue-500" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl bg-white"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition duration-300 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Sending..." : "Send Verification Code"}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-blue-600">We'll send a verification code to your registered email address</p>
        </div>
      </form>
    </div>
  )
}

// Forgot Password Step 2 - Verify OTP
const ForgotPasswordStep2 = ({ nextStep, formData, handleOTPChange, isSubmitting }) => {
  const [countdown, setCountdown] = useState(60)
  const [showResendToast, setShowResendToast] = useState(false)

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleResendCode = () => {
    // Reset the countdown
    setCountdown(60)
    // Show the resend toast
    setShowResendToast(true)
    // Hide the toast after 3 seconds
    setTimeout(() => setShowResendToast(false), 3000)
    // Here you would typically call an API to resend the code
    console.log("Resending code to:", formData.email)
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold text-blue-900">Verify Your Email</h1>
      <p className="text-blue-600 mt-2 mb-6">Enter the 4-digit code sent to your email</p>

      {/* Resend Toast Notification */}
      {showResendToast && (
        <div className="mb-4 bg-green-100 text-green-700 px-4 py-3 rounded-lg shadow-md flex items-center animate-fade-in">
          <Check size={18} className="mr-2" />
          <span>Verification code resent successfully!</span>
        </div>
      )}

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          nextStep()
        }}
      >
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-3">Enter verification code</h3>
          <p className="text-xs text-blue-600 mb-3">We've sent a 4-digit code to your email address</p>
          <div className="flex justify-between gap-2">
            {[...Array(4)].map((_, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center text-lg font-bold border border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={formData.verificationCode[i]}
                onChange={(e) => handleOTPChange(i, e.target.value)}
                required
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition duration-300 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Verifying..." : "Verify Code"}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-blue-600">
            Didn't receive the code?{" "}
            {countdown > 0 ? (
              <span className="text-gray-500 font-medium">Resend Code in {countdown}s</span>
            ) : (
              <button type="button" className="text-blue-800 font-medium hover:underline" onClick={handleResendCode}>
                Resend Code
              </button>
            )}
          </p>
        </div>
      </form>
    </div>
  )
}

// Forgot Password Step 3 - Create New Password
const ForgotPasswordStep3 = ({
  goToLogin,
  formData,
  handleInputChange,
  passwordVisible,
  setPasswordVisible,
  handleSubmit,
  isSubmitting,
}) => {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold text-blue-900">Create New Password</h1>
      <p className="text-blue-600 mt-2 mb-6">Enter your new password</p>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <div className="space-y-4">
          <div className="relative">
            <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 flex items-center">
              <Lock size={18} className="text-blue-500" />
            </div>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="New Password"
              className="w-full pl-10 pr-12 py-3 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl bg-white"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? (
                <EyeOff size={18} className="text-blue-500" />
              ) : (
                <Eye size={18} className="text-blue-500" />
              )}
            </button>
          </div>

          <div className="relative">
            <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 flex items-center">
              <Lock size={18} className="text-blue-500" />
            </div>
            <input
              type={passwordVisible ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm New Password"
              className="w-full pl-10 pr-4 py-3 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl bg-white"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition duration-300 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Updating Password..." : "Update Password"}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-blue-600">
            Remember your password?{" "}
            <button type="button" onClick={goToLogin} className="text-blue-800 font-medium hover:underline">
              Log In
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}

// Forgot Password Flow Component
const ForgotPasswordFlow = ({
  currentStep,
  nextStep,
  goBack,
  goToLogin,
  totalSteps,
  formData,
  handleInputChange,
  handleOTPChange,
  handleSubmit,
  isSubmitting,
  passwordVisible,
  setPasswordVisible,
}) => {
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ForgotPasswordStep1
            nextStep={nextStep}
            formData={formData}
            handleInputChange={handleInputChange}
            isSubmitting={isSubmitting}
          />
        )
      case 2:
        return (
          <ForgotPasswordStep2
            nextStep={nextStep}
            formData={formData}
            handleOTPChange={handleOTPChange}
            isSubmitting={isSubmitting}
          />
        )
      case 3:
        return (
          <ForgotPasswordStep3
            goToLogin={goToLogin}
            formData={formData}
            handleInputChange={handleInputChange}
            passwordVisible={passwordVisible}
            setPasswordVisible={setPasswordVisible}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )
      default:
        return (
          <ForgotPasswordStep1
            nextStep={nextStep}
            formData={formData}
            handleInputChange={handleInputChange}
            isSubmitting={isSubmitting}
          />
        )
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
      <button onClick={goBack} className="self-start mb-6 text-blue-700 flex items-center">
        <ArrowLeft size={20} className="mr-1" />
        Back
      </button>

      <div className="mt-6 mb-8">
        <div className="flex justify-between mb-2">
          {[...Array(totalSteps)].map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full flex-1 mx-1 ${i + 1 <= currentStep ? "bg-blue-600" : "bg-blue-200"}`}
            ></div>
          ))}
        </div>
        <div className="text-sm text-blue-600">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      {renderStepContent()}
    </div>
  )
}

// App Component
const QVuewAuth = () => {
  const router = useRouter()
  const { isAuthenticated, login, signup, resetPassword } = useAuth()

  const [currentScreen, setCurrentScreen] = useState("splash")
  const [signUpStep, setSignUpStep] = useState(1)
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  // Add these state variables at the beginning of the QVuewAuth component, right after the existing useState declarations:
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [showLocationPermission, setShowLocationPermission] = useState(false)
  // Update the formData state to include businessCoordinates
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    businessType: "",
    businessAddress: "",
    businessCoordinates: "", // Add this line
    countryCode: "+91",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: ["", "", "", ""],
    agreeToTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  // Create a global function to sync form data before navigation
  useEffect(() => {
    window.syncFormData = () => {
      // This function will be called before navigating to the next step
      console.log("Syncing form data before navigation")
    }
    return () => {
      delete window.syncFormData
    }
  }, [])

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/connect-device")
    }
  }, [isAuthenticated, router])

  // Navigation functions
  const goToLogin = () => setCurrentScreen("login")
  const goToSignUp = () => {
    setCurrentScreen("signup")
    setSignUpStep(1)
  }
  const goToForgotPassword = () => {
    setCurrentScreen("forgotPassword")
    setForgotPasswordStep(1)
  }
  const goBack = () => {
    if (currentScreen === "signup") {
      if (signUpStep > 1) {
        setSignUpStep(signUpStep - 1)
      } else {
        setCurrentScreen("splash")
      }
    } else if (currentScreen === "forgotPassword") {
      if (forgotPasswordStep > 1) {
        setForgotPasswordStep(forgotPasswordStep - 1)
      } else {
        setCurrentScreen("login")
      }
    } else {
      setCurrentScreen("splash")
    }
  }
  const nextStep = () => {
    if (currentScreen === "signup") {
      setSignUpStep(signUpStep + 1)
    } else if (currentScreen === "forgotPassword") {
      setForgotPasswordStep(forgotPasswordStep + 1)
    }
  }

  // Form handling
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleOTPChange = (index, value) => {
    const newVerificationCode = [...formData.verificationCode]
    newVerificationCode[index] = value

    setFormData({
      ...formData,
      verificationCode: newVerificationCode,
    })

    // Auto-focus next input if value is entered
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  // Handle login submission
  const handleLogin = async () => {
    if (isSubmitting) return

    // Validate login form
    const loginFormSchema = loginSchema.safeParse(formData)
    if (!loginFormSchema.success) {
      const errors = {}
      loginFormSchema.error.errors.forEach((err) => {
        errors[err.path[0]] = err.message
      })
      setFormErrors(errors)
      return
    }

    try {
      setIsSubmitting(true)

      const result = await login({
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        // Redirect to device connection screen
        router.push("/connect-device")
      } else {
        setErrorMessage(result.error || "Login failed. Please try again.")
        setShowErrorToast(true)
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.")
      setShowErrorToast(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle signup submission
  const handleSignup = async () => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      // Log the form data being submitted
      console.log("Submitting signup form data:", formData)

      // Validate required fields before submission
      if (!formData.email || !formData.password || !formData.fullName) {
        const missingFields = []
        if (!formData.email) missingFields.push("email")
        if (!formData.password) missingFields.push("password")
        if (!formData.fullName) missingFields.push("fullName")

        setErrorMessage(`Please fill in all required fields: ${missingFields.join(", ")}`)
        setShowErrorToast(true)
        setIsSubmitting(false)
        return
      }

      // Create a simplified data object with just the required fields
      const signupData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        businessName: formData.businessName || "Default Business",
        businessType: formData.businessType || "Retail",
        businessAddress: formData.businessAddress || "Default Address",
        phoneNumber: formData.phoneNumber || "0000000000",
      }

      console.log("Simplified signup data:", signupData)

      const result = await signup(signupData)

      if (result.success) {
        // Redirect to device connection screen
        router.push("/connect-device")
      } else {
        setErrorMessage(result.error || "Signup failed. Please try again.")
        setShowErrorToast(true)
      }
    } catch (error) {
      console.error("Signup error:", error)
      setErrorMessage("An unexpected error occurred. Please try again.")
      setShowErrorToast(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle password reset
  const handleResetPassword = async () => {
    if (isSubmitting) return

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match")
      setShowErrorToast(true)
      return
    }

    try {
      setIsSubmitting(true)

      const result = await resetPassword(formData.email, formData.password)

      if (result.success) {
        setCurrentScreen("login")
        setErrorMessage("Password reset successfully. Please login with your new password.")
        setShowErrorToast(true)
      } else {
        setErrorMessage(result.error || "Password reset failed. Please try again.")
        setShowErrorToast(true)
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.")
      setShowErrorToast(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Auto-hide error toast after 5 seconds
  useEffect(() => {
    if (showErrorToast) {
      const timer = setTimeout(() => {
        setShowErrorToast(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [showErrorToast])

  // Render the current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <SplashScreen goToLogin={goToLogin} goToSignUp={goToSignUp} />
      case "login":
        return (
          <LoginScreen
            goToSignUp={goToSignUp}
            goBack={goBack}
            goToForgotPassword={goToForgotPassword}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleLogin}
            isSubmitting={isSubmitting}
            passwordVisible={passwordVisible}
            setPasswordVisible={setPasswordVisible}
            errors={formErrors}
          />
        )
      case "signup":
        return (
          <SignUpFlow
            currentStep={signUpStep}
            nextStep={nextStep}
            goBack={goBack}
            totalSteps={3}
            showTermsModal={() => setShowTermsModal(true)}
            showPrivacyModal={() => setShowPrivacyModal(true)}
            formData={formData}
            handleInputChange={handleInputChange}
            handleOTPChange={handleOTPChange}
            handleSubmit={handleSignup}
            isSubmitting={isSubmitting}
            passwordVisible={passwordVisible}
            setPasswordVisible={setPasswordVisible}
          />
        )
      case "forgotPassword":
        return (
          <ForgotPasswordFlow
            currentStep={forgotPasswordStep}
            nextStep={nextStep}
            goBack={goBack}
            goToLogin={goToLogin}
            totalSteps={3}
            formData={formData}
            handleInputChange={handleInputChange}
            handleOTPChange={handleOTPChange}
            handleSubmit={handleResetPassword}
            isSubmitting={isSubmitting}
            passwordVisible={passwordVisible}
            setPasswordVisible={setPasswordVisible}
          />
        )
      default:
        return <SplashScreen goToLogin={goToLogin} goToSignUp={goToSignUp} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      {renderScreen()}

      {/* Error Toast */}
      {showErrorToast && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center items-center animate-fade-in">
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg shadow-md flex items-center max-w-xs">
            <AlertCircle size={18} className="mr-2" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Terms and Conditions Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAgree={() => {
          setShowTermsModal(false)
          setFormData({
            ...formData,
            agreeToTerms: true,
          })
        }}
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        onAccept={() => {
          setShowPrivacyModal(false)
          setFormData({
            ...formData,
            agreeToTerms: true,
          })
        }}
      />
    </div>
  )
}

export default QVuewAuth
