import type { Locale } from "../i18n/locale";

export type WhyMeReason = {
  id: string;
  title: string;
  description: string;
};

export type WhyMeContent = {
  sectionLabel: string;
  title: string;
  reasons: WhyMeReason[];
};

const it: WhyMeContent = {
  sectionLabel: "Perché lavorare con me",
  title:
    "La differenza tra una soluzione su misura e un sito preconfezionato.",
  reasons: [
    {
      id: "single-contact",
      title: "Un solo interlocutore, dall'idea al sito online",
      description:
        "Niente passaggi di consegna tra account, designer e dev di un'agenzia. Parli con me, decidi con me, ricevi il lavoro da me.",
    },
    {
      id: "real-experience",
      title: "Esperienza reale su prodotti in produzione",
      description:
        "Arrivo con metodo già testato su prodotti reali, utenti veri e flussi complessi. Non improvviso sul tuo progetto.",
    },
    {
      id: "no-template",
      title: "Soluzioni su misura, non temi rivenduti",
      description:
        "Costruisco con React, TypeScript e Tailwind quando serve controllo reale su performance, design e flussi. Non rivendo un tema con due colori cambiati.",
    },
    {
      id: "transparent-pricing",
      title: "Prezzi chiari, scope chiaro",
      description:
        "Ti dico in anticipo cosa è dentro e cosa è fuori. Preventivo scritto, priorità chiare e decisioni tracciate.",
    },
    {
      id: "fast-real",
      title: "Tempi realistici, non promesse",
      description:
        "Una landing in una settimana. Un sito in 2-3 settimane. Una web app MVP in 1-2 mesi. Se non riesco nei tempi, te lo dico subito, non a fine progetto.",
    },
    {
      id: "post-launch",
      title: "Non sparisco dopo il lancio",
      description:
        "Resto reperibile su WhatsApp/email per fix e dubbi. Se vuoi un'evolutiva o una nuova sezione, ti faccio un preventivo separato.",
    },
  ],
};

const en: WhyMeContent = {
  sectionLabel: "Why work with me",
  title:
    "The difference between a tailored solution and a prebuilt website.",
  reasons: [
    {
      id: "single-contact",
      title: "One person from idea to live site",
      description:
        "No handoffs between agency account managers, designers and devs. You talk to me, decide with me, get the work from me.",
    },
    {
      id: "real-experience",
      title: "Real experience on production products",
      description:
        "I bring a method already tested on real products, real users, and complex flows. I do not improvise on your project.",
    },
    {
      id: "no-template",
      title: "Tailored solutions, not resold themes",
      description:
        "I build with React, TypeScript, and Tailwind when real control over performance, design, and flows matters. I do not resell a theme with two colours changed.",
    },
    {
      id: "transparent-pricing",
      title: "Clear pricing, clear scope",
      description:
        "I tell you upfront what's in and what's out. Written quote, clear priorities, and tracked decisions.",
    },
    {
      id: "fast-real",
      title: "Realistic timelines, not promises",
      description:
        "A landing in a week. A site in 2-3 weeks. A web app MVP in 1-2 months. If I can't make it on time, I tell you immediately — not at the end.",
    },
    {
      id: "post-launch",
      title: "I don't disappear after launch",
      description:
        "I stay reachable on WhatsApp/email for fixes and questions. If you want an upgrade or a new section, I send you a separate quote.",
    },
  ],
};

const fr: WhyMeContent = {
  sectionLabel: "Pourquoi travailler avec moi",
  title:
    "La différence entre une solution sur mesure et un site préfabriqué.",
  reasons: [
    {
      id: "single-contact",
      title: "Un seul interlocuteur, de l'idée au site en ligne",
      description:
        "Pas de passages entre commercial, designer et dev d'une agence. Vous parlez avec moi, décidez avec moi, recevez le travail de moi.",
    },
    {
      id: "real-experience",
      title: "Expérience réelle sur des produits en production",
      description:
        "J'arrive avec une méthode déjà testée sur de vrais produits, de vrais utilisateurs et des flux complexes. Je n'improvise pas sur votre projet.",
    },
    {
      id: "no-template",
      title: "Solutions sur mesure, pas des thèmes revendus",
      description:
        "Je construis avec React, TypeScript et Tailwind quand il faut un vrai contrôle sur la performance, le design et les flux. Je ne revends pas un thème avec deux couleurs changées.",
    },
    {
      id: "transparent-pricing",
      title: "Prix clair, scope clair",
      description:
        "Je vous dis à l'avance ce qui est inclus et ce qui ne l'est pas. Devis écrit, priorités claires et décisions suivies.",
    },
    {
      id: "fast-real",
      title: "Délais réalistes, pas des promesses",
      description:
        "Une landing en une semaine. Un site en 2-3 semaines. Un MVP en 1-2 mois. Si je ne peux pas tenir les délais, je vous le dis tout de suite — pas à la fin.",
    },
    {
      id: "post-launch",
      title: "Je ne disparais pas après le lancement",
      description:
        "Je reste joignable sur WhatsApp/email pour les corrections et les doutes. Si vous voulez une évolution ou une nouvelle section, je vous fais un devis séparé.",
    },
  ],
};

const de: WhyMeContent = {
  sectionLabel: "Warum mit mir arbeiten",
  title:
    "Der Unterschied zwischen einer massgeschneiderten Lösung und einer Website von der Stange.",
  reasons: [
    {
      id: "single-contact",
      title: "Ein Ansprechpartner, von der Idee bis zur Website online",
      description:
        "Keine Übergaben zwischen Account-Manager, Designer und Entwickler einer Agentur. Sie sprechen mit mir, entscheiden mit mir, erhalten die Arbeit von mir.",
    },
    {
      id: "real-experience",
      title: "Echte Erfahrung mit Produkten in Produktion",
      description:
        "Ich bringe eine Methode mit, die an echten Produkten, echten Nutzern und komplexen Abläufen erprobt ist. Auf Ihrem Projekt improvisiere ich nicht.",
    },
    {
      id: "no-template",
      title: "Massgeschneiderte Lösungen, keine weiterverkauften Themes",
      description:
        "Ich baue mit React, TypeScript und Tailwind, wenn echte Kontrolle über Performance, Design und Abläufe zählt. Ich verkaufe kein Theme mit zwei geänderten Farben weiter.",
    },
    {
      id: "transparent-pricing",
      title: "Klare Preise, klarer Umfang",
      description:
        "Ich sage Ihnen vorab, was drin ist und was nicht. Schriftliche Offerte, klare Prioritäten, nachvollziehbare Entscheidungen.",
    },
    {
      id: "fast-real",
      title: "Realistische Zeitpläne, keine Versprechen",
      description:
        "Eine Landing Page in einer Woche. Eine Website in 2-3 Wochen. Ein Web-App-MVP in 1-2 Monaten. Wenn ich einen Termin nicht halten kann, sage ich es sofort — nicht am Projektende.",
    },
    {
      id: "post-launch",
      title: "Nach dem Launch verschwinde ich nicht",
      description:
        "Ich bleibe per WhatsApp/E-Mail erreichbar für Fixes und Fragen. Wenn Sie eine Erweiterung oder eine neue Sektion möchten, erhalten Sie eine separate Offerte.",
    },
  ],
};

export const whyMeContent: Record<Locale, WhyMeContent> = { it, en, fr, de };

export function getWhyMeContent(locale: Locale) {
  return whyMeContent[locale];
}
