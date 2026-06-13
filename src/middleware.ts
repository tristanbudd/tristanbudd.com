import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";
  const bypassKey = process.env.MAINTENANCE_BYPASS_KEY;
  const path = request.nextUrl.pathname;

  // Exclude Next.js internal files, static/public assets, and API routes
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/favicon.ico") ||
    path.includes(".") ||
    path === "/maintenance"
  ) {
    return NextResponse.next();
  }

  if (maintenanceMode) {
    // Check for bypass query parameter
    const bypassQuery = request.nextUrl.searchParams.get("bypass");
    if (bypassQuery && bypassKey && bypassQuery === bypassKey) {
      // Set the bypass cookie and redirect to a clean URL without the query string
      const response = NextResponse.redirect(new URL(path, request.url));
      response.cookies.set("maintenance_bypass", bypassKey, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
      });
      return response;
    }

    // Check for active bypass cookie
    const bypassCookie = request.cookies.get("maintenance_bypass")?.value;
    if (bypassCookie && bypassKey && bypassCookie === bypassKey) {
      return NextResponse.next();
    }

    // Rewrite to /maintenance while returning a 503 Service Unavailable status code
    const response = NextResponse.rewrite(new URL("/maintenance", request.url), {
      status: 503,
      statusText: "Service Unavailable",
    });

    // Suggest retry header for search crawlers (e.g. 1 hour)
    response.headers.set("Retry-After", "3600");
    return response;
  }

  // If maintenance mode is off but the user goes directly to /maintenance, redirect them home
  if (!maintenanceMode && path === "/maintenance") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
