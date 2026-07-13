import type { Locale } from "../i18n/locale";

export type SeoContent = {
  title: string;
  description: string;
  keywords: string[];
};

export const seoContent: Record<Locale, SeoContent> = {
  it: {
    title:
      "Hassan Akkari · Sviluppatore freelance per professionisti e piccole attività",
    description:
      "Sviluppatore freelance a Roma. Landing page, siti professionali, web app e restyling. Niente template, niente WordPress impacchettato. Online in 1-3 settimane.",
    keywords: [
      "sviluppatore freelance roma",
      "sviluppatore web freelance",
      "creare landing page professionale",
      "rifare sito web professionista",
      "restyling sito web",
      "sviluppo web app su misura",
      "react developer italia",
      "freelance web developer rome",
    ],
  },
  en: {
    title:
      "Hassan Akkari · Freelance developer for professionals and small businesses",
    description:
      "Freelance developer in Rome. Landing pages, professional websites, custom web apps and restyling. No templates, no WordPress in disguise. Live in 1-3 weeks.",
    keywords: [
      "freelance web developer rome",
      "freelance react developer",
      "professional landing page",
      "website redesign",
      "custom web app development",
      "next.js developer italy",
    ],
  },
  fr: {
    title:
      "Hassan Akkari · Développeur freelance pour professionnels et petites entreprises",
    description:
      "Développeur freelance à Rome. Landing pages, sites pros, web apps sur mesure et refontes. Pas de templates, pas de WordPress déguisé. En ligne en 1-3 semaines.",
    keywords: [
      "développeur web freelance rome",
      "développeur react freelance",
      "landing page professionnelle",
      "refonte site web",
      "développement web app sur mesure",
      "développeur next.js italie",
    ],
  },
  de: {
    title:
      "Hassan Akkari · Freelance-Webentwickler für Selbstständige und kleine Betriebe",
    description:
      "Freelance-Webentwickler in Rom. Landing Pages, professionelle Websites, massgeschneiderte Web-Apps und Redesigns. Keine Templates, kein verstecktes WordPress. Online in 1-3 Wochen.",
    keywords: [
      "freelance webentwickler",
      "webentwickler schweiz remote",
      "professionelle landing page",
      "website redesign",
      "web app entwicklung massgeschneidert",
      "react entwickler freelance",
    ],
  },
};

export function getSeoContent(locale: Locale) {
  return seoContent[locale];
}
