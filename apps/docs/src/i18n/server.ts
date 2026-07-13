import { resolveLocale, type Locale } from "./locale";

/**
 * Resolve the [locale] route param on the server. The layout already 404s
 * invalid locales; resolveLocale's "it" fallback only guards direct misuse
 * (and keeps the default-locale policy defined in exactly one place).
 */
export async function localeFromParams(
  params: Promise<{ locale: string }>,
): Promise<Locale> {
  const { locale } = await params;
  return resolveLocale(locale);
}
