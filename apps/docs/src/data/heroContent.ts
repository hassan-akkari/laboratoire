import type { Locale } from "../i18n/locale";
import { mailtoLink, SITE, whatsappLink } from "./site";

export type HeroBullet = {
  id: string;
  label: string;
};

export type HeroAside = {
  title: string;
  bullets: HeroBullet[];
};

export type HeroContent = {
  badge: string;
  titleParts: { before: string; accent: string; after: string };
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  guaranteeBullets: string[];
  aside: HeroAside;
};

const callSubjectByLocale: Record<Locale, { subject: string; body: string }> = {
  it: {
    subject: "Call gratuita per il mio progetto",
    body: "Ciao Hassan, vorrei prenotare una call gratuita per parlarti del mio progetto.",
  },
  en: {
    subject: "Free intro call about my project",
    body: "Hi Hassan, I'd like to book a free intro call to talk about my project.",
  },
  fr: {
    subject: "Appel gratuit pour mon projet",
    body: "Bonjour Hassan, j'aimerais réserver un appel gratuit pour parler de mon projet.",
  },
};

const it: HeroContent = {
  badge: `Sviluppatore freelance — ${SITE.location}`,
  titleParts: {
    before: "Trasformo siti vecchi e idee confuse in soluzioni digitali ",
    accent: "chiare, veloci",
    after: " e che portano contatti.",
  },
  subtitle:
    "Aiuto professionisti, studi e piccole attività ad avere una presenza online seria. Niente template, niente promesse vaghe. Parli con me, decidi con me, ricevi il lavoro da me.",
  primaryCtaLabel: "Scrivimi su WhatsApp",
  primaryCtaHref: whatsappLink("it"),
  secondaryCtaLabel: "Prenota una call gratuita",
  secondaryCtaHref: mailtoLink(
    callSubjectByLocale.it.subject,
    callSubjectByLocale.it.body,
  ),
  guaranteeBullets: [
    "✓ Prima call gratuita di 20 min",
    "✓ Preventivo scritto entro 48h",
    "✓ Online in 1-3 settimane",
  ],
  aside: {
    title: "Cosa faccio in pratica",
    bullets: [
      { id: "landing", label: "Landing page per vendere un servizio" },
      { id: "site", label: "Siti professionali per attività e studi" },
      { id: "webapp", label: "Web app / MVP su misura" },
      { id: "restyle", label: "Restyling di siti esistenti" },
    ],
  },
};

const en: HeroContent = {
  badge: `Freelance developer — ${SITE.location}`,
  titleParts: {
    before: "I turn outdated sites and unclear ideas into ",
    accent: "clear, fast",
    after: " digital solutions that actually bring you contacts.",
  },
  subtitle:
    "I help professionals, studios, and small businesses build a serious online presence. No templates, no vague promises. You talk to me, decide with me, get the work from me.",
  primaryCtaLabel: "Message me on WhatsApp",
  primaryCtaHref: whatsappLink("en"),
  secondaryCtaLabel: "Book a free intro call",
  secondaryCtaHref: mailtoLink(
    callSubjectByLocale.en.subject,
    callSubjectByLocale.en.body,
  ),
  guaranteeBullets: [
    "✓ Free 20-minute intro call",
    "✓ Written quote within 48h",
    "✓ Live in 1-3 weeks",
  ],
  aside: {
    title: "What I actually do",
    bullets: [
      { id: "landing", label: "Landing pages to sell a service" },
      { id: "site", label: "Professional sites for studios and businesses" },
      { id: "webapp", label: "Custom web apps / MVPs" },
      { id: "restyle", label: "Restyling existing sites" },
    ],
  },
};

const fr: HeroContent = {
  badge: `Développeur freelance — ${SITE.location}`,
  titleParts: {
    before: "Je transforme des sites dépassés et des idées floues en solutions numériques ",
    accent: "claires, rapides",
    after: " qui ramènent de vrais contacts.",
  },
  subtitle:
    "J'aide les professionnels, les cabinets et les petites entreprises à avoir une présence en ligne sérieuse. Pas de templates, pas de promesses vagues. Vous parlez avec moi, décidez avec moi, recevez le travail de moi.",
  primaryCtaLabel: "Écrivez-moi sur WhatsApp",
  primaryCtaHref: whatsappLink("fr"),
  secondaryCtaLabel: "Réservez un appel gratuit",
  secondaryCtaHref: mailtoLink(
    callSubjectByLocale.fr.subject,
    callSubjectByLocale.fr.body,
  ),
  guaranteeBullets: [
    "✓ Premier appel gratuit de 20 min",
    "✓ Devis écrit sous 48h",
    "✓ En ligne en 1-3 semaines",
  ],
  aside: {
    title: "Ce que je fais concrètement",
    bullets: [
      { id: "landing", label: "Landing pages pour vendre un service" },
      { id: "site", label: "Sites pros pour cabinets et entreprises" },
      { id: "webapp", label: "Web apps / MVP sur mesure" },
      { id: "restyle", label: "Refonte de sites existants" },
    ],
  },
};

export const heroContent: Record<Locale, HeroContent> = { it, en, fr };

export function getHeroContent(locale: Locale) {
  return heroContent[locale];
}
