"use client"

import Dashboard from "@/components/Dashboard"
import { useTranslation } from "@/utils/i18n"

export default function DashboardPage() {
  // Add the translation hook to ensure language changes are applied
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Dashboard />
    </div>
  )
}
