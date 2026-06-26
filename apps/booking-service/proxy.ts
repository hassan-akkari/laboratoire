import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "./lib/adminSession";

// Next 16 proxy (formerly "middleware") — the FIRST gate in front of the admin
// surface. It is a cheap PRESENCE check only: it never unseals the cookie
// (iron-session unseal is async crypto, kept out of the hot edge path and out
// of the proxy bundle). The real authentication happens server-side in
// `requireAdminSession()`, which every /admin page + layout and every admin
// server action calls. This is defence-in-depth: the proxy turns away anonymous
// traffic fast, but it is NEVER trusted as the sole guard.
//
// Unlike web-next this app has no host/subdomain routing — just the path gate.
//
// Behaviour:
//   /admin/login            → always allowed (the public login surface)
//   /admin, /admin/*        → no cookie ⇒ redirect to /admin/login (?next=…)
//   /api/admin/*            → no cookie ⇒ JSON 401 (never an HTML redirect)
export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Public carve-out: the login page must be reachable while signed out.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const isApiAdmin = pathname.startsWith("/api/admin");
  const isAdmin = pathname.startsWith("/admin");
  if (!isAdmin && !isApiAdmin) {
    return NextResponse.next();
  }

  // Presence-only: the page/route validates the seal. A stale/tampered cookie
  // still passes here but is rejected by requireAdminSession() / getAdminSession().
  if (request.cookies.has(ADMIN_COOKIE_NAME)) {
    return NextResponse.next();
  }

  if (isApiAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
