import { LOCALES, type Locale } from "./locale";

/**
 * Locale-prefixed routing helpers. Every page lives under /{locale}/... —
 * `/it`, `/en/cv`, `/fr/audit`, ... The bare paths (`/`, `/cv`, ...) are
 * redirected to the visitor's preferred locale by src/proxy.ts.
 */

/** Cookie the proxy reads to remember an explicit locale choice. */
export const LOCALE_COOKIE = "laboratoire-locale";

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
  if ((LOCALES as readonly string[]).includes(current)) {
    segments[1] = next;
    return segments.join("/") || `/${next}`;
  }
  return localePath(next, pathname);
}

export const OG_LOCALE_BY_LOCALE: Record<Locale, string> = {
  it: "it_IT",
  en: "en_US",
  fr: "fr_FR",
};
