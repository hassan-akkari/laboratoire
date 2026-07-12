import { isLocale, type Locale } from "./locale";

/**
 * Resolve the [locale] route param on the server. The layout already 404s
 * invalid locales; the "it" fallback here only guards against direct misuse.
 */
export async function localeFromParams(
  params: Promise<{ locale: string }>,
): Promise<Locale> {
  const { locale } = await params;
  return isLocale(locale) ? locale : "it";
}
