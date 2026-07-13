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
    accent: "veloci",
    after: " che trasformano visite confuse in richieste reali.",
  },
  subtitle:
    "Aiuto professionisti, studi e piccole attività a sistemare siti vecchi, idee digitali confuse e processi manuali con soluzioni chiare, curate e facili da usare.",
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
      "Lavoro ogni giorno su prodotti web reali, con utenti veri e flussi complessi. Porto lo stesso metodo nei progetti freelance selezionati: meno improvvisazione, più struttura.",
  },
};

const en: HeroContent = {
  badge: "Freelance developer for professionals and small businesses",
  titleParts: {
    before: "I build ",
    accent: "fast",
    after: " websites and web apps that turn confused visits into real enquiries.",
  },
  subtitle:
    "I help professionals, studios, and small businesses fix outdated websites, unclear digital ideas, and manual workflows with clear, polished, easy-to-use solutions.",
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
      "I work every day on real web products, with real users and complex flows. I bring the same method to selected freelance projects: less improvisation, more structure.",
  },
};

const fr: HeroContent = {
  badge: "Développeur freelance pour professionnels et petites entreprises",
  titleParts: {
    before: "Je crée des sites web et des applications ",
    accent: "rapides",
    after: " qui transforment des visites confuses en vraies demandes.",
  },
  subtitle:
    "J'aide les professionnels, les studios et les petites entreprises à remettre en ordre des sites dépassés, des idées digitales floues et des processus manuels avec des solutions claires, soignées et faciles à utiliser.",
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
      "Je travaille chaque jour sur de vrais produits web, avec de vrais utilisateurs et des flux complexes. J'apporte la même méthode aux projets freelance sélectionnés : moins d'improvisation, plus de structure.",
  },
};

const de: HeroContent = {
  badge: "Freelance-Webentwickler für Selbstständige und kleine Betriebe",
  titleParts: {
    before: "Ich baue ",
    accent: "schnelle",
    after:
      " Websites und Web-Apps, die verwirrte Besuche in echte Anfragen verwandeln.",
  },
  subtitle:
    "Ich helfe Selbstständigen, Praxen, Kanzleien und kleinen Betrieben, veraltete Websites, unklare digitale Ideen und manuelle Abläufe in klare, gepflegte und einfach nutzbare Lösungen zu verwandeln.",
  primaryCtaLabel: "Gratis-Audit anfordern",
  primaryCtaHref: "/audit",
  secondaryCtaLabel: "Case Studies ansehen",
  secondaryCtaHref: "#case-studies",
  guaranteeBullets: [
    "✓ Kostenloses Erstgespräch, 20 Minuten",
    "✓ Schriftliche Offerte innert 48h",
    "✓ Erste Version online in 1–3 Wochen",
  ],
  portraitAlt: "Hassan Akkari, Freelance-Webentwickler",
  proofCard: {
    stats: [
      { id: "experience", value: "5+", label: "Jahre im Bau von Web-Interfaces" },
      { id: "response", value: "24h", label: "typische erste Antwort" },
      { id: "no-tricks", value: "0", label: "aggressive Verkaufsanrufe" },
    ],
    quote:
      "Ich arbeite täglich an echten Web-Produkten, mit echten Nutzern und komplexen Abläufen. Dieselbe Methode bringe ich in ausgewählte Freelance-Projekte: weniger Improvisation, mehr Struktur.",
  },
};

export const heroContent: Record<Locale, HeroContent> = { it, en, fr, de };

export function getHeroContent(locale: Locale) {
  return heroContent[locale];
}
