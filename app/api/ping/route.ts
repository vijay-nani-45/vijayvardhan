import { NextResponse } from "next/server"

export async function HEAD(request: Request) {
  // Add cache control headers to prevent caching
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  })
}

export async function GET(request: Request) {
  // Add cache control headers to prevent caching
  return NextResponse.json(
    { status: "ok", timestamp: Date.now() },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  )
}
