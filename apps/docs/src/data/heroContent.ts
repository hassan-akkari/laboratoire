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
  badge: "Sviluppatore freelance per professionisti e piccole attività",
  titleParts: {
    before: "Creo siti e web app ",
    accent: "puliti e veloci",
    after:
      " che aiutano i professionisti a sembrare più credibili e ricevere più richieste.",
  },
  subtitle:
    "Aiuto professionisti, studi e piccole attività a trasformare siti vecchi, idee confuse e processi manuali in prodotti digitali chiari, curati e facili da usare.",
  primaryCtaLabel: "Richiedi un audit gratuito",
  primaryCtaHref: "/audit",
  secondaryCtaLabel: "Vedi i case study",
  secondaryCtaHref: "#case-studies",
  guaranteeBullets: [
    "✓ Call introduttiva gratuita di 20 minuti",
    "✓ Preventivo scritto entro 48h",
    "✓ Prima versione online in 1–3 settimane",
  ],
  portraitAlt: "Hassan Akkari, sviluppatore freelance",
  proofCard: {
    stats: [
      { id: "experience", value: "5+", label: "anni nella creazione di interfacce web" },
      { id: "response", value: "24h", label: "prima risposta tipica" },
      { id: "no-tricks", value: "0", label: "call commerciali aggressive" },
    ],
    quote:
      "Di giorno lavoro su prodotti enterprise. Porto la stessa cura nei progetti freelance selezionati — senza il sovrapprezzo di un'agenzia.",
  },
};

const en: HeroContent = {
  badge: "Freelance developer for professionals and small businesses",
  titleParts: {
    before: "I build ",
    accent: "clean, fast",
    after:
      " websites and web apps that help professionals look credible and get more enquiries.",
  },
  subtitle:
    "I help professionals, studios, and small businesses turn outdated websites, unclear ideas, and manual workflows into digital products that feel clear, polished, and easy to use.",
  primaryCtaLabel: "Get a free audit",
  primaryCtaHref: "/audit",
  secondaryCtaLabel: "See case studies",
  secondaryCtaHref: "#case-studies",
  guaranteeBullets: [
    "✓ Free 20-minute intro call",
    "✓ Written quote within 48h",
    "✓ First version live in 1–3 weeks",
  ],
  portraitAlt: "Hassan Akkari, freelance developer",
  proofCard: {
    stats: [
      { id: "experience", value: "5+", label: "years building web interfaces" },
      { id: "response", value: "24h", label: "typical first reply" },
      { id: "no-tricks", value: "0", label: "pushy sales calls" },
    ],
    quote:
      "I work on enterprise products by day and bring the same care to selected freelance projects — without agency markup.",
  },
};

const fr: HeroContent = {
  badge: "Développeur freelance pour professionnels et petites entreprises",
  titleParts: {
    before: "Je crée des sites web et des applications ",
    accent: "rapides et soignés",
    after:
      " qui aident les professionnels à paraître plus crédibles et à recevoir plus de demandes.",
  },
  subtitle:
    "J'aide les professionnels, les studios et les petites entreprises à transformer des sites dépassés, des idées floues et des processus manuels en produits digitaux clairs, soignés et faciles à utiliser.",
  primaryCtaLabel: "Demander un audit gratuit",
  primaryCtaHref: "/audit",
  secondaryCtaLabel: "Voir les cas clients",
  secondaryCtaHref: "#case-studies",
  guaranteeBullets: [
    "✓ Appel découverte gratuit de 20 minutes",
    "✓ Devis écrit sous 48h",
    "✓ Première version en ligne en 1–3 semaines",
  ],
  portraitAlt: "Hassan Akkari, développeur freelance",
  proofCard: {
    stats: [
      { id: "experience", value: "5+", label: "ans à créer des interfaces web" },
      { id: "response", value: "24h", label: "première réponse habituelle" },
      { id: "no-tricks", value: "0", label: "appels commerciaux agressifs" },
    ],
    quote:
      "Le jour, je travaille sur des produits enterprise. J'apporte le même niveau de soin aux projets freelance sélectionnés — sans la marge d'une agence.",
  },
};

export const heroContent: Record<Locale, HeroContent> = { it, en, fr };

export function getHeroContent(locale: Locale) {
  return heroContent[locale];
}
