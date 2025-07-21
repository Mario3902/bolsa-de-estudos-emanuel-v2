import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  console.log("Middleware running for:", request.nextUrl.pathname)

  // Check if it's an admin route (except login)
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("auth_token")?.value
    console.log("Token found:", !!token, token)

    if (!token || token !== "authenticated-admin-session") {
      console.log("Redirecting to login")
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}
