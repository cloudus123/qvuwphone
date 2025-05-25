"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, CreditCard, Lock, CheckCircle, AlertCircle, Info } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") || "monthly"
  const price = searchParams.get("price") || "$9.99"

  const [paymentStep, setPaymentStep] = useState("details") // details, processing, success, error, otp
  const [paymentMethod, setPaymentMethod] = useState("card") // card, upi, netbanking, wallet
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
    upiId: "",
    otp: "",
  })
  const [errors, setErrors] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
    otp: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target

    if (name === "cardNumber") {
      setFormData({
        ...formData,
        [name]: formatCardNumber(value),
      })
    } else if (name === "expiryDate") {
      setFormData({
        ...formData,
        [name]: formatExpiryDate(value),
      })
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      })
    }

    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
      upiId: "",
      otp: "",
    }
    let isValid = true

    // Card number validation (16 digits, Luhn algorithm check)
    const cardNumberClean = formData.cardNumber.replace(/\s/g, "")
    if (!cardNumberClean || cardNumberClean.length !== 16 || !/^\d+$/.test(cardNumberClean)) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number"
      isValid = false
    }

    // Card name validation
    if (!formData.cardName.trim()) {
      newErrors.cardName = "Please enter the name on your card"
      isValid = false
    }

    // Expiry date validation (MM/YY format, not expired)
    const expiryPattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
    if (!expiryPattern.test(formData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)"
      isValid = false
    } else {
      const [month, year] = formData.expiryDate.split("/")
      const expiryDate = new Date(2000 + Number.parseInt(year), Number.parseInt(month) - 1, 1)
      const today = new Date()

      if (expiryDate < today) {
        newErrors.expiryDate = "Your card has expired"
        isValid = false
      }
    }

    // CVV validation (3-4 digits)
    if (!/^[0-9]{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "Please enter a valid 3 or 4 digit CVV"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const validateOtp = () => {
    if (formData.otp.length !== 6 || !/^\d+$/.test(formData.otp)) {
      return false
    }
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === "card" && !validateForm()) {
      return
    }

    if (paymentMethod === "upi" && (!formData.upiId || !formData.upiId.includes("@"))) {
      setErrors({
        ...errors,
        upiId: "Please enter a valid UPI ID",
      })
      return
    }

    setIsProcessing(true)
    setPaymentStep("processing")

    // Simulate payment processing
    setTimeout(() => {
      // For demo purposes, show OTP verification for all successful initial validations
      setPaymentStep("otp")
      setIsProcessing(false)
    }, 2000)
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateOtp()) {
      setErrors({
        ...errors,
        otp: "Please enter a valid 6-digit OTP",
      })
      return
    }

    setIsProcessing(true)

    // Simulate OTP verification
    setTimeout(() => {
      // 90% chance of success for demo purposes
      const isSuccess = Math.random() < 0.9

      if (isSuccess) {
        setPaymentStep("success")
      } else {
        setPaymentStep("error")
      }

      setIsProcessing(false)
    }, 1500)
  }

  const handleTryAgain = () => {
    setPaymentStep("details")
  }

  const handleGoToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="flex items-center">
          <button onClick={() => router.push("/premium")} className="mr-3">
            <ArrowLeft size={20} className="text-blue-600" />
          </button>
          <h1 className="text-lg font-bold text-blue-900 dark:text-blue-100">Secure Payment</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 pb-16">
        <div className="max-w-md mx-auto">
          {paymentStep === "details" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mb-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100">Payment Details</h2>
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <Lock size={16} className="mr-1" />
                  <span className="text-xs font-medium">Secure Payment</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700 dark:text-blue-300">Plan:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-100 capitalize">{plan}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-blue-700 dark:text-blue-300">Amount:</span>
                  <span className="font-medium text-blue-900 dark:text-blue-100">{price}</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-2 rounded-lg flex flex-col items-center justify-center text-xs ${
                      paymentMethod === "card"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-500"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <CreditCard size={20} className="mb-1" />
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-2 rounded-lg flex flex-col items-center justify-center text-xs ${
                      paymentMethod === "upi"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-500"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      className="mb-1"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 0L1 7v10l11 7 11-7V7L12 0zm-1 5.9c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z" />
                    </svg>
                    UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("netbanking")}
                    className={`p-2 rounded-lg flex flex-col items-center justify-center text-xs ${
                      paymentMethod === "netbanking"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-500"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      className="mb-1"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M4 10v7h16v-7H4zm12 5H8v-1h8v1zm-8-2h8v1H8v-1z" />
                      <path d="M21 7H3a1 1 0 00-1 1v10a1 1 0 001 1h18a1 1 0 001-1V8a1 1 0 00-1-1zm-1 10H4v-7h16v7z" />
                      <path d="M12 6h2v2h-2zM16 6h2v2h-2zM8 6h2v2H8z" />
                    </svg>
                    NetBanking
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("wallet")}
                    className={`p-2 rounded-lg flex flex-col items-center justify-center text-xs ${
                      paymentMethod === "wallet"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-500"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      className="mb-1"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M21 7.28V5c0-1.1-.9-2-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2v-2.28A2 2 0 0022 15V9a2 2 0 00-1-1.72zM20 9v6h-7V9h7zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2H5z" />
                      <circle cx="16" cy="12" r="1.5" />
                    </svg>
                    Wallet
                  </button>
                </div>
              </div>

              {paymentMethod === "card" && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="cardNumber"
                      className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1"
                    >
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={`w-full px-4 py-2 border ${
                          errors.cardNumber ? "border-red-500" : "border-blue-200 dark:border-blue-800"
                        } rounded-lg bg-white dark:bg-gray-700 text-blue-900 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      <CreditCard
                        size={18}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400"
                      />
                    </div>
                    {errors.cardNumber && <p className="mt-1 text-xs text-red-500">{errors.cardNumber}</p>}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="cardName"
                      className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1"
                    >
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="John Smith"
                      className={`w-full px-4 py-2 border ${
                        errors.cardName ? "border-red-500" : "border-blue-200 dark:border-blue-800"
                      } rounded-lg bg-white dark:bg-gray-700 text-blue-900 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.cardName && <p className="mt-1 text-xs text-red-500">{errors.cardName}</p>}
                  </div>

                  <div className="flex space-x-4 mb-4">
                    <div className="w-1/2">
                      <label
                        htmlFor="expiryDate"
                        className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1"
                      >
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={`w-full px-4 py-2 border ${
                          errors.expiryDate ? "border-red-500" : "border-blue-200 dark:border-blue-800"
                        } rounded-lg bg-white dark:bg-gray-700 text-blue-900 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.expiryDate && <p className="mt-1 text-xs text-red-500">{errors.expiryDate}</p>}
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="cvv" className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                        CVV
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength={4}
                          className={`w-full px-4 py-2 border ${
                            errors.cvv ? "border-red-500" : "border-blue-200 dark:border-blue-800"
                          } rounded-lg bg-white dark:bg-gray-700 text-blue-900 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Info
                            size={16}
                            className="text-blue-400 cursor-help"
                            title="3 or 4 digit security code on the back of your card"
                          />
                        </div>
                      </div>
                      {errors.cvv && <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>}
                    </div>
                  </div>

                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      id="saveCard"
                      name="saveCard"
                      checked={formData.saveCard}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="saveCard" className="ml-2 block text-sm text-blue-700 dark:text-blue-300">
                      Save card for future payments
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <Lock size={16} className="mr-2" />
                    Pay {price}
                  </button>
                </form>
              )}

              {paymentMethod === "upi" && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex flex-col items-center">
                      <div className="mb-4 w-48 h-48 bg-white p-3 rounded-lg">
                        <div className="w-full h-full border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                          <div className="text-center">
                            <div className="mb-2 flex justify-center">
                              <svg
                                viewBox="0 0 24 24"
                                width="40"
                                height="40"
                                fill="currentColor"
                                className="text-blue-600"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M12 0L1 7v10l11 7 11-7V7L12 0zm-1 5.9c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z" />
                              </svg>
                            </div>
                            <p className="text-sm font-medium text-blue-900">Scan QR with any UPI app</p>
                            <p className="text-xs text-gray-500 mt-1">Google Pay, PhonePe, Paytm, etc.</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Scan to pay {price}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="relative flex items-center">
                      <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                      <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
                      <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="upiId" className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                      Enter UPI ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="upiId"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleInputChange}
                        placeholder="yourname@upi"
                        className={`w-full px-4 py-2 border ${
                          errors.upiId ? "border-red-500" : "border-blue-200 dark:border-blue-800"
                        } rounded-lg bg-white dark:bg-gray-700 text-blue-900 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="currentColor"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 0L1 7v10l11 7 11-7V7L12 0zm-1 5.9c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z" />
                      </svg>
                    </div>
                    {errors.upiId && <p className="mt-1 text-xs text-red-500">{errors.upiId}</p>}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Example: yourname@okhdfcbank, yourname@ybl
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <Lock size={16} className="mr-2" />
                    Pay {price}
                  </button>
                </form>
              )}

              {paymentMethod === "netbanking" && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-3">
                      Select Your Bank
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["HDFC", "SBI", "ICICI", "Axis", "Kotak", "Yes"].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          className="p-3 border border-blue-200 dark:border-blue-800 rounded-lg bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
                        >
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">{bank}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Bank</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="otherBank"
                      className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1"
                    >
                      Other Banks
                    </label>
                    <select
                      id="otherBank"
                      className="w-full px-4 py-2 border border-blue-200 dark:border-blue-800 rounded-lg bg-white dark:bg-gray-700 text-blue-900 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a bank</option>
                      <option value="pnb">Punjab National Bank</option>
                      <option value="bob">Bank of Baroda</option>
                      <option value="idfc">IDFC First Bank</option>
                      <option value="federal">Federal Bank</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <Lock size={16} className="mr-2" />
                    Pay {price}
                  </button>
                </form>
              )}

              {paymentMethod === "wallet" && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-3">
                      Select Wallet
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Paytm", "PhonePe", "Amazon Pay", "MobiKwik", "FreeCharge", "Airtel Money"].map((wallet) => (
                        <button
                          key={wallet}
                          type="button"
                          className="p-3 border border-blue-200 dark:border-blue-800 rounded-lg bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
                        >
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">{wallet.split(" ")[0]}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {wallet.includes(" ") ? wallet.split(" ")[1] : "Wallet"}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <Lock size={16} className="mr-2" />
                    Pay {price}
                  </button>
                </form>
              )}

              <div className="mt-4 text-center text-xs text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Lock size={12} className="mr-1" />
                <span>Your payment information is encrypted and secure</span>
              </div>
            </div>
          )}

          {paymentStep === "otp" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Lock size={32} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mt-4 mb-1">OTP Verification</h2>
                <p className="text-blue-700 dark:text-blue-300">
                  Enter the 6-digit code sent to your registered mobile number
                </p>
              </div>

              <form onSubmit={handleVerifyOtp}>
                <div className="mb-6">
                  <label htmlFor="otp" className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="123456"
                    maxLength={6}
                    className={`w-full px-4 py-3 text-center text-lg tracking-widest border ${
                      errors.otp ? "border-red-500" : "border-blue-200 dark:border-blue-800"
                    } rounded-lg bg-white dark:bg-gray-700 text-blue-900 dark:text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.otp && <p className="mt-1 text-xs text-red-500">{errors.otp}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Verify & Pay
                </button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Didn't receive the code?{" "}
                    <button type="button" className="text-blue-600 dark:text-blue-400 font-medium">
                      Resend OTP
                    </button>
                  </p>
                </div>
              </form>
            </div>
          )}

          {paymentStep === "processing" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-4 text-center">
              <div className="animate-pulse mb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <CreditCard size={32} className="text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">Processing Payment</h2>
              <p className="text-blue-700 dark:text-blue-300 mb-4">Please wait while we process your payment...</p>
              <div className="w-full bg-blue-100 dark:bg-blue-900 rounded-full h-2 mb-4">
                <div className="bg-blue-600 h-2 rounded-full animate-[loading_1.5s_ease-in-out_infinite]"></div>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                This may take a few moments. Please don't close this page.
              </p>
            </div>
          )}

          {paymentStep === "success" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-4 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">Payment Successful!</h2>
              <p className="text-blue-700 dark:text-blue-300 mb-6">
                Thank you for upgrading to QVuew Premium. Your subscription is now active.
              </p>
              <button
                onClick={handleGoToDashboard}
                className="w-full py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {paymentStep === "error" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-4 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <AlertCircle size={32} className="text-red-600 dark:text-red-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">Payment Failed</h2>
              <p className="text-blue-700 dark:text-blue-300 mb-6">
                We couldn't process your payment. Please check your details and try again.
              </p>
              <button
                onClick={handleTryAgain}
                className="w-full py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Payment Methods */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <p className="text-sm text-center text-blue-700 dark:text-blue-300 mb-3">Accepted Payment Methods</p>
            <div className="flex justify-center space-x-3">
              <div className="w-12 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-100">VISA</span>
              </div>
              <div className="w-12 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-100">MC</span>
              </div>
              <div className="w-12 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-100">AMEX</span>
              </div>
              <div className="w-12 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-100">UPI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animation for loading */}
      <style jsx>{`
        @keyframes loading {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          75% {
            width: 90%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
