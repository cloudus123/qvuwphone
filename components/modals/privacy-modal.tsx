"use client"

import { X, Shield, Lock, Eye, Database } from "lucide-react"

export const PrivacyModal = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 sticky top-0 bg-white rounded-t-xl z-10">
          <h3 className="text-lg font-bold text-blue-900">Privacy Policy</h3>
          <button onClick={onClose} className="text-blue-500 hover:text-blue-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ scrollBehavior: "smooth" }}>
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield size={32} className="text-blue-600" />
              </div>
            </div>

            <h2 className="text-lg font-bold text-blue-900 text-center">QVuew Privacy Policy</h2>
            <p className="text-sm text-blue-700 text-center">Last Updated: April 20, 2025</p>

            <div className="bg-blue-50 p-4 rounded-lg flex items-start mt-6">
              <Lock size={20} className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-800">Your privacy is important to us</h4>
                <p className="text-sm text-blue-700">
                  At QVuew, we respect your privacy and are committed to protecting your personal data.
                </p>
              </div>
            </div>

            <h3 className="font-semibold text-blue-800 mt-6">1. Information We Collect</h3>
            <p className="text-blue-700 text-sm">We collect information you provide directly to us when you:</p>
            <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1 mt-2">
              <li>Create an account</li>
              <li>Use our services</li>
              <li>Contact customer support</li>
              <li>Participate in surveys or promotions</li>
            </ul>

            <div className="flex items-start mt-4">
              <Database size={20} className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-blue-700 text-sm">
                <span className="font-semibold">Data Protection:</span> We do not sell or share your personal or
                customer data with third parties.
              </p>
            </div>

            <h3 className="font-semibold text-blue-800 mt-6">2. How We Use Your Information</h3>
            <p className="text-blue-700 text-sm">We use the information we collect to:</p>
            <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1 mt-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Develop new products and services</li>
            </ul>

            <div className="flex items-start mt-4">
              <Eye size={20} className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-blue-700 text-sm">
                <span className="font-semibold">Transparency:</span> All communication is encrypted via SSL. Location
                data (if used for maps) is not stored beyond session.
              </p>
            </div>

            <h3 className="font-semibold text-blue-800 mt-6">3. Information Sharing</h3>
            <p className="text-blue-700 text-sm">We may share your information with:</p>
            <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1 mt-2">
              <li>Service providers who perform services on our behalf</li>
              <li>Professional advisors, such as lawyers and accountants</li>
              <li>Regulatory authorities, when required by law</li>
            </ul>

            <h3 className="font-semibold text-blue-800 mt-6">4. Data Security</h3>
            <p className="text-blue-700 text-sm">
              We implement appropriate technical and organizational measures to protect your personal data against
              unauthorized or unlawful processing, accidental loss, destruction, or damage.
            </p>

            <h3 className="font-semibold text-blue-800 mt-6">5. Your Rights</h3>
            <p className="text-blue-700 text-sm">You have the right to:</p>
            <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1 mt-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
            </ul>

            <h3 className="font-semibold text-blue-800 mt-6">6. Changes to This Privacy Policy</h3>
            <p className="text-blue-700 text-sm">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last Updated" date.
            </p>

            <h3 className="font-semibold text-blue-800 mt-6">7. Contact Us</h3>
            <p className="text-blue-700 text-sm">
              If you have any questions about this Privacy Policy, please contact us at privacy@qvuew.app.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mt-6">
              <p className="text-blue-700 text-sm text-center font-medium">
                By using this app, you consent to this policy.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-blue-100 sticky bottom-0 bg-white rounded-b-xl flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-100 text-blue-700 font-medium rounded-lg hover:bg-gray-200 transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Accept Policy
          </button>
        </div>
      </div>
    </div>
  )
}
