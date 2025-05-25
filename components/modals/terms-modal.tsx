"use client"

import { X } from "lucide-react"

export const TermsModal = ({ isOpen, onClose, onAgree }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-4 border-b border-blue-100 sticky top-0 bg-white rounded-t-xl z-10">
          <h3 className="text-lg font-bold text-blue-900">Terms of Service</h3>
          <button onClick={onClose} className="text-blue-500 hover:text-blue-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ scrollBehavior: "smooth" }}>
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-blue-900">QVuew Terms of Service</h2>
            <p className="text-sm text-blue-700">Last Updated: April 20, 2025</p>

            <h3 className="font-semibold text-blue-800 mt-6">1. Acceptance of Terms</h3>
            <p className="text-blue-700 text-sm">
              Welcome to QVuew. By accessing or using our queue management service, you agree to be bound by these Terms
              of Service.
            </p>

            <h3 className="font-semibold text-blue-800 mt-4">2. Description of Service</h3>
            <p className="text-blue-700 text-sm">
              QVuew provides a queue management system for businesses to organize customer flow and improve service
              efficiency. The service includes mobile applications, display screens, and web interfaces.
            </p>

            <h3 className="font-semibold text-blue-800 mt-4">3. User Accounts</h3>
            <p className="text-blue-700 text-sm">
              You are responsible for maintaining the confidentiality of your account information, including your
              password, and for all activity that occurs under your account. You must notify QVuew immediately of any
              unauthorized use of your account.
            </p>

            <h3 className="font-semibold text-blue-800 mt-4">4. Privacy Policy</h3>
            <p className="text-blue-700 text-sm">
              Your use of QVuew is also governed by our Privacy Policy, which is incorporated by reference into these
              Terms of Service.
            </p>

            <h3 className="font-semibold text-blue-800 mt-4">5. User Conduct</h3>
            <p className="text-blue-700 text-sm">You agree not to use the service to:</p>
            <ul className="list-disc pl-5 text-blue-700 text-sm space-y-1 mt-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe the rights of any third party</li>
              <li>Transmit any material that is unlawful, harmful, threatening, abusive, or otherwise objectionable</li>
              <li>Interfere with or disrupt the service or servers or networks connected to the service</li>
              <li>Attempt to gain unauthorized access to any part of the service</li>
            </ul>

            <h3 className="font-semibold text-blue-800 mt-4">6. Intellectual Property</h3>
            <p className="text-blue-700 text-sm">
              All content included on or comprising the service, including text, graphics, logos, and software, is the
              property of QVuew or its suppliers and is protected by copyright and other laws.
            </p>

            <h3 className="font-semibold text-blue-800 mt-4">7. Termination</h3>
            <p className="text-blue-700 text-sm">
              QVuew may terminate your access to all or any part of the service at any time, with or without cause, with
              or without notice, effective immediately.
            </p>

            <h3 className="font-semibold text-blue-800 mt-4">8. Disclaimer of Warranties</h3>
            <p className="text-blue-700 text-sm">
              The service is provided "as is" and "as available" without warranty of any kind, either express or
              implied, including but not limited to, the implied warranties of merchantability, fitness for a particular
              purpose, or non-infringement.
            </p>

            <h3 className="font-semibold text-blue-800 mt-4">9. Limitation of Liability</h3>
            <p className="text-blue-700 text-sm">
              In no event shall QVuew be liable for any direct, indirect, incidental, special, exemplary, or
              consequential damages arising out of or in connection with the use of the service.
            </p>

            <h3 className="font-semibold text-blue-800 mt-4">10. Changes to Terms</h3>
            <p className="text-blue-700 text-sm">
              QVuew reserves the right to modify these Terms of Service at any time. We will notify users of any changes
              by posting the new Terms of Service on this page.
            </p>

            <h3 className="font-semibold text-blue-800 mt-4">11. Governing Law</h3>
            <p className="text-blue-700 text-sm">
              These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction
              in which QVuew is established, without regard to its conflict of law provisions.
            </p>

            <h3 className="font-semibold text-blue-800 mt-4">12. Contact Information</h3>
            <p className="text-blue-700 text-sm">
              For any questions about these Terms of Service, please contact us at legal@qvuew.app.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-blue-100 sticky bottom-0 bg-white rounded-b-xl flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-100 text-blue-700 font-medium rounded-lg hover:bg-gray-200 transition duration-300"
          >
            Disagree
          </button>
          <button
            onClick={onAgree}
            className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Agree & Continue
          </button>
        </div>
      </div>
    </div>
  )
}
