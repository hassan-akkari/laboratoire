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
  title: "Lavoro con persone vere, non con buyer persona.",
  subtitle:
    "Se ti riconosci in una di queste categorie probabilmente posso aiutarti. Se sei nel dubbio, scrivimi e te lo dico io con onestà.",
  clients: [
    {
      id: "professionals",
      label: "Professionisti e consulenti",
      description:
        "Commercialisti, avvocati, consulenti, architetti che vogliono un sito serio, veloce e che dia subito fiducia.",
    },
    {
      id: "fitness",
      label: "Personal trainer e palestre",
      description:
        "Landing per pacchetti, schede online, prenotazioni lezioni, app gestione clienti.",
    },
    {
      id: "studios",
      label: "Studi e piccole strutture",
      description:
        "Studi medici, centri estetici, scuole, associazioni: presenza online chiara con orari, servizi e prenotazione.",
    },
    {
      id: "small-business",
      label: "Piccole attività locali",
      description:
        "Ristoranti, b&b, negozi, artigiani: sito mobile-first che porti chiamate, prenotazioni e visite reali.",
    },
    {
      id: "founders",
      label: "Founder con un'idea di prodotto",
      description:
        "Hai un'idea di app, gestionale o servizio digitale? Ti aiuto a partire dall'MVP senza buttare via tempo e budget.",
    },
    {
      id: "freelancers",
      label: "Altri freelance",
      description:
        "Personal brand, portfolio, landing per i tuoi servizi. Un sito che ti faccia sembrare il professionista che sei.",
    },
  ],
};

const en: TargetClientsContent = {
  sectionLabel: "Who I work with",
  title: "I work with real people, not buyer personas.",
  subtitle:
    "If you recognise yourself in one of these, I can probably help. If you're not sure, drop me a line and I'll tell you honestly.",
  clients: [
    {
      id: "professionals",
      label: "Professionals & consultants",
      description:
        "Accountants, lawyers, consultants, architects who want a serious, fast site that builds trust on the spot.",
    },
    {
      id: "fitness",
      label: "Personal trainers & gyms",
      description:
        "Landings for packages, online plans, class booking, client management apps.",
    },
    {
      id: "studios",
      label: "Studios & small practices",
      description:
        "Clinics, beauty studios, schools, associations: clear online presence with hours, services, and booking.",
    },
    {
      id: "small-business",
      label: "Small local businesses",
      description:
        "Restaurants, B&Bs, shops, craftsmen: a mobile-first site that drives real calls, bookings, and visits.",
    },
    {
      id: "founders",
      label: "Founders with a product idea",
      description:
        "Got an app idea, internal tool, or digital service? I help you start from the MVP without burning time and budget.",
    },
    {
      id: "freelancers",
      label: "Other freelancers",
      description:
        "Personal brand, portfolio, landings for your services. A site that makes you look like the professional you are.",
    },
  ],
};

const fr: TargetClientsContent = {
  sectionLabel: "Pour qui je travaille",
  title: "Je travaille avec de vraies personnes, pas avec des buyer personas.",
  subtitle:
    "Si vous vous reconnaissez dans l'une de ces catégories, je peux probablement vous aider. Sinon, écrivez-moi et je vous le dirai honnêtement.",
  clients: [
    {
      id: "professionals",
      label: "Professionnels & consultants",
      description:
        "Experts-comptables, avocats, consultants, architectes : un site sérieux, rapide, qui inspire confiance dès la première seconde.",
    },
    {
      id: "fitness",
      label: "Coachs sportifs & salles de sport",
      description:
        "Landings pour des forfaits, plans en ligne, réservation de cours, apps de gestion clients.",
    },
    {
      id: "studios",
      label: "Cabinets & petites structures",
      description:
        "Cabinets médicaux, instituts de beauté, écoles, associations : présence en ligne claire avec horaires, services et réservation.",
    },
    {
      id: "small-business",
      label: "Petites activités locales",
      description:
        "Restaurants, B&B, boutiques, artisans : site mobile-first qui ramène appels, réservations et visites réelles.",
    },
    {
      id: "founders",
      label: "Founders avec une idée produit",
      description:
        "Une idée d'app, d'outil interne ou de service digital ? Je vous aide à partir du MVP sans gaspiller temps et budget.",
    },
    {
      id: "freelancers",
      label: "Autres freelances",
      description:
        "Marque personnelle, portfolio, landings pour vos services. Un site qui vous fait passer pour le pro que vous êtes.",
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
