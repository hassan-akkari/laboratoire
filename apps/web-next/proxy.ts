import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "./lib/adminSession";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_VALUE } from "./lib/session";

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public carve-outs (admin)
  if (path === "/api/admin/login" || path === "/admin/login") {
    return NextResponse.next();
  }

  // Admin gate
  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    const hasAdminCookie = request.cookies.has(ADMIN_COOKIE_NAME);
    if (hasAdminCookie) {
      // Presence-only check; route handler / page validates the seal
      return NextResponse.next();
    }
    if (path.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", `${path}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Booking demo gate (existing logic, preserved verbatim including /api/checkout JSON 401)
  if (path.startsWith("/checkout") || path === "/api/checkout") {
    const hasSession =
      request.cookies.get(SESSION_COOKIE_NAME)?.value === SESSION_COOKIE_VALUE;
    if (hasSession) return NextResponse.next();

    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${path}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/api/checkout",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
