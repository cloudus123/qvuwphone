"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Trash2, Plus, X, Check, AlertCircle, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { getServiceSuggestions } from "@/utils/service-categories"

export default function AddServicePage() {
  const router = useRouter()
  const [existingServices, setExistingServices] = useState([])
  const [newServices, setNewServices] = useState([
    {
      id: Date.now(),
      name: "",
      gender: "All",
      hours: 0,
      minutes: 15,
      rate: "",
    },
  ])
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [showSuggestions, setShowSuggestions] = useState(Array(newServices.length).fill(false))
  const [businessType, setBusinessType] = useState<string>("")
  const [serviceSuggestions, setServiceSuggestions] = useState<string[]>([])

  // Load existing services on mount
  useEffect(() => {
    const savedServices = localStorage.getItem("rateCardServices")
    if (savedServices) {
      try {
        const parsedServices = JSON.parse(savedServices)
        setExistingServices(parsedServices)
      } catch (e) {
        console.error("Error parsing saved services:", e)
        setExistingServices([])
      }
    } else {
      setExistingServices([])
    }
  }, [])

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
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        setShowSuggestions(Array(newServices.length).fill(false))
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSuggestions, newServices.length])

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

  const handleInputChange = (index, field, value) => {
    const updatedServices = [...newServices]
    updatedServices[index][field] = value
    setNewServices(updatedServices)

    // Clear error for this field if it exists
    if (formErrors[`${index}-${field}`]) {
      const updatedErrors = { ...formErrors }
      delete updatedErrors[`${index}-${field}`]
      setFormErrors(updatedErrors)
    }
  }

  const validateServices = () => {
    const errors = {}
    let isValid = true

    newServices.forEach((service, index) => {
      // Skip validation for empty services that will be filtered out
      if (!service.name && !service.rate) {
        return
      }

      if (!service.name.trim()) {
        errors[`${index}-name`] = "Service name is required"
        isValid = false
      } else if (service.name.length < 3) {
        errors[`${index}-name`] = "Service name must be at least 3 characters"
        isValid = false
      }

      if (!service.rate) {
        errors[`${index}-rate`] = "Rate is required"
        isValid = false
      } else if (isNaN(service.rate) || Number(service.rate) <= 0) {
        errors[`${index}-rate`] = "Rate must be a positive number"
        isValid = false
      }

      // Check for duplicate service names with the same gender
      const isDuplicate = existingServices.some(
        (existingService) =>
          existingService.name.toLowerCase() === service.name.toLowerCase() &&
          existingService.gender === service.gender,
      )

      const isDuplicateInNewServices = newServices.findIndex(
        (s, i) => i !== index && s.name.toLowerCase() === service.name.toLowerCase() && s.gender === service.gender,
      )

      if (isDuplicate) {
        errors[`${index}-name`] = `Service "${service.name}" for ${service.gender} already exists`
        isValid = false
      }

      if (isDuplicateInNewServices !== -1) {
        errors[`${index}-name`] = `Duplicate service "${service.name}" for ${service.gender} in your new services`
        isValid = false
      }
    })

    setFormErrors(errors)
    return isValid
  }

  const handleAddService = () => {
    if (newServices.length >= 5) {
      setShowWarningModal(true)
      return
    }

    setNewServices([
      ...newServices,
      {
        id: Date.now(),
        name: "",
        gender: "All",
        hours: 0,
        minutes: 15,
        rate: "",
      },
    ])

    setShowSuggestions([...showSuggestions, false])
  }

  const handleRemoveService = (index) => {
    if (newServices.length === 1) {
      // Don't remove the last service form, just reset it
      setNewServices([
        {
          id: Date.now(),
          name: "",
          gender: "All",
          hours: 0,
          minutes: 15,
          rate: "",
        },
      ])
      setShowSuggestions([false])
      return
    }

    const updatedServices = newServices.filter((_, i) => i !== index)
    setNewServices(updatedServices)

    const updatedSuggestions = showSuggestions.filter((_, i) => i !== index)
    setShowSuggestions(updatedSuggestions)

    // Clear any errors for the removed service
    const updatedErrors = { ...formErrors }
    Object.keys(updatedErrors).forEach((key) => {
      if (key.startsWith(`${index}-`)) {
        delete updatedErrors[key]
      }
    })
    setFormErrors(updatedErrors)
  }

  const handleSaveServices = () => {
    // Filter out empty services
    const servicesToSave = newServices.filter((service) => service.name.trim() !== "" && service.rate !== "")

    if (servicesToSave.length === 0) {
      setFormErrors({ general: "Please fill in at least one service" })
      return
    }

    if (!validateServices()) {
      return
    }

    // Check if adding these services would exceed the 20 service limit
    if (existingServices.length + servicesToSave.length > 20) {
      setFormErrors({
        general: `You can only have up to 20 services. You currently have ${existingServices.length} and are trying to add ${servicesToSave.length} more.`,
      })
      return
    }

    // Add IDs and prepare services for saving
    const servicesWithIds = servicesToSave.map((service) => ({
      ...service,
      id: service.id || Date.now() + Math.floor(Math.random() * 1000),
      rate: Number(service.rate),
    }))

    // Combine with existing services
    const updatedServices = [...existingServices, ...servicesWithIds]

    // Save to localStorage
    localStorage.setItem("rateCardServices", JSON.stringify(updatedServices))

    // Show success toast
    const count = servicesToSave.length
    setToastMessage(`${count} service${count !== 1 ? "s" : ""} added successfully`)
    setShowSuccessToast(true)

    // Navigate back to rate card preview after a short delay
    setTimeout(() => {
      router.push("/rate-card/preview")
    }, 1000)
  }

  const remainingServices = 20 - existingServices.length

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="flex items-center">
          <button onClick={handleBack} className="mr-3 text-blue-600">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-blue-900">Add Services</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 pb-20 dark:bg-gray-900">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center mb-4 text-gray-600 text-sm">
            <Info size={16} className="mr-2 text-blue-500" />
            <p>
              You've added {existingServices.length} services. You can add {remainingServices} more.
            </p>
          </div>

          {formErrors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start">
              <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <p>{formErrors.general}</p>
            </div>
          )}

          {newServices.map((service, index) => (
            <div key={service.id} className="mb-6 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-blue-800">Service {index + 1}</h3>
                {newServices.length > 1 && (
                  <button
                    onClick={() => handleRemoveService(index)}
                    className="p-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                    aria-label="Remove service"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Service Name */}
                <div className="relative">
                  <label htmlFor={`service-name-${index}`} className="block text-sm font-medium text-blue-700 mb-1">
                    Service Name*
                  </label>
                  <input
                    type="text"
                    id={`service-name-${index}`}
                    value={service.name}
                    onChange={(e) => handleInputChange(index, "name", e.target.value)}
                    onFocus={() => {
                      const newShowSuggestions = [...showSuggestions]
                      newShowSuggestions[index] = true
                      setShowSuggestions(newShowSuggestions)
                    }}
                    className={`w-full px-3 py-2 border ${
                      formErrors[`${index}-name`] ? "border-red-300" : "border-blue-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g., Haircut, Manicure, Facial"
                  />
                  {showSuggestions[index] && (
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
                              handleInputChange(index, "name", suggestion)
                              const newShowSuggestions = [...showSuggestions]
                              newShowSuggestions[index] = false
                              setShowSuggestions(newShowSuggestions)
                            }}
                          >
                            {suggestion}
                          </div>
                        ))}
                    </div>
                  )}
                  {formErrors[`${index}-name`] && (
                    <p className="mt-1 text-sm text-red-600">{formErrors[`${index}-name`]}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor={`service-gender-${index}`} className="block text-sm font-medium text-blue-700 mb-1">
                    Gender
                  </label>
                  <select
                    id={`service-gender-${index}`}
                    value={service.gender}
                    onChange={(e) => handleInputChange(index, "gender", e.target.value)}
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
                      <label htmlFor={`service-hours-${index}`} className="block text-xs text-blue-600 mb-1">
                        Hours
                      </label>
                      <select
                        id={`service-hours-${index}`}
                        value={service.hours}
                        onChange={(e) => handleInputChange(index, "hours", Number(e.target.value))}
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
                      <label htmlFor={`service-minutes-${index}`} className="block text-xs text-blue-600 mb-1">
                        Minutes
                      </label>
                      <select
                        id={`service-minutes-${index}`}
                        value={service.minutes}
                        onChange={(e) => handleInputChange(index, "minutes", Number(e.target.value))}
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
                  <label htmlFor={`service-rate-${index}`} className="block text-sm font-medium text-blue-700 mb-1">
                    Rate (₹)*
                  </label>
                  <input
                    type="number"
                    id={`service-rate-${index}`}
                    value={service.rate}
                    onChange={(e) => handleInputChange(index, "rate", e.target.value)}
                    className={`w-full px-3 py-2 border ${
                      formErrors[`${index}-rate`] ? "border-red-300" : "border-blue-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g., 500"
                    min="1"
                  />
                  {formErrors[`${index}-rate`] && (
                    <p className="mt-1 text-sm text-red-600">{formErrors[`${index}-rate`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add Another Service Button */}
          {newServices.length < 5 && (
            <button
              onClick={handleAddService}
              className="w-full py-3 mt-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center dark:bg-green-700 dark:text-white dark:hover:bg-green-600"
            >
              <Plus size={18} className="mr-2" />
              Add Another Service
            </button>
          )}

          {/* Save Button */}
          <button
            onClick={handleSaveServices}
            className="w-full py-3 mt-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Services
          </button>
        </div>
      </div>

      {/* Warning Modal - Max 5 Services */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-4 w-80 max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-900">Maximum Limit Reached</h3>
              <button onClick={() => setShowWarningModal(false)} className="text-blue-400 hover:text-blue-600">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-blue-800">
                You can only add up to 5 services at once. Please save or remove one to continue.
              </p>
            </div>

            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <Check size={16} className="mr-2" />
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  )
}
