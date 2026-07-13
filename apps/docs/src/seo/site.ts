import { LOCALES, type Locale } from "../i18n/locale";

/**
 * Canonical origin of the portfolio (apex, no www) — the same origin
 * web-next's PUBLIC_ALLOWED_ORIGINS whitelists for the docs site.
 */
export const SITE_URL = "https://itshassan.it";

/** hreflang map for a site-relative path ("" for home, "/cv", ...). */
export function languageAlternates(path = "") {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[locale] = `${SITE_URL}/${locale}${path}`;
  }
  // Italy is the primary market: the x-default experience is the Italian one
  // (also where the proxy sends visitors with no matching Accept-Language).
  languages["x-default"] = `${SITE_URL}/it${path}`;
  return languages;
}

export function canonicalUrl(locale: Locale, path = ""): string {
  return `${SITE_URL}/${locale}${path}`;
}

const OG_LOCALE_BY_LOCALE: Record<Locale, string> = {
  it: "it_IT",
  en: "en_US",
  fr: "fr_FR",
};

export function ogLocale(locale: Locale): string {
  return OG_LOCALE_BY_LOCALE[locale];
}

export function ogAlternateLocales(locale: Locale): string[] {
  return LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE_BY_LOCALE[l]);
}
