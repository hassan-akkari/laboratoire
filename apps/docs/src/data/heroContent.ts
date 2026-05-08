import type { Locale } from "../i18n/locale";

export type HeroProofStat = {
  id: string;
  value: string;
  label: string;
};

export type HeroProofCard = {
  stats: HeroProofStat[];
  quote: string;
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
  portraitAlt: string;
  proofCard: HeroProofCard;
};

const it: HeroContent = {
  badge: "Developer freelance per professionisti e piccole attività",
  titleParts: {
    before: "Trasformo siti vecchi e idee confuse in soluzioni digitali ",
    accent: "chiare, veloci",
    after: " e che portano contatti.",
  },
  subtitle:
    "Aiuto professionisti, studi e piccole attività ad avere una presenza online seria. Niente template, niente promesse vaghe. Parli con me, decidi con me, ricevi il lavoro da me.",
  primaryCtaLabel: "Audit gratuito in 24h",
  primaryCtaHref: "/audit",
  secondaryCtaLabel: "Vedi i miei progetti",
  secondaryCtaHref: "#case-studies",
  guaranteeBullets: [
    "✓ Prima call gratuita di 20 min",
    "✓ Preventivo scritto entro 48h",
    "✓ Online in 1-3 settimane",
  ],
  portraitAlt: "Hassan Akkari, sviluppatore freelance",
  proofCard: {
    stats: [
      { id: "experience", value: "5+", label: "anni React + TypeScript" },
      { id: "response", value: "24h", label: "tempo di risposta" },
      { id: "no-tricks", value: "0", label: "call vendita mascherate" },
    ],
    quote:
      "Lavoro su prodotti enterprise di giorno. Per i miei clienti freelance porto la stessa qualità — senza farti pagare l'agenzia.",
  },
};

const en: HeroContent = {
  badge: "Freelance developer for professionals and small businesses",
  titleParts: {
    before: "I turn outdated sites and unclear ideas into ",
    accent: "clear, fast",
    after: " digital solutions that actually bring you contacts.",
  },
  subtitle:
    "I help professionals, studios, and small businesses build a serious online presence. No templates, no vague promises. You talk to me, decide with me, get the work from me.",
  primaryCtaLabel: "Free 24h audit",
  primaryCtaHref: "/audit",
  secondaryCtaLabel: "See my projects",
  secondaryCtaHref: "#case-studies",
  guaranteeBullets: [
    "✓ Free 20-minute intro call",
    "✓ Written quote within 48h",
    "✓ Live in 1-3 weeks",
  ],
  portraitAlt: "Hassan Akkari, freelance developer",
  proofCard: {
    stats: [
      { id: "experience", value: "5+", label: "years React + TypeScript" },
      { id: "response", value: "24h", label: "reply time" },
      { id: "no-tricks", value: "0", label: "disguised sales calls" },
    ],
    quote:
      "I work on enterprise products by day. I bring the same quality to my freelance clients — without the agency markup.",
  },
};

const fr: HeroContent = {
  badge: "Développeur freelance pour pros et petites entreprises",
  titleParts: {
    before: "Je transforme des sites dépassés et des idées floues en solutions numériques ",
    accent: "claires, rapides",
    after: " qui ramènent de vrais contacts.",
  },
  subtitle:
    "J'aide les professionnels, les cabinets et les petites entreprises à avoir une présence en ligne sérieuse. Pas de templates, pas de promesses vagues. Vous parlez avec moi, décidez avec moi, recevez le travail de moi.",
  primaryCtaLabel: "Audit gratuit en 24h",
  primaryCtaHref: "/audit",
  secondaryCtaLabel: "Voir mes projets",
  secondaryCtaHref: "#case-studies",
  guaranteeBullets: [
    "✓ Premier appel gratuit de 20 min",
    "✓ Devis écrit sous 48h",
    "✓ En ligne en 1-3 semaines",
  ],
  portraitAlt: "Hassan Akkari, développeur freelance",
  proofCard: {
    stats: [
      { id: "experience", value: "5+", label: "ans React + TypeScript" },
      { id: "response", value: "24h", label: "délai de réponse" },
      { id: "no-tricks", value: "0", label: "appel commercial déguisé" },
    ],
    quote:
      "Je travaille sur des produits enterprise de jour. À mes clients freelance j'apporte la même qualité — sans le markup d'agence.",
  },
};

export const heroContent: Record<Locale, HeroContent> = { it, en, fr };

export function getHeroContent(locale: Locale) {
  return heroContent[locale];
}
