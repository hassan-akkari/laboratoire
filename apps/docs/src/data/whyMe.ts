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
    "Differenza tra una scelta su misura e un sito-pacco di un'agenzia.",
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
        "Lavoro tutti i giorni su un prodotto enterprise con utenti reali. So cosa rompe un flusso di booking, un checkout o un form di contatto. Non imparo sul tuo budget.",
    },
    {
      id: "no-template",
      title: "Codice mio, non template ricomprati",
      description:
        "React, TypeScript e Tailwind. Il sito che ricevi è davvero su misura: cambi un titolo o aggiungi una sezione senza dover ricomprare un plugin.",
    },
    {
      id: "transparent-pricing",
      title: "Prezzi chiari, scope chiaro",
      description:
        "Ti dico in anticipo cosa è dentro e cosa è fuori. Non triplichiamo il preventivo a metà progetto, e non spariamo cifre per vedere se attacchi.",
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
        "Resto reperibile su WhatsApp/email per fix e dubbi. Se vuoi un'evolutiva o una nuova sezione, ti faccio un preventivo separato e onesto.",
    },
  ],
};

const en: WhyMeContent = {
  sectionLabel: "Why work with me",
  title:
    "The difference between a tailored choice and an off-the-shelf agency site.",
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
        "I work daily on an enterprise product with real users. I know what breaks a booking flow, a checkout, or a contact form. I don't learn on your budget.",
    },
    {
      id: "no-template",
      title: "My code, not bought templates",
      description:
        "React, TypeScript, and Tailwind. The site you receive is genuinely custom: you can change a heading or add a section without buying yet another plugin.",
    },
    {
      id: "transparent-pricing",
      title: "Clear pricing, clear scope",
      description:
        "I tell you upfront what's in and what's out. We don't triple the quote mid-project, and I don't throw out numbers just to see if you bite.",
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
        "I stay reachable on WhatsApp/email for fixes and questions. If you want an upgrade or a new section, I send you a separate honest quote.",
    },
  ],
};

const fr: WhyMeContent = {
  sectionLabel: "Pourquoi travailler avec moi",
  title:
    "La différence entre un choix sur mesure et un site-paquet d'agence.",
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
        "Je travaille tous les jours sur un produit enterprise avec de vrais utilisateurs. Je sais ce qui casse un flow de booking, un checkout ou un formulaire. Je n'apprends pas sur votre budget.",
    },
    {
      id: "no-template",
      title: "Mon code, pas des templates achetés",
      description:
        "React, TypeScript et Tailwind. Le site que vous recevez est vraiment sur mesure : vous changez un titre ou ajoutez une section sans devoir racheter un plugin.",
    },
    {
      id: "transparent-pricing",
      title: "Prix clair, scope clair",
      description:
        "Je vous dis à l'avance ce qui est inclus et ce qui ne l'est pas. On ne triple pas le devis en cours de projet, et je ne lance pas des chiffres pour voir si vous mordez.",
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
        "Je reste joignable sur WhatsApp/email pour les corrections et les doutes. Si vous voulez une évolution ou une nouvelle section, je vous fais un devis séparé et honnête.",
    },
  ],
};

export const whyMeContent: Record<Locale, WhyMeContent> = { it, en, fr };

export function getWhyMeContent(locale: Locale) {
  return whyMeContent[locale];
}
