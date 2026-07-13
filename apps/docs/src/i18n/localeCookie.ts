import type { Locale } from "./locale";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from "./routing";

/** Client-only helpers around the locale-preference cookie the proxy reads. */

export function persistLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${LOCALE_COOKIE_MAX_AGE};samesite=lax`;
}

export function hasLocaleCookie(): boolean {
  return document.cookie
    .split("; ")
    .some((entry) => entry.startsWith(`${LOCALE_COOKIE}=`));
}
