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
    openGraph: {
      type: "website",
      siteName: "Hassan Akkari",
      url,
      title,
      description,
      locale: ogLocale(locale),
      alternateLocale: ogAlternateLocales(locale),
      images: [
        {
          url: "/image/portrait.png",
          width: 840,
          height: 1120,
          alt: "Hassan Akkari",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/image/portrait.png"],
    },
  };
}
