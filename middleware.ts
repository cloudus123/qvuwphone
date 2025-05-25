import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // This is a simplified middleware for client-side auth
  // In a real app, you would validate the token on the server

  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/auth"

  // Check for auth token in cookies
  const token = request.cookies.get("qvuew_auth_token")?.value

  // Redirect logic
  if (isPublicPath && token) {
    // If user is authenticated and trying to access public path, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!isPublicPath && !token && path !== "/auth") {
    // If user is not authenticated and trying to access protected path, redirect to login
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons).*)"],
}
