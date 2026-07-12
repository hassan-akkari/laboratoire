import "server-only";

import type { Locale } from "../i18n/locale";
import {
  fallbackPortfolioContent,
  portfolioContentSchema,
  type PortfolioContent,
} from "./portfolioContent";
import contentEn from "./data/portfolio-content.en.json";
import contentIt from "./data/portfolio-content.it.json";
import contentFr from "./data/portfolio-content.fr.json";

/**
 * Server-side replacement for the SPA's RTK Query fetch of
 * /data/portfolio-content*.json: the same three payloads are now statically
 * imported and zod-validated at BUILD time, so a malformed payload fails
 * `next build` instead of silently falling back in the browser.
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
  const content = normalizeAssetPaths(
    parsed.success ? parsed.data : fallbackPortfolioContent,
  );
  if (!parsed.success) {
    // Same graceful degradation the SPA had: EN fallback content rather than a
    // hard crash. Logged so a bad payload is visible in build/server output.
    console.error(
      `[docs] portfolio-content.${locale}.json failed validation; serving fallback content`,
      parsed.error.issues,
    );
  }

  contentByLocale.set(locale, content);
  return content;
}
