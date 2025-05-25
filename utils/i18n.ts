"use client"

// Enhanced i18n utility for the app with comprehensive translation support

// Define the structure of our translations
type TranslationDictionary = {
  [key: string]: string
}

// Define the structure of our language packs
type LanguagePack = {
  [language: string]: TranslationDictionary
}

// Sample translations for demonstration
// In a real app, these would be loaded from JSON files
const translations: LanguagePack = {
  English: {
    // General
    "app.name": "QVuew Business App",
    "app.tagline": "Manage your business queue efficiently",
    "language.changed": "Language updated to",

    // Navigation
    "nav.queue": "Queue",
    "nav.stats": "Stats",
    "nav.premium": "Premium",
    "nav.settings": "Settings",
    "nav.logout": "Logout",

    // Settings
    "settings.title": "Settings",
    "settings.profile": "Profile Information",
    "settings.general": "General Settings",
    "settings.queue": "Queue Settings",
    "settings.account": "Account",
    "settings.edit": "Edit",
    "settings.save": "Save",
    "settings.cancel": "Cancel",

    // Profile fields
    "profile.fullName": "Full Name",
    "profile.email": "Email",
    "profile.businessName": "Business Name",
    "profile.businessType": "Business Type",
    "profile.businessAddress": "Business Address",
    "profile.phoneNumber": "Phone Number",
    "profile.notProvided": "Not provided",

    // Settings options
    "settings.notifications": "Notifications",
    "settings.darkMode": "Dark Mode",
    "settings.language": "Language",
    "settings.inactivityReminder": "Inactivity Reminder",
    "settings.reminderAfter": "Reminder after",
    "settings.minutes": "minutes",
    "settings.privacyMode": "Privacy Mode",
    "settings.privacyModeDesc": "Hides customer phone numbers and personal details from the queue display",

    // Account options
    "account.title": "Account",
    "account.privacyPolicy": "Privacy Policy",
    "account.termsOfService": "Terms of Service",
    "account.logout": "Logout",

    // Location
    "location.detect": "Detect Location",
    "location.getting": "Getting address...",
    "location.allow": "Allow Location Access",
    "location.description": "QVuew would like to access your location to detect your business address.",
    "location.deny": "Deny",
    "location.allow.button": "Allow",

    // Dashboard
    "dashboard.currentQueue": "Current Queue",
    "dashboard.nextCustomer": "Next Customer",
    "dashboard.nextInQueue": "Next in Queue",
    "dashboard.viewAll": "View All",
    "dashboard.noCustomers": "No customers waiting in queue",
    "dashboard.todayStats": "Today's Stats",
    "dashboard.inQueue": "In Queue",
    "dashboard.served": "Served",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.customerHistory": "Customer History",
    "dashboard.addCustomer": "Add Customer Manually",

    // Customer Details
    "customer.details": "Customer Details",
    "customer.contactInfo": "Contact Information",
    "customer.queueInfo": "Queue Information",
    "customer.serviceInfo": "Service Information",
    "customer.addTime": "Add Extra Time",
    "customer.recentHistory": "Recent History",
    "customer.noActivity": "No recent activity found",

    // Buttons
    "button.details": "Details",
    "button.next": "Next",
    "button.call": "Call",
    "button.cancel": "Cancel",
    "button.hold": "Hold",
    "button.unhold": "Unhold",
    "button.skip": "Skip",
    "button.remove": "Remove",
    "button.add": "Add",
    "button.close": "Close",
    "button.back": "Back",

    // Stats page
    "stats.title": "Statistics",
    "stats.timeRange": "Time Range",
    "stats.customersServed": "Customers Served",
    "stats.avgWaitTime": "Avg. Wait Time",
    "stats.customersSkipped": "Customers Skipped",
    "stats.customersLeft": "Customers Left",
    "stats.customerDistribution": "Customer Distribution",
    "stats.total": "total",
    "stats.customerInsights": "Customer Insights",
    "stats.visited": "Visited",
    "stats.served": "Served",
    "stats.conversion": "Conversion",
    "stats.retention": "Retention",
    "stats.keyInsights": "Key Insights",
    "stats.trafficTrend": "Traffic trend",
    "stats.customerRetention": "Customer retention",
    "stats.bestDay": "Best performing day",
    "stats.attentionNeeded": "Attention needed",
    "stats.peakHours": "Peak Hours",
    "stats.serviceCompletion": "Service Completion",
    "stats.completed": "Completed",
  },

  हिन्दी: {
    // General
    "app.name": "क्यूव्यू बिज़नेस ऐप",
    "app.tagline": "अपने व्यापार की कतार को कुशलतापूर्वक प्रबंधित करें",
    "language.changed": "भाषा बदल दी गई है",

    // Navigation
    "nav.queue": "कतार",
    "nav.stats": "आँकड़े",
    "nav.premium": "प्रीमियम",
    "nav.settings": "सेटिंग्स",
    "nav.logout": "लॉगआउट",

    // Settings
    "settings.title": "सेटिंग्स",
    "settings.profile": "प्रोफ़ाइल जानकारी",
    "settings.general": "सामान्य सेटिंग्स",
    "settings.queue": "कतार सेटिंग्स",
    "settings.account": "खाता",
    "settings.edit": "संपादित करें",
    "settings.save": "सहेजें",
    "settings.cancel": "रद्द करें",

    // Profile fields
    "profile.fullName": "पूरा नाम",
    "profile.email": "ईमेल",
    "profile.businessName": "व्यापार का नाम",
    "profile.businessType": "व्यापार का प्रकार",
    "profile.businessAddress": "व्यापार का पता",
    "profile.phoneNumber": "फ़ोन नंबर",
    "profile.notProvided": "प्रदान नहीं किया गया",

    // Settings options
    "settings.notifications": "सूचनाएँ",
    "settings.darkMode": "डार्क मोड",
    "settings.language": "भाषा",
    "settings.inactivityReminder": "निष्क्रियता अनुस्मारक",
    "settings.reminderAfter": "के बाद अनुस्मारक",
    "settings.minutes": "मिनट",
    "settings.privacyMode": "गोपनीयता मोड",
    "settings.privacyModeDesc": "कतार प्रदर्शन से ग्राहक फोन नंबर और व्यक्तिगत विवरण छिपाता है",

    // Account options
    "account.title": "खाता",
    "account.privacyPolicy": "गोपनीयता नीति",
    "account.termsOfService": "सेवा की शर्तें",
    "account.logout": "लॉगआउट",

    // Location
    "location.detect": "स्थान का पता लगाएं",
    "location.getting": "पता प्राप्त कर रहे हैं...",
    "location.allow": "स्थान एक्सेस की अनुमति दें",
    "location.description": "क्यूव्यू आपके व्यापार का पता पता लगाने के लिए आपके स्थान तक पहुंचना चाहता है।",
    "location.deny": "अस्वीकार करें",
    "location.allow.button": "अनुमति दें",

    // Dashboard
    "dashboard.currentQueue": "वर्तमान कतार",
    "dashboard.nextCustomer": "अगला ग्राहक",
    "dashboard.nextInQueue": "कतार में अगला",
    "dashboard.viewAll": "सभी देखें",
    "dashboard.noCustomers": "कतार में कोई ग्राहक प्रतीक्षा नहीं कर रहा है",
    "dashboard.todayStats": "आज के आंकड़े",
    "dashboard.inQueue": "कतार में",
    "dashboard.served": "सेवा की गई",
    "dashboard.quickActions": "त्वरित कार्रवाई",
    "dashboard.customerHistory": "ग्राहक इतिहास",
    "dashboard.addCustomer": "मैन्युअल रूप से ग्राहक जोड़ें",

    // Customer Details
    "customer.details": "ग्राहक विवरण",
    "customer.contactInfo": "संपर्क जानकारी",
    "customer.queueInfo": "कतार जानकारी",
    "customer.serviceInfo": "सेवा जानकारी",
    "customer.addTime": "अतिरिक्त समय जोड़ें",
    "customer.recentHistory": "हाल का इतिहास",
    "customer.noActivity": "कोई हालिया गतिविधि नहीं मिली",

    // Buttons
    "button.details": "विवरण",
    "button.next": "अगला",
    "button.call": "कॉल करें",
    "button.cancel": "रद्द करें",
    "button.hold": "रोकें",
    "button.unhold": "जारी रखें",
    "button.skip": "छोड़ें",
    "button.remove": "हटाएं",
    "button.add": "जोड़ें",
    "button.close": "बंद करें",
    "button.back": "वापस",

    // Stats page
    "stats.title": "आँकड़े",
    "stats.timeRange": "समय सीमा",
    "stats.customersServed": "सेवा किए गए ग्राहक",
    "stats.avgWaitTime": "औसत प्रतीक्षा समय",
    "stats.customersSkipped": "छोड़े गए ग्राहक",
    "stats.customersLeft": "चले गए ग्राहक",
    "stats.customerDistribution": "ग्राहक वितरण",
    "stats.total": "कुल",
    "stats.customerInsights": "ग्राहक अंतर्दृष्टि",
    "stats.visited": "आए",
    "stats.served": "सेवा की गई",
    "stats.conversion": "रूपांतरण",
    "stats.retention": "प्रतिधारण",
    "stats.keyInsights": "प्रमुख अंतर्दृष्टि",
    "stats.trafficTrend": "ट्रैफ़िक प्रवृत्ति",
    "stats.customerRetention": "ग्राहक प्रतिधारण",
    "stats.bestDay": "सर्वश्रेष्ठ प्रदर्शन दिन",
    "stats.attentionNeeded": "ध्यान देने की आवश्यकता",
    "stats.peakHours": "व्यस्त घंटे",
    "stats.serviceCompletion": "सेवा पूर्णता",
    "stats.completed": "पूर्ण",
  },

  // Add more languages as needed
  తెలుగు: {
    // Basic translations for Telugu
    "settings.language": "భాష",
    "nav.queue": "క్యూ",
    "nav.settings": "సెట్టింగులు",
    "settings.title": "సెట్టింగులు",
    "settings.profile": "ప్రొఫైల్ సమాచారం",
    "settings.general": "సాధారణ సెట్టింగులు",
    "settings.queue": "క్యూ సెట్టింగులు",
    "settings.account": "ఖాతా",
    "settings.edit": "సవరించు",
    "settings.save": "సేవ్ చేయి",
    "settings.cancel": "రద్దు చేయి",
    "profile.fullName": "పూర్తి పేరు",
    "profile.email": "ఇమెయిల్",
    "profile.businessName": "వ్యాపార పేరు",
    "profile.businessType": "వ్యాపార రకం",
    "profile.businessAddress": "వ్యాపార చిరునామా",
    "profile.phoneNumber": "ఫోన్ నంబర్",
    "profile.notProvided": "అందించబడలేదు",
    "settings.notifications": "నోటిఫికేషన్లు",
    "settings.darkMode": "డార్క్ మోడ్",
    "settings.inactivityReminder": "నిష్క్రియత రిమైండర్",
    "settings.reminderAfter": "తర్వాత రిమైండర్",
    "settings.minutes": "నిమిషాలు",
    "settings.privacyMode": "గోప్యతా మోడ్",
    "language.changed": "భాష మార్చబడింది",
    // Add more translations as needed
  },

  தமிழ்: {
    // Basic translations for Tamil
    "settings.language": "மொழி",
    "nav.queue": "வரிசை",
    "nav.settings": "அமைப்புகள்",
    "settings.title": "அமைப்புகள்",
    "settings.profile": "சுயவிவரத் தகவல்",
    "settings.general": "பொது அமைப்புகள்",
    "settings.queue": "வரிசை அமைப்புகள்",
    "settings.account": "கணக்கு",
    "settings.edit": "திருத்து",
    "settings.save": "சேமி",
    "settings.cancel": "ரத்து செய்",
    "profile.fullName": "முழு பெயர்",
    "profile.email": "மின்னஞ்சல்",
    "profile.businessName": "வணிகப் பெயர்",
    "profile.businessType": "வணிக வகை",
    "profile.businessAddress": "வணிக முகவரி",
    "profile.phoneNumber": "தொலைபேசி எண்",
    "profile.notProvided": "வழங்கப்படவில்லை",
    "settings.notifications": "அறிவிப்புகள்",
    "settings.darkMode": "இருள் பயன்முறை",
    "settings.inactivityReminder": "செயலற்ற நினைவூட்டல்",
    "settings.reminderAfter": "பின்னர் நினைவூட்டல்",
    "settings.minutes": "நிமிடங்கள்",
    "settings.privacyMode": "தனியுரிமை பயன்முறை",
    "language.changed": "மொழி புதுப்பிக்கப்பட்டது",
    // Add more translations as needed
  },

  // Add translations for other languages
  বাংলা: {
    "settings.language": "ভাষা",
    "language.changed": "ভাষা পরিবর্তন করা হয়েছে",
    // Add more translations as needed
  },

  मराठी: {
    "settings.language": "भाषा",
    "language.changed": "भाषा बदलली",
    // Add more translations as needed
  },

  اردو: {
    "settings.language": "زبان",
    "language.changed": "زبان تبدیل کر دی گئی ہے",
    // Add more translations as needed
  },

  ગુજરાતી: {
    "settings.language": "ભાષા",
    "language.changed": "ભાષા બદલાઈ ગઈ છે",
    // Add more translations as needed
  },

  ಕನ್ನಡ: {
    "settings.language": "ಭಾಷೆ",
    "language.changed": "ಭಾಷೆ ಬದಲಾಯಿಸಲಾಗಿದೆ",
    // Add more translations as needed
  },

  ଓଡ଼ିଆ: {
    "settings.language": "ଭାଷା",
    "language.changed": "ଭାଷା ପରିବର୍ତ୍ତନ କରାଯାଇଛି",
    // Add more translations as needed
  },

  മലയാളം: {
    "settings.language": "ഭാഷ",
    "language.changed": "ഭാഷ മാറ്റി",
    // Add more translations as needed
  },

  ਪੰਜਾਬੀ: {
    "settings.language": "ਭ��ਸ਼ਾ",
    "language.changed": "ਭਾਸ਼ਾ ਬਦਲੀ ਗਈ ਹੈ",
    // Add more translations as needed
  },

  অসমীয়া: {
    "settings.language": "ভাষা",
    "language.changed": "ভাষা সলনি কৰা হৈছে",
    // Add more translations as needed
  },

  मैथिली: {
    "settings.language": "भाषा",
    "language.changed": "भाषा बदलल गेल अछि",
    // Add more translations as needed
  },

  ᱥᱟᱱᱛᱟᱲᱤ: {
    "settings.language": "ᱯᱟᱹᱨᱥᱤ",
    "language.changed": "ᱯᱟᱹᱨᱥᱤ ᱵᱚᱫᱚᱞ ᱮᱱᱟ",
    // Add more translations as needed
  },
}

