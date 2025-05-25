"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  User,
  Phone,
  History,
  Calendar,
  Clock,
  CheckCircle,
  SkipForward,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  X,
  Filter,
  Search,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Modal } from "@/components/ui/modal"

export default function CustomerHistoryPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [customerHistory, setCustomerHistory] = useState([])
  const [historyDetailsCustomer, setHistoryDetailsCustomer] = useState(null)
  const [showCallModal, setShowCallModal] = useState(false)
  const [phoneToCall, setPhoneToCall] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [expandedServiceHistory, setExpandedServiceHistory] = useState(false)
  const [previousServices, setPreviousServices] = useState([])
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [sortOrder, setSortOrder] = useState("newest") // "newest" or "oldest"
  const [filteredHistory, setFilteredHistory] = useState([])

  // Date filter states
  const [dateFilterType, setDateFilterType] = useState("day") // "day", "7days", "30days", "60days", "90days", "custom"
  const [showDateFilterDropdown, setShowDateFilterDropdown] = useState(false)
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")

  // Load customer history from localStorage or generate mock data
  useEffect(() => {
    setIsLoading(true)

    // Get date range based on filter type
    let startDateObj = new Date(selectedDate)
    let endDateObj = new Date(selectedDate)

    if (dateFilterType === "7days") {
      startDateObj = new Date()
      startDateObj.setDate(startDateObj.getDate() - 7)
    } else if (dateFilterType === "30days") {
      startDateObj = new Date()
      startDateObj.setDate(startDateObj.getDate() - 30)
    } else if (dateFilterType === "60days") {
      startDateObj = new Date()
      startDateObj.setDate(startDateObj.getDate() - 60)
    } else if (dateFilterType === "90days") {
      startDateObj = new Date()
      startDateObj.setDate(startDateObj.getDate() - 90)
    } else if (dateFilterType === "custom" && customStartDate && customEndDate) {
      startDateObj = new Date(customStartDate)
      endDateObj = new Date(customEndDate)
      endDateObj.setHours(23, 59, 59, 999) // Include the full end date
    }

    try {
      const savedHistory = localStorage.getItem("customerHistory")
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory)
        // Filter history for the selected date range
        const filteredHistory = parsedHistory.filter((item) => {
          if (!item.timestamp) return false
          const itemDate = new Date(item.timestamp)

          if (dateFilterType === "day") {
            return itemDate.toDateString() === selectedDate.toDateString()
          } else {
            return itemDate >= startDateObj && itemDate <= endDateObj
          }
        })

        if (filteredHistory.length > 0) {
          setCustomerHistory(filteredHistory)
          setFilteredHistory(filteredHistory)
          setIsLoading(false)
          return
        }
      }
    } catch (e) {
      console.error("Error loading customer history:", e)
    }

    // Fallback to mock data if no saved history
    setTimeout(() => {
      let mockHistory = []

      if (dateFilterType === "day") {
        mockHistory = generateMockHistory(selectedDate)
      } else {
        // Generate mock data for date range
        const dayCount =
          dateFilterType === "7days"
            ? 7
            : dateFilterType === "30days"
              ? 30
              : dateFilterType === "60days"
                ? 60
                : dateFilterType === "90days"
                  ? 90
                  : 1

        for (let i = 0; i < dayCount; i++) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          mockHistory = [...mockHistory, ...generateMockHistory(date, 5 + Math.floor(Math.random() * 10))] // 5-15 customers per day
        }
      }

      setCustomerHistory(mockHistory)
      setFilteredHistory(mockHistory)
      setIsLoading(false)
    }, 800) // Simulate loading delay
  }, [selectedDate, dateFilterType, customStartDate, customEndDate])

  useEffect(() => {
    // Apply sorting to customer history
    if (customerHistory.length > 0) {
      const sortedHistory = [...customerHistory].sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime()
        const timeB = new Date(b.timestamp).getTime()
        return sortOrder === "newest" ? timeB - timeA : timeA - timeB
      })
      setFilteredHistory(sortedHistory)
    }
  }, [sortOrder, customerHistory])

  // Handle search functionality
  useEffect(() => {
    if (customerHistory.length === 0) return

    if (!searchQuery.trim()) {
      setFilteredHistory(customerHistory)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = customerHistory.filter((item) => {
      return (
        item.name?.toLowerCase().includes(query) ||
        item.phone?.toLowerCase().includes(query) ||
        item.service?.toLowerCase().includes(query)
      )
    })

    setFilteredHistory(filtered)
  }, [searchQuery, customerHistory])

  const generateMockHistory = (date, count = null) => {
    // Create consistent but random data based on the date
    const dateString = date.toISOString().split("T")[0]
    const dateSeed = dateString.split("-").reduce((a, b) => a + Number.parseInt(b), 0)
    const rng = (n) => (((dateSeed * 9301 + 49297) % 233280) / 233280) * n

    // If count is not provided, generate a random count
    const customerCount = count || Math.floor(rng(30)) + 10 // 10-40 customers per day
    const history = []

    // Service options
    const services = [
      { name: "Hair Cutting", rate: 150 },
      { name: "Hair Styling", rate: 300 },
      { name: "Hair Coloring", rate: 500 },
      { name: "Facial", rate: 400 },
      { name: "Manicure", rate: 200 },
      { name: "Pedicure", rate: 250 },
      { name: "Beard Trim", rate: 100 },
      { name: "Hair Spa", rate: 600 },
      { name: "Makeup", rate: 800 },
      { name: "Waxing", rate: 350 },
    ]

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
      "Raj Malhotra",
      "Priya Singh",
      "Ahmed Hassan",
      "Maria Gonzalez",
      "Kenji Yamamoto",
      "Ananya Desai",
      "John Smith",
      "Li Wei",
      "Sanjay Gupta",
      "Elena Petrova",
    ]

    for (let i = 0; i < customerCount; i++) {
      // Use a combination of date seed and index to ensure variety but consistency
      const seedOffset = (i * 13) % 100
      const adjustedSeed = (dateSeed + seedOffset) % 1000
      const adjustedRng = (n) => (((adjustedSeed * 9301 + 49297) % 233280) / 233280) * n

      const hour = Math.floor(adjustedRng(10)) + 9 // 9am - 7pm
      const minute = Math.floor(adjustedRng(60))
      const waitTime = Math.floor(adjustedRng(25)) + 5 // 5-30 minutes
      const gender = ["Male", "Female", "Other"][Math.floor(adjustedRng(3))]
      const status = adjustedRng(1) > 0.2 ? "served" : "skipped"
      const id = `H${date.getDate()}${1000 + i}`
      const serviceIndex = Math.floor(adjustedRng(services.length))
      const service = services[serviceIndex]
      const nameIndex = Math.floor(adjustedRng(names.length))
      const name = names[nameIndex]

      // Generate phone number that varies but is consistent for the same name
      const nameHash = name.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
      const phoneArea = 100 + (nameHash % 900)
      const phonePrefix = 100 + ((nameHash * 13) % 900)
      const phoneSuffix = 1000 + ((nameHash * 29) % 9000)
      const phone = `(${phoneArea}) ${phonePrefix}-${phoneSuffix}`

      // Generate previous visits (1-5 visits)
      const visitCount = Math.floor(adjustedRng(5)) + 1
      const previousVisits = []

      for (let j = 0; j < visitCount; j++) {
        const visitDate = new Date(date)
        visitDate.setDate(visitDate.getDate() - Math.floor(adjustedRng(30)) - 1) // 1-30 days ago
        const prevServiceIndex = Math.floor(adjustedRng(services.length))
        const prevService = services[prevServiceIndex]

        previousVisits.push({
          date: visitDate,
          service: prevService.name,
          rate: prevService.rate,
        })
      }

      history.push({
        id: id,
        name: name,
        arrivalTime: `${hour}:${minute.toString().padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`,
        waitTime: `${waitTime} min`,
        status,
        gender,
        phone: phone,
        timestamp: new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute),
        position: i + 1,
        totalServed: customerCount,
        notes: status === "served" ? "Customer was satisfied with the service" : "Customer couldn't wait",
        service: service.name,
        serviceRate: service.rate,
        previousVisits: previousVisits,
      })
    }

    // Sort by arrival time
    history.sort((a, b) => {
      const timeA = new Date(a.timestamp)
      const timeB = new Date(b.timestamp)
      return timeB - timeA // Most recent first
    })

    return history
  }

  const handleBackToQueue = () => {
    router.push("/")
  }

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value)
    setSelectedDate(newDate)
    setDateFilterType("day")
  }

  const formatDate = (date) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ""
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatShortDate = (date) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" })
  }

  const toggleHistoryDetails = (customer) => {
    setHistoryDetailsCustomer(customer)

    // Load previous services
    if (customer.previousVisits) {
      setPreviousServices(customer.previousVisits)
    } else {
      setPreviousServices([])
    }

    // Open the modal
    setShowDetailsModal(true)
  }

  const handlePhoneClick = (phone, e) => {
    e.stopPropagation() // Prevent triggering the card click
    setPhoneToCall(phone)
    setShowCallModal(true)
  }

  const handleCall = () => {
    // In a real app, this would use the device's phone capabilities
    window.location.href = `tel:${phoneToCall.replace(/[^0-9]/g, "")}`
    setShowCallModal(false)
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

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
    setDateFilterType("day")
  }

  const handleNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDate(newDate)
    setDateFilterType("day")
  }

  const handleTodayClick = () => {
    setSelectedDate(new Date())
    setDateFilterType("day")
  }

  const toggleServiceHistory = () => {
    setExpandedServiceHistory(!expandedServiceHistory)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
  }

  const handleDateFilterSelect = (filterType) => {
    setDateFilterType(filterType)
    setShowDateFilterDropdown(false)
  }

  const getDateFilterLabel = () => {
    switch (dateFilterType) {
      case "day":
        return "Today"
      case "7days":
        return "Last 7 Days"
      case "30days":
        return "Last 30 Days"
      case "60days":
        return "Last 60 Days"
      case "90days":
        return "Last 90 Days"
      case "custom":
        return "Custom Range"
      default:
        return "Select Date Range"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="flex justify-between items-center">
          <button onClick={handleBackToQueue} className="text-blue-600 flex items-center text-sm font-medium">
            <ArrowLeft size={16} className="mr-1" />
            <span className="hidden sm:inline">Back to Queue</span>
            <span className="sm:hidden">Back</span>
          </button>
          <h1 className="text-xl font-bold text-blue-800 mx-auto">Customer History</h1>
          <button onClick={() => setShowFilterModal(true)} className="text-blue-600 p-2">
            <Filter size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 dark:bg-gray-900">
        {/* Search and Date Selector */}
        <div className="bg-white dark:bg-gray-800/90 dark:border dark:border-gray-700 rounded-xl shadow-sm p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-blue-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, phone, or service"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Date Filter Dropdown */}
            <div className="md:w-48 relative">
              <button
                onClick={() => setShowDateFilterDropdown(!showDateFilterDropdown)}
                className="w-full flex items-center justify-between border border-blue-200 rounded-lg p-2 bg-white"
              >
                <div className="flex items-center">
                  <Calendar size={18} className="text-blue-500 mr-2" />
                  <span className="text-sm">{getDateFilterLabel()}</span>
                </div>
                <ChevronDown size={16} className="text-blue-500" />
              </button>

              {/* Date Filter Options Dropdown */}
              {showDateFilterDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-blue-200 rounded-lg shadow-lg">
                  <div className="p-2 space-y-2">
                    <button
                      onClick={() => handleDateFilterSelect("day")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        dateFilterType === "day" ? "bg-blue-100 text-blue-700" : "hover:bg-blue-50"
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => handleDateFilterSelect("7days")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        dateFilterType === "7days" ? "bg-blue-100 text-blue-700" : "hover:bg-blue-50"
                      }`}
                    >
                      Last 7 Days
                    </button>
                    <button
                      onClick={() => handleDateFilterSelect("30days")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        dateFilterType === "30days" ? "bg-blue-100 text-blue-700" : "hover:bg-blue-50"
                      }`}
                    >
                      Last 30 Days
                    </button>
                    <button
                      onClick={() => handleDateFilterSelect("60days")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        dateFilterType === "60days" ? "bg-blue-100 text-blue-700" : "hover:bg-blue-50"
                      }`}
                    >
                      Last 60 Days
                    </button>
                    <button
                      onClick={() => handleDateFilterSelect("90days")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        dateFilterType === "90days" ? "bg-blue-100 text-blue-700" : "hover:bg-blue-50"
                      }`}
                    >
                      Last 90 Days
                    </button>
                    <button
                      onClick={() => handleDateFilterSelect("custom")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        dateFilterType === "custom" ? "bg-blue-100 text-blue-700" : "hover:bg-blue-50"
                      }`}
                    >
                      Custom Range
                    </button>
                  </div>

                  {/* Custom Date Range Picker */}
                  {dateFilterType === "custom" && (
                    <div className="p-3 border-t border-blue-100">
                      <div className="mb-2">
                        <label className="block text-xs text-blue-600 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="w-full p-1 text-sm border border-blue-200 rounded"
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs text-blue-600 mb-1">End Date</label>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="w-full p-1 text-sm border border-blue-200 rounded"
                        />
                      </div>
                      <button
                        onClick={() => setShowDateFilterDropdown(false)}
                        className="w-full mt-2 py-1 bg-blue-600 text-white rounded text-sm"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {dateFilterType === "day" && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-blue-600 font-medium">{formatDate(selectedDate)}</div>
              <div className="flex gap-2">
                <button
                  onClick={handlePreviousDay}
                  className="p-1 bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-white rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleTodayClick}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-white rounded-lg text-xs hover:bg-blue-200 dark:hover:bg-blue-700"
                >
                  Today
                </button>
                <button
                  onClick={handleNextDay}
                  className="p-1 bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-white rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700"
                  disabled={selectedDate.toDateString() === new Date().toDateString()}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* History List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 bg-blue-50 dark:bg-gray-700/80 text-blue-700 dark:text-blue-200 border-b border-blue-100 dark:border-gray-600 font-medium flex justify-between items-center">
            <div>Customers Served: {filteredHistory.length}</div>
            <div className="text-sm">
              {dateFilterType === "day" && selectedDate.toLocaleDateString() === new Date().toLocaleDateString()
                ? "Today"
                : dateFilterType === "day"
                  ? "Selected Date"
                  : getDateFilterLabel()}
            </div>
          </div>

          {isLoading ? (
            // Loading skeleton
            <div className="divide-y divide-blue-100">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="p-4 animate-pulse">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-200 mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-blue-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-blue-100 rounded w-1/2"></div>
                    </div>
                    <div className="w-20 h-6 bg-blue-100 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="divide-y divide-blue-100 max-h-[calc(100vh-320px)] overflow-y-auto"
              style={{ scrollBehavior: "smooth" }}
            >
              {filteredHistory.length > 0 ? (
                filteredHistory.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-4 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer active:bg-blue-100 dark:active:bg-gray-700"
                    onClick={() => toggleHistoryDetails(customer)}
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm">
                        {getGenderIcon(customer.gender)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold text-blue-900 dark:text-blue-100 flex items-center">
                              {customer.name}
                              <span className="text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 ml-2 px-2 py-0.5 rounded-full">
                                {customer.position}/{customer.totalServed}
                              </span>
                            </div>
                            <div className="text-blue-600 dark:text-blue-400 text-sm mt-1 flex items-center">
                              <Clock size={14} className="mr-1 text-blue-400 dark:text-blue-500" />
                              {formatTimestamp(customer.timestamp)}
                              <span className="mx-2">•</span>
                              <span>Wait: {customer.waitTime}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                customer.status === "served"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
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
                            <ChevronRight size={16} className="ml-2 text-blue-400 dark:text-blue-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <History size={24} className="text-blue-400" />
                  </div>
                  <p className="text-blue-500 font-medium">No customer history found</p>
                  <p className="text-blue-400 text-sm mt-1">Try adjusting your search or date filter</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Customer Details Modal */}
      <Modal isOpen={showDetailsModal} onClose={closeDetailsModal} title="Customer Details" maxWidth="lg">
        {historyDetailsCustomer && (
          <div className="space-y-4">
            {/* Customer Header */}
            <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/40 p-3 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 shadow-sm">
                  {getGenderIcon(historyDetailsCustomer.gender)}
                </div>
                <div>
                  <div className="font-bold text-blue-900 dark:text-blue-200">{historyDetailsCustomer.name}</div>
                  <div className="text-blue-600 text-sm">
                    Position: {historyDetailsCustomer.position}/{historyDetailsCustomer.totalServed}
                  </div>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  historyDetailsCustomer.status === "served"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
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

            {/* Customer Information */}
            <div>
              <h3 className="text-blue-800 font-medium mb-3">Customer Information</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/40 rounded-lg">
                  <Phone size={18} className="text-blue-500 mr-3" />
                  <div>
                    <div className="text-sm text-blue-600 dark:text-blue-300">Phone Number</div>
                    <div className="text-blue-900 dark:text-blue-200 font-medium">
                      <button
                        onClick={(e) => handlePhoneClick(historyDetailsCustomer.phone, e)}
                        className="hover:underline"
                      >
                        {historyDetailsCustomer.phone}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/40 rounded-lg">
                  <User size={18} className="text-blue-500 mr-3" />
                  <div>
                    <div className="text-sm text-blue-600 dark:text-blue-300">Gender</div>
                    <div className="text-blue-900 dark:text-blue-200 font-medium">
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
                <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/40 rounded-lg">
                  <Clock size={18} className="text-blue-500 mr-3" />
                  <div>
                    <div className="text-sm text-blue-600 dark:text-blue-300">Arrival Time</div>
                    <div className="text-blue-900 dark:text-blue-200 font-medium">
                      {historyDetailsCustomer.arrivalTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/40 rounded-lg">
                  <History size={18} className="text-blue-500 mr-3" />
                  <div>
                    <div className="text-sm text-blue-600 dark:text-blue-300">Wait Duration</div>
                    <div className="text-blue-900 dark:text-blue-200 font-medium">
                      {historyDetailsCustomer.waitTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/40 rounded-lg">
                  <CheckCircle size={18} className="text-blue-500 mr-3" />
                  <div>
                    <div className="text-sm text-blue-600 dark:text-blue-300">
                      {historyDetailsCustomer.status === "served" ? "Served Time" : "Skipped Time"}
                    </div>
                    <div className="text-blue-900 dark:text-blue-200 font-medium">
                      {formatTimestamp(historyDetailsCustomer.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div>
              <h3 className="text-blue-800 font-medium mb-3">Service Information</h3>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/40 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-300">Current Service</div>
                <div className="text-blue-900 dark:text-blue-200 font-medium">
                  {historyDetailsCustomer.service || "No service recorded"}
                </div>
                {historyDetailsCustomer.serviceRate && (
                  <div className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                    Rate: ₹{historyDetailsCustomer.serviceRate}
                  </div>
                )}
              </div>

              {/* Previous Services */}
              {previousServices.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={toggleServiceHistory}
                    className="flex items-center justify-between w-full p-3 bg-blue-50 dark:bg-blue-900/40 rounded-lg text-left"
                  >
                    <span className="text-sm text-blue-600 dark:text-blue-300">Previous Services</span>
                    {expandedServiceHistory ? (
                      <ChevronUp size={16} className="text-blue-500" />
                    ) : (
                      <ChevronDown size={16} className="text-blue-500" />
                    )}
                  </button>

                  {expandedServiceHistory && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/40 rounded-lg">
                      <div className="space-y-3">
                        {previousServices.map((visit, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <div>
                              <span className="text-blue-900 dark:text-blue-200">{visit.service}</span>
                              <div className="text-blue-600 dark:text-blue-300 text-xs">
                                {formatShortDate(visit.date)}
                              </div>
                            </div>
                            <div className="text-blue-700 dark:text-blue-300">₹{visit.rate}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notes - Only show if available */}
            {historyDetailsCustomer.notes && (
              <div>
                <h3 className="text-blue-800 font-medium mb-3">Notes</h3>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/40 rounded-lg">
                  <div className="text-blue-700 dark:text-blue-300">{historyDetailsCustomer.notes}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 w-80 max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-900">Make a Call</h3>
              <button onClick={() => setShowCallModal(false)} className="text-blue-400 hover:text-blue-600">
                <X size={20} />
              </button>
            </div>

            <div className="text-center mb-4">
              <div className="text-blue-600 mb-2">Call this customer?</div>
              <div className="font-bold text-lg">{phoneToCall}</div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowCallModal(false)}
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

      {/* Filter Modal */}
      <Modal isOpen={showFilterModal} onClose={() => setShowFilterModal(false)} title="Filter History">
        <div className="p-4">
          <h3 className="text-blue-800 font-medium mb-4">Sort By</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="sortOrder"
                checked={sortOrder === "newest"}
                onChange={() => setSortOrder("newest")}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>Newest First</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="sortOrder"
                checked={sortOrder === "oldest"}
                onChange={() => setSortOrder("oldest")}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>Oldest First</span>
            </label>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => {
                setSortOrder("newest")
                setShowFilterModal(false)
              }}
              className="px-4 py-2 border border-blue-200 text-blue-700 rounded-lg"
            >
              Reset
            </button>
            <button onClick={() => setShowFilterModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Apply Filters
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
