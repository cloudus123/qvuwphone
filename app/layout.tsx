import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import { NavigationProvider } from "@/context/NavigationContext"
import { ThemeProvider } from "@/context/ThemeContext"
import { LanguageProvider } from "@/components/LanguageProvider"

export const metadata: Metadata = {
  title: "QVuew Business App",
  description: "Manage your business queue efficiently",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
    (function() {
      try {
        // Default to light mode
        const savedTheme = localStorage.getItem('theme');
        
        // Only apply dark mode if explicitly set to dark
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          // Ensure dark mode is removed if not explicitly set
          document.documentElement.classList.remove('dark');
          
          // If no theme is set, initialize to light
          if (!savedTheme) {
            localStorage.setItem('theme', 'light');
          }
        }

        // Initialize language attribute
        const savedLanguage = localStorage.getItem('app_language');
        if (savedLanguage) {
          document.documentElement.setAttribute('lang', savedLanguage);
          // Force language to be applied immediately
          window.APP_LANGUAGE = savedLanguage;
          
          // Dispatch language change event to ensure all components update
          if (typeof window.dispatchEvent === 'function') {
            setTimeout(function() {
              window.dispatchEvent(new CustomEvent('languageChange', { detail: savedLanguage }));
            }, 0);
          }
        } else {
          localStorage.setItem('app_language', 'English');
          document.documentElement.setAttribute('lang', 'English');
          window.APP_LANGUAGE = 'English';
        }
      } catch (e) {
        console.error('Error applying theme/language on load:', e);
      }
    })();
  `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <NavigationProvider>
            <ThemeProvider>
              <LanguageProvider>{children}</LanguageProvider>
            </ThemeProvider>
          </NavigationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
