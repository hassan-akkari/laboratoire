import type { Metadata } from "next";
import type { Locale } from "../i18n/locale";
import {
  SITE_URL,
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
  /** Per-locale keyword set (home passes getSeoContent(locale).keywords). */
  keywords?: string[];
  /** Set for note pages: switches og:type to article with real timestamps. */
  article?: {
    publishedTime: string;
    modifiedTime: string;
    tags: string[];
  };
  /**
   * Content that exists in ONE language only (garden notes are English under
   * every locale prefix): canonical + hreflang collapse onto this locale's
   * URL so Google sees one page, not 4 duplicates competing with each other.
   */
  canonicalLocale?: Locale;
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
  keywords,
  article,
  canonicalLocale,
}: PageMetadataOptions): Metadata {
  const url = canonicalUrl(canonicalLocale ?? locale, path);

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: url,
      languages: canonicalLocale
        ? { [canonicalLocale]: url, "x-default": url }
        : languageAlternates(path),
      // RSS autodiscovery on every page (nested `alternates` objects replace,
      // not merge, across layout/page metadata — so it lives here, where every
      // route's alternates are built).
      types: {
        "application/rss+xml": `${SITE_URL}/feed.xml`,
      },
    },
    // og:image / twitter:image come from the file-convention
    // src/app/[locale]/opengraph-image.tsx (1200x630 brand card, per locale).
    openGraph: {
      siteName: "Hassan Akkari",
      url,
      title,
      description,
      locale: ogLocale(locale),
      alternateLocale: ogAlternateLocales(locale),
      ...(article
        ? {
            type: "article",
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            tags: article.tags,
            authors: [`${SITE_URL}/${locale}`],
          }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