// Global language state
let currentLanguage = "English"

// Get translation for a key in the current language
export function translate(key: string, language = currentLanguage): string {
  // If the language doesn't exist, fall back to English
  if (!translations[language]) {
    language = "English"
  }

  // If the key doesn't exist in the selected language, fall back to English
  if (!translations[language][key]) {
    console.warn(`Missing translation for key "${key}" in language "${language}"`)
    return translations.English[key] || key
  }

  return translations[language][key]
}

// Change the current language
export function changeLanguage(language: string): void {
  if (translations[language]) {
    currentLanguage = language

    // Save to localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("app_language", language)

      // Update document language attribute
      document.documentElement.setAttribute("lang", language.toLowerCase().split(" ")[0])

      // Trigger a custom event that components can listen for
      const event = new CustomEvent("languageChange", { detail: language })
      window.dispatchEvent(event)

      // Update any data-language attributes in the DOM for CSS selectors
      document.documentElement.setAttribute("data-language", language)
    }
  } else {
    console.warn(`Language "${language}" not supported, falling back to English`)
    currentLanguage = "English"

    if (typeof window !== "undefined") {
      localStorage.setItem("app_language", "English")
      document.documentElement.setAttribute("lang", "en")
      document.documentElement.setAttribute("data-language", "English")
    }
  }
}

