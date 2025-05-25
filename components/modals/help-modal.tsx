"use client"

import { X } from "lucide-react"

export const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  // Handle FAQ button click
  const handleFAQClick = () => {
    // Open FAQ page in a new tab
    window.open("https://www.qvuew.app/faq", "_blank")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 rounded-t-xl z-10">
          <h3 className="text-lg font-bold text-blue-900 dark:text-white">Need Help with Device Connection?</h3>
          <button onClick={onClose} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ scrollBehavior: "smooth" }}>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Having trouble connecting?</h4>
              <ul className="space-y-3 text-blue-700 dark:text-blue-200">
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">
                    •
                  </span>
                  <span>Ensure Bluetooth/Wi-Fi is enabled.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">
                    •
                  </span>
                  <span>Move closer to the QVuew device.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300 flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">
                    •
                  </span>
                  <span>Make sure your device is powered ON.</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Bluetooth Connection Tips:</h4>
              <ul className="space-y-2 text-blue-700 dark:text-blue-200 text-sm">
                <li>• Ensure Bluetooth is enabled on your mobile device</li>
                <li>• The QVuew display should show a blinking blue light when ready to pair</li>
                <li>• Some devices may require location permissions for Bluetooth scanning</li>
                <li>• Try forgetting the device in your Bluetooth settings and reconnecting</li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">WiFi Connection Tips:</h4>
              <ul className="space-y-2 text-blue-700 dark:text-blue-200 text-sm">
                <li>• Ensure your phone and QVuew display are on the same WiFi network</li>
                <li>• Check if your WiFi network has device isolation turned off</li>
                <li>• The QVuew display should show a solid green light when connected to WiFi</li>
                <li>• Try restarting your WiFi router if problems persist</li>
              </ul>
            </div>

            <button
              onClick={handleFAQClick}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition duration-300"
            >
              Visit FAQ Page
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-blue-100 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
