"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  BarChart2,
  Users,
  CheckCircle,
  Clock,
  Calendar,
  Star,
  Settings,
  LogOut,
  XCircle,
  TrendingUp,
  Filter,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Info,
  UserCheck,
  TrendingDown,
  AlertCircle,
} from "lucide-react"
import { useTranslation } from "@/utils/i18n"

// Add this CSS for the pie chart animation and line chart animation
const chartAnimations = `
  @keyframes pieRotate {
    0% {
      transform: rotate(-90deg);
      opacity: 0;
    }
    100% {
      transform: rotate(0);
      opacity: 1;
    }
  }
  
  @keyframes drawLine {
    to {
      stroke-dashoffset: 0;
    }
  }
  
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes growBar {
    from {
      transform: scaleY(0);
    }
    to {
      transform: scaleY(1);
    }
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(-20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`

export default function StatsPage() {
  const router = useRouter()
  const { t } = useTranslation() // Add translation hook
  const [stats, setStats] = useState({
    customersServed: 0,
    customersSkipped: 0,
    customersLeft: 0,
    averageWaitTime: 0,
    peakHours: [],
    dailyStats: [],
  })

  const [selectedTimeRange, setSelectedTimeRange] = useState(7) // Default to 7 days
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false)
  const [trendData, setTrendData] = useState([])
  const [customerTrendData, setCustomerTrendData] = useState([])
  const [showInfoTooltip, setShowInfoTooltip] = useState(false)

  useEffect(() => {
    // In a real app, this would fetch data from an API based on the selected time range
    // For now, we'll use mock data
    generateMockData(selectedTimeRange)
  }, [selectedTimeRange])

  const generateMockData = (days) => {
    // Create more realistic data patterns
    const dailyStats = []
    const trendData = []
    const customerTrendData = []

    // Create patterns that show weekly cycles and trends
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    // Base values that will be modified to create patterns
    const baseServed = 35
    const baseSkipped = 8
    const baseLeft = 5
    const baseVisited = 50 // Base value for customers visited

    // Trend factors - slight upward trend for served, downward for others
    const servedTrendFactor = 0.4
    const skippedTrendFactor = -0.2
    const leftTrendFactor = -0.1
    const visitedTrendFactor = 0.3 // Slight upward trend for visits

    // Weekly pattern factors - busier mid-week, quieter weekends
    const weekdayFactors = {
      Mon: 0.9, // Monday starts slower
      Tue: 1.1, // Tuesday picks up
      Wed: 1.3, // Wednesday is busy
      Thu: 1.2, // Thursday still busy
      Fri: 1.0, // Friday average
      Sat: 0.6, // Saturday slower
      Sun: 0.4, // Sunday slowest
    }

    // Generate data for each day in the selected range
    for (let i = 0; i < days; i++) {
      // Calculate which day of the week this is
      const dayOfWeek = dayNames[i % 7]
      const dayFactor = weekdayFactors[dayOfWeek]

      // Apply trend over time (slight increase or decrease)
      const trendProgress = i / days
      const servedTrend = 1 + trendProgress * servedTrendFactor
      const skippedTrend = 1 + trendProgress * skippedTrendFactor
      const leftTrend = 1 + trendProgress * leftTrendFactor
      const visitedTrend = 1 + trendProgress * visitedTrendFactor

      // Add some randomness (±20%)
      const randomFactor = 0.8 + Math.random() * 0.4
      const visitedRandomFactor = 0.85 + Math.random() * 0.3

      // Calculate final values with all factors applied
      const served = Math.round(baseServed * dayFactor * servedTrend * randomFactor)
      const skipped = Math.round(baseSkipped * dayFactor * skippedTrend * randomFactor)
      const left = Math.round(baseLeft * dayFactor * leftTrend * randomFactor)

      // Calculate customers visited (always greater than or equal to served)
      const visited = Math.round(baseVisited * dayFactor * visitedTrend * visitedRandomFactor)

      // Calculate returning customers (a portion of visited customers)
      const returningFactor = 0.3 + Math.random() * 0.2 // 30-50% of visitors are returning customers
      const returning = Math.round(visited * returningFactor)

      // For the weekly view, group by day of week
      if (days === 7) {
        dailyStats.push({ day: dayOfWeek, count: served })
      } else {
        // For longer ranges, use day numbers but still show weekly patterns
        dailyStats.push({ day: `D${i + 1}`, count: served })
      }

      // Format date for x-axis
      let dateLabel = dayOfWeek
      if (days > 7) {
        // For longer ranges, use day numbers with some day names
        dateLabel = i % 7 === 0 ? dayOfWeek : `D${i + 1}`
      }
      if (days >= 30) {
        // For monthly+ views, use week numbers
        dateLabel = i % 7 === 0 ? `W${Math.floor(i / 7) + 1}` : ""
      }

      // Add to trend data
      trendData.push({
        day: i + 1,
        served: served,
        skipped: skipped,
        left: left,
        dayOfWeek: dayOfWeek,
      })

      // Add to customer trend data
      customerTrendData.push({
        day: i + 1,
        date: dateLabel,
        visited: visited,
        served: served,
        returning: returning,
        dayOfWeek: dayOfWeek,
        conversionRate: Math.round((served / visited) * 100),
      })
    }

    // Calculate totals
    const totalServed = trendData.reduce((sum, day) => sum + day.served, 0)
    const totalSkipped = trendData.reduce((sum, day) => sum + day.skipped, 0)
    const totalLeft = trendData.reduce((sum, day) => sum + day.left, 0)

    // Calculate average wait time based on customer volume
    // Higher volume days have longer wait times
    const avgVolumePerDay = totalServed / days
    const baseWaitTime = 10
    const waitTimeVariation = 5
    const avgWaitTime = Math.round(baseWaitTime + waitTimeVariation * (totalServed / (avgVolumePerDay * days)))

    // Generate peak hours based on the data
    const peakHours = ["10:00 AM - 11:00 AM", "2:00 PM - 3:00 PM"]

    // If we have a high volume, add a lunch peak
    if (totalServed > days * 30) {
      peakHours.push("12:00 PM - 1:00 PM")
    }

    setStats({
      customersServed: totalServed,
      customersSkipped: totalSkipped,
      customersLeft: totalLeft,
      averageWaitTime: avgWaitTime,
      peakHours: peakHours,
      dailyStats: dailyStats,
    })

    setTrendData(trendData)
    setCustomerTrendData(customerTrendData)
  }

  const timeRangeOptions = [
    { value: 7, label: "Last 7 Days" },
    { value: 15, label: "Last 15 Days" },
    { value: 30, label: "Last 30 Days" },
    { value: 60, label: "Last 60 Days" },
    { value: 90, label: "Last 90 Days" },
  ]

  const handleTimeRangeChange = (days) => {
    setSelectedTimeRange(days)
    setShowTimeRangeDropdown(false)
  }

  // Find the maximum value in trend data for scaling the graph
  const maxTrendValue = Math.max(...trendData.map((day) => Math.max(day.served, day.skipped, day.left)))

  // Find the maximum and minimum values in customer trend data for scaling
  const maxVisited = Math.max(...customerTrendData.map((day) => day.visited || 0))
  const minVisited = Math.min(...customerTrendData.map((day) => day.visited || 0))
  const maxServed = Math.max(...customerTrendData.map((day) => day.served || 0))
  const minServed = Math.min(...customerTrendData.map((day) => day.served || 0))

  // Calculate y-axis tick values for customer trend chart - ensure they're nice round numbers
  const visitedRange = maxVisited - minVisited
  const roundedMin = Math.max(0, Math.floor(minVisited / 10) * 10) // Round down to nearest 10, but not below 0
  const roundedMax = Math.ceil(maxVisited / 10) * 10 // Round up to nearest 10
  const step = Math.max(5, Math.ceil((roundedMax - roundedMin) / 4 / 5) * 5) // Round to nearest 5 for nice steps, minimum 5

  const yAxisTicks = []
  for (let i = 0; i <= 4; i++) {
    yAxisTicks.push(roundedMin + i * step)
  }

  // Calculate trends for insights
  const calculateTrends = () => {
    if (customerTrendData.length < 2) return { visited: 0, served: 0, conversion: 0 }

    const firstHalf = customerTrendData.slice(0, Math.floor(customerTrendData.length / 2))
    const secondHalf = customerTrendData.slice(Math.floor(customerTrendData.length / 2))

    const avgVisitedFirst = firstHalf.reduce((sum, day) => sum + day.visited, 0) / firstHalf.length
    const avgVisitedSecond = secondHalf.reduce((sum, day) => sum + day.visited, 0) / secondHalf.length
    const visitedTrend = ((avgVisitedSecond - avgVisitedFirst) / avgVisitedFirst) * 100

    const avgServedFirst = firstHalf.reduce((sum, day) => sum + day.served, 0) / firstHalf.length
    const avgServedSecond = secondHalf.reduce((sum, day) => sum + day.served, 0) / secondHalf.length
    const servedTrend = ((avgServedSecond - avgServedFirst) / avgServedFirst) * 100

    const avgConversionFirst = firstHalf.reduce((sum, day) => sum + day.conversionRate, 0) / firstHalf.length
    const avgConversionSecond = secondHalf.reduce((sum, day) => sum + day.conversionRate, 0) / secondHalf.length
    const conversionTrend = avgConversionSecond - avgConversionFirst

    // Calculate retention trend
    const avgReturningFirst = firstHalf.reduce((sum, day) => sum + (day.returning || 0), 0) / firstHalf.length
    const avgReturningSecond = secondHalf.reduce((sum, day) => sum + (day.returning || 0), 0) / secondHalf.length
    const avgVisitedFirstHalf = firstHalf.reduce((sum, day) => sum + day.visited, 0) / firstHalf.length
    const avgVisitedSecondHalf = secondHalf.reduce((sum, day) => sum + day.visited, 0) / secondHalf.length
    const retentionTrendFirst = (avgReturningFirst / avgVisitedFirstHalf) * 100
    const retentionTrendSecond = (avgReturningSecond / avgVisitedSecondHalf) * 100
    const retentionTrend = retentionTrendSecond - retentionTrendFirst

    // Calculate skipped and left trends
    const avgSkippedFirst =
      firstHalf.reduce((sum, day) => sum + (trendData[day.day - 1]?.skipped || 0), 0) / firstHalf.length
    const avgSkippedSecond =
      secondHalf.reduce((sum, day) => sum + (trendData[day.day - 1]?.skipped || 0), 0) / secondHalf.length
    const skippedTrend = ((avgSkippedSecond - avgSkippedFirst) / Math.max(1, avgSkippedFirst)) * 100

    const avgLeftFirst = firstHalf.reduce((sum, day) => sum + (trendData[day.day - 1]?.left || 0), 0) / firstHalf.length
    const avgLeftSecond =
      secondHalf.reduce((sum, day) => sum + (trendData[day.day - 1]?.left || 0), 0) / secondHalf.length
    const leftTrend = ((avgLeftSecond - avgLeftFirst) / Math.max(1, avgLeftFirst)) * 100

    return {
      visited: Math.round(visitedTrend),
      served: Math.round(servedTrend),
      conversion: Math.round(conversionTrend),
      retention: Math.round(retentionTrend),
      skipped: Math.round(skippedTrend),
      left: Math.round(leftTrend),
    }
  }

  const trends = calculateTrends()

  // Get trend icon based on value
  const getTrendIcon = (value) => {
    if (value > 0) return <ArrowUp className="text-green-500" size={14} />
    if (value < 0) return <ArrowDown className="text-red-500" size={14} />
    return <Minus className="text-gray-500" size={14} />
  }

  // Get trend color based on value and metric (for conversion, positive is always good)
  const getTrendColor = (value, isConversion = false) => {
    if (isConversion) {
      return value >= 0 ? "text-green-600" : "text-red-600"
    }
    return value >= 0 ? "text-green-600" : "text-red-600"
  }

  // Find best and worst performing days
  const getBestDay = () => {
    if (customerTrendData.length === 0) return null

    const bestDayIndex = customerTrendData.reduce((bestIdx, day, idx, arr) => {
      return (day.conversionRate || 0) > (arr[bestIdx]?.conversionRate || 0) ? idx : bestIdx
    }, 0)

    return customerTrendData[bestDayIndex]?.dayOfWeek || null
  }

  const getWorstDay = () => {
    if (customerTrendData.length === 0) return null

    const worstDayIndex = customerTrendData.reduce((worstIdx, day, idx, arr) => {
      return (day.conversionRate || 0) < (arr[worstIdx]?.conversionRate || 0) ? idx : worstIdx
    }, 0)

    return customerTrendData[worstDayIndex]?.dayOfWeek || null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <style>{chartAnimations}</style>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="flex items-center">
          <button onClick={() => router.push("/dashboard")} className="mr-3">
            <ArrowLeft size={20} className="text-blue-600" />
          </button>
          <h1 className="text-lg font-bold text-blue-900 dark:text-blue-100">{t("stats.title")}</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 pb-20">
        {/* Time Range Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Filter size={16} className="text-blue-500 mr-2" />
              <h3 className="text-blue-800 dark:text-blue-200 font-medium">{t("stats.timeRange")}</h3>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
                className="flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-800"
              >
                {timeRangeOptions.find((option) => option.value === selectedTimeRange)?.label}
                <ChevronDown size={16} className="ml-1" />
              </button>

              {showTimeRangeDropdown && (
                <div className="absolute right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 w-40 py-1 border border-blue-100 dark:border-gray-700">
                  {timeRangeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleTimeRangeChange(option.value)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${
                        selectedTimeRange === option.value ? "bg-blue-50 text-blue-700 font-medium" : "text-blue-800"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-blue-600">
            Showing statistics for the{" "}
            {timeRangeOptions.find((option) => option.value === selectedTimeRange)?.label.toLowerCase()}
          </p>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <div className="flex items-center mb-2">
                <Users className="text-blue-500 dark:text-blue-400 mr-2" size={18} />
                <h3 className="text-blue-800 dark:text-blue-200 font-medium">{t("stats.customersServed")}</h3>
              </div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.customersServed}</p>
              <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                {timeRangeOptions.find((option) => option.value === selectedTimeRange)?.label}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <div className="flex items-center mb-2">
                <Clock className="text-blue-500 mr-2" size={18} />
                <h3 className="text-blue-800 font-medium">{t("stats.avgWaitTime")}</h3>
              </div>
              <p className="text-2xl font-bold text-blue-900">{stats.averageWaitTime} min</p>
              <p className="text-sm text-blue-600 mt-1">
                {timeRangeOptions.find((option) => option.value === selectedTimeRange)?.label}
              </p>
            </div>
          </div>

          {/* New Stats: Skipped and Left */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center mb-2">
                <XCircle className="text-amber-500 mr-2" size={18} />
                <h3 className="text-blue-800 font-medium">{t("stats.customersSkipped")}</h3>
              </div>
              <p className="text-2xl font-bold text-amber-600">{stats.customersSkipped}</p>
              <p className="text-sm text-blue-600 mt-1">
                {timeRangeOptions.find((option) => option.value === selectedTimeRange)?.label}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center mb-2">
                <ArrowLeft className="text-red-500 mr-2" size={18} />
                <h3 className="text-blue-800 font-medium">{t("stats.customersLeft")}</h3>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.customersLeft}</p>
              <p className="text-sm text-blue-600 mt-1">
                {timeRangeOptions.find((option) => option.value === selectedTimeRange)?.label}
              </p>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <TrendingUp className="text-blue-500 mr-2" size={18} />
                <h3 className="text-blue-800 font-medium">{t("stats.customerDistribution")}</h3>
              </div>
              <div className="text-xs bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-white px-2 py-1 rounded-full">
                {stats.customersServed + stats.customersSkipped + stats.customersLeft} {t("stats.total")}
              </div>
            </div>
            <div className="h-auto flex flex-col">
              <div className="flex flex-col md:flex-row">
                {/* Pie Chart SVG - Full width on mobile, left side on larger screens */}
                <div className="relative flex items-center justify-center py-8 md:py-0 md:w-2/3">
                  <svg width="180" height="180" viewBox="0 0 100 100">
                    {(() => {
                      const total = stats.customersServed + stats.customersSkipped + stats.customersLeft
                      if (total === 0) return null

                      const servedPercent = (stats.customersServed / total) * 100
                      const skippedPercent = (stats.customersSkipped / total) * 100
                      const leftPercent = (stats.customersLeft / total) * 100

                      // Calculate the SVG arc paths
                      const getSlicePath = (startPercent, endPercent) => {
                        const start = (startPercent / 100) * Math.PI * 2
                        const end = (endPercent / 100) * Math.PI * 2

                        const x1 = 50 + 40 * Math.cos(start - Math.PI / 2)
                        const y1 = 50 + 40 * Math.sin(start - Math.PI / 2)
                        const x2 = 50 + 40 * Math.cos(end - Math.PI / 2)
                        const y2 = 50 + 40 * Math.sin(end - Math.PI / 2)

                        const largeArcFlag = endPercent - startPercent > 50 ? 1 : 0

                        return `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
                      }

                      return (
                        <>
                          {/* Served slice (blue) */}
                          <path
                            d={getSlicePath(0, servedPercent)}
                            fill="#3b82f6"
                            style={{
                              animation: "pieRotate 1s ease-out forwards",
                              transformOrigin: "center",
                            }}
                          >
                            <title>
                              {t("stats.served")}: {stats.customersServed} ({Math.round(servedPercent)}%)
                            </title>
                          </path>

                          {/* Skipped slice (amber) */}
                          <path
                            d={getSlicePath(servedPercent, servedPercent + skippedPercent)}
                            fill="#f59e0b"
                            style={{
                              animation: "pieRotate 1s ease-out 0.2s forwards",
                              transformOrigin: "center",
                            }}
                          >
                            <title>
                              {t("stats.customersSkipped")}: {stats.customersSkipped} ({Math.round(skippedPercent)}%)
                            </title>
                          </path>

                          {/* Left slice (red) */}
                          <path
                            d={getSlicePath(servedPercent + skippedPercent, 100)}
                            fill="#ef4444"
                            style={{
                              animation: "pieRotate 1s ease-out 0.4s forwards",
                              transformOrigin: "center",
                            }}
                          >
                            <title>
                              {t("stats.customersLeft")}: {stats.customersLeft} ({Math.round(leftPercent)}%)
                            </title>
                          </path>

                          {/* Inner white circle for donut effect */}
                          <circle cx="50" cy="50" r="20" fill="white" />

                          {/* Center text showing total */}
                          <text
                            x="50"
                            y="46"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-xs font-medium fill-blue-800"
                          >
                            {total}
                          </text>
                          <text
                            x="50"
                            y="54"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-[8px] fill-blue-600"
                          >
                            {t("stats.total")}
                          </text>
                        </>
                      )
                    })()}
                  </svg>
                </div>

                {/* Data labels - Horizontal on mobile, vertical on right side for larger screens */}
                <div className="flex flex-row justify-around md:flex-col md:justify-center md:w-1/3 md:space-y-3 md:pl-2">
                  <div className="bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm p-2 rounded-lg border border-blue-100 dark:border-blue-900 shadow-sm transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <div>
                        <div className="text-sm font-medium text-blue-800 dark:text-blue-300">{t("stats.served")}</div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          {stats.customersServed} (
                          {String(
                            Math.round(
                              (stats.customersServed /
                                Math.max(1, stats.customersServed + stats.customersSkipped + stats.customersLeft)) *
                                100,
                            ) || 0,
                          )}
                          %)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm p-2 rounded-lg border border-blue-100 dark:border-amber-900 shadow-sm transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                      <div>
                        <div className="text-sm font-medium text-blue-800 dark:text-amber-300">
                          {t("stats.customersSkipped")}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-amber-400">
                          {stats.customersSkipped} (
                          {String(
                            Math.round(
                              (stats.customersSkipped /
                                Math.max(1, stats.customersServed + stats.customersSkipped + stats.customersLeft)) *
                                100,
                            ) || 0,
                          )}
                          %)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm p-2 rounded-lg border border-blue-100 dark:border-red-900 shadow-sm transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <div>
                        <div className="text-sm font-medium text-blue-800 dark:text-red-300">
                          {t("stats.customersLeft")}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-red-400">
                          {stats.customersLeft} (
                          {String(
                            Math.round(
                              (stats.customersLeft /
                                Math.max(1, stats.customersServed + stats.customersSkipped + stats.customersLeft)) *
                                100,
                            ) || 0,
                          )}
                          %)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend removed as requested */}
              <div className="mt-4"></div>
            </div>
          </div>

          {/* Customer Trend Insights (replacing Customer Trend Line Graph) */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <BarChart2 className="text-blue-500 dark:text-blue-400 mr-2" size={18} />
                <h3 className="text-blue-800 dark:text-blue-200 font-medium">{t("stats.customerInsights")}</h3>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowInfoTooltip(!showInfoTooltip)}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Info size={16} />
                </button>
                {showInfoTooltip && (
                  <div className="absolute right-0 top-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-10 w-64 p-3 text-xs border border-blue-100 dark:border-gray-600">
                    <p className="text-blue-800 dark:text-blue-200 mb-1">
                      This chart shows key customer metrics and trends over the selected time period.
                    </p>
                    <p className="text-blue-600 dark:text-blue-300">
                      Trends compare the second half of the period to the first half, showing percentage change.
                    </p>
                    <button
                      onClick={() => setShowInfoTooltip(false)}
                      className="absolute top-1 right-1 text-blue-400 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Trend Summary Cards */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="bg-blue-50 dark:bg-blue-900/40 rounded-lg p-2 text-center">
                <div className="text-xs text-blue-700 dark:text-blue-300 mb-1">{t("stats.visited")}</div>
                <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {String(customerTrendData.reduce((sum, day) => sum + day.visited, 0))}
                </div>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(trends.visited)}
                  <span className={`text-xs ml-1 ${getTrendColor(trends.visited)}`}>
                    {String(Math.abs(trends.visited) || 0)}%
                  </span>
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/40 rounded-lg p-2 text-center">
                <div className="text-xs text-purple-700 dark:text-purple-300 mb-1">{t("stats.served")}</div>
                <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
                  {String(customerTrendData.reduce((sum, day) => sum + day.served, 0))}
                </div>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(trends.served)}
                  <span className={`text-xs ml-1 ${getTrendColor(trends.served)}`}>
                    {String(Math.abs(trends.served) || 0)}%
                  </span>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/40 rounded-lg p-2 text-center">
                <div className="text-xs text-green-700 dark:text-green-300 mb-1">{t("stats.conversion")}</div>
                <div className="text-lg font-bold text-green-900 dark:text-green-100">
                  {String(
                    Math.round(
                      (customerTrendData.reduce((sum, day) => sum + day.served, 0) /
                        Math.max(
                          1,
                          customerTrendData.reduce((sum, day) => sum + day.visited, 0),
                        )) *
                        100,
                    ) || 0,
                  )}
                  %
                </div>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(trends.conversion)}
                  <span className={`text-xs ml-1 ${getTrendColor(trends.conversion, true)}`}>
                    {String(Math.abs(trends.conversion) || 0)}%
                  </span>
                </div>
              </div>
              <div className="bg-teal-50 dark:bg-teal-900/40 rounded-lg p-2 text-center">
                <div className="text-xs text-teal-700 dark:text-teal-300 mb-1">{t("stats.retention")}</div>
                <div className="text-lg font-bold text-teal-900 dark:text-teal-100">
                  {String(
                    Math.round(
                      (customerTrendData.reduce((sum, day) => sum + (day.returning || 0), 0) /
                        Math.max(
                          1,
                          customerTrendData.reduce((sum, day) => sum + day.visited, 0),
                        )) *
                        100,
                    ) || 0,
                  )}
                  %
                </div>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(trends.retention || 0)}
                  <span className={`text-xs ml-1 ${getTrendColor(trends.retention || 0, true)}`}>
                    {String(Math.abs(trends.retention || 0))}%
                  </span>
                </div>
              </div>
            </div>

            {/* Daily Performance Chart - Removed */}

            {/* Conversion Rate Explanation */}
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 mb-3">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">What is Conversion Rate?</h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Conversion rate shows what percentage of customers who visited were actually served. It's calculated as
                (Customers Served ÷ Customers Visited) × 100%. A higher conversion rate means you're efficiently serving
                most of the customers who visit.
              </p>
            </div>

            {/* Legend */}

            {/* Key Insights */}
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">{t("stats.keyInsights")}</h4>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1.5">
                <li className="flex items-start">
                  <div className="min-w-4 h-4 flex items-center justify-center mr-2 mt-0.5">
                    {trends.visited > 0 ? (
                      <TrendingUp className="text-green-500" size={14} />
                    ) : (
                      <TrendingDown className="text-red-500" size={14} />
                    )}
                  </div>
                  <span>
                    <span className="font-medium">{t("stats.trafficTrend")}:</span> Customer visits are{" "}
                    {trends.visited > 0 ? "up" : "down"} by {String(Math.abs(trends.visited) || 0)}% compared to the
                    previous period.{" "}
                    {trends.visited > 5
                      ? "Consider adding more staff during peak hours."
                      : trends.visited < -5
                        ? "Review your marketing strategy to attract more customers."
                        : ""}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="min-w-4 h-4 flex items-center justify-center mr-2 mt-0.5">
                    <UserCheck className="text-blue-500 dark:text-blue-400" size={14} />
                  </div>
                  <span>
                    <span className="font-medium">{t("stats.customerRetention")}:</span>{" "}
                    {String(
                      Math.round(
                        (customerTrendData.reduce((sum, day) => sum + (day.returning || 0), 0) /
                          Math.max(
                            1,
                            customerTrendData.reduce((sum, day) => sum + day.visited, 0),
                          )) *
                          100,
                      ) || 0,
                    )}
                    % of your customers are returning visitors.{" "}
                    {trends.retention > 0
                      ? "Your loyalty efforts are working well."
                      : trends.retention < 0
                        ? "Consider implementing a loyalty program to improve retention."
                        : ""}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="min-w-4 h-4 flex items-center justify-center mr-2 mt-0.5">
                    <Calendar className="text-purple-500 dark:text-purple-400" size={14} />
                  </div>
                  <span>
                    <span className="font-medium">{t("stats.bestDay")}:</span>{" "}
                    {getBestDay() ? `${getBestDay()} has your highest conversion rate.` : "No day data available."}{" "}
                    {getBestDay()
                      ? `Consider studying what makes ${getBestDay()} successful and apply those practices to other days.`
                      : ""}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="min-w-4 h-4 flex items-center justify-center mr-2 mt-0.5">
                    <AlertCircle className="text-amber-500 dark:text-amber-400" size={14} />
                  </div>
                  <span>
                    <span className="font-medium">{t("stats.attentionNeeded")}:</span>{" "}
                    {trends.skipped > 0 || trends.left > 0
                      ? `${trends.skipped > 0 ? `Customer skips have increased by ${Math.abs(trends.skipped)}%.` : ""} ${trends.left > 0 ? `Customers leaving without service has increased by ${Math.abs(trends.left)}%.` : ""}`
                      : `${trends.skipped < 0 ? `Customer skips have decreased by ${Math.abs(trends.skipped)}%.` : ""} ${trends.left < 0 ? `Customers leaving without service has decreased by ${Math.abs(trends.left)}%.` : ""}`}
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-2 text-xs text-center text-blue-600 dark:text-blue-400">
              {selectedTimeRange === 7 ? "This week" : `Last ${selectedTimeRange} days`}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4">
            <div className="flex items-center mb-3">
              <Calendar className="text-blue-500 dark:text-blue-400 mr-2" size={18} />
              <h3 className="text-blue-800 dark:text-blue-200 font-medium">{t("stats.peakHours")}</h3>
            </div>
            <div className="space-y-2">
              {stats.peakHours.map((hour, index) => (
                <div
                  key={index}
                  className="p-2 bg-blue-50 dark:bg-blue-900/40 rounded-lg flex justify-between items-center"
                >
                  <span className="text-blue-700 dark:text-blue-200">{hour}</span>
                  <span className="text-sm text-blue-500 dark:text-blue-400">High Traffic</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center mb-3">
              <CheckCircle className="text-blue-500 dark:text-blue-400 mr-2" size={18} />
              <h3 className="text-blue-800 dark:text-blue-200 font-medium">{t("stats.serviceCompletion")}</h3>
            </div>
            <div className="relative h-4 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-blue-600 dark:bg-blue-500 rounded-full"
                style={{ width: "85%" }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-blue-600 dark:text-blue-400">0%</span>
              <span className="text-xs font-medium text-blue-800 dark:text-blue-200">85% {t("stats.completed")}</span>
              <span className="text-xs text-blue-600 dark:text-blue-400">100%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-blue-100 dark:border-gray-700 p-2 z-40">
        <div className="flex justify-around">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 text-blue-400 flex flex-col items-center hover:text-blue-700"
          >
            <Users size={20} />
            <span className="text-xs mt-1">{t("nav.queue")}</span>
          </button>
          <button className="p-2 text-blue-800 flex flex-col items-center">
            <BarChart2 size={20} />
            <span className="text-xs mt-1">{t("nav.stats")}</span>
          </button>
          <button
            onClick={() => router.push("/premium")}
            className="p-2 text-blue-400 flex flex-col items-center hover:text-blue-700"
          >
            <Star size={20} />
            <span className="text-xs mt-1">{t("nav.premium")}</span>
          </button>
          <button
            onClick={() => router.push("/settings")}
            className="p-2 text-blue-400 flex flex-col items-center hover:text-blue-700"
          >
            <Settings size={20} />
            <span className="text-xs mt-1">{t("nav.settings")}</span>
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("qvuew_auth")
              router.push("/auth")
            }}
            className="p-2 text-blue-400 flex flex-col items-center hover:text-blue-700"
          >
            <LogOut size={20} />
            <span className="text-xs mt-1">{t("nav.logout")}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
