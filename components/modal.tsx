"use client"

import { X } from "lucide-react"
import type React from "react"

interface ModalProps {
  isVisible: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl"
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, title, children, footer, maxWidth = "2xl" }) => {
  if (!isVisible) {
    return null
  }

  const maxWidthClass = `max-w-${maxWidth}`

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 transform ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        {/* Modal Header - Fixed */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 scroll-smooth">
          {children}
        </div>

        {/* Modal Footer - Fixed (if provided) */}
        {footer && <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}

export default Modal
