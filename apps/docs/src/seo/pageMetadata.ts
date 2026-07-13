import type { Metadata } from "next";
import type { Locale } from "../i18n/locale";
import {
  SEO_KEYWORDS,
  canonicalUrl,
  languageAlternates,
  ogAlternateLocales,
  ogLocale,
} from "./site";

type PageMetadataOptions = {
  locale: Locale;
  /** Site-relative path WITHOUT locale prefix: "" | "/audit" | "/cv" | "/privacy". */
  path?: string;
  title: string;
  description: string;
  /** Home gets the keyword set; inner pages skip it. */
  withKeywords?: boolean;
};

/**
 * Shared per-page Metadata: canonical + hreflang alternates for all three
 * locales, Open Graph and Twitter cards. Replaces the SPA's imperative
 * setMetaContent() DOM mutations with server-rendered tags crawlers can read
 * without executing JavaScript.
 */
export function buildPageMetadata({
  locale,
  path = "",
  title,
  description,
  withKeywords = false,
}: PageMetadataOptions): Metadata {
  const url = canonicalUrl(locale, path);

  return {
    title,
    description,
    ...(withKeywords ? { keywords: SEO_KEYWORDS[locale] } : {}),
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    // og:image / twitter:image come from the file-convention
    // src/app/[locale]/opengraph-image.tsx (1200x630 brand card, per locale).
    openGraph: {
      type: "website",
      siteName: "Hassan Akkari",
      url,
      title,
      description,
      locale: ogLocale(locale),
      alternateLocale: ogAlternateLocales(locale),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
