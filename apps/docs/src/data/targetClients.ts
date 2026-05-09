import type { Locale } from "../i18n/locale";

export type TargetClient = {
  id: string;
  label: string;
  description: string;
};

export type TargetClientsContent = {
  sectionLabel: string;
  title: string;
  subtitle: string;
  clients: TargetClient[];
};

const it: TargetClientsContent = {
  sectionLabel: "Per chi lavoro",
  title: "Lavoro con persone che hanno bisogno di più ordine digitale.",
  subtitle:
    "Tre gruppi diversi, stesso obiettivo: un sito o un piccolo sistema web che renda più chiaro cosa fai e più semplice contattarti.",
  clients: [
    {
      id: "professionals",
      label: "Professionisti e studi",
      description:
        "Commercialisti, avvocati, consulenti, architetti e studi medici che vogliono un sito credibile, chiaro e orientato al contatto.",
    },
    {
      id: "small-business",
      label: "Attività locali e servizi",
      description:
        "Palestre, centri estetici, B&B, ristoranti, scuole e associazioni: servizi, orari, disponibilità, contatti e prenotazioni in ordine.",
    },
    {
      id: "founders",
      label: "Founder e team piccoli",
      description:
        "Persone che vogliono MVP, dashboard, strumenti interni o flussi digitali per togliere processi da Excel e WhatsApp.",
    },
  ],
};

const en: TargetClientsContent = {
  sectionLabel: "Who I work with",
  title: "I work with people who need more digital order.",
  subtitle:
    "Three different groups, one shared goal: a website or small web system that makes your work clearer and easier to contact.",
  clients: [
    {
      id: "professionals",
      label: "Professionals and studios",
      description:
        "Accountants, lawyers, consultants, architects, and medical studios that need a credible, clear, contact-oriented site.",
    },
    {
      id: "small-business",
      label: "Local activities and services",
      description:
        "Gyms, beauty centres, B&Bs, restaurants, schools, and associations: services, hours, availability, contacts, and bookings in one clear place.",
    },
    {
      id: "founders",
      label: "Founders and small teams",
      description:
        "People who need MVPs, dashboards, internal tools, or digital flows to move work out of Excel and WhatsApp.",
    },
  ],
};

const fr: TargetClientsContent = {
  sectionLabel: "Pour qui je travaille",
  title: "Je travaille avec des personnes qui ont besoin de plus d'ordre digital.",
  subtitle:
    "Trois groupes différents, un même objectif : un site ou un petit système web qui clarifie votre activité et facilite le contact.",
  clients: [
    {
      id: "professionals",
      label: "Professionnels et cabinets",
      description:
        "Experts-comptables, avocats, consultants, architectes et cabinets médicaux qui veulent un site crédible, clair et orienté contact.",
    },
    {
      id: "small-business",
      label: "Activités locales et services",
      description:
        "Salles de sport, instituts de beauté, B&B, restaurants, écoles et associations : services, horaires, disponibilités, contacts et réservations en ordre.",
    },
    {
      id: "founders",
      label: "Founders et petites équipes",
      description:
        "Personnes qui veulent un MVP, un dashboard, un outil interne ou des flux digitaux pour sortir d'Excel et WhatsApp.",
    },
  ],
};

export const targetClientsContent: Record<Locale, TargetClientsContent> = {
  it,
  en,
  fr,
};

export function getTargetClientsContent(locale: Locale) {
  return targetClientsContent[locale];
}
