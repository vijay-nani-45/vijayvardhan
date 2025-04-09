import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get("origin") || ""

  // Check if the request is from Dialogflow
  if (origin.includes("dialogflow") || origin.includes("gstatic.com")) {
    return NextResponse.next({
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    })
  }

  // For all other requests, continue without modification
  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}
