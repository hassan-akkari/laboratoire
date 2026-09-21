import type { MetadataRoute } from "next";
import { getNotes } from "../content/notesLoader";
import { LOCALES } from "../i18n/locale";
import { SITE_URL, languageAlternates } from "../seo/site";

const PATHS = ["", "/audit", "/cv", "/notes", "/privacy"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  // No lastModified for the static pages: it would be stamped at build time,
  // telling crawlers everything changed on every deploy — a noise signal
  // Google learns to ignore. Notes DO carry a real per-note updatedAt.
  const staticEntries = PATHS.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.6,
      alternates: {
        languages: languageAlternates(path),
      },
    })),
  );

  // Note bodies are English-only; their locale variants canonicalize onto
  // /en (see buildPageMetadata canonicalLocale), so the sitemap lists ONLY
  // the canonical /en URL — listing non-canonical URLs is a mixed signal.
  const noteEntries = getNotes().map((note) => ({
    url: `${SITE_URL}/en/notes/${note.slug}`,
    lastModified: note.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...noteEntries];
}
