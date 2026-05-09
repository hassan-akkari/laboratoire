export const LOCALES = ["en", "it", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_STORAGE_KEY = "laboratoire-locale";

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function resolveLocale(value: string | null | undefined): Locale {
  if (!value) return "it";
  return isLocale(value) ? value : "it";
}
