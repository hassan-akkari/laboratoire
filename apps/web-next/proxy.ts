import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "./lib/adminSession";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_VALUE } from "./lib/session";

/** The dedicated admin subdomain. Requests on this host are routed to `/admin`. */
const ADMIN_HOST = "admin.itshassan.it";

/**
 * Resolve the request host: case-insensitive and without a port.
 * Prefers the forwarded host (set by Vercel / proxies) and falls back to the
 * standard `host` header. Returns "" when neither is present.
 */
function getHost(request: NextRequest): string {
  const raw =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  return raw.toLowerCase().split(":", 1)[0];
}

/**
 * Next 16 proxy (middleware). Two concerns, kept visually separate:
 *
 *   1. HOST ROUTING — `admin.itshassan.it` is an admin-only surface. A request to
 *      that host's ROOT (`/`) is REWRITTEN to `/admin` so the clean subdomain URL
 *      is preserved in the address bar (no client-visible redirect).
 *   2. PATH GATES — the `/admin` cookie gate and the `/checkout` booking-demo
 *      session gate, unchanged. The admin gate runs AFTER the host rewrite, so a
 *      rewritten subdomain request is still cookie-protected.
 *
 * Host × path matrix (paired with the apex `/` redirect in app/page.tsx):
 *
 *   host                  | path              | proxy action
 *   ----------------------+-------------------+---------------------------------------
 *   admin.itshassan.it    | /                 | rewrite -> /admin, then admin gate
 *   admin.itshassan.it    | /admin, /admin/*  | (no rewrite) admin gate
 *   admin.itshassan.it    | /api/admin/*      | (no rewrite) admin gate (JSON 401)
 *   localhost / other     | /                 | passthrough -> app/page.tsx redirects to /admin
 *   localhost / other     | /admin, /api/admin| admin gate
 *   localhost / other     | /checkout,/api/co | booking-demo session gate
 *   any                   | everything else   | passthrough
 *
 * `localhost` (and the apex `itshassan.it`) never match ADMIN_HOST, so the apex
 * redirect and the booking-demo routes are untouched off the admin subdomain.
 */
export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const host = getHost(request);

  // Carry the pathname into request headers (kept for downstream consumers /
  // observability) — set on every passthrough/rewrite below.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", path);
  const passthrough = () =>
    NextResponse.next({ request: { headers: requestHeaders } });

  // 1) HOST ROUTING — admin subdomain root.
  // Map the bare subdomain onto /admin via an internal rewrite (clean URL stays
  // `admin.itshassan.it/`). The `!startsWith("/admin")` guard avoids a rewrite
  // loop and lets real /admin and /api/admin paths fall straight to the gate.
  if (host === ADMIN_HOST && !path.startsWith("/admin") && !path.startsWith("/api/admin")) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = "/admin";
    return NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
  }

  // 2) PATH GATES.

  // Public carve-outs (admin)
  if (path === "/api/admin/login" || path === "/admin/login") {
    return passthrough();
  }

  // Admin gate
  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    const hasAdminCookie = request.cookies.has(ADMIN_COOKIE_NAME);
    if (hasAdminCookie) {
      // Presence-only check; route handler / page validates the seal
      return passthrough();
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
    if (hasSession) return passthrough();

    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${path}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  return passthrough();
}

export const config = {
  matcher: [
    // `/` is matched so the host rewrite fires on the admin subdomain root.
    // On localhost / apex, `/` is a no-op passthrough -> app/page.tsx redirects to /admin.
    "/",
    "/checkout/:path*",
    "/api/checkout",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
