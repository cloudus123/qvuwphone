// This file contains utility functions for QR code handling

/**
 * Process a QR code scan and refresh the token
 * @param token The scanned QR token
 * @param businessId The business ID
 * @param sessionId Optional session ID for hardware connection
 * @returns Promise with the new token data
 */
export async function processQRScan(token: string, businessId: string, sessionId?: string) {
  try {
    const response = await fetch("/api/qr-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        businessId,
        sessionId,
      }),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error processing QR scan:", error)
    throw error
  }
}

/**
 * Generate a new QR token
 * @param businessId The business ID
 * @param sessionId Optional session ID for hardware connection
 * @returns Promise with the new token data
 */
export async function generateQRToken(businessId: string, sessionId?: string) {
  try {
    let url = `/api/qr-code?businessId=${encodeURIComponent(businessId)}`
    if (sessionId) {
      url += `&sessionId=${encodeURIComponent(sessionId)}`
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating QR token:", error)
    throw error
  }
}
