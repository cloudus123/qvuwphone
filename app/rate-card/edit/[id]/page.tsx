"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Check, Info } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { getServiceSuggestions } from "@/utils/service-categories"

export default function EditServicePage() {
  const router = useRouter()
  const params = useParams()
  const serviceId = params.id

  const [service, setService] = useState({
    id: "",
    name: "",
    gender: "All",
    hours: 0,
    minutes: 15,
    rate: "",
  })

  const [existingServices, setExistingServices] = useState([])
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const [businessType, setBusinessType] = useState<string>("")
  const [serviceSuggestions, setServiceSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Load service data on mount
  useEffect(() => {
    const savedServices = localStorage.getItem("rateCardServices")
    if (savedServices) {
      try {
        const parsedServices = JSON.parse(savedServices)
        setExistingServices(parsedServices)

        // Find the service to edit
        const serviceToEdit = parsedServices.find((s) => s.id.toString() === serviceId)
        if (serviceToEdit) {
          setService(serviceToEdit)
        } else {
          // Service not found, redirect back
          router.push("/rate-card/preview")
        }
      } catch (e) {
        console.error("Error parsing saved services:", e)
        router.push("/rate-card/preview")
      }
    } else {
      // No services saved, redirect back
      router.push("/rate-card/preview")
    }
  }, [serviceId, router])

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    let timer
    if (showSuccessToast) {
      timer = setTimeout(() => {
        setShowSuccessToast(false)
      }, 3000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [showSuccessToast])

  useEffect(() => {
    // Get business type from localStorage
    const user = localStorage.getItem("qvuew_user")
    if (user) {
      try {
        const userData = JSON.parse(user)
        if (userData.businessType) {
          setBusinessType(userData.businessType)
          // Get service suggestions based on business type
          const suggestions = getServiceSuggestions(userData.businessType)
          setServiceSuggestions(suggestions)
        } else {
          // Default to "Others" category if no business type is found
          setServiceSuggestions(getServiceSuggestions("Others"))
        }
      } catch (e) {
        console.error("Error parsing user data:", e)
        // Default to "Others" category if there's an error
        setServiceSuggestions(getServiceSuggestions("Others"))
      }
    } else {
      // Default to "Others" category if no user data is found
      setServiceSuggestions(getServiceSuggestions("Others"))
    }
  }, [])

  const handleBack = () => {
    // Use router.back() instead of pushing to a specific route
    router.back()
  }

  const handleInputChange = (field, value) => {
    setService({
      ...service,
      [field]: value,
    })

    // Clear error for this field if it exists
    if (formErrors[field]) {
      const updatedErrors = { ...formErrors }
      delete updatedErrors[field]
      setFormErrors(updatedErrors)
    }
  }

  const validateForm = () => {
    const errors = {}
    let isValid = true

    if (!service.name.trim()) {
      errors.name = "Service name is required"
      isValid = false
    } else if (service.name.length < 3) {
      errors.name = "Service name must be at least 3 characters"
      isValid = false
    }

    if (!service.rate) {
      errors.rate = "Rate is required"
      isValid = false
    } else if (isNaN(service.rate) || Number(service.rate) <= 0) {
      errors.rate = "Rate must be a positive number"
      isValid = false
    }

    // Check for duplicate service names (excluding the current service)
    const isDuplicate = existingServices.some(
      (existingService) =>
        existingService.id !== service.id && existingService.name.toLowerCase() === service.name.toLowerCase(),
    )

    if (isDuplicate) {
      errors.name = "Service with this name already exists"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSaveService = () => {
    if (!validateForm()) {
      return
    }

    // Update the service in the list
    const updatedServices = existingServices.map((s) =>
      s.id === service.id
        ? {
            ...service,
            rate: Number(service.rate),
          }
        : s,
    )

    // Save to localStorage
    localStorage.setItem("rateCardServices", JSON.stringify(updatedServices))

    // Show success toast
    setShowSuccessToast(true)

    // Navigate back to rate card preview after a short delay
    setTimeout(() => {
      router.push("/rate-card/preview")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="flex items-center">
          <button onClick={handleBack} className="mr-3 text-blue-600">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-blue-900">Edit Service</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center mb-4 text-gray-600 text-sm">
            <Info size={16} className="mr-2 text-blue-500" />
            <p>Services Added: {existingServices.length} / 20</p>
          </div>

          <div className="space-y-4">
            {/* Service Name */}
            <div>
              <label htmlFor="service-name" className="block text-sm font-medium text-blue-700 mb-1">
                Service Name*
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="service-name"
                  value={service.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  className={`w-full px-3 py-2 border ${
                    formErrors.name ? "border-red-300" : "border-blue-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., Haircut, Manicure, Consultation"
                />
                {showSuggestions && serviceSuggestions.length > 0 && (
                  <div
                    className="absolute z-10 mt-1 w-full bg-white border border-blue-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {serviceSuggestions
                      .filter(
                        (suggestion) =>
                          suggestion.toLowerCase().includes(service.name.toLowerCase()) || service.name === "",
                      )
                      .map((suggestion, i) => (
                        <div
                          key={i}
                          className="px-3 py-2 cursor-pointer hover:bg-blue-50 text-blue-800 active:bg-blue-100"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleInputChange("name", suggestion)
                            setShowSuggestions(false)
                          }}
                        >
                          {suggestion}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="service-gender" className="block text-sm font-medium text-blue-700 mb-1">
                Gender
              </label>
              <select
                id="service-gender"
                value={service.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Service Duration */}
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Service Duration</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label htmlFor="service-hours" className="block text-xs text-blue-600 mb-1">
                    Hours
                  </label>
                  <select
                    id="service-hours"
                    value={service.hours}
                    onChange={(e) => handleInputChange("hours", Number(e.target.value))}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[...Array(5).keys()].map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label htmlFor="service-minutes" className="block text-xs text-blue-600 mb-1">
                    Minutes
                  </label>
                  <select
                    id="service-minutes"
                    value={service.minutes}
                    onChange={(e) => handleInputChange("minutes", Number(e.target.value))}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((minute) => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Service Rate */}
            <div>
              <label htmlFor="service-rate" className="block text-sm font-medium text-blue-700 mb-1">
                Rate (₹)*
              </label>
              <input
                type="number"
                id="service-rate"
                value={service.rate}
                onChange={(e) => handleInputChange("rate", e.target.value)}
                className={`w-full px-3 py-2 border ${
                  formErrors.rate ? "border-red-300" : "border-blue-200"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g., 500"
                min="1"
              />
              {formErrors.rate && <p className="mt-1 text-sm text-red-600">{formErrors.rate}</p>}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveService}
            className="w-full py-3 mt-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <Check size={16} className="mr-2" />
            Service updated successfully
          </div>
        </div>
      )}
    </div>
  )
}