import { useState, useEffect, useCallback } from "react"

// Hook to use translations
export function useTranslation(initialLanguage = currentLanguage) {
  const [currentLang, setCurrentLang] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("app_language")
      return savedLanguage && translations[savedLanguage] ? savedLanguage : initialLanguage
    }
    return initialLanguage
  })

  const [forceUpdate, setForceUpdate] = useState(0) // Add this to force re-renders

  useEffect(() => {
    // Listen for language change events
    const handleLanguageChange = (e: CustomEvent) => {
      if (e.detail && translations[e.detail]) {
        setCurrentLang(e.detail)
        setForceUpdate((prev) => prev + 1) // Force re-render when language changes
      }
    }

    if (typeof window !== "undefined") {
      // Check localStorage again in case it changed
      const savedLanguage = localStorage.getItem("app_language")
      if (savedLanguage && translations[savedLanguage] && savedLanguage !== currentLang) {
        setCurrentLang(savedLanguage)
      }

      window.addEventListener("languageChange", handleLanguageChange as EventListener)
      return () => {
        window.removeEventListener("languageChange", handleLanguageChange as EventListener)
      }
    }
  }, [currentLang])

  // Translation function
  const t = useCallback((key: string) => translate(key, currentLang), [currentLang, forceUpdate])

  const changeAppLanguage = (lang: string) => {
    changeLanguage(lang)
  }

  return {
    t,
    changeLanguage: (lang: string) => {
      changeAppLanguage(lang)
      setCurrentLang(lang)
    },
    currentLanguage: currentLang,
  }
}

// Initialize language from localStorage on page load
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    const savedLanguage = localStorage.getItem("app_language")
    if (savedLanguage && translations[savedLanguage]) {
      currentLanguage = savedLanguage
      document.documentElement.setAttribute("lang", savedLanguage.toLowerCase().split(" ")[0])
      document.documentElement.setAttribute("data-language", savedLanguage)
    }
  })
}
