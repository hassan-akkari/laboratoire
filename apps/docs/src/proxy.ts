import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { LOCALES, isLocale, type Locale } from "./i18n/locale";
import { LOCALE_COOKIE } from "./i18n/routing";

/**
 * Next 16 proxy (middleware): locale-prefix enforcement.
 *
 * Every page route lives under /{locale}/... (it | en | fr). Any request whose
 * first segment is NOT a locale — `/`, `/cv`, `/audit`, `/privacy`, plus any
 * legacy deep link — is redirected to the same path under the visitor's
 * preferred locale:
 *
 *   1. `laboratoire-locale` cookie (set by the LocaleSwitcher) when valid;
 *   2. best `Accept-Language` match otherwise;
 *   3. `it` as the final fallback (primary target market — same default the
 *      SPA used in resolveLocale()).
 *
 * Static files (anything with an extension), /_next and Next internals are
 * excluded via the matcher so public assets (pdf/, image/, favicon, ...) are
 * served untouched.
 */

function detectRequestLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  for (const part of acceptLanguage.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase();
    if (!tag) continue;
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }

  return "it";
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const firstSegment = pathname.split("/")[1] ?? "";
  if ((LOCALES as readonly string[]).includes(firstSegment)) {
    return NextResponse.next();
  }

  const locale = detectRequestLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  // 307, NOT 308: the target depends on cookie + Accept-Language, and browsers
  // cache permanent redirects — a cached `/ -> /it` would override a later
  // locale switch. Crawlers still follow 307 and index the localized URLs via
  // the hreflang alternates each page declares.
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: [
    // Everything except Next internals, API routes and static files
    // (dot-containing paths: /pdf/x.pdf, /image/x.png, /favicon.svg, ...).
    "/((?!_next|api|.*\\..*).*)",
  ],
};
