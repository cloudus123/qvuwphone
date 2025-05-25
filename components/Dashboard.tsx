"use client"

import { useEffect, useState, useContext } from "react"

import {
  User,
  ArrowLeft,
  Clock,
  CheckCircle,
  SkipForward,
  ChevronRight,
  History,
  Phone,
  UserCircle,
  Users,
  Settings,
  X,
  PhoneIcon,
  Pause,
  Play,
  Trash2,
  Coffee,
  AlertTriangle,
  Plus,
  UserPlus,
  Search,
  Mic,
  MicOff,
  Star,
  LogOut,
  QrCode,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Add import for i18n
import { useTranslation } from "@/utils/i18n"

import { Download, BarChart, FileSpreadsheet, ChevronDown, ArrowUpDown, FileTextIcon, CalendarIcon } from "lucide-react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// First, import the service categories utility
import { getServiceSuggestions } from "@/utils/service-categories"

// Import AuthContext
import { AuthContext } from "@/context/AuthContext"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function Dashboard() {
  // Queue state
  const [queueActive, setQueueActive] = useState(true)
  const [currentQueue, setCurrentQueue] = useState([])
  const [expandedCustomer, setExpandedCustomer] = useState(null)
  const [showAllQueue, setShowAllQueue] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [customerHistory, setCustomerHistory] = useState([])
  const [customerDetails, setCustomerDetails] = useState(null)
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)
  const [showHistoryDetails, setShowHistoryDetails] = useState(false)
  const [historyDetailsCustomer, setHistoryDetailsCustomer] = useState(null)
  const [showCallModal, setShowCallModal] = useState(false)
  const [phoneToCall, setPhoneToCall] = useState("")
  const [showUndoModal, setShowUndoModal] = useState(false)
  const [lastRemovedCustomer, setLastRemovedCustomer] = useState(null)
  const [businessName, setBusinessName] = useState("ABC Business Services")
  const [extraMinutes, setExtraMinutes] = useState(0)
  const [stats, setStats] = useState({
    customersInQueue: 0,
    customersServed: 0,
  })

  // Update these state variables
  const [undoActions, setUndoActions] = useState([])
  const [undoCount, setUndoCount] = useState(0)
  const [undoLimit] = useState(3) // Maximum number of undos allowed
  const [undoMessage, setUndoMessage] = useState("") // Message to display in the undo modal
  const [showUndoActionsModal, setShowUndoActionsModal] = useState(false)

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const router = useRouter()

  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false)
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)
  const [showExistingCustomerForm, setShowExistingCustomerForm] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    phone: "",
    name: "",
    service: "",
    gender: "Other",
    waitTime: 15,
    notes: "",
  })
  const [searchPhone, setSearchPhone] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState("")
  const [formErrors, setFormErrors] = useState({})

  // Break-related states
  const [showBreakModal, setShowBreakModal] = useState(false)
  const [breakReason, setBreakReason] = useState("")
  const [customBreakReason, setCustomBreakReason] = useState("")
  const [breakDuration, setBreakDuration] = useState(15) // Default 15 minutes
  const [customDuration, setCustomDuration] = useState("")
  const [isOnBreak, setIsOnBreak] = useState(false)
  const [breakEndTime, setBreakEndTime] = useState(null)
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(0)
  const [showCustomReason, setShowCustomReason] = useState(false)
  const [showCustomDuration, setShowCustomDuration] = useState(false)

  // Inactivity reminder states
  const [lastActionTimestamp, setLastActionTimestamp] = useState(Date.now())
  const [showInactivityReminder, setShowInactivityReminder] = useState(false)
  const [inactivityReminderTimeout, setInactivityReminderTimeout] = useState(5) // Default 5 minutes
  const [isInactivityReminderEnabled, setIsInactivityReminderEnabled] = useState(true)
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false)

  // Download History states
  const [showDownloadHistory, setShowDownloadHistory] = useState(false)
  const [timeRange, setTimeRange] = useState("last30Days")
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false)
  const [customStartDate, setCustomStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
  const [customEndDate, setCustomEndDate] = useState(new Date())
  const [historyData, setHistoryData] = useState([])
  const [isPremiumUser, setIsPremiumUser] = useState(false) // Set to true for premium users
  const [showPrivacyToggle, setShowPrivacyToggle] = useState(false)
  const [isPrivacyEnabled, setIsPrivacyEnabled] = useState(false)

  // Add this with the other state variables
  const [showChart, setShowChart] = useState(true)

  // PDF Download Modal states
  const [showPdfDownloadModal, setShowPdfDownloadModal] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadFileName, setDownloadFileName] = useState("")

  // Excel Premium Modal states
  const [showExcelPremiumModal, setShowExcelPremiumModal] = useState(false)

  // Add this state variable after the existing state declarations
  const [businessType, setBusinessType] = useState<string>("")
  const [serviceSuggestions, setServiceSuggestions] = useState<string[]>([])

  // Inside the Dashboard component, add the translation hook
  const { t } = useTranslation()

  // Use AuthContext
  const { setUser, setIsAuthenticated } = useContext(AuthContext)

  const handleAddCustomerClick = () => {
    setShowAddCustomerModal(true)
    updateModalState(true)
    setShowNewCustomerForm(false)
    setShowExistingCustomerForm(false)
    resetCustomerForm()
  }

  const resetCustomerForm = () => {
    setNewCustomer({
      phone: "",
      name: "",
      service: "",
      gender: "Other",
      waitTime: 15,
      notes: "",
    })
    setSearchPhone("")
    setSearchResults([])
    setTranscription("")
    setFormErrors({})
    setIsRecording(false)
  }

  const handleNewCustomerClick = () => {
    setShowNewCustomerForm(true)
    setShowExistingCustomerForm(false)
  }

  const handleExistingCustomerClick = () => {
    setShowNewCustomerForm(false)
    setShowExistingCustomerForm(true)
  }

  const handlePhoneChange = (e) => {
    // Only allow numbers and limit to 15 digits
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 15)
    setNewCustomer({ ...newCustomer, phone: value })

    // Clear error when user types
    if (formErrors.phone) {
      setFormErrors({ ...formErrors, phone: "" })
    }
  }

  const handleSearchPhoneChange = (e) => {
    // Only allow numbers and limit to 15 digits
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 15)
    setSearchPhone(value)

    if (value.length >= 3) {
      // Search for matching customers
      searchCustomers(value)
    } else {
      setSearchResults([])
    }
  }

  const searchCustomers = (phoneQuery) => {
    // In a real app, this would search a database
    // For now, we'll generate some mock results based on the query
    const mockCustomers = [
      {
        id: "C201",
        name: "John Smith",
        phone: "1234567890",
        lastService: "Haircut",
        gender: "Male",
      },
      {
        id: "C202",
        name: "Maria Garcia",
        phone: "9876543210",
        lastService: "Manicure",
        gender: "Female",
      },
      {
        id: "C203",
        name: "David Lee",
        phone: "5551234567",
        lastService: "Beard Trim",
        gender: "Male",
      },
    ]

    // Filter customers whose phone contains the query
    const results = mockCustomers.filter((customer) => customer.phone.includes(phoneQuery))

    setSearchResults(results)
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const startRecording = () => {
    // In a real app, this would use the Web Speech API
    setIsRecording(true)
    setTranscription("Listening...")

    // Simulate voice recognition after 2 seconds
    setTimeout(() => {
      setTranscription("Sarah Johnson, haircut")
      setIsRecording(false)

      // Parse the transcription
      const parts = "Sarah Johnson, haircut".split(",")
      if (parts.length > 0) {
        setNewCustomer((prev) => ({
          ...prev,
          name: parts[0].trim(),
        }))
      }

      if (parts.length > 1) {
        setNewCustomer((prev) => ({
          ...prev,
          service: parts[1].trim(),
        }))
      }
    }, 2000)
  }

  const stopRecording = () => {
    setIsRecording(false)
  }

  const validateNewCustomer = () => {
    const errors = {}

    if (!newCustomer.phone || newCustomer.phone.length < 10) {
      errors.phone = "Please enter a valid phone number (at least 10 digits)"
    }

    if (!newCustomer.service) {
      errors.service = "Please select a service"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddNewCustomer = () => {
    if (!validateNewCustomer()) {
      return
    }

    // Generate a unique ID
    const customerId = `C${Date.now()}`

    // Create the new customer object
    const customer = {
      id: customerId,
      name: newCustomer.name || `Guest ${stats.customersInQueue + 1}`,
      phone: formatPhoneNumber(newCustomer.phone),
      waitTime: newCustomer.waitTime,
      joinTime: new Date(),
      estimatedTime: newCustomer.waitTime,
      status: currentQueue.length === 0 ? "current" : "waiting",
      notes: newCustomer.notes,
      gender: newCustomer.gender,
      onHold: false,
      service: newCustomer.service,
    }

    // Add to queue
    const newQueue = [...currentQueue]

    // If this is the first customer, set as current
    if (newQueue.length === 0) {
      customer.status = "current"
    }

    newQueue.push(customer)
    setCurrentQueue(newQueue)

    // Update stats
    setStats({
      ...stats,
      customersInQueue: newQueue.length,
    })

    // Show success toast
    setToastMessage(`${customer.name} added to queue`)
    setShowToast(true)

    // Close modal and reset form
    setShowAddCustomerModal(false)
    updateModalState(false)
    resetCustomerForm()
  }

  const handleSelectExistingCustomer = (customer) => {
    // Pre-fill the form with the selected customer's data
    setNewCustomer({
      phone: customer.phone.replace(/[^0-9]/g, ""),
      name: customer.name,
      service: customer.lastService,
      gender: customer.gender,
      waitTime: 15,
      notes: "Returning customer",
    })

    // Switch to new customer form to allow edits
    setShowNewCustomerForm(true)
    setShowExistingCustomerForm(false)
  }

  // Generate mock queue data on load
  useEffect(() => {
    const mockQueue = generateMockQueue()
    setCurrentQueue(mockQueue)
    setStats({
      customersInQueue: mockQueue.length,
      customersServed: 43, // Match with the dashboard example
    })
  }, [])

  // Load customer history from localStorage or generate mock data
  useEffect(() => {
    if (showHistory) {
      try {
        const savedHistory = localStorage.getItem("customerHistory")
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory)
          // Filter history for the selected date
          const filteredHistory = parsedHistory.filter((item) => {
            if (!item.timestamp) return false
            const itemDate = new Date(item.timestamp)
            return itemDate.toDateString() === selectedDate.toDateString()
          })

          if (filteredHistory.length > 0) {
            setCustomerHistory(filteredHistory)
            return
          }
        }
      } catch (e) {
        console.error("Error loading customer history:", e)
      }

      // Fallback to mock data if no saved history
      setCustomerHistory(generateMockHistory(selectedDate))
    }
  }, [showHistory, selectedDate])

  // Add this useEffect after the existing useEffects to load the business type
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
          setBusinessName(userData.businessName || "ABC Business Services")
        }
      } catch (e) {
        console.error("Error parsing user data:", e)
      }
    }
  }, [showAddCustomerModal]) // Add showAddCustomerModal as a dependency

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    let timer
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false)
      }, 3000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [showToast])

  // Countdown timer for break
  useEffect(() => {
    let timer
    if (isOnBreak && breakTimeRemaining > 0) {
      timer = setInterval(() => {
        setBreakTimeRemaining((prev) => {
          if (prev <= 1) {
            // Auto-resume when timer ends
            handleResumeFromBreak()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isOnBreak, breakTimeRemaining])

  // Inactivity reminder timer
  useEffect(() => {
    if (!isInactivityReminderEnabled || !queueActive || isOnBreak || currentQueue.length === 0 || isAnyModalOpen) {
      return
    }

    const inactivityTimer = setTimeout(
      () => {
        // Only show reminder if there's a current customer and no modals are open
        if (currentQueue.length > 0 && currentQueue[0].status === "current" && !isAnyModalOpen) {
          setShowInactivityReminder(true)
        }
      },
      inactivityReminderTimeout * 60 * 1000,
    ) // Convert minutes to milliseconds

    return () => {
      clearTimeout(inactivityTimer)
    }
  }, [
    lastActionTimestamp,
    queueActive,
    isOnBreak,
    currentQueue,
    isAnyModalOpen,
    inactivityReminderTimeout,
    isInactivityReminderEnabled,
  ])

  const generateMockQueue = () => {
    // Names are deliberately diverse to reflect a varied customer base
    const names = [
      "Sarah Johnson",
      "Michael Chen",
      "Aisha Patel",
      "Carlos Rodriguez",
      "Emma Wilson",
      "Jamal Washington",
      "Hiroshi Tanaka",
      "Sofia Garcia",
      "Aditya Sharma",
      "Olivia Smith",
      "Wei Liu",
      "Isabella Rossi",
      "Fatima Al-Hassan",
      "David Kim",
      "Zoe Miller",
    ]

    // Create between 8-12 customers in queue
    const count = Math.floor(Math.random() * 5) + 8
    const queue = []

    // Gender options
    const genders = ["Male", "Female", "Other"]

    for (let i = 0; i < count; i++) {
      const waitTime = Math.floor(Math.random() * 20) + 5 // 5-25 minutes
      queue.push({
        id: `C${100 + i}`,
        name: names[Math.floor(Math.random() * names.length)],
        waitTime,
        joinTime: new Date(Date.now() - waitTime * 60000), // Join time based on wait time
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${
          Math.floor(Math.random() * 9000) + 1000
        }`,
        estimatedTime: waitTime,
        status: i === 0 ? "current" : "waiting",
        notes: i % 3 === 0 ? "Returning customer" : "",
        gender: genders[Math.floor(Math.random() * genders.length)],
        onHold: false,
      })
    }

    return queue
  }

  // Add this function after the generateMockQueue function
  const generateMockAdditionalServices = () => {
    return [
      { name: "Beard Trim", rate: 100 },
      { name: "Hair Wash", rate: 50 },
    ]
  }

  const generateMockHistory = (date) => {
    // Create consistent but random data based on the date
    const dateString = date.toISOString().split("T")[0]
    const dateSeed = dateString.split("-").reduce((a, b) => a + Number.parseInt(b), 0)
    const rng = (n) => (((dateSeed * 9301 + 49297) % 233280) / 233280) * n

    const count = Math.floor(rng(30)) + 30 // 30-60 customers per day
    const history = []

    for (let i = 0; i < count; i++) {
      const hour = Math.floor(rng(10)) + 9 // 9am - 7pm
      const minute = Math.floor(rng(60))
      const waitTime = Math.floor(rng(25)) + 5 // 5-30 minutes
      const gender = ["Male", "Female", "Other"][Math.floor(rng(3))]
      const status = Math.random() > 0.2 ? "served" : "skipped"
      const id = `H${1000 + i}`

      history.push({
        id: id,
        name: `Customer #${i + 1}`,
        arrivalTime: `${hour}:${minute.toString().padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`,
        waitTime: `${waitTime} min`,
        status,
        gender,
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${
          Math.floor(Math.random() * 9000) + 1000
        }`,
        timestamp: new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute),
        position: i + 1,
        totalServed: count,
      })
    }

    // Sort by arrival time
    history.sort((a, b) => {
      const timeA = a.arrivalTime
      const timeB = b.arrivalTime
      return timeA.localeCompare(timeB)
    })

    return history
  }

  // Save customer history to localStorage
  const saveCustomerHistory = (history) => {
    try {
      localStorage.setItem("customerHistory", JSON.stringify(history))
    } catch (e) {
      console.error("Error saving customer history:", e)
    }
  }

  const toggleQueue = () => {
    setQueueActive(!queueActive)
  }

  const toggleCustomerDetails = (customer) => {
    // If customer doesn't have additionalServices, add mock ones for demonstration
    if (customer && customer.service && !customer.additionalServices) {
      customer.additionalServices = generateMockAdditionalServices()
    }

    setCustomerDetails(customer)
    setShowCustomerDetails(true)
  }

  const toggleHistoryDetails = (customer) => {
    setHistoryDetailsCustomer(customer)
    setShowHistoryDetails(true)
  }

  const handleNext = () => {
    // Remove the first customer and update queue
    if (currentQueue.length > 0) {
      const newQueue = [...currentQueue]
      const served = newQueue.shift()
      setLastRemovedCustomer(served)

      // Track this action for undo
      const newUndoActions = [...undoActions]
      newUndoActions.unshift({
        type: "next",
        customer: served,
        timestamp: new Date(),
      })
      // Keep only the last 3 actions
      if (newUndoActions.length > undoLimit) {
        newUndoActions.pop()
      }
      setUndoActions(newUndoActions)

      // Update the next customer to "current" status
      if (newQueue.length > 0) {
        newQueue[0].status = "current"
      }

      setCurrentQueue(newQueue)
      setStats({
        ...stats,
        customersInQueue: newQueue.length,
        customersServed: stats.customersServed + 1,
      })

      // Add to customer history with enhanced data
      const newHistory = [...customerHistory]
      // Try to get service information from localStorage if available
      let serviceInfo = null
      try {
        const savedServices = localStorage.getItem("rateCardServices")
        if (savedServices) {
          serviceInfo = JSON.parse(savedServices)[0] // Just get the first service as an example
        }
      } catch (e) {
        console.error("Error parsing service info:", e)
      }

      newHistory.unshift({
        id: `H${Date.now()}`,
        name: served.name || `Guest ${stats.customersServed + 1}`,
        arrivalTime: served.joinTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        waitTime: `${served.waitTime} min`,
        status: "served",
        gender: served.gender,
        phone: served.phone,
        timestamp: new Date(),
        position: stats.customersServed + 1,
        totalServed: stats.customersServed + 1,
        notes: served.notes || "No additional notes",
        service: serviceInfo ? serviceInfo.name : null,
        serviceRate: serviceInfo ? serviceInfo.rate : null,
      })
      setCustomerHistory(newHistory)
      saveCustomerHistory(newHistory)

      setUndoCount(0)
      setUndoMessage(`Undo opportunity: 0/${undoLimit} used`)

      // Show undo modal
      setShowUndoModal(true)
      updateModalState(true)

      // Auto-dismiss snackbar after 6.5 seconds
      setTimeout(() => {
        setShowUndoModal(false)
        updateModalState(false)
      }, 6500)

      // Show toast
      setToastMessage(`${served.name} has been served`)
      setShowToast(true)
    }

    // Update last action timestamp
    setLastActionTimestamp(Date.now())

    // Update the modal state when handling Next
    updateModalState(false)
  }

  const handleUndoNext = (actionIndex = 0) => {
    if (undoActions.length > 0) {
      const newUndoActions = [...undoActions]
      const actionToUndo = actionIndex !== undefined ? newUndoActions[actionIndex] : newUndoActions[0]

      // Remove the specific action that was undone
      if (actionIndex !== undefined) {
        newUndoActions.splice(actionIndex, 1)
      } else {
        newUndoActions.shift()
      }

      setUndoActions(newUndoActions)

      const newQueue = [...currentQueue]

      if (actionToUndo.type === "next") {
        // If there's a current customer, change status back to waiting
        if (newQueue.length > 0) {
          newQueue[0].status = "waiting"
        }

        // Add the customer back to the front
        actionToUndo.customer.status = "current"
        newQueue.unshift(actionToUndo.customer)

        setStats({
          ...stats,
          customersInQueue: newQueue.length,
          customersServed: stats.customersServed - 1,
        })

        // Remove from history if added
        const newHistory = [...customerHistory]
        const historyIndex = newHistory.findIndex(
          (h) => h.name === actionToUndo.customer.name && h.timestamp && new Date() - h.timestamp < 300000,
        ) // Within 5 minutes
        if (historyIndex !== -1) {
          newHistory.splice(historyIndex, 1)
          setCustomerHistory(newHistory)
          saveCustomerHistory(newHistory)
        }

        // Show toast
        setToastMessage(`${actionToUndo.customer.name} has been restored to queue`)
        setShowToast(true)
      } else if (actionToUndo.type === "skip") {
        // Find the skipped customer in the queue
        const currentIndex = newQueue.findIndex((c) => c.id === actionToUndo.customer.id)

        if (currentIndex !== -1) {
          // Remove from current position
          newQueue.splice(currentIndex, 1)
        }

        // Put back at original position or at the end if original position is out of bounds
        const targetIndex = Math.min(actionToUndo.originalIndex, newQueue.length)
        newQueue.splice(targetIndex, 0, actionToUndo.customer)

        // Remove from history if added
        const newHistory = [...customerHistory]
        const historyIndex = newHistory.findIndex(
          (h) =>
            h.name === actionToUndo.customer.name &&
            h.status === "skipped" &&
            h.timestamp &&
            new Date() - h.timestamp < 300000,
        ) // Within 5 minutes
        if (historyIndex !== -1) {
          newHistory.splice(historyIndex, 1)
          setCustomerHistory(newHistory)
          saveCustomerHistory(newHistory)
        }

        // Show toast
        setToastMessage(`${actionToUndo.customer.name} has been restored to original position`)
        setShowToast(true)
      }

      setCurrentQueue(newQueue)

      // Track undo count
      const newUndoCount = undoCount + 1
      setUndoCount(newUndoCount)

      // Update undo message
      setUndoMessage(`Undo ${newUndoCount}/${undoLimit} completed`)

      // Close modal if we've done all 3 undos or there are no more actions to undo
      if (newUndoCount >= undoLimit || newUndoActions.length === 0) {
        const finalMessage =
          newUndoCount >= undoLimit
            ? `Undo ${newUndoCount}/${undoLimit} completed – No more Undo available.`
            : `Undo ${newUndoCount}/${newUndoCount} completed – No more actions to undo.`

        setUndoMessage(finalMessage)

        // Auto-dismiss after showing the final message
        setTimeout(() => {
          setShowUndoModal(false)
          setShowUndoActionsModal(false)
          updateModalState(false)
          setUndoCount(0)
        }, 3000)
      }

      // Close the undo actions modal after an action is undone
      if (showUndoActionsModal) {
        setShowUndoActionsModal(false)
      }
    }
  }

  const handleRateCardClick = () => {
    // Check if there are any services in localStorage
    const savedServices = localStorage.getItem("rateCardServices")

    if (savedServices) {
      try {
        const parsedServices = JSON.parse(savedServices)
        if (Array.isArray(parsedServices) && parsedServices.length > 0) {
          // If services exist, go to preview page
          router.push("/rate-card/preview")
          return
        }
      } catch (e) {
        console.error("Error parsing saved services:", e)
      }
    }

    // If no services or error parsing, go to add service page
    router.push("/rate-card")
  }

  const handleCustomerAction = (action, customerId) => {
    // Update last action timestamp for any customer action
    setLastActionTimestamp(Date.now())

    const customerIndex = currentQueue.findIndex((c) => c.id === customerId)
    if (customerIndex === -1) return

    const newQueue = [...currentQueue]
    const customer = { ...newQueue[customerIndex] }

    switch (action) {
      case "hold":
        // Toggle hold status
        newQueue[customerIndex].onHold = true

        // Move to end of queue with "on hold" status
        const heldCustomer = { ...newQueue[customerIndex], status: "on hold" }
        newQueue.splice(customerIndex, 1)
        newQueue.push(heldCustomer)

        // Update current customer
        if (customerIndex === 0 && newQueue.length > 0) {
          newQueue[0].status = "current"
        }

        // Update customer details if showing
        if (customerDetails && customerDetails.id === customerId) {
          setCustomerDetails({ ...heldCustomer })
        }

        // Show toast
        setToastMessage(`${heldCustomer.name} has been put on hold`)
        setShowToast(true)
        break

      case "unhold":
        // Find the held customer
        const unheldCustomer = { ...newQueue[customerIndex], onHold: false, status: "waiting" }
        newQueue.splice(customerIndex, 1)

        // Place right after current customer (if there is one)
        if (newQueue.length > 0) {
          newQueue.splice(1, 0, unheldCustomer)
        } else {
          unheldCustomer.status = "current"
          newQueue.push(unheldCustomer)
        }

        // Update customer details if showing
        if (customerDetails && customerDetails.id === customerId) {
          setCustomerDetails({ ...unheldCustomer })
        }

        // Show toast
        setToastMessage(`${unheldCustomer.name} has been removed from hold`)
        setShowToast(true)
        break

      case "skip":
        // Track this action for undo
        const skippedCustomer = { ...newQueue[customerIndex] }
        const newUndoActions = [...undoActions]
        newUndoActions.unshift({
          type: "skip",
          customer: skippedCustomer,
          originalIndex: customerIndex,
          timestamp: new Date(),
        })
        // Keep only the last 3 actions
        if (newUndoActions.length > undoLimit) {
          newUndoActions.pop()
        }
        setUndoActions(newUndoActions)

        // Move to after the current customer
        if (customerIndex !== 0) {
          const customer = newQueue[customerIndex]
          newQueue.splice(customerIndex, 1)
          newQueue.splice(1, 0, customer)
        }

        // Add to customer history with enhanced data
        const newHistory = [...customerHistory]
        // Try to get service information from localStorage if available
        let serviceInfo = null
        try {
          const savedServices = localStorage.getItem("rateCardServices")
          if (savedServices) {
            serviceInfo = JSON.parse(savedServices)[0] // Just get the first service as an example
          }
        } catch (e) {
          console.error("Error parsing service info:", e)
        }

        newHistory.unshift({
          id: `H${Date.now()}`,
          name: skippedCustomer.name || `Guest ${stats.customersInQueue - customerIndex}`,
          arrivalTime: skippedCustomer.joinTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          waitTime: `${skippedCustomer.waitTime} min`,
          status: "skipped",
          gender: skippedCustomer.gender,
          phone: skippedCustomer.phone,
          timestamp: new Date(),
          position: stats.customersInQueue - customerIndex,
          totalServed: stats.customersServed,
          notes: skippedCustomer.notes || "Customer was skipped",
          service: serviceInfo ? serviceInfo.name : null,
          serviceRate: serviceInfo ? serviceInfo.rate : null,
        })
        setCustomerHistory(newHistory)
        saveCustomerHistory(newHistory)

        setUndoCount(0)
        setUndoMessage(`Undo opportunity: 0/${undoLimit} used`)
        setShowUndoModal(true)
        updateModalState(true)

        // Auto-dismiss snackbar after 6.5 seconds
        setTimeout(() => {
          setShowUndoModal(false)
          updateModalState(false)
        }, 6500)

        // Show toast
        setToastMessage(`${skippedCustomer.name} has been skipped`)
        setShowToast(true)
        break

      case "remove":
        // Remove from queue
        const removedCustomer = { ...newQueue[customerIndex] }
        newQueue.splice(customerIndex, 1)

        // Update current customer
        if (customerIndex === 0 && newQueue.length > 0) {
          newQueue[0].status = "current"
        }

        // Close details view if the removed customer was being viewed
        if (customerDetails && customerDetails.id === customerId) {
          setShowCustomerDetails(false)
        }

        // Show toast
        setToastMessage(`${removedCustomer.name} has been removed from queue`)
        setShowToast(true)
        break

      case "add-time":
        // Use the new function
        handleAddExtraTime(extraMinutes)
        break

      default:
        break
    }

    setCurrentQueue(newQueue)
    setStats({
      ...stats,
      customersInQueue: newQueue.length,
    })
  }

  const handlePhoneClick = (phone) => {
    setPhoneToCall(phone)
    setShowCallModal(true)
    updateModalState(true)
  }

  const handleCall = () => {
    // In a real app, this would use the device's phone capabilities
    window.location.href = `tel:${phoneToCall.replace(/[^0-9]/g, "")}`
    setShowCallModal(false)
    updateModalState(false)
  }

  const formatDate = (date) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }

  const handleBackToQueue = () => {
    setShowHistory(false)
    setShowAllQueue(false)
    setShowCustomerDetails(false)
    setShowHistoryDetails(false)
  }

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value)
    setSelectedDate(newDate)
    setCustomerHistory(generateMockHistory(newDate))
  }

  const handleAddExtraTime = (minutes) => {
    if (!customerDetails) return

    // Find the customer in the queue
    const customerIndex = currentQueue.findIndex((c) => c.id === customerDetails.id)
    if (customerIndex === -1) return

    const newQueue = [...currentQueue]

    // Calculate new wait time, ensuring it doesn't go below 1 minute
    const newWaitTime = Math.max(newQueue[customerIndex].waitTime + minutes, 1)
    const timeDelta = newWaitTime - newQueue[customerIndex].waitTime

    // Update the wait time for the selected customer
    newQueue[customerIndex].waitTime = newWaitTime

    // Update customer details if showing
    setCustomerDetails({
      ...customerDetails,
      waitTime: newWaitTime,
    })

    // Recalculate waiting times for all customers after the modified one
    if (timeDelta !== 0) {
      // Update all customers after this one in the queue
      for (let i = customerIndex + 1; i < newQueue.length; i++) {
        // Only update waiting customers, not those on hold
        if (newQueue[i].status !== "on hold") {
          newQueue[i].waitTime = Math.max(newQueue[i].waitTime + timeDelta, 1)
          newQueue[i].estimatedTime = Math.max((newQueue[i].estimatedTime || newQueue[i].waitTime) + timeDelta, 1)
        }
      }
    }

    // Reset extra minutes input
    setExtraMinutes(0)

    // Show toast with appropriate message
    const actionText = minutes > 0 ? "Added" : "Removed"
    const absMinutes = Math.abs(minutes)
    setToastMessage(
      `${actionText} ${absMinutes} minutes ${minutes > 0 ? "to" : "from"} ${newQueue[customerIndex].name}`,
    )
    setShowToast(true)

    // Update the queue
    setCurrentQueue(newQueue)

    // Update last action timestamp
    setLastActionTimestamp(Date.now())
  }

  const showCustomerHistoryByDate = (date) => {
    router.push("/history")
  }

  const getGenderIcon = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return <User className="text-blue-500" />
      case "female":
        return <User className="text-pink-500" />
      default:
        return <User className="text-purple-500" />
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ""
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/[^0-9]/g, "")
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    return phone
  }

  const handleTakeBreak = () => {
    const selectedReason = showCustomReason ? customBreakReason : breakReason
    const selectedDuration = showCustomDuration ? Number.parseInt(customDuration) : breakDuration

    if (!selectedReason) {
      setToastMessage("Please select a break reason")
      setShowToast(true)
      return
    }

    if (
      showCustomDuration &&
      (!customDuration || isNaN(Number.parseInt(customDuration)) || Number.parseInt(customDuration) <= 0)
    ) {
      setToastMessage("Please enter a valid duration")
      setShowToast(true)
      return
    }

    // Calculate end time
    const endTime = new Date(Date.now() + selectedDuration * 60 * 1000)
    setBreakEndTime(endTime)
    setBreakTimeRemaining(selectedDuration * 60) // Convert to seconds

    // Toggle queue to paused state
    setQueueActive(false)
    setIsOnBreak(true)

    // Show toast with break reason
    setToastMessage(`Queue paused: ${selectedReason} for ${selectedDuration} minutes`)
    setShowToast(true)

    // Reset form fields
    setShowCustomReason(false)
    setCustomBreakReason("")
    setShowCustomDuration(false)
    setCustomDuration("")

    // Close modal
    setShowBreakModal(false)
    updateModalState(false)

    setLastActionTimestamp(Date.now())
  }

  const handleResumeFromBreak = () => {
    setIsOnBreak(false)
    setQueueActive(true)
    setBreakEndTime(null)
    setBreakTimeRemaining(0)
    setToastMessage("Queue resumed")
    setShowToast(true)

    setLastActionTimestamp(Date.now())
  }

  const formatRemainingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Find the getAvailableServices function and update it to use the dynamic service suggestions

  // Find the getAvailableServices function and update it to ensure it properly uses service suggestions
  // Look for this function:
  const getAvailableServices = () => {
    // Try to get services from localStorage (Rate Card services)
    try {
      const savedServices = localStorage.getItem("rateCardServices")
      if (savedServices) {
        const services = JSON.parse(savedServices)
        if (Array.isArray(services) && services.length > 0) {
          return services
        }
      }
    } catch (e) {
      console.error("Error loading services:", e)
    }

    // If no services found in localStorage, use the service suggestions based on business type
    if (serviceSuggestions.length > 0) {
      return serviceSuggestions.map((name) => ({ name, rate: 100 + Math.floor(Math.random() * 200) }))
    }

    // Fallback options if no services found in localStorage or business type
    return [
      { name: "Haircut", rate: 200 },
      { name: "Beard Trim", rate: 100 },
      { name: "Manicure", rate: 150 },
      { name: "Pedicure", rate: 200 },
      { name: "Facial", rate: 300 },
    ]
  }

  // No changes needed to this function as it already works correctly

  // Track modal state for all modals
  const updateModalState = (isOpen) => {
    setIsAnyModalOpen(isOpen)

    // If a modal is being closed, update the last action timestamp
    if (!isOpen) {
      setLastActionTimestamp(Date.now())
    }
  }

  // Handle extending time from the inactivity reminder
  const handleExtendTimeFromReminder = () => {
    // Add 5 minutes to the current customer
    if (currentQueue.length > 0) {
      handleAddExtraTime(5)
    }
    setShowInactivityReminder(false)
    setLastActionTimestamp(Date.now())
  }

  // Handle inactivity reminder settings
  const updateInactivitySettings = (isEnabled, timeout) => {
    setIsInactivityReminderEnabled(isEnabled)
    if (timeout) {
      setInactivityReminderTimeout(timeout)
    }
    // In a real app, this would save to localStorage or a database
    setLastActionTimestamp(Date.now())
  }

  const handleDownloadHistory = () => {
    setShowDownloadHistory(true)

    // Generate mock data based on the selected time range
    generateHistoryData()
  }

  const generateHistoryData = () => {
    let startDate
    const endDate = new Date()

    switch (timeRange) {
      case "last15Days":
        startDate = new Date(endDate.getTime() - 15 * 24 * 60 * 60 * 1000)
        break
      case "last30Days":
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "last60Days":
        startDate = new Date(endDate.getTime() - 60 * 24 * 60 * 60 * 1000)
        break
      case "last90Days":
        startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case "customRange":
        startDate = customStartDate
        break
      default:
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // Generate mock data for each day in the range
    const data = []
    const currentDate = new Date(startDate)
    const names = [
      "Ajay Mehra",
      "Priya Singh",
      "Rahul Sharma",
      "Neha Patel",
      "Vikram Malhotra",
      "Ananya Desai",
      "Rajesh Kumar",
      "Sunita Verma",
      "Amit Joshi",
      "Kavita Gupta",
      "Sanjay Reddy",
      "Meera Nair",
      "Deepak Chopra",
      "Pooja Iyer",
      "Arjun Kapoor",
    ]
    const services = [
      "Haircut",
      "Beard Trim",
      "Manicure",
      "Pedicure",
      "Facial",
      "Hair Coloring",
      "Massage",
      "Waxing",
      "Styling",
      "Makeup",
    ]
    const amounts = [150, 200, 250, 300, 350, 400, 450, 500, 550, 600]

    let id = 1
    while (currentDate <= endDate) {
      // Generate 1-5 entries for each day
      const entriesCount = Math.floor(Math.random() * 5) + 1

      for (let i = 0; i < entriesCount; i++) {
        const nameIndex = Math.floor(Math.random() * names.length)
        const serviceIndex = Math.floor(Math.random() * services.length)
        const amountIndex = Math.floor(Math.random() * amounts.length)

        // Generate random hour between 9 AM and 7 PM
        const hour = Math.floor(Math.random() * 10) + 9
        const minute = Math.floor(Math.random() * 60)
        const timestamp = `${hour}:${minute.toString().padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`

        // Generate random phone and email
        const phone = `9${Math.floor(Math.random() * 900000000) + 100000000}`
        const email = `${names[nameIndex].toLowerCase().replace(" ", ".")}@example.com`

        // Random status (80% served, 20% skipped)
        const status = Math.random() < 0.8 ? "served" : "skipped"

        data.push({
          id: id++,
          date: new Date(currentDate).toISOString().split("T")[0],
          customerId: `CUST${1000 + id}`,
          name: names[nameIndex],
          service: services[serviceIndex],
          amount: amounts[amountIndex],
          phone,
          email,
          timestamp,
          status,
        })
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1)
    }

    setHistoryData(data)
  }

  const handleTimeRangeChange = (range) => {
    setTimeRange(range)
    setShowTimeRangeDropdown(false)
    generateHistoryData()
  }

  const handleDownloadPDF = () => {
    setDownloadFileName("customer_history_" + new Date().toISOString().split("T")[0] + ".pdf")
    setDownloadProgress(0)
    setShowPdfDownloadModal(true)
    updateModalState(true)

    // Simulate download progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5
      if (progress > 100) progress = 100
      setDownloadProgress(progress)

      if (progress === 100) {
        clearInterval(interval)
        // Close modal after 1 second of completion
        setTimeout(() => {
          setShowPdfDownloadModal(false)
          updateModalState(false)
          // Show success toast
          setToastMessage("PDF downloaded successfully!")
          setShowToast(true)
        }, 1000)
      }
    }, 500)
  }

  const handleDownloadExcel = () => {
    if (isPremiumUser) {
      setDownloadFileName("customer_history_" + new Date().toISOString().split("T")[0] + ".xlsx")
      setDownloadProgress(0)
      setShowPdfDownloadModal(true)
      updateModalState(true)

      // Simulate download progress
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5
        if (progress > 100) progress = 100
        setDownloadProgress(progress)

        if (progress === 100) {
          clearInterval(interval)
          // Close modal after 1 second of completion
          setTimeout(() => {
            setShowPdfDownloadModal(false)
            updateModalState(false)
            // Show success toast
            setToastMessage("Excel file downloaded successfully!")
            setShowToast(true)
          }, 1000)
        }
      }, 500)
    } else {
      setShowExcelPremiumModal(true)
      updateModalState(true)
    }
  }

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "last15Days":
        return "Last 15 Days"
      case "last30Days":
        return "Last 30 Days"
      case "last60Days":
        return "Last 60 Days"
      case "last90Days":
        return "Last 90 Days"
      case "customRange":
        return `${customStartDate.toLocaleDateString()} - ${customEndDate.toLocaleDateString()}`
      default:
        return "Last 30 Days"
    }
  }

  const getChartData = () => {
    // Group data by date and count customers
    const dateMap = new Map()

    historyData.forEach((entry) => {
      if (dateMap.has(entry.date)) {
        dateMap.set(entry.date, dateMap.get(entry.date) + 1)
      } else {
        dateMap.set(entry.date, 1)
      }
    })

    // Sort dates
    const sortedDates = Array.from(dateMap.keys()).sort()

    // For mobile view, limit the number of labels if there are too many
    const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 640
    const displayDates =
      isSmallScreen && sortedDates.length > 10
        ? sortedDates.filter((_, i) => i % 3 === 0 || i === sortedDates.length - 1)
        : sortedDates

    return {
      labels: sortedDates,
      datasets: [
        {
          label: "Customers Served",
          data: sortedDates.map((date) => dateMap.get(date)),
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          tension: 0.3,
          pointRadius: isSmallScreen ? 2 : 3,
          pointHoverRadius: isSmallScreen ? 4 : 5,
          borderWidth: isSmallScreen ? 1.5 : 2,
        },
      ],
    }
  }

  const maskData = (data, type) => {
    if (!isPrivacyEnabled) return data

    if (type === "phone") {
      // Mask middle digits of phone number
      return data.slice(0, 3) + "XXXX" + data.slice(7)
    } else if (type === "email") {
      // Mask username part of email
      const [username, domain] = data.split("@")
      return username.slice(0, 2) + "XXX" + "@" + domain
    }

    return data
  }

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
  <div className="flex flex-col space-y-3">
    {/* Logo and Business Name */}
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
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
        <div>
          <h1 className="text-lg font-bold text-blue-900">QVuew</h1>
          <p className="text-xs text-blue-600">{businessName}</p>
        </div>
      </div>
      
      {/* Queue Status Toggle - Most important control, always visible */}
      <button
        onClick={toggleQueue}
        className={`px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 ${
          queueActive
            ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white hover:bg-green-200 dark:hover:bg-green-600"
            : "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white hover:bg-red-200 dark:hover:bg-red-600"
        }`}
      >
        {queueActive ? (
          <>
            <span className="font-medium text-sm">Active</span>
            <Pause size={14} />
          </>
        ) : (
          <>
            <span className="font-medium text-sm">Paused</span>
            <Play size={14} />
          </>
        )}
      </button>
    </div>
    
    {/* Action Buttons Row */}
    <div className="flex justify-between items-center">
      <button
        onClick={handleRateCardClick}
        className="flex-1 mr-2 px-3 py-2 bg-blue-600 text-white dark:bg-blue-700 dark:text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 text-sm font-medium flex items-center justify-center"
      >
        <FileTextIcon size={16} className="mr-1" />
        Rate Card
      </button>
      <button
        onClick={() => {
          !isOnBreak && setShowBreakModal(true)
          !isOnBreak && updateModalState(true)
        }}
        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center ${
          isOnBreak
            ? "bg-orange-600 text-white dark:bg-orange-700 dark:text-white hover:bg-orange-700 dark:hover:bg-orange-600"
            : "bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-white hover:bg-orange-200 dark:hover:bg-orange-600"
        }`}
      >
        <Coffee size={16} className="mr-1" />
        {isOnBreak ? "On Break" : "Take a Break"}
      </button>
    </div>
  </div>
</header>

      {/* Main Content */}
      <div className="flex-1 p-4 pb-16 dark:bg-gray-900 dark:text-gray-100">
        {/* Overlay to prevent interactions when on break */}
        {isOnBreak && (
          <div className="fixed inset-0 bg-black dark:bg-indigo-900/70 bg-opacity-50 dark:bg-opacity-80 z-40 flex flex-col items-center justify-center backdrop-blur-sm dark:backdrop-blur-md">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-md w-full mx-4 text-center border dark:border-indigo-500/30">
              <Coffee size={40} className="mx-auto mb-3 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Queue Paused</h3>
              <div className="bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold text-2xl py-3 px-4 rounded-lg mb-4 border dark:border-indigo-700/50">
                {formatRemainingTime(breakTimeRemaining)}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You're currently on a break. Queue operations are paused until you resume.
              </p>
              <button
                onClick={handleResumeFromBreak}
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors font-medium"
              >
                Resume Now
              </button>
            </div>
          </div>
        )}
        {showHistory ? (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <button onClick={handleBackToQueue} className="text-blue-600 flex items-center text-sm font-medium">
                <ArrowLeft size={16} className="mr-1" />
                Back to Queue
              </button>
              <h2 className="text-xl font-bold text-blue-800">Customer History</h2>
            </div>

            {/* Date Selector */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <label className="text-blue-800 font-medium mb-2 block">Select Date</label>
              <div className="flex items-center gap-2">
                <CalendarIcon size={18} className="text-blue-500" />
                <input
                  type="date"
                  value={selectedDate.toISOString().split("T")[0]}
                  onChange={handleDateChange}
                  className="border border-blue-200 rounded-lg p-2 flex-1"
                />
              </div>
              <div className="text-blue-600 font-medium mt-4">{formatDate(selectedDate)}</div>
            </div>

            {/* History List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-3 bg-blue-50 text-blue-700 border-b border-blue-100 font-medium flex justify-between items-center">
                <div>Customers Served: {customerHistory.length}</div>
                <div className="text-sm">
                  {selectedDate.toLocaleDateString() === new Date().toLocaleDateString() ? "Today" : "Selected Date"}
                </div>
              </div>

              <div className="divide-y divide-blue-100 max-h-[calc(100vh-320px)] overflow-y-auto">
                {customerHistory.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-4 hover:bg-blue-50 transition-colors cursor-pointer active:bg-blue-100"
                    onClick={() => toggleHistoryDetails(customer)}
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm">
                        {getGenderIcon(customer.gender)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold text-blue-900 flex items-center">
                              {customer.name}
                              <span className="text-xs bg-blue-50 text-blue-600 ml-2 px-2 py-0.5 rounded-full">
                                {customer.position}/{customer.totalServed}
                              </span>
                            </div>
                            <div className="text-blue-600 text-sm mt-1 flex items-center">
                              <Clock size={14} className="mr-1 text-blue-400" />
                              {formatTimestamp(customer.timestamp)}
                              <span className="mx-2">•</span>
                              <span>Wait: {customer.waitTime}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                customer.status === "served"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {customer.status === "served" ? (
                                <span className="flex items-center">
                                  <CheckCircle size={14} className="mr-1" />
                                  Served
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <SkipForward size={14} className="mr-1" />
                                  Skipped
                                </span>
                              )}
                            </div>
                            <ChevronRight size={16} className="ml-2 text-blue-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {customerHistory.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <History size={24} className="text-blue-400" />
                    </div>
                    <p className="text-blue-500 font-medium">No customer history found for this date</p>
                    <p className="text-blue-400 text-sm mt-1">Customer actions will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : showAllQueue ? (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <button onClick={handleBackToQueue} className="text-blue-600 flex items-center text-sm font-medium">
                <ArrowLeft size={16} className="mr-1" />
                Back to Queue
              </button>
              <h2 className="text-xl font-bold text-blue-800">Full Queue</h2>
            </div>

            {/* Queue List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="p-3 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-white border-b border-blue-100 dark:border-blue-800 font-medium">
                Customers in Queue: {currentQueue.length}
              </div>

              <div className="divide-y divide-blue-100 max-h-96 overflow-y-auto">
                {currentQueue.map((customer, index) => (
                  <div key={customer.id} className={`p-4 ${customer.status === "current" ? "bg-gray-50 dark:bg-gray-800/60" : "dark:bg-gray-800/40"}`}>
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full ${
                            customer.status === "current"
                              ? "bg-green-500"
                              : customer.status === "on hold"
                                ? "bg-yellow-500"
                                : "bg-blue-400"
                          } text-white flex items-center justify-center text-xs font-bold mr-2`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-blue-900">{customer.name}</div>
                          <div className="text-sm text-blue-600">Est. wait: {customer.waitTime} min</div>
                          <div className="text-sm text-blue-600">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePhoneClick(customer.phone)
                              }}
                              className="p-1.5 bg-blue-50 dark:bg-blue-800/60 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-700/80 transition-colors"
                            >
                              {customer.phone}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {customer.status === "current" && (
                          <button
                            onClick={handleNext}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
                          >
                            Next
                          </button>
                        )}
                        <button
                          onClick={() => {
                            // Ensure we're setting the customer details and showing the details view
                            setCustomerDetails(customer)
                            setShowCustomerDetails(true)
                            setShowAllQueue(false) // Close the queue view to show details
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                          >
                          Details
                        </button>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-2">
                      {customer.onHold ? (
                        <button
                          onClick={() => handleCustomerAction("unhold", customer.id)}
                          className="flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs hover:bg-blue-100"
                        >
                          <Play size={12} className="mr-1" />
                          Unhold
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCustomerAction("hold", customer.id)}
                          className="flex items-center px-2 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-xs hover:bg-yellow-100"
                        >
                          <Pause size={12} className="mr-1" />
                          Hold
                        </button>
                      )}
                      <button
                        onClick={() => handleCustomerAction("skip", customer.id)}
                        className="flex items-center px-2 py-1 bg-blue-50 dark:bg-purple-800/60 text-blue-700 dark:text-purple-100 rounded-lg text-xs hover:bg-blue-100 dark:hover:bg-purple-700/80"
                      >
                        <SkipForward size={12} className="mr-1" />
                        Skip
                      </button>
                      <button
                        onClick={() => handleCustomerAction("remove", customer.id)}
                        className="flex items-center px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs hover:bg-red-100"
                      >
                        <Trash2 size={12} className="mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : showCustomerDetails ? (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <button onClick={handleBackToQueue} className="text-blue-600 flex items-center text-sm font-medium">
                <ArrowLeft size={16} className="mr-1" />
                Back to Queue
              </button>
              <h2 className="text-xl font-bold text-blue-800">Customer Details</h2>
            </div>

            {/* Customer Details Card */}
            {customerDetails && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-100 dark:border-blue-800">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-blue-900 dark:text-white text-lg">{customerDetails.name}</div>
                    <div
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        customerDetails.status === "current"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                          : customerDetails.status === "on hold"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                      }`}
                    >
                      {customerDetails.status === "current"
                        ? "Current"
                        : customerDetails.status === "on hold"
                          ? "On Hold"
                          : "In Queue"}
                    </div>
                  </div>
                </div>

                {/* Update the div with className="p-4 space-y-4" and its child elements to improve dark mode styling: */}
                <div className="p-4 space-y-4 dark:text-gray-100">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-blue-800 dark:text-blue-300 font-medium mb-2">Contact Information</h3>
                    <div className="flex items-center mb-2">
                      <Phone size={16} className="text-blue-500 mr-2" />
                      <button
                        className="text-blue-800 dark:text-blue-200 hover:underline"
                        onClick={() => handlePhoneClick(customerDetails.phone)}
                      >
                        {customerDetails.phone}
                      </button>
                    </div>
                    <div className="flex items-center mb-2">
                      <User size={16} className="text-blue-500 mr-2" />
                      <div className="text-blue-800 dark:text-blue-200">Gender: {customerDetails.gender}</div>
                    </div>
                  </div>

                  {/* Queue Information */}
                  <div>
                    <h3 className="text-blue-800 dark:text-blue-300 font-medium mb-2">Queue Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 bg-blue-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-blue-600 dark:text-blue-300">Queue Position</span>
                        <span className="text-blue-900 dark:text-gray-100 font-medium">
                          {currentQueue.findIndex((c) => c.id === customerDetails.id) + 1}
                        </span>
                      </div>
                      <div className="flex justify-between p-2 bg-blue-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-blue-600 dark:text-blue-300">Join Time</span>
                        <span className="text-blue-900 dark:text-gray-100 font-medium">
                          {customerDetails.joinTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="flex justify-between p-2 bg-blue-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-blue-600 dark:text-blue-300">Estimated Wait</span>
                        <span className="text-blue-900 dark:text-gray-100 font-medium">{customerDetails.waitTime} minutes</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Information */}
                  <div>
                    <h3 className="text-blue-800 dark:text-blue-300 font-medium mb-2">Service Information</h3>
                    <div className="space-y-2 text-sm">
                      {customerDetails.service ? (
                        <>
                          <div className="flex justify-between p-2 bg-blue-50 dark:bg-gray-700/50 rounded-lg">
                            <span className="text-blue-600 dark:text-blue-300">Requested Service</span>
                            <span className="text-blue-900 dark:text-gray-100 font-medium">{customerDetails.service}</span>
                          </div>

                          {(() => {
                            // Try to get service rate from available services
                            const services = getAvailableServices()
                            const serviceObj = services.find((s) => s.name === customerDetails.service)
                            const rate = serviceObj ? serviceObj.rate : 0

                            return rate ? (
                              <div className="flex justify-between p-2 bg-blue-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="text-blue-600 dark:text-blue-300">Service Rate</span>
                                <span className="text-blue-900 dark:text-gray-100 font-medium">₹{rate}</span>
                              </div>
                            ) : null
                          })()}

                          {/* Mock additional services for demonstration */}
                          {!customerDetails.additionalServices && (
                            <div className="p-2 bg-blue-50 dark:bg-gray-700/50 rounded-lg">
                              <div className="text-blue-600 dark:text-blue-300 mb-1">Additional Services</div>
                              <div className="flex justify-between mt-1">
                                <span className="dark:text-gray-200">Beard Trim</span>
                                <span className="font-medium dark:text-gray-200">₹100</span>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="dark:text-gray-200">Hair Wash</span>
                                <span className="font-medium dark:text-gray-200">₹50</span>
                              </div>
                            </div>
                          )}

                          {/* Display additional services if available */}
                          {customerDetails.additionalServices && customerDetails.additionalServices.length > 0 && (
                            <div className="p-2 bg-blue-50 dark:bg-gray-700/50 rounded-lg">
                              <div className="text-blue-600 dark:text-blue-300 mb-1">Additional Services</div>
                              {customerDetails.additionalServices.map((service, index) => (
                                <div key={index} className="flex justify-between mt-1">
                                  <span>{service.name}</span>
                                  <span className="font-medium">₹{service.rate}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <span className="text-green-600 dark:text-green-400 font-medium">Total Charges</span>
                            <span className="text-green-700 dark:text-green-300 font-bold">
                              ₹{(() => {
                                const services = getAvailableServices()
                                const mainService = services.find((s) => s.name === customerDetails.service)
                                const mainRate = mainService ? mainService.rate : 0

                                // If we have additional services, use them, otherwise use mock data
                                const additionalTotal = customerDetails.additionalServices
                                  ? customerDetails.additionalServices.reduce(
                                      (sum, service) => sum + (service.rate || 0),
                                      0,
                                    )
                                  : 150 // 100 for Beard Trim + 50 for Hair Wash

                                return mainRate + additionalTotal
                              })()}
                            </span>
                          </div>
                        </>
                      ) : (
                        
                        <div className="space-y-2 bg-blue-50 dark:bg-gray-800/60 rounded-lg border border-blue-100 dark:border-gray-700 p-3">
                          <h4 className="text-blue-700 dark:text-blue-300 font-medium">Requested Services</h4>
                          <div className="space-y-1">
                            {(() => {
                              // Get available services from rate card
                              const availableServices = getAvailableServices()

                              // Generate 2-4 random services
                              const numServices = Math.floor(Math.random() * 3) + 2 // 2 to 4 services
                              const selectedServices = []
                              let totalCharges = 0

                              // Select random services without duplicates
                              for (let i = 0; i < numServices && i < availableServices.length; i++) {
                                const randomIndex = Math.floor(Math.random() * availableServices.length)
                                const service = availableServices[randomIndex]

                                // Check if service is already selected
                                if (!selectedServices.some((s) => s.name === service.name)) {
                                  selectedServices.push(service)
                                  totalCharges += service.rate
                                } else {
                                  // Try again if we got a duplicate
                                  i--
                                }
                              }

                              return (
                                <>
                                  {selectedServices.map((service, index) => (
                                    <div key={index} className="flex justify-between">
                                      <span className="text-blue-600 dark:text-blue-300">
                                        {index + 1}. {service.name}
                                      </span>
                                      <span className="text-blue-800 dark:text-blue-200 font-medium">₹ {service.rate}</span>
                                    </div>
                                  ))}
                                  <div className="mt-3 pt-2 border-t border-blue-200 dark:border-gray-600 flex justify-between">
                                    <span className="text-blue-700 dark:text-blue-300 font-medium">Total Service Charges</span>
                                    <span className="text-blue-900 dark:text-blue-100 font-bold">₹ {totalCharges}</span>
                                  </div>
                                </>
                              )
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add Extra Time */}
                  <div>
                    <h3 className="text-blue-800 dark:text-blue-300 font-medium mb-2">Add Extra Time</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAddExtraTime(-10)}
                          className="px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800/60"
                        >
                          -10 min
                        </button>
                        <button
                          onClick={() => handleAddExtraTime(-5)}
                          className="px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800/60"
                        >
                          -5 min
                        </button>
                        <button
                          onClick={() => handleAddExtraTime(5)}
                          className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800/60"
                        >
                          +5 min
                        </button>
                        <button
                          onClick={() => handleAddExtraTime(10)}
                          className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800/60"
                        >
                          +10 min
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAddExtraTime(-15)}
                          className="px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800/60"
                        >
                          -15 min
                        </button>
                        <button
                          onClick={() => handleAddExtraTime(15)}
                          className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800/60"
                        >
                          +15 min
                        </button>
                        <button
                          onClick={() => handleAddExtraTime(30)}
                          className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800/60"
                        >
                          +30 min
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="-60"
                          max="120"
                          value={extraMinutes}
                          onChange={(e) => setExtraMinutes(Number.parseInt(e.target.value) || 0)}
                          className="border border-blue-200 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg p-2 w-20"
                          placeholder="Min"
                        />
                        <button
                          onClick={() => handleAddExtraTime(extraMinutes)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium ${
                            extraMinutes > 0
                              ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/60"
                              : extraMinutes < 0
                                ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/60"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          }`}
                          disabled={extraMinutes === 0}
                        >
                          {extraMinutes > 0 ? "Add" : extraMinutes < 0 ? "Remove" : "Add"} Minutes
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Customer History Placeholder */}
                  <div>
                    <h3 className="text-blue-800 dark:text-blue-300 font-medium mb-2">Recent History</h3>
                    <div className="p-3 text-center bg-blue-50 dark:bg-gray-700/50 rounded-lg border border-blue-100 dark:border-gray-600">
                      {customerDetails.notes ? (
                        <p className="text-blue-700">{customerDetails.notes}</p>
                      ) : (
                        <p className="text-blue-500 italic">No recent activity found</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-2">
                    {customerDetails.onHold ? (
                      <button
                        onClick={() => handleCustomerAction("unhold", customerDetails.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg mr-2 hover:bg-blue-100 dark:hover:bg-blue-900/60"
                      >
                        <Play size={16} />
                        <span>Unhold</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCustomerAction("hold", customerDetails.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-yellow-50 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 rounded-lg mr-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/60"
                      >
                        <Pause size={16} />
                        <span>Hold</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleCustomerAction("skip", customerDetails.id)}
                      className="flex items-center px-2 py-1 bg-blue-50 dark:bg-purple-800/60 text-blue-700 dark:text-purple-100 rounded-lg text-xs hover:bg-blue-100 dark:hover:bg-purple-700/80"
                      >
                      <SkipForward size={16} />
                      <span>Skip</span>
                    </button>
                    <button
                      onClick={() => handleCustomerAction("remove", customerDetails.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg ml-2 hover:bg-red-100 dark:hover:bg-red-900/60"
                    >
                      <Trash2 size={16} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (showHistoryDetails ? (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowHistoryDetails(false)}
                className="text-blue-600 flex items-center text-sm font-medium"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to History
              </button>
              <h2 className="text-xl font-bold text-blue-800">Customer Details</h2>
            </div>

            {/* Customer History Details Card */}
            {historyDetailsCustomer && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden animate-fade-in">
                <div className="p-4 bg-blue-50 border-b border-blue-100">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-blue-900 text-lg flex items-center">
                      {historyDetailsCustomer.name}
                      <span className="text-xs bg-blue-100 text-blue-700 ml-2 px-2 py-0.5 rounded-full">
                        #{historyDetailsCustomer.position}
                      </span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        historyDetailsCustomer.status === "served"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {historyDetailsCustomer.status === "served" ? (
                        <span className="flex items-center">
                          <CheckCircle size={14} className="mr-1" />
                          Served
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <SkipForward size={14} className="mr-1" />
                          Skipped
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Customer Information */}
                  <div>
                    <h3 className="text-blue-800 font-medium mb-3">Customer Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <UserCircle size={18} className="text-blue-500 mr-3" />
                        <div>
                          <div className="text-sm text-blue-600">Position</div>
                          <div className="text-blue-900 font-medium">
                            {historyDetailsCustomer.position} of {historyDetailsCustomer.totalServed} customers
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <Phone size={18} className="text-blue-500 mr-3" />
                        <div>
                          <div className="text-sm text-blue-600">Phone Number</div>
                          <div className="text-blue-900 font-medium">{historyDetailsCustomer.phone}</div>
                        </div>
                      </div>

                      <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <User size={18} className="text-blue-500 mr-3" />
                        <div>
                          <div className="text-sm text-blue-600">Gender</div>
                          <div className="text-blue-900 font-medium">
                            {historyDetailsCustomer.gender || "Not specified"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Time Information */}
                  <div>
                    <h3 className="text-blue-800 font-medium mb-3">Time Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <Clock size={18} className="text-blue-500 mr-3" />
                        <div>
                          <div className="text-sm text-blue-600">Arrival Time</div>
                          <div className="text-blue-900 font-medium">{historyDetailsCustomer.arrivalTime}</div>
                        </div>
                      </div>

                      <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <History size={18} className="text-blue-500 mr-3" />
                        <div>
                          <div className="text-sm text-blue-600">Wait Duration</div>
                          <div className="text-blue-900 font-medium">{historyDetailsCustomer.waitTime}</div>
                        </div>
                      </div>

                      <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <CheckCircle size={18} className="text-blue-500 mr-3" />
                        <div>
                          <div className="text-sm text-blue-600">
                            {historyDetailsCustomer.status === "served" ? "Served Time" : "Skipped Time"}
                          </div>
                          <div className="text-blue-900 font-medium">
                            {formatTimestamp(historyDetailsCustomer.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Information - Only show if available */}
                  {historyDetailsCustomer.service && (
                    <div>
                      <h3 className="text-blue-800 font-medium mb-3">Service Information</h3>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-600">Service Availed</div>
                        <div className="text-blue-900 font-medium">{historyDetailsCustomer.service}</div>
                        {historyDetailsCustomer.serviceRate && (
                          <div className="text-blue-700 text-sm mt-1">Rate: ₹{historyDetailsCustomer.serviceRate}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes - Only show if available */}
                  {historyDetailsCustomer.notes && (
                    <div>
                      <h3 className="text-blue-800 font-medium mb-3">Notes</h3>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-blue-700">{historyDetailsCustomer.notes}</div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => setShowHistoryDetails(false)}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Back to History
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Regular HomeScreen View
          <>
            <div className="mb-6 dark:bg-gray-900 dark:text-gray-100 dark:rounded-lg dark:p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-800 dark:text-white">Current Queue</h2>
                <button
                  onClick={handleNext}
                  className="px-4 py-1.5 bg-blue-600 dark:bg-blue-700 text-white rounded-lg shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition flex items-center gap-1"
                  disabled={currentQueue.length === 0}
                >
                  <span>Next Customer</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* First customer highlighted */}
              {currentQueue.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-4 overflow-hidden">
                  <div className="p-3 bg-blue-600 dark:bg-blue-700 text-white font-medium flex justify-between items-center">
                    <div className="flex items-center">
                      <span>Current Customer</span>
                    </div>
                    <div className="text-sm bg-blue-500 dark:bg-blue-600 px-2 py-0.5 rounded-full">
                      Wait: {currentQueue[0].waitTime} min
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-blue-900 dark:text-white text-lg">{currentQueue[0].name}</div>
                        <div className="text-blue-600 dark:text-blue-300 text-sm mt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePhoneClick(currentQueue[0].phone)
                            }}
                            className="hover:underline"
                          >
                            {currentQueue[0].phone}
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setCustomerDetails(currentQueue[0])
                            setShowCustomerDetails(true)
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                        >
                          Details
                        </button>
                        <button
                          onClick={handleNext}
                          className="px-3 py-1 bg-green-100 dark:bg-green-700 text-green-700 dark:text-white rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-600"
                        >
                          Next
                        </button>
                      </div>
                    </div>

                    {/* Notes if any */}
                    {currentQueue[0].notes && (
                      <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/40 rounded-lg text-sm text-blue-700 dark:text-blue-200">
                        <span className="font-medium">Note:</span> {currentQueue[0].notes}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Next in queue */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-3 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-100 border-b border-blue-100 dark:border-blue-800 font-medium flex justify-between items-center">
                  <div>Next in Queue</div>
                  <button onClick={() => setShowAllQueue(true)} className="text-sm text-blue-600 dark:text-blue-300 hover:underline">
                    View All
                  </button>
                </div>

                <div className="divide-y divide-blue-100">
                  {currentQueue.slice(1, 4).map((customer, index) => (
                    <div key={customer.id} className="p-3 hover:bg-blue-50 transition-colors">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full bg-blue-400 text-white flex items-center justify-center text-xs font-bold mr-2">
                            {index + 2}
                          </div>
                          <div>
                            <div className="font-medium text-blue-900">{customer.name}</div>
                            <div className="text-sm text-blue-600">Est. wait: {customer.waitTime} min</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePhoneClick(customer.phone)
                            }}
                            className="p-1.5 bg-blue-50 dark:bg-blue-800/60 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-700/80 transition-colors"
                          >
                            <PhoneIcon size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setCustomerDetails(customer)
                              setShowCustomerDetails(true)
                            }}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {currentQueue.length <= 1 && (
                    <div className="p-4 text-center text-blue-500">No customers waiting in queue</div>
                  )}

                  {currentQueue.length > 4 && (
                    <div className="p-2 border-t border-blue-100">
                      <button
                        onClick={() => setShowAllQueue(true)}
                        className="w-full py-2 text-center text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium"
                      >
                        View All ({currentQueue.length - 1} customers)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats and Actions */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <h3 className="text-blue-800 dark:text-white font-medium mb-2">Today's Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                    <span className="text-blue-600 dark:text-blue-200">In Queue</span>
                    <span className="text-blue-900 dark:text-white font-medium">{stats.customersInQueue}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                    <span className="text-blue-600 dark:text-blue-200">Served</span>
                    <span className="text-blue-900 dark:text-white font-medium">{stats.customersServed}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <h3 className="text-blue-800 dark:text-white font-medium mb-2">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => showCustomerHistoryByDate(new Date())}
                    className="p-2 bg-blue-50 dark:bg-blue-800 text-blue-700 dark:text-blue-100 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-700 flex items-center justify-center mb-2"
                  >
                    <History size={14} className="mr-1" />
                    Customer History
                  </button>
                  <button
                    onClick={() => handleDownloadHistory()}
                    className="p-2 bg-blue-50 dark:bg-blue-800 text-blue-700 dark:text-blue-100 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-700 flex items-center justify-center mb-2"
                  >
                    <Download size={14} className="mr-1" />
                    Download History
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
\
      {/* Download History Modal */}
      {showDownloadHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart size={20} className="mr-2 text-blue-600" />
                Download Customer History
              </h3>
              <button
                onClick={() => setShowDownloadHistory(false)}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Time Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Select Time Range</label>
                <div className="relative">
                  <button
                    onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
                    className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <span className="flex items-center">
                      <CalendarIcon size={16} className="mr-2 text-blue-500" />
                      {getTimeRangeLabel()}
                    </span>
                    <ChevronDown size={16} />
                  </button>
                  
                  {showTimeRangeDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
                      <ul className="py-1">
                        <li>
                          <button
                            onClick={() => handleTimeRangeChange("last15Days")}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 flex items-center"
                          >
                            Last 15 Days
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleTimeRangeChange("last30Days")}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 flex items-center"
                          >
                            Last 30 Days
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleTimeRangeChange("last60Days")}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 flex items-center"
                          >
                            Last 60 Days
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleTimeRangeChange("last90Days")}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 flex items-center"
                          >
                            Last 90 Days
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setTimeRange("customRange")
                              setShowTimeRangeDropdown(false)
                              // Show date picker UI here
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 flex items-center"
                          >
                            Custom Range
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                
                {timeRange === "customRange" && (
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={customStartDate.toISOString().split('T')[0]}
                        onChange={(e) => {
                          setCustomStartDate(new Date(e.target.value))
                          generateHistoryData()
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={customEndDate.toISOString().split('T')[0]}
                        onChange={(e) => {
                          setCustomEndDate(new Date(e.target.value))
                          generateHistoryData()
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
                
                {/* Privacy Toggle */}
                <div className="mt-3 flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isPrivacyEnabled}
                        onChange={() => setIsPrivacyEnabled(!isPrivacyEnabled)}
                      />
                      <div className={`block w-10 h-6 rounded-full ${isPrivacyEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isPrivacyEnabled ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-700">Mask sensitive data (phone/email)</span>
                  </label>
                </div>
              </div>
              
              {/* Trend Visualization */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-base font-medium text-gray-800">Customer Flow Trend</h4>
                  <button 
                    onClick={() => setShowChart(!showChart)} 
                    className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-white rounded-md flex items-center"
                  >
                    {showChart ? (
                      <>
                        <ChevronDown size={14} className="mr-1" />
                        Hide Chart
                      </>
                    ) : (
                      <>
                        <ChevronRight size={14} className="mr-1" />
                        Show Chart
                      </>
                    )}
                  </button>
                </div>
                
                {showChart && (
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 overflow-hidden">
                    <div className="h-48 sm:h-64">
                      {historyData.length > 0 ? (
                        <Line 
                          data={getChartData()} 
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: true,
                                position: 'top',
                                labels: {
                                  boxWidth: 12,
                                  padding: 10,
                                  font: {
                                    size: 11
                                  }
                                }
                              },
                              tooltip: {
                                titleFont: {
                                  size: 12
                                },
                                bodyFont: {
                                  size: 11
                                },
                                padding: 8,
                                displayColors: false
                              }
                            },
                            scales: {
                              x: {
                                ticks: {
                                  maxRotation: 45,
                                  minRotation: 45,
                                  font: {
                                    size: 9
                                  },
                                  callback: function(val, index) {
                                    // Show fewer labels on mobile
                                    const labels = this.getLabelForValue(val).split('-');
                                    const isSmallScreen = window.innerWidth < 640;
                                    // For small screens, show fewer labels
                                    if (isSmallScreen) {
                                      return index % 3 === 0 ? `${labels[1]}/${labels[2]}` : '';
                                    }
                                    // For larger screens, show more labels with better formatting
                                    return `${labels[1]}/${labels[2]}`;
                                  }
                                },
                                grid: {
                                  display: false
                                }
                              },
                              y: {
                                beginAtZero: true,
                                ticks: {
                                  precision: 0,
                                  font: {
                                    size: 10
                                  },
                                  stepSize: Math.max(1, Math.ceil(Math.max(...getChartData().datasets[0].data) / 5))
                                },
                                grid: {
                                  color: 'rgba(0, 0, 0, 0.05)'
                                }
                              }
                            }
                          }}
                        />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                          <BarChart size={32} className="text-gray-300 mb-2" />
                          <p>No data available for the selected time range</p>
                        </div>
                      )}
                    </div>
                    
                    {historyData.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                        <div>Total: {historyData.length} customers</div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                          <span>Daily customer count</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Tabular View */}
              <div className="mb-6">
                <h4 className="text-base font-medium text-gray-800 mb-4">Customer Details</h4>
                <div className="bg-[#F0F9FF] dark:bg-blue-900 text-white dark:text-blue-100 rounded-lg border border-blue-100 dark:border-blue-800 overflow-x-auto">
                  <table className="min-w-full divide-y divide-blue-200">
                    <thead className="bg-blue-50 dark:bg-blue-900 text-white dark:text-white dark:border-blue-800">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          <div className="flex items-center">
                            Sr. No.
                            <ArrowUpDown size={14} className="ml-1 text-blue-500" />
                          </div>
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          <div className="flex items-center">
                            Date
                            <ArrowUpDown size={14} className="ml-1 text-blue-500" />
                          </div>
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          <div className="flex items-center">
                            Customer ID
                            <ArrowUpDown size={14} className="ml-1 text-blue-500" />
                          </div>
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          <div className="flex items-center">
                            Full Name
                            <ArrowUpDown size={14} className="ml-1 text-blue-500" />
                          </div>
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          <div className="flex items-center">
                            Service
                            <ArrowUpDown size={14} className="ml-1 text-blue-500" />
                          </div>
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          <div className="flex items-center">
                            Amount
                            <ArrowUpDown size={14} className="ml-1 text-blue-500" />
                          </div>
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          <div className="flex items-center">
                            Phone
                            <ArrowUpDown size={14} className="ml-1 text-blue-500" />
                          </div>
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          <div className="flex items-center">
                            Email ID
                            <ArrowUpDown size={14} className="ml-1 text-blue-500" />
                          </div>
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          <div className="flex items-center">
                            Timestamp
                            <ArrowUpDown size={14} className="ml-1 text-blue-500" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-blue-100">
                      {historyData.length > 0 ? (
                        historyData.map((customer, index) => (
                          <tr key={customer.id} className={index % 2 === 0 ? 'bg-blue-50/30 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                              {customer.id.toString().padStart(3, '0')}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                              {customer.date}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                              {customer.customerId}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                              {customer.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                customer.status === 'served' 
                                 ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                                 : 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
                              }`}>
                                {customer.service}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                              ₹{customer.amount}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                              {maskData(customer.phone, 'phone')}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                              {maskData(customer.email, 'email')}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                              {customer.timestamp}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            No customer data available for the selected time range
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Download Options */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FileTextIcon size={16} className="mr-2" />
                  Download as PDF
                </button>
                <button
                  onClick={handleDownloadExcel}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isPremiumUser
                      ? 'text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg border border-amber-400 dark:from-amber-600 dark:to-amber-800 dark:hover:from-amber-700 dark:hover:to-amber-900 dark:border-amber-700'
                      : 'text-amber-100 bg-gradient-to-r from-amber-500/60 to-amber-600/60 cursor-not-allowed shadow-inner border border-amber-400/30 dark:from-amber-700/40 dark:to-amber-800/40 dark:border-amber-700/30 dark:text-amber-300/70'
                  }`}
                  title={!isPremiumUser ? 'Upgrade to Premium for Excel Export' : ''}
                >
                  <FileSpreadsheet size={16} className={`mr-2 ${isPremiumUser ? 'text-amber-100' : 'text-amber-200/80 dark:text-amber-300/70'}`} />
                  Download as Excel
                  {!isPremiumUser && (
                    <span
                      className="inline-flex items-center ml-2 text-xs bg-gradient-to-r from-amber-600/20 to-amber-700/20 
                        text-amber-100 dark:from-amber-800/40 dark:to-amber-900/40 dark:text-amber-200 
                        px-2 py-0.5 rounded-full tracking-wide font-medium border border-amber-400/20 
                        dark:border-amber-700/30 whitespace-nowrap leading-none shadow-sm"
                    >
                      Premium
                    </span>
                  )}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 w-80 max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-900">Make a Call</h3>
              <button
                onClick={() => {
                  setShowCallModal(false)
                  updateModalState(false)
                }}
                className="text-blue-400 hover:text-blue-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-center mb-4">
              <div className="text-blue-600 mb-2">Call this customer?</div>
              <div className="font-bold text-lg">{phoneToCall}</div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowCallModal(false)
                  updateModalState(false)
                }}
                className="flex-1 py-2 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50"
              >
                Cancel
              </button>
              <button onClick={handleCall} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Undo Snackbar */}
      {showUndoModal && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center items-center z-50 px-4 animate-fade-in">
          <div className="bg-blue-700 text-white rounded-md p-3 w-full max-w-md shadow-lg flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
              </div>
              <div>
                <div className="font-medium">Customer removed from queue</div>
                <div className="text-xs text-blue-200">
                  {undoCount > 0 ? `Undo ${undoCount}/${undoLimit} actions done` : "Undo available"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUndoNext()}
                className="text-sm font-medium text-blue-200 hover:text-white flex items-center px-2 py-1 rounded hover:bg-blue-600"
                disabled={undoActions.length === 0 || undoCount >= undoLimit}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M3 7v6h6"></path>
                  <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
                </svg>
                Undo
              </button>
              <button
                onClick={() => {
                  setShowUndoActionsModal(true)
                  updateModalState(false)
                }}
                className="text-sm font-medium text-blue-200 hover:text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                More
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Break Modal */}
      {showBreakModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-96 max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-900">Take a Break</h3>
              <button
                onClick={() => {
                  setShowBreakModal(false)
                  updateModalState(false)
                }}
                className="text-blue-400 hover:text-blue-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-5">
              <div>
                <p className="text-blue-700 dark:text-blue-300 font-medium mb-2">Select break reason:</p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setBreakReason("Tea Break")
                      setShowCustomReason(false)
                    }}
                    className={`w-full py-2 px-3 rounded-lg flex items-center ${
                      breakReason === "Tea Break" && !showCustomReason
                        ? "bg-blue-600 text-white dark:bg-blue-700 dark:text-white"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-gray-800 dark:text-blue-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Coffee
                      size={18}
                      className={`mr-2 ${
                        breakReason === "Tea Break" && !showCustomReason ? "text-white" : "text-blue-500 dark:text-blue-400"
                      }`}
                    />
                    <span>Tea Break</span>
                  </button>

                  <button
                    onClick={() => {
                      setBreakReason("Lunch Break")
                      setShowCustomReason(false)
                    }}
                    className={`w-full py-2 px-3 rounded-lg flex items-center ${
                      breakReason === "Lunch Break" && !showCustomReason
                        ? "bg-blue-600 text-white dark:bg-blue-700 dark:text-white"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-gray-800 dark:text-blue-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Coffee
                      size={18}
                      className={`mr-2 ${
                        breakReason === "Lunch Break" && !showCustomReason ? "text-white" : "text-blue-500 dark:text-blue-400"
                      }`}
                    />
                    <span>Lunch Break</span>
                  </button>

                  <button
                    onClick={() => {
                      setBreakReason("Staff Meeting")
                      setShowCustomReason(false)
                    }}
                    className={`w-full py-2 px-3 rounded-lg flex items-center ${
                      breakReason === "Staff Meeting" && !showCustomReason
                        ? "bg-blue-600 text-white dark:bg-blue-700 dark:text-white"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-gray-800 dark:text-blue-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Users
                      size={18}
                      className={`mr-2 ${
                        breakReason === "Staff Meeting" && !showCustomReason ? "text-white" : "text-blue-500 dark:text-blue-400"
                      }`}
                    />
                    <span>Staff Meeting</span>
                  </button>

                  <button
                    onClick={() => {
                      setBreakReason("Emergency")
                      setShowCustomReason(false)
                    }}
                    className={`w-full py-2 px-3 rounded-lg flex items-center ${
                      breakReason === "Emergency" && !showCustomReason
                        ? "bg-red-600 text-white dark:bg-red-700 dark:text-white"
                        : "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60"
                    }`}
                  >
                    <AlertTriangle
                      size={18}
                      className={`mr-2 ${
                        breakReason === "Emergency" && !showCustomReason ? "text-white" : "text-red-500 dark:text-red-400"
                      }`}
                    />
                    <span>Emergency</span>
                  </button>

                  <button
                    onClick={() => setShowCustomReason(true)}
                    className={`w-full py-2 px-3 rounded-lg flex items-center ${
                      showCustomReason ? "bg-blue-600 text-white dark:bg-blue-700 dark:text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-gray-800 dark:text-blue-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Plus size={18} className={`mr-2 ${showCustomReason ? "text-white" : "text-blue-500 dark:text-blue-400"}`} />
                    <span>Custom Reason</span>
                  </button>

                  {showCustomReason && (
                    <input
                      type="text"
                      value={customBreakReason}
                      onChange={(e) => setCustomBreakReason(e.target.value)}
                      placeholder="Enter break reason"
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-gray-800/60 p-3 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300 font-medium mb-2">Customer notification preview:</p>
                <div className="bg-white dark:bg-gray-900/50 p-3 rounded border border-blue-100 dark:border-blue-800/50 text-blue-800 dark:text-blue-200">
                  {"We're on a " +
                    (showCustomReason ? customBreakReason || "[Reason]" : breakReason || "[Reason]") +
                    " (" +
                    (showCustomDuration ? customDuration || "[Duration]" : breakDuration) +
                    " min). Please stay queued. Service will resume shortly."}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowBreakModal(false)
                  updateModalState(false)
                }}
                className="flex-1 py-2 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50"
              >
                Cancel
              </button>
              <button
                onClick={handleTakeBreak}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Start Break
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-900">Add Customer</h3>
              <button
                onClick={() => {
                  setShowAddCustomerModal(false)
                  updateModalState(false)
                }}
                className="text-blue-400 hover:text-blue-600"
              >
                <X size={20} />
              </button>
            </div>

            {!showNewCustomerForm && !showExistingCustomerForm ? (
              <div className="space-y-4">
                <p className="text-blue-700 mb-4">Choose how you want to add a customer:</p>

                {/* New Customer Card */}
                <button
                  onClick={handleNewCustomerClick}
                  className="w-full bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700/50 rounded-xl p-4 text-left hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors active:bg-blue-100 dark:active:bg-gray-600 overflow-hidden relative"
                >
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-4">
                      <UserPlus className="text-blue-600 dark:text-blue-300" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 dark:text-blue-100 text-lg">New Customer</h4>
                      <p className="text-blue-600 dark:text-blue-300 text-sm">Manually add a customer with new details</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-10 transition-opacity">
                    <div className="w-full h-full bg-blue-600 dark:bg-blue-500 rounded-full scale-0 hover:scale-100 transition-transform duration-500"></div>
                  </div>
                </button>
                {/* Existing Customer Card */}
                <button
                  onClick={handleExistingCustomerClick}
                  className="w-full bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700/50 rounded-xl p-4 text-left hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors active:bg-blue-100 dark:active:bg-gray-600 overflow-hidden relative"
                >
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-4">
                      <UserPlus className="text-blue-600 dark:text-blue-300" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900 dark:text-blue-100 text-lg">Repeat Customer</h4>
                      <p className="text-blue-600 dark:text-blue-300 text-sm">Search by phone and auto-fill known details</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-10 transition-opacity">
                    <div className="w-full h-full bg-blue-600 dark:bg-blue-500 rounded-full scale-0 hover:scale-100 transition-transform duration-500"></div>
                  </div>
                </button>
              </div>
            ) : showNewCustomerForm ? (
              <div className="space-y-4">
                <button
                  onClick={() => setShowNewCustomerForm(false)}
                  className="text-blue-600 flex items-center text-sm font-medium mb-2"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to options
                </button>

                <div className="space-y-4">
                  {/* Phone Number Field */}
                  <div>
                    <label className="block text-blue-800 font-medium mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={newCustomer.phone}
                      onChange={handlePhoneChange}
                      placeholder="Enter phone number"
                      className={`w-full px-3 py-2 border ${
                        formErrors.phone ? "border-red-300 bg-red-50" : "border-blue-200"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                  </div>

                  {/* Name Field with Voice */}
                  <div>
                    <label className="block text-blue-800 font-medium mb-1">Name (Optional)</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        placeholder="Enter customer name"
                        className="w-full px-3 py-2 border border-blue-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={toggleRecording}
                        className={`px-3 py-2 ${
                          isRecording ? "bg-red-500 text-white" : "bg-gray-600 text-white"
                        } rounded-r-lg`}
                      >
                        {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                      </button>
                    </div>
                    {transcription && (
                      <p className="text-blue-600 text-xs mt-1 italic">
                        {isRecording ? "Listening..." : `Heard: "${transcription}"`}
                      </p>
                    )}
                  </div>

                  {/* Service Field */}
                  <div>
                    <label className="block text-blue-800 font-medium mb-1">Service *</label>
                    <select
  value={newCustomer.service}
  onChange={(e) => setNewCustomer({ ...newCustomer, service: e.target.value })}
  className={`w-full px-3 py-2 border ${
    formErrors.service ? "border-red-300 bg-red-50" : "border-blue-200"
  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white`}
>
  <option value="">Select a service</option>
  {(() => {
    // First try to get services from localStorage (Rate Card services)
    try {
      const savedServices = localStorage.getItem("rateCardServices")
      if (savedServices) {
        const services = JSON.parse(savedServices)
        if (Array.isArray(services) && services.length > 0) {
          return services.map((service) => (
            <option key={service.id || service.name} value={service.name}>
              {service.name} {service.rate ? `- ₹${service.rate}` : ""}
            </option>
          ))
        }
      }
    } catch (e) {
      console.error("Error loading services from Rate Card:", e)
    }
    
    // If no services found in localStorage, fall back to serviceSuggestions based on business type
    if (serviceSuggestions && serviceSuggestions.length > 0) {
      return serviceSuggestions.map((service, index) => (
        <option key={`service-${index}`} value={typeof service === 'string' ? service : service.name}>
          {typeof service === 'string' ? service : service.name} {typeof service !== 'string' && service.rate ? `- ₹${service.rate}` : ""}
        </option>
      ))
    }
    
    // Final fallback options if no services found anywhere
    return ["Haircut", "Beard Trim", "Manicure", "Pedicure", "Facial"].map((service) => (
      <option key={service} value={service}>
        {service}
      </option>
    ))
  })()}
</select>
                    {formErrors.service && <p className="text-red-500 text-xs mt-1">{formErrors.service}</p>}
                  </div>

                  {/* Gender Field */}
                  <div>
                    <label className="block text-blue-800 font-medium mb-1">Gender</label>
                    <div className="flex space-x-4">
                      {["Male", "Female", "Other"].map((gender) => (
                        <label key={gender} className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={newCustomer.gender === gender}
                            onChange={() => setNewCustomer({ ...newCustomer, gender })}
                            className="mr-1"
                          />
                          <span className="text-blue-800">{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Wait Time Field */}
                  <div>
                    <label className="block text-blue-800 font-medium mb-1">Estimated Wait (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={newCustomer.waitTime}
                      onChange={(e) => setNewCustomer({ ...newCustomer, waitTime: Number(e.target.value) || 15 })}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Notes Field */}
                  <div>
                    <label className="block text-blue-800 font-medium mb-1">Notes (Optional)</label>
                    <textarea
                      value={newCustomer.notes}
                      onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                      placeholder="Add any additional notes"
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleAddNewCustomer}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add to Queue
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setShowExistingCustomerForm(false)}
                  className="text-blue-600 flex items-center text-sm font-medium mb-2"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to options
                </button>

                <div>
                  <label className="block text-blue-800 font-medium mb-1">Search by Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={searchPhone}
                      onChange={handleSearchPhoneChange}
                      placeholder="Enter phone number to search"
                      className="w-full px-3 py-2 pl-10 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-blue-400" size={18} />
                  </div>
                </div>

                {searchResults.length > 0 ? (
                  <div className="bg-blue-50 dark:bg-gray-800/60 rounded-lg p-2">
                    <p className="text-blue-700 dark:text-blue-300 text-sm mb-2 font-medium">
                      Found {searchResults.length} matching customers:
                    </p>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {searchResults.map((customer) => (
                        <button
                          key={customer.id}
                          onClick={() => handleSelectExistingCustomer(customer)}
                          className="w-full bg-white dark:bg-gray-700 p-3 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors flex items-center"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            {getGenderIcon(customer.gender)}
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-blue-900 dark:text-white">{customer.name}</div>
                            <div className="text-blue-600 dark:text-blue-300 text-sm flex items-center">
                              <Phone size={12} className="mr-1" />
                              {customer.phone}
                              <span className="mx-1">•</span>
                              <span>{customer.lastService}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : searchPhone.length >= 3 ? (
                  <div className="text-center p-4 bg-blue-50 dark:bg-orange-600/50 rounded-lg">
                    <p className="text-blue-600 dark:text-orange-300">No customers found with that phone number</p>
                    <button onClick={handleNewCustomerClick} className="mt-2 text-blue-700 hover:underline">
                      Add as new customer instead
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inactivity Reminder Modal */}
      {showInactivityReminder && currentQueue.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center items-center z-50 px-4 animate-fade-in">
          <div className="bg-amber-50 dark:bg-amber-800/55 border border-amber-200 dark:border-amber-700/50 text-amber-800 dark:text-amber-200 rounded-lg p-4 w-full max-w-md shadow-lg flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium flex items-center dark:text-amber-100">
                <Clock className="mr-2" size={18} />
                Still with {currentQueue[0].name}?
              </h3>
              <button onClick={() => setShowInactivityReminder(false)} className="text-amber-600 hover:text-amber-800">
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
              It looks like you're still with the current customer. Ready for the next one or need more time?
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleNext()
                  setShowInactivityReminder(false)
                }}
                className="flex-1 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center justify-center"
              >
                <ChevronRight size={16} className="mr-1" />
                Next Customer
              </button>
              <button
                onClick={handleExtendTimeFromReminder}
                className="flex-1 py-2 bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50"
              >
                Extend Time (+5m)
              </button>
              <button
                onClick={() => setShowInactivityReminder(false)}
                className="py-2 px-3 border border-amber-200 dark:border-amber-700/50 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtle reminder banner */}
      {showInactivityReminder && currentQueue.length > 0 && !isAnyModalOpen && (
        <div className="fixed bottom-16 left-0 right-0 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-700/50 p-2 text-center text-amber-800 dark:text-amber-200 text-sm animate-fade-in z-40">
          Still working with {currentQueue[0].name}. Tap Next when ready.
        </div>
      )}

      {/* Floating Add Customer Button (Mobile) */}
      <div className="fixed right-4 bottom-36 md:hidden">
        <button
          onClick={() => {
            handleAddCustomerClick()
          }}
          className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700"
        >
          <UserPlus size={24} />
        </button>
      </div>

      {/* Floating QR Code Button (Mobile) */}
      <div className="fixed right-4 bottom-20 md:hidden">
        <button
          onClick={() => router.push("/qr-code")}
          className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700"
        >
          <QrCode size={24} />
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 p-2 z-40">
        <div className="flex justify-around">
          <button onClick={() => router.push("/dashboard")} className="p-2 text-blue-800 flex flex-col items-center">
            <Users size={20} />
            <span className="text-xs mt-1">Queue</span>
          </button>
          <button
            onClick={() => router.push("/stats")}
            className="p-2 text-blue-400 flex flex-col items-center hover:text-blue-700"
          >
            <FileTextIcon size={20} />
            <span className="text-xs mt-1">Stats</span>
          </button>
          <button
            onClick={() => router.push("/premium")}
            className="p-2 text-blue-400 flex flex-col items-center hover:text-blue-700"
          >
            <Star size={20} />
            <span className="text-xs mt-1">Premium</span>
          </button>
          <button
            onClick={() => router.push("/settings")}
            className="p-2 text-blue-400 flex flex-col items-center hover:text-blue-700"
          >
            <Settings size={20} />
            <span className="text-xs mt-1">Settings</span>
          </button>
          <button
  onClick={() => {
    // Use the logout function from AuthContext
    localStorage.removeItem("qvuew_user")
    setUser(null)
    setIsAuthenticated(false)
    router.push("/auth")
  }}
  className="p-2 text-blue-400 flex flex-col items-center hover:text-blue-700"
>
            <LogOut size={20} />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </div>

      {/* Undo Recent Actions Modal */}
      {showUndoActionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-900">Undo Recent Actions</h3>
              <button
                onClick={() => {
                  setShowUndoActionsModal(false)
                  updateModalState(false)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {undoActions.map((action, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div>
                    <div className="font-medium text-blue-900">Completed: {action.customer.name}</div>
                    <div className="text-xs text-gray-500">
                      {action.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <button
                    onClick={() => handleUndoNext(index)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200"
                    disabled={undoCount >= undoLimit}
                  >
                    Undo
                  </button>
                </div>
              ))}

              {undoActions.length === 0 && (
                <div className="text-center py-4 text-gray-500">No recent actions to undo</div>
              )}
            </div>

            <button
              onClick={() => {
                setShowUndoActionsModal(false)
                updateModalState(false)
              }}
              className="w-full mt-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Close
            </button>

            {undoActions.length > 0 && (
              <div className="text-center mt-2">
                <button className="text-sm text-blue-600 hover:underline">
                  View All ({undoActions.length} customers)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop Testing Buttons - Simulate Mobile Floating Buttons */}
      <div className="fixed bottom-20 right-4 flex flex-col gap-3 md:flex md:flex-col lg:flex xl:flex hidden sm:flex">
        {/* Add Customer Button */}
        <button
          onClick={() => setShowAddCustomerModal(true)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          aria-label="Add customer"
        >
          <UserPlus size={24} />
        </button>
        
        {/* QR Code Button */}
        <button
          onClick={() => router.push('/qr-code')}
          className="w-14 h-14 bg-white text-blue-600 border-2 border-blue-600 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
          aria-label="QR code"
        >
          <QrCode size={24} />
        </button>
      </div>

      {/* PDF Download Progress Modal */}
      {showPdfDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-900 flex items-center">
                <Download size={20} className="mr-2 text-blue-600" />
                Downloading File
              </h3>
              {downloadProgress === 100 && (
                <button
                  onClick={() => {
                    setShowPdfDownloadModal(false)
                    updateModalState(false)
                  }}
                  className="text-blue-400 hover:text-blue-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-blue-700 mb-2 flex items-center">
                <FileTextIcon size={16} className="mr-2" />
                {downloadFileName}
              </div>
              
              <div className="w-full bg-blue-100 rounded-full h-4 mb-2">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">{downloadProgress}% complete</span>
                <span className="text-blue-700">{downloadProgress === 100 ? 'Completed' : 'Downloading...'}</span>
              </div>
            </div>
            
            {downloadProgress === 100 && (
              <button
                onClick={() => {
                  setShowPdfDownloadModal(false)
                  updateModalState(false)
                }}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      {/* Excel Premium Upgrade Modal */}
      {showExcelPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-900 flex items-center">
                <Star size={20} className="mr-2 text-amber-500" />
                Premium Feature
              </h3>
              <button
                onClick={() => {
                  setShowExcelPremiumModal(false)
                  updateModalState(false)
                }}
                className="text-blue-400 hover:text-blue-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                  <FileSpreadsheet size={32} className="text-amber-500" />
                </div>
              </div>
              
              <h4 className="text-center font-bold text-blue-900 mb-2">Excel Export is a Premium Feature</h4>
              <p className="text-center text-blue-700 mb-4">
                Upgrade to Premium to unlock Excel exports and more powerful features.
              </p>
              
              <div className="bg-blue-50 dark:bg-gray-600 rounded-lg p-4 mb-4">
                <h5 className="font-medium text-blue-800 mb-2">Premium Benefits:</h5>
                <ul className="space-y-2">
                  <li className="flex items-center text-blue-700">
                    <CheckCircle size={16} className="mr-2 text-green-500" />
                    Excel and CSV exports
                  </li>
                  <li className="flex items-center text-blue-700">
                    <CheckCircle size={16} className="mr-2 text-green-500" />
                    Advanced data filtering
                  </li>
                  <li className="flex items-center text-blue-700">
                    <CheckCircle size={16} className="mr-2 text-green-500" />
                    Unlimited customer history
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  router.push("/premium")
                  setShowExcelPremiumModal(false)
                  updateModalState(false)
                }}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Upgrade to Premium
              </button>
              <button
                onClick={() => {
                  setShowExcelPremiumModal(false)
                  updateModalState(false)
                }}
                className="w-full py-2 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
