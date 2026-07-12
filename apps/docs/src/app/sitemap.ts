import type { MetadataRoute } from "next";
import { LOCALES } from "../i18n/locale";
import { SITE_URL, languageAlternates } from "../seo/site";

const PATHS = ["", "/audit", "/cv", "/privacy"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PATHS.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.6,
      alternates: {
        languages: languageAlternates(path),
      },
    })),
  );
}
