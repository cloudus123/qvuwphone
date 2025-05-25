"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Star, Shield, Zap, Clock, Users, BarChart2, Settings, LogOut } from "lucide-react"
import { useState } from "react"

export default function PremiumPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState("monthly")

  const plans = {
    monthly: {
      price: "$9.99",
      period: "month",
      savings: "",
    },
    yearly: {
      price: "$89.99",
      period: "year",
      savings: "Save 25%",
    },
  }

  const features = [
    {
      icon: <Shield className="text-blue-500" size={18} />,
      title: "Unlimited Customers",
      description: "No limits on queue size",
    },
    {
      icon: <Zap className="text-blue-500" size={18} />,
      title: "Priority Support",
      description: "Get help when you need it",
    },
    {
      icon: <Clock className="text-blue-500" size={18} />,
      title: "Advanced Analytics",
      description: "Detailed insights and reports",
    },
    {
      icon: <Users className="text-blue-500" size={18} />,
      title: "Team Access",
      description: "Add up to 5 team members",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="flex items-center">
          <button onClick={() => router.push("/dashboard")} className="mr-3">
            <ArrowLeft size={20} className="text-blue-600" />
          </button>
          <h1 className="text-lg font-bold text-blue-900 dark:text-blue-100">Premium Plans</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 pb-16">
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4">
            <div className="flex items-center justify-center mb-4">
              <Star className="text-yellow-500" size={24} />
              <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 ml-2">QVuew Premium</h2>
            </div>

            <p className="text-center text-blue-700 mb-6">
              Upgrade to Premium for advanced features and unlimited access
            </p>

            {/* Plan Toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 dark:bg-blue-900 p-1 rounded-lg flex">
                <button
                  onClick={() => setSelectedPlan("monthly")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedPlan === "monthly"
                      ? "bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 shadow-sm"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedPlan("yearly")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedPlan === "yearly"
                      ? "bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 shadow-sm"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-900 dark:text-blue-100">{plans[selectedPlan].price}</span>
                <span className="text-blue-600 dark:text-blue-300 ml-2">/ {plans[selectedPlan].period}</span>
              </div>
              {plans[selectedPlan].savings && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {plans[selectedPlan].savings}
                </span>
              )}
            </div>

            {/* Features */}
            <div className="space-y-4 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="mt-0.5 mr-3">{feature.icon}</div>
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">{feature.title}</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() =>
                router.push(`/payment?plan=${selectedPlan}&price=${encodeURIComponent(plans[selectedPlan].price)}`)
              }
              className="w-full py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Upgrade Now
            </button>
          </div>

          {/* Testimonial */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <p className="italic text-blue-700 dark:text-blue-300 mb-3">
              "QVuew Premium has transformed how we manage our salon. The advanced analytics alone are worth the price!"
            </p>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                <Users size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">Sarah Johnson</p>
                <p className="text-xs text-blue-600 dark:text-blue-300">Salon Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Same as Dashboard */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-blue-100 dark:border-gray-700 p-2 z-40">
        <div className="flex justify-around">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 text-blue-400 flex flex-col items-center hover:text-blue-700"
          >
            <Users size={20} />
            <span className="text-xs mt-1">Queue</span>
          </button>
          <button
            onClick={() => router.push("/stats")}
            className="p-2 text-blue-400 flex flex-col items-center hover:text-blue-700"
          >
            <BarChart2 size={20} />
            <span className="text-xs mt-1">Stats</span>
          </button>
          <button className="p-2 text-blue-800 flex flex-col items-center">
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
              localStorage.removeItem("qvuew_auth")
              router.push("/auth")
            }}
            className="p-2 text-blue-400 flex flex-col items-center hover:text-blue-700"
          >
            <LogOut size={20} />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}
