import type { Locale } from "../i18n/locale";

export type SeoContent = {
  title: string;
  description: string;
};

export const seoContent: Record<Locale, SeoContent> = {
  it: {
    title:
      "Hassan Akkari · Sviluppatore freelance per professionisti e piccole attività",
    description:
      "Sviluppatore freelance a Roma. Landing page, siti professionali, web app e restyling. Niente template, niente WordPress impacchettato. Online in 1-3 settimane.",
  },
  en: {
    title:
      "Hassan Akkari · Freelance developer for professionals and small businesses",
    description:
      "Freelance developer in Rome. Landing pages, professional websites, custom web apps and restyling. No templates, no WordPress in disguise. Live in 1-3 weeks.",
  },
  fr: {
    title:
      "Hassan Akkari · Développeur freelance pour professionnels et petites entreprises",
    description:
      "Développeur freelance à Rome. Landing pages, sites pros, web apps sur mesure et refontes. Pas de templates, pas de WordPress déguisé. En ligne en 1-3 semaines.",
  },
};

export function getSeoContent(locale: Locale) {
  return seoContent[locale];
}
