import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_VALUE } from "./lib/session";

export function middleware(request: NextRequest) {
  const hasSession =
    request.cookies.get(SESSION_COOKIE_NAME)?.value === SESSION_COOKIE_VALUE;

  if (hasSession) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/checkout/:path*"],
};
