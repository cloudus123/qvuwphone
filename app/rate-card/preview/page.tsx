"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Trash2, Edit, Plus, X, Check, Clock, User, IndianRupee } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RateCardPreviewPage() {
  const router = useRouter()
  const [services, setServices] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Load saved services on mount
  useEffect(() => {
    // Try to get data from localStorage first
    const savedServices = localStorage.getItem("rateCardServices")

    if (savedServices) {
      try {
        const parsedServices = JSON.parse(savedServices)
        setServices(parsedServices)
      } catch (e) {
        console.error("Error parsing saved services:", e)
        setServices([])
      }
    } else {
      setServices([])
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

  const handleEditService = (serviceId) => {
    // Navigate to edit page with the service ID
    router.push(`/rate-card/edit/${serviceId}`)
  }

  const confirmDeleteService = (service) => {
    setServiceToDelete(service)
    setShowDeleteModal(true)
  }

  const handleDeleteService = () => {
    if (serviceToDelete) {
      const newServices = services.filter((s) => s.id !== serviceToDelete.id)
      setServices(newServices)

      // Update localStorage
      localStorage.setItem("rateCardServices", JSON.stringify(newServices))

      setShowDeleteModal(false)
      setServiceToDelete(null)

      // Show success toast
      setToastMessage(`${serviceToDelete.name} has been deleted`)
      setShowSuccessToast(true)
    }
  }

  const handleAddNewService = () => {
    router.push("/rate-card/add")
  }

  const handleBack = () => {
    // Always navigate directly to the dashboard
    router.push("/dashboard")
  }

  const formatTime = (hours, minutes) => {
    let timeString = ""
    if (hours > 0) {
      timeString += `${hours} hr${hours > 1 ? "s" : ""} `
    }
    if (minutes > 0) {
      timeString += `${minutes} min`
    }
    return timeString.trim() || "0 min"
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="flex items-center">
          <button onClick={handleBack} className="mr-3 text-blue-600">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-blue-900">Your Rate Card</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 pb-20 dark:bg-gray-900">
        {services.length > 0 ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4 dark:border dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Your Services</h2>
                <div className="text-sm text-blue-600 dark:text-blue-400">Services Added: {services.length} / 20</div>
              </div>

              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-blue-900/20 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-bold text-lg text-blue-900 dark:text-blue-200">{service.name}</div>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm">
                            <Clock size={16} className="mr-1 text-blue-500 dark:text-blue-400" />
                            {formatTime(service.hours, service.minutes)}
                          </div>
                          <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm">
                            <User size={16} className="mr-1 text-blue-500 dark:text-blue-400" />
                            {service.gender}
                          </div>
                          <div className="flex items-center text-blue-800 dark:text-blue-300 font-semibold">
                            <IndianRupee size={16} className="mr-1 text-blue-600 dark:text-blue-400" />
                            {service.rate}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditService(service.id)}
                          className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
                          aria-label="Edit service"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => confirmDeleteService(service)}
                          className="p-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/50 transition-colors"
                          aria-label="Delete service"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Add Button */}
            <div className="fixed bottom-20 right-4">
              <button
                onClick={handleAddNewService}
                className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Add new service"
              >
                <Plus size={24} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 w-full max-w-md text-center dark:border dark:border-gray-700">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <IndianRupee size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-200 mb-2">No services added yet</h3>
              <p className="text-blue-600 dark:text-blue-400 mb-2">Tap the + button below to add your first service</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Services Added: 0 / 20</p>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Add Service Button for Empty State */}
      {services.length === 0 && (
        <div className="fixed bottom-20 right-4">
          <button
            onClick={handleAddNewService}
            className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
            aria-label="Add new service"
          >
            <Plus size={24} />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-4 w-80 max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-900">Delete Service</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-blue-400 hover:text-blue-600">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-blue-800">
                Are you sure you want to delete <span className="font-semibold">{serviceToDelete?.name}</span>?
              </p>
              <p className="text-blue-600 text-sm mt-2">This action cannot be undone.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteService}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
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
