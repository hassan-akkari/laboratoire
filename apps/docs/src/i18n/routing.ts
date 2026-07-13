import { LOCALE_STORAGE_KEY, isLocale, type Locale } from "./locale";

/**
 * Locale-prefixed routing helpers. Every page lives under /{locale}/... —
 * `/it`, `/en/cv`, `/fr/audit`, ... The bare paths (`/`, `/cv`, ...) are
 * redirected to the visitor's preferred locale by src/proxy.ts.
 */

/**
 * Cookie the proxy reads to remember an explicit locale choice. Deliberately
 * the SAME key the old SPA used in localStorage — LocaleCookieSync migrates
 * returning visitors' stored preference into the cookie, so the two names
 * must never drift apart.
 */
export const LOCALE_COOKIE = LOCALE_STORAGE_KEY;

/** One year, in seconds — locale choice is a long-lived preference. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Prefix a site-relative path with the locale segment. */
export function localePath(locale: Locale, path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

/** Swap the locale segment of a locale-prefixed pathname, keeping the rest. */
export function switchLocalePath(pathname: string, next: Locale): string {
  const segments = pathname.split("/");
  const current = segments[1] ?? "";
  if (isLocale(current)) {
    segments[1] = next;
    return segments.join("/") || `/${next}`;
  }
  return localePath(next, pathname);
}
