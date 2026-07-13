import type { Locale } from "../i18n/locale";

export type Problem = {
  id: string;
  title: string;
  description: string;
};

export type ProblemsContent = {
  sectionLabel: string;
  title: string;
  problems: Problem[];
};

const it: ProblemsContent = {
  sectionLabel: "Problemi che risolvo",
  title:
    "Se ti riconosci in uno di questi problemi, il sito non è solo da rifare: è da rimettere in ordine.",
  problems: [
    {
      id: "old-site",
      title: "Hai un sito vecchio che non ti rappresenta più",
      description:
        "Lento, brutto sul telefono, copy generico. Lo apri davanti a un cliente e fai brutta figura.",
    },
    {
      id: "no-contacts",
      title: "Il sito c'è ma non porta contatti",
      description:
        "La gente lo apre, non capisce cosa offri, e se ne va. Niente CTA chiare, niente WhatsApp, niente form che funzioni.",
    },
    {
      id: "scattered",
      title: "La tua presenza online è sparpagliata e poco credibile",
      description:
        "Un Instagram, un sito di 10 anni fa, un Facebook fermo. Quando qualcuno ti cerca su Google, non si fida.",
    },
    {
      id: "internal-tool",
      title: "Gestisci ancora tutto via Excel e WhatsApp",
      description:
        "Prenotazioni, clienti, schede, ordini. Funziona, ma ti porta via tempo e ti fa sembrare poco strutturato.",
    },
    {
      id: "vague-idea",
      title: "Hai un'idea per un sito o un'app ma non sai da dove partire",
      description:
        "Hai capito che ti serve qualcosa, ma non sai se serve un sito, una landing, una web app o un sistema più ordinato.",
    },
    {
      id: "wordpress-mess",
      title:
        "Sei stanco di WordPress impacchettato come 'soluzione su misura'",
      description:
        "Plugin che si rompono, template comprati, performance basse e modifiche semplici che diventano sempre complicate.",
    },
  ],
};

const en: ProblemsContent = {
  sectionLabel: "Problems I solve",
  title:
    "If any of this sounds familiar, your website doesn't just need a refresh — it needs order.",
  problems: [
    {
      id: "old-site",
      title: "You have an old site that no longer represents you",
      description:
        "Slow, ugly on mobile, generic copy. You open it in front of a client and feel embarrassed.",
    },
    {
      id: "no-contacts",
      title: "Your site exists but doesn't bring contacts",
      description:
        "People open it, don't understand what you offer, and leave. No clear CTAs, no WhatsApp, no form that actually works.",
    },
    {
      id: "scattered",
      title: "Your online presence is scattered and not credible",
      description:
        "An Instagram, a 10-year-old site, a stale Facebook. When someone Googles you, they don't trust what they see.",
    },
    {
      id: "internal-tool",
      title: "You still run everything via Excel and WhatsApp",
      description:
        "Bookings, clients, sheets, orders. It works, but it eats your time and makes you look unstructured.",
    },
    {
      id: "vague-idea",
      title:
        "You have an idea for a site or an app but don't know where to start",
      description:
        "You know you need something, but can't tell if it's a website, a landing page, a web app, or simply a more ordered system.",
    },
    {
      id: "wordpress-mess",
      title: "You're tired of WordPress sold as a 'custom solution'",
      description:
        "Plugins that break, bought templates, poor performance, and simple edits that always become complicated.",
    },
  ],
};

const fr: ProblemsContent = {
  sectionLabel: "Problèmes que je résous",
  title:
    "Si vous vous reconnaissez dans ces problèmes, votre site n'est pas seulement à refaire : il faut le remettre en ordre.",
  problems: [
    {
      id: "old-site",
      title: "Vous avez un vieux site qui ne vous représente plus",
      description:
        "Lent, moche sur mobile, copy générique. Vous l'ouvrez devant un client et vous êtes gêné(e).",
    },
    {
      id: "no-contacts",
      title: "Le site existe mais ne ramène pas de contacts",
      description:
        "Les visiteurs l'ouvrent, ne comprennent pas ce que vous offrez, et repartent. Pas de CTA clairs, pas de WhatsApp, pas de formulaire qui marche.",
    },
    {
      id: "scattered",
      title: "Votre présence en ligne est dispersée et peu crédible",
      description:
        "Un Instagram, un site d'il y a 10 ans, un Facebook abandonné. Quand quelqu'un vous cherche sur Google, il ne fait pas confiance.",
    },
    {
      id: "internal-tool",
      title: "Vous gérez encore tout par Excel et WhatsApp",
      description:
        "Réservations, clients, fiches, commandes. Ça marche, mais ça vous bouffe du temps et vous fait paraître peu structuré(e).",
    },
    {
      id: "vague-idea",
      title:
        "Vous avez une idée de site ou d'app mais vous ne savez pas par où commencer",
      description:
        "Vous savez qu'il vous faut quelque chose, mais vous ne savez pas si c'est un site, une landing, une web app ou simplement un système plus ordonné.",
    },
    {
      id: "wordpress-mess",
      title:
        "Vous en avez marre de WordPress vendu comme 'solution sur mesure'",
      description:
        "Plugins qui cassent, templates achetés, performances faibles, et des petites modifications qui deviennent toujours compliquées.",
    },
  ],
};

const de: ProblemsContent = {
  sectionLabel: "Probleme, die ich löse",
  title:
    "Wenn Sie sich in einem dieser Probleme wiedererkennen, braucht Ihre Website nicht nur ein Facelift — sie braucht Ordnung.",
  problems: [
    {
      id: "old-site",
      title: "Sie haben eine alte Website, die Sie nicht mehr repräsentiert",
      description:
        "Langsam, unschön auf dem Handy, generische Texte. Sie öffnen sie vor einem Kunden und schämen sich ein wenig.",
    },
    {
      id: "no-contacts",
      title: "Die Website existiert, bringt aber keine Anfragen",
      description:
        "Besucher öffnen sie, verstehen nicht, was Sie anbieten, und gehen wieder. Keine klaren CTAs, kein WhatsApp, kein Formular, das funktioniert.",
    },
    {
      id: "scattered",
      title: "Ihr Online-Auftritt ist verstreut und wenig glaubwürdig",
      description:
        "Ein Instagram, eine Website von vor 10 Jahren, ein eingeschlafenes Facebook. Wer Sie googelt, fasst kein Vertrauen.",
    },
    {
      id: "internal-tool",
      title: "Sie verwalten noch alles über Excel und WhatsApp",
      description:
        "Buchungen, Kunden, Karteien, Bestellungen. Es funktioniert, aber es kostet Zeit und lässt Sie unstrukturiert wirken.",
    },
    {
      id: "vague-idea",
      title:
        "Sie haben eine Idee für eine Website oder App, wissen aber nicht, wo anfangen",
      description:
        "Sie wissen, dass Sie etwas brauchen — aber nicht, ob es eine Website, eine Landing Page, eine Web-App oder einfach ein geordneteres System ist.",
    },
    {
      id: "wordpress-mess",
      title:
        "Sie sind WordPress leid, das als «massgeschneiderte Lösung» verkauft wird",
      description:
        "Plugins, die kaputtgehen, gekaufte Templates, schwache Performance — und einfache Änderungen, die immer kompliziert werden.",
    },
  ],
};

export const problemsContent: Record<Locale, ProblemsContent> = {
  it,
  en,
  fr,
  de,
};

export function getProblemsContent(locale: Locale) {
  return problemsContent[locale];
}
