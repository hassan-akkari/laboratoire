import "server-only";

import type { Locale } from "../i18n/locale";
import {
  portfolioContentSchema,
  type PortfolioContent,
} from "./portfolioContent";
import contentEn from "./data/portfolio-content.en.json";
import contentIt from "./data/portfolio-content.it.json";
import contentFr from "./data/portfolio-content.fr.json";

/**
 * Server-side replacement for the SPA's RTK Query fetch of
 * /data/portfolio-content*.json: the same three payloads are now statically
 * imported and zod-validated when the /cv pages prerender, so a malformed
 * payload THROWS and fails `next build` — loudly, instead of the SPA's silent
 * English fallback that would have served the wrong language undetected.
 *
 * Asset paths inside the payloads are public/-relative by history
 * ("pdf/CV-….pdf", "image/….png"). Under locale-prefixed routes a relative
 * URL would resolve against /{locale}/…, so they are normalized to
 * root-absolute here — components can use them directly.
 */

const rawByLocale: Record<Locale, unknown> = {
  en: contentEn,
  it: contentIt,
  fr: contentFr,
};

function toRootAbsolute(path: string): string {
  if (path.startsWith("/") || /^[a-z]+:/i.test(path) || path.startsWith("#")) {
    return path;
  }
  return `/${path}`;
}

function normalizeAssetPaths(content: PortfolioContent): PortfolioContent {
  return {
    ...content,
    contact: {
      ...content.contact,
      resumePath: toRootAbsolute(content.contact.resumePath),
    },
    projects: content.projects.map((project) => ({
      ...project,
      image: toRootAbsolute(project.image),
    })),
  };
}

const contentByLocale = new Map<Locale, PortfolioContent>();

export function getPortfolioContent(locale: Locale): PortfolioContent {
  const cached = contentByLocale.get(locale);
  if (cached) return cached;

  const parsed = portfolioContentSchema.safeParse(rawByLocale[locale]);
  if (!parsed.success) {
    // Fail the build (all /cv pages are SSG) rather than silently serving the
    // English fallback under an it/fr URL — the old SPA's graceful runtime
    // degradation becomes a loud build-time gate here.
    throw new Error(
      `[docs] portfolio-content.${locale}.json failed schema validation:\n` +
        JSON.stringify(parsed.error.issues, null, 2),
    );
  }

  const content = normalizeAssetPaths(parsed.data);
  contentByLocale.set(locale, content);
  return content;
}
