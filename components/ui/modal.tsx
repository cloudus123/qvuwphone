"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: string
}

export function Modal({ isOpen, onClose, title, children, footer, maxWidth = "md" }: ModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
      // Small delay for animation
      setTimeout(() => setIsVisible(true), 10)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  // Determine max width class
  const maxWidthClass =
    {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      full: "max-w-full",
    }[maxWidth] || "max-w-md"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
      onClick={handleBackdropClick}
    >
      <div
        className={`${maxWidthClass} w-full max-h-[80vh] flex flex-col rounded-xl bg-white shadow-xl transition-transform duration-300 transform ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        {/* Modal Header - Fixed */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scroll-smooth">
          {children}
        </div>

        {/* Modal Footer - Fixed (if provided) */}
        {footer && <div className="border-t border-gray-200 px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}
