"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LOCALE_STORAGE_KEY, isLocale, type Locale } from "../../i18n/locale";
import { switchLocalePath } from "../../i18n/routing";
import {
  hasLocaleCookie,
  persistLocaleCookie,
} from "../../i18n/localeCookie";

/**
 * One-time bridge for visitors of the old SPA: their locale choice lives in
 * localStorage ("laboratoire-locale"), which the proxy cannot read. On first
 * visit with no locale cookie, copy the stored choice into the cookie and, if
 * it differs from the URL locale, move to the matching localized route.
 */
export default function LocaleCookieSync({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const synced = useRef(false);

  useEffect(() => {
    if (synced.current) return;
    synced.current = true;
    try {
      if (hasLocaleCookie()) return;

      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (!stored || !isLocale(stored)) return;

      persistLocaleCookie(stored);
      if (stored !== locale) {
        router.replace(switchLocalePath(pathname ?? `/${locale}`, stored));
      }
    } catch {
      /* localStorage may be unavailable; nothing to sync. */
    }
  }, [locale, pathname, router]);

  return null;
}
