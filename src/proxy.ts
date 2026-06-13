import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Exclude Next.js internal files, static/public assets, and general API routes
  if (
    path.startsWith("/_next") ||
    (path.startsWith("/api") && !path.startsWith("/api/admin")) ||
    path.startsWith("/favicon.ico") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  // Fetch database-backed maintenance settings
  let maintenanceMode = false;
  let bypassKey = "";
  try {
    const isProd = process.env.NODE_ENV === "production";
    const internalPort = process.env.PORT || "3000";
    const fetchUrl = isProd
      ? `http://127.0.0.1:${internalPort}/api/maintenance`
      : new URL("/api/maintenance", request.url).toString();

    const res = await fetch(fetchUrl, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      maintenanceMode = data.maintenanceMode;
      bypassKey = data.bypassKey;
    }
  } catch (error) {
    console.error("Proxy failed to fetch maintenance status:", error);
    maintenanceMode = process.env.MAINTENANCE_MODE === "true";
    bypassKey = process.env.MAINTENANCE_BYPASS_KEY || "";
  }

  // Force maintenance mode if environment variable is explicitly set to true
  if (process.env.MAINTENANCE_MODE === "true") {
    maintenanceMode = true;
  }
  // Ensure bypass key defaults to environment variable if not retrieved or set
  if (!bypassKey) {
    bypassKey = process.env.MAINTENANCE_BYPASS_KEY || "";
  }

  // Admin route protection check (Both HTML views and API endpoints)
  const adminSession = request.cookies.get("admin_session")?.value;
  const ownerAccount = process.env.ADMIN_OWNER_ACCOUNT || "tristanbudd";
  const isAdminAuthenticated = adminSession === ownerAccount;

  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    if (
      path !== "/admin/login" &&
      path !== "/admin/login/mock-github" &&
      path !== "/api/admin/auth" &&
      path !== "/api/admin/auth/login" &&
      path !== "/api/admin/auth/callback"
    ) {
      if (!isAdminAuthenticated) {
        // Return 401 Unauthorized for admin API requests
        if (path.startsWith("/api/admin")) {
          return NextResponse.json(
            { error: "Unauthorized access: Please sign in." },
            { status: 401 }
          );
        }
        // Redirect HTML requests to login page
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(loginUrl);
      }
    }
    // Bypass maintenance mode for admin routes
    return NextResponse.next();
  }

  // Authenticated admins bypass maintenance mode automatically for all pages
  if (isAdminAuthenticated) {
    if (path === "/maintenance") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Maintenance Mode rewrite
  if (path === "/maintenance") {
    if (!maintenanceMode) {
      return NextResponse.redirect(new URL("/", request.url));
    }
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes except /api/admin)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/api/admin/:path*",
  ],
};
