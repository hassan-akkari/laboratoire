import type { Locale } from "../i18n/locale";

export type CaseStudyVariant = {
  label: string;
  image: string;
};

export type CaseStudy = {
  id: string;
  title: string;
  context: string;
  problem: string;
  solution: string[];
  stack: string[];
  result: string[];
  proves: string;
  /** When set, the card renders a "Live" link to the deployed product. */
  liveUrl?: string;
  /** When set, the card renders the interactive style-switcher showcase. */
  variants?: CaseStudyVariant[];
};

export type CaseStudiesContent = {
  sectionLabel: string;
  title: string;
  subtitle: string;
  labels: {
    problem: string;
    solution: string;
    result: string;
    stack: string;
    proves: string;
    viewLive: string;
  };
  caseStudies: CaseStudy[];
};

const it: CaseStudiesContent = {
  sectionLabel: "Progetti e case study",
  title: "Case study reali e laboratori tecnici, separati con chiarezza.",
  subtitle:
    "I case study reali mostrano metodo e impatto. I lab tecnici mostrano profondità su flussi più complessi, senza confonderli con lavori cliente.",
  labels: {
    problem: "Problema",
    solution: "Cosa ho fatto",
    result: "Risultato",
    stack: "Stack",
    proves: "Cosa dimostra",
    viewLive: "Vai al sito live",
  },
  caseStudies: [
    {
      id: "sibylla-network",
      title: "Sibylla Network — UI standards e flussi core",
      context:
        "Prodotto enterprise complesso con team distribuito e moduli multipli. Codebase legacy con regole UI sparpagliate.",
      problem:
        "Componenti duplicati, convenzioni diverse tra moduli, regressioni frequenti al rilascio. Ogni nuova feature costava più del previsto.",
      solution: [
        "Introdotto standard UI condivisi (classi, stili, naming) riusati dal team",
        "Refactoring di flussi core (booking, catalogo, checkout) in React + Redux Toolkit",
        "Pattern riutilizzabili che hanno reso più prevedibile la consegna",
      ],
      stack: [
        "React",
        "TypeScript",
        "Redux Toolkit",
        "REST APIs",
        "Tailwind CSS",
      ],
      result: [
        "Prima: moduli simili avevano bottoni, layout e comportamenti diversi",
        "Dopo: pattern condivisi hanno reso l'interfaccia più coerente e più veloce da mantenere",
        "Risultato: meno discussioni soggettive nelle PR e meno regressioni sulle schermate comuni",
      ],
      proves:
        "So portare ordine in codebase grandi e già in produzione, senza riscriverle da zero.",
    },
    {
      id: "bootstrap-tailwind",
      title: "Migrazione Bootstrap → Tailwind",
      context:
        "Applicazione web costruita su Bootstrap + componenti vendor con anni di patch addosso. Layout incoerenti tra pagine simili.",
      problem:
        "Cambiare uno stile rompeva pagine in posti imprevisti. Velocità di iterazione bassa, ogni piccola modifica richiedeva controlli manuali su decine di schermate.",
      solution: [
        "Audit dei componenti realmente usati e di quelli morti",
        "Migrazione progressiva pagina-per-pagina, senza freezare la roadmap",
        "Costruito un set di pattern Tailwind riutilizzabili (card, form, layout, button)",
      ],
      stack: [
        "Tailwind CSS",
        "Component refactor",
        "UI standards",
        "CSS architecture",
      ],
      result: [
        "Prima: cambiare uno stile richiedeva controlli manuali su pagine non collegate",
        "Dopo: pattern Tailwind condivisi per card, form, layout e bottoni",
        "Risultato: iterazioni UI più rapide e più controllo sul design system",
      ],
      proves:
        "Posso modernizzare un sito esistente senza buttare via tutto il lavoro fatto prima.",
    },
    {
      id: "booking-checkout",
      title: "Bookable — Multi-Style Booking Platform",
      context:
        "Una piattaforma di prenotazione full-stack in produzione per attività di servizi locali — catalogo pubblico, flusso di richiesta prenotazione validato e dashboard admin sicura. Online su bookable.itshassan.it.",
      problem:
        "Le attività vogliono un'identità propria, non l'ennesimo template identico — e proporre un solo design fisso è una posizione debole. Volevo mostrare un vero flusso backend e dimostrare che lo stesso contenuto può uscire in identità visive davvero diverse, all'istante.",
      solution: [
        "Un solo modello di contenuti reso in tre design system completi (Editorial / Warm / Bold), cambiati live da cookie lato server senza flicker",
        "Next.js 16 App Router + Server Actions, Drizzle ORM, Neon Postgres, con un repository layer che tiene le pagine leggere",
        "Admin sicuro: iron-session + bcrypt, login timing- ed enumeration-safe, protezione delle route a tre livelli",
        "Validazione Zod end-to-end condivisa tra client e server; prezzi salvati in cent interi",
      ],
      stack: [
        "Next.js 16",
        "React 19",
        "Drizzle ORM",
        "Neon Postgres",
        "iron-session",
        "Zod",
      ],
      result: [
        "Online in produzione su dominio custom con SSL valido (Vercel + OVH)",
        "Tre design system completi da un solo codebase — zero duplicazione di contenuti",
        "Data layer build-safe: parte e fa demo senza database, poi passa al Neon live quando configurato",
      ],
      proves:
        "So progettare e portare in produzione un vero prodotto full-stack end-to-end — data layer, auth, validazione e un design system distintivo — non solo siti vetrina.",
      liveUrl: "https://bookable.itshassan.it",
      variants: [
        { label: "Editorial", image: "image/bookable-variant-1.png" },
        { label: "Warm", image: "image/bookable-variant-2.png" },
        { label: "Bold", image: "image/bookable-variant-3.png" },
      ],
    },
  ],
};

const en: CaseStudiesContent = {
  sectionLabel: "Projects & case studies",
  title: "Real case studies and technical labs, clearly separated.",
  subtitle:
    "Real case studies show method and impact. Technical labs show depth on more complex flows without presenting them as client work.",
  labels: {
    problem: "Problem",
    solution: "What I did",
    result: "Result",
    stack: "Stack",
    proves: "What it proves",
    viewLive: "Visit the live site",
  },
  caseStudies: [
    {
      id: "sibylla-network",
      title: "Sibylla Network — UI standards and core flows",
      context:
        "Complex enterprise product with a distributed team and multiple modules. Legacy codebase with scattered UI rules.",
      problem:
        "Duplicated components, different conventions across modules, frequent release regressions. Every new feature cost more than expected.",
      solution: [
        "Introduced shared UI standards (classes, styles, naming) reused by the team",
        "Refactored core flows (booking, catalog, checkout) in React + Redux Toolkit",
        "Reusable patterns that made delivery more predictable",
      ],
      stack: [
        "React",
        "TypeScript",
        "Redux Toolkit",
        "REST APIs",
        "Tailwind CSS",
      ],
      result: [
        "Before: similar modules had different buttons, layouts, and behaviours",
        "After: shared patterns made the interface more consistent and easier to maintain",
        "Result: fewer subjective PR debates and fewer regressions on common screens",
      ],
      proves:
        "I can bring order to large, in-production codebases without rewriting them from scratch.",
    },
    {
      id: "bootstrap-tailwind",
      title: "Bootstrap → Tailwind migration",
      context:
        "Web app built on Bootstrap + vendor components with years of patches on top. Inconsistent layouts across similar pages.",
      problem:
        "Changing one style broke pages in unrelated places. Low iteration speed — every tiny change required manual checks across dozens of screens.",
      solution: [
        "Audit of which components were actually used vs dead",
        "Progressive page-by-page migration without freezing the roadmap",
        "Built a set of reusable Tailwind patterns (card, form, layout, button)",
      ],
      stack: [
        "Tailwind CSS",
        "Component refactor",
        "UI standards",
        "CSS architecture",
      ],
      result: [
        "Before: changing one style required manual checks on unrelated pages",
        "After: shared Tailwind patterns for cards, forms, layouts, and buttons",
        "Result: faster UI iterations and more control over the design system",
      ],
      proves:
        "I can modernise an existing site without throwing away the work already done.",
    },
    {
      id: "booking-checkout",
      title: "Bookable — Multi-Style Booking Platform",
      context:
        "A deployed, full-stack booking platform for local service businesses — public catalogue, validated booking-request flow, and a secure admin dashboard. Live at bookable.itshassan.it.",
      problem:
        "Businesses want their own look, not another identical template — and pitching one fixed design is a weak position. I wanted to show a real backend flow and prove the same content can ship in genuinely different visual identities, instantly.",
      solution: [
        "One content model rendered in three full design systems (Editorial / Warm / Bold), switched live from a server-side cookie with no flicker",
        "Next.js 16 App Router + Server Actions, Drizzle ORM, Neon Postgres, with a repository layer keeping pages thin",
        "Secure admin: iron-session + bcrypt, timing- and enumeration-safe login, three-layer route protection",
        "End-to-end Zod validation shared between client and server; prices stored as integer cents",
      ],
      stack: [
        "Next.js 16",
        "React 19",
        "Drizzle ORM",
        "Neon Postgres",
        "iron-session",
        "Zod",
      ],
      result: [
        "Live in production on a custom domain with valid SSL (Vercel + OVH)",
        "Three complete design systems from one codebase — zero content duplication",
        "Build-safe data layer: boots and demos with no database, then switches to live Neon when configured",
      ],
      proves:
        "I can design and ship a real, deployed full-stack product end to end — data layer, auth, validation, and a distinctive design system — not just brochure sites.",
      liveUrl: "https://bookable.itshassan.it",
      variants: [
        { label: "Editorial", image: "image/bookable-variant-1.png" },
        { label: "Warm", image: "image/bookable-variant-2.png" },
        { label: "Bold", image: "image/bookable-variant-3.png" },
      ],
    },
  ],
};

const fr: CaseStudiesContent = {
  sectionLabel: "Projets & case studies",
  title: "Case studies réels et labos techniques, clairement séparés.",
  subtitle:
    "Les case studies réels montrent la méthode et l'impact. Les labos techniques montrent la profondeur sur des flux plus complexes, sans les présenter comme des projets client.",
  labels: {
    problem: "Problème",
    solution: "Ce que j'ai fait",
    result: "Résultat",
    stack: "Stack",
    proves: "Ce que ça prouve",
    viewLive: "Voir le site live",
  },
  caseStudies: [
    {
      id: "sibylla-network",
      title: "Sibylla Network — standards UI et flux core",
      context:
        "Produit enterprise complexe avec équipe distribuée et modules multiples. Codebase legacy avec règles UI dispersées.",
      problem:
        "Composants dupliqués, conventions différentes entre modules, régressions fréquentes en release. Chaque nouvelle feature coûtait plus que prévu.",
      solution: [
        "Introduit des standards UI partagés (classes, styles, naming) réutilisés par l'équipe",
        "Refactor des flux core (booking, catalogue, checkout) en React + Redux Toolkit",
        "Patterns réutilisables qui ont rendu la livraison plus prévisible",
      ],
      stack: [
        "React",
        "TypeScript",
        "Redux Toolkit",
        "REST APIs",
        "Tailwind CSS",
      ],
      result: [
        "Avant : des modules similaires avaient des boutons, layouts et comportements différents",
        "Après : des patterns partagés ont rendu l'interface plus cohérente et plus facile à maintenir",
        "Résultat : moins de débats subjectifs en PR et moins de régressions sur les écrans communs",
      ],
      proves:
        "Je sais mettre de l'ordre dans des codebases grands et déjà en production, sans tout réécrire.",
    },
    {
      id: "bootstrap-tailwind",
      title: "Migration Bootstrap → Tailwind",
      context:
        "Application web construite sur Bootstrap + composants vendor avec des années de patches. Layouts incohérents entre pages similaires.",
      problem:
        "Changer un style cassait des pages à des endroits inattendus. Vitesse d'itération basse, chaque petite modif demandait des checks manuels sur des dizaines d'écrans.",
      solution: [
        "Audit des composants réellement utilisés vs morts",
        "Migration progressive page par page sans freezer la roadmap",
        "Set de patterns Tailwind réutilisables (card, form, layout, button)",
      ],
      stack: [
        "Tailwind CSS",
        "Component refactor",
        "UI standards",
        "CSS architecture",
      ],
      result: [
        "Avant : changer un style demandait des checks manuels sur des pages sans lien direct",
        "Après : patterns Tailwind partagés pour cards, forms, layouts et boutons",
        "Résultat : itérations UI plus rapides et plus de contrôle sur le design system",
      ],
      proves:
        "Je peux moderniser un site existant sans jeter le travail déjà fait.",
    },
    {
      id: "booking-checkout",
      title: "Bookable — Multi-Style Booking Platform",
      context:
        "Une plateforme de réservation full-stack en production pour des activités de services locales — catalogue public, flux de demande de réservation validé et dashboard admin sécurisé. En ligne sur bookable.itshassan.it.",
      problem:
        "Les activités veulent leur propre identité, pas un énième template identique — et proposer un seul design figé est une position faible. Je voulais montrer un vrai flux backend et prouver que le même contenu peut sortir dans des identités visuelles vraiment différentes, instantanément.",
      solution: [
        "Un seul modèle de contenu rendu dans trois design systems complets (Editorial / Warm / Bold), changés en live via un cookie côté serveur sans flicker",
        "Next.js 16 App Router + Server Actions, Drizzle ORM, Neon Postgres, avec un repository layer qui garde les pages légères",
        "Admin sécurisé : iron-session + bcrypt, login timing- et enumeration-safe, protection des routes à trois niveaux",
        "Validation Zod end-to-end partagée entre client et serveur ; prix stockés en cents entiers",
      ],
      stack: [
        "Next.js 16",
        "React 19",
        "Drizzle ORM",
        "Neon Postgres",
        "iron-session",
        "Zod",
      ],
      result: [
        "En ligne en production sur un domaine custom avec SSL valide (Vercel + OVH)",
        "Trois design systems complets depuis un seul codebase — zéro duplication de contenu",
        "Data layer build-safe : démarre et fait la démo sans base de données, puis bascule sur Neon live une fois configuré",
      ],
      proves:
        "Je sais concevoir et mettre en production un vrai produit full-stack de bout en bout — data layer, auth, validation et un design system distinctif — pas juste des sites vitrine.",
      liveUrl: "https://bookable.itshassan.it",
      variants: [
        { label: "Editorial", image: "image/bookable-variant-1.png" },
        { label: "Warm", image: "image/bookable-variant-2.png" },
        { label: "Bold", image: "image/bookable-variant-3.png" },
      ],
    },
  ],
};

const de: CaseStudiesContent = {
  sectionLabel: "Projekte & Case Studies",
  title: "Echte Case Studies und technische Labs, sauber getrennt.",
  subtitle:
    "Echte Case Studies zeigen Methode und Wirkung. Technische Labs zeigen Tiefe bei komplexeren Abläufen — ohne sie als Kundenprojekte auszugeben.",
  labels: {
    problem: "Problem",
    solution: "Was ich getan habe",
    result: "Ergebnis",
    stack: "Stack",
    proves: "Was es zeigt",
    viewLive: "Zur Live-Website",
  },
  caseStudies: [
    {
      id: "sibylla-network",
      title: "Sibylla Network — UI-Standards und Kernflüsse",
      context:
        "Komplexes Enterprise-Produkt mit verteiltem Team und mehreren Modulen. Legacy-Codebasis mit verstreuten UI-Regeln.",
      problem:
        "Duplizierte Komponenten, unterschiedliche Konventionen zwischen Modulen, häufige Regressionen beim Release. Jedes neue Feature kostete mehr als geplant.",
      solution: [
        "Gemeinsame UI-Standards eingeführt (Klassen, Styles, Naming), die vom Team wiederverwendet werden",
        "Kernflüsse (Buchung, Katalog, Checkout) in React + Redux Toolkit refaktoriert",
        "Wiederverwendbare Patterns, die die Lieferung planbarer gemacht haben",
      ],
      stack: [
        "React",
        "TypeScript",
        "Redux Toolkit",
        "REST APIs",
        "Tailwind CSS",
      ],
      result: [
        "Vorher: ähnliche Module hatten unterschiedliche Buttons, Layouts und Verhalten",
        "Nachher: gemeinsame Patterns machten die Oberfläche konsistenter und einfacher zu warten",
        "Ergebnis: weniger subjektive PR-Diskussionen und weniger Regressionen auf den gemeinsamen Screens",
      ],
      proves:
        "Ich kann Ordnung in grosse, produktive Codebasen bringen — ohne sie von Grund auf neu zu schreiben.",
    },
    {
      id: "bootstrap-tailwind",
      title: "Migration Bootstrap → Tailwind",
      context:
        "Web-Anwendung auf Bootstrap + Vendor-Komponenten mit jahrelangen Patches obendrauf. Inkonsistente Layouts zwischen ähnlichen Seiten.",
      problem:
        "Eine Stiländerung brach Seiten an unerwarteten Stellen. Geringe Iterationsgeschwindigkeit — jede kleine Änderung erforderte manuelle Checks über Dutzende Screens.",
      solution: [
        "Audit, welche Komponenten wirklich genutzt werden und welche tot sind",
        "Progressive Seite-für-Seite-Migration, ohne die Roadmap einzufrieren",
        "Ein Set wiederverwendbarer Tailwind-Patterns gebaut (Card, Formular, Layout, Button)",
      ],
      stack: [
        "Tailwind CSS",
        "Component-Refactoring",
        "UI-Standards",
        "CSS-Architektur",
      ],
      result: [
        "Vorher: eine Stiländerung erforderte manuelle Checks auf nicht verwandten Seiten",
        "Nachher: gemeinsame Tailwind-Patterns für Cards, Formulare, Layouts und Buttons",
        "Ergebnis: schnellere UI-Iterationen und mehr Kontrolle über das Design-System",
      ],
      proves:
        "Ich kann eine bestehende Website modernisieren, ohne die bereits geleistete Arbeit wegzuwerfen.",
    },
    {
      id: "booking-checkout",
      title: "Bookable — Multi-Style Booking Platform",
      context:
        "Eine produktive Full-Stack-Buchungsplattform für lokale Dienstleister — öffentlicher Katalog, validierter Buchungsanfrage-Fluss und ein abgesichertes Admin-Dashboard. Live auf bookable.itshassan.it.",
      problem:
        "Betriebe wollen eine eigene Identität, nicht das x-te identische Template — und ein einziges fixes Design anzubieten ist eine schwache Position. Ich wollte einen echten Backend-Fluss zeigen und beweisen, dass derselbe Inhalt sofort in wirklich unterschiedlichen visuellen Identitäten erscheinen kann.",
      solution: [
        "Ein Content-Modell, gerendert in drei kompletten Design-Systemen (Editorial / Warm / Bold), live umgeschaltet über ein server-seitiges Cookie ohne Flackern",
        "Next.js 16 App Router + Server Actions, Drizzle ORM, Neon Postgres, mit einem Repository-Layer, der die Seiten schlank hält",
        "Abgesichertes Admin: iron-session + bcrypt, timing- und enumeration-sicherer Login, dreistufiger Routenschutz",
        "End-to-end Zod-Validierung, geteilt zwischen Client und Server; Preise als ganzzahlige Cents gespeichert",
      ],
      stack: [
        "Next.js 16",
        "React 19",
        "Drizzle ORM",
        "Neon Postgres",
        "iron-session",
        "Zod",
      ],
      result: [
        "Live in Produktion auf eigener Domain mit gültigem SSL (Vercel + OVH)",
        "Drei komplette Design-Systeme aus einer Codebasis — null Content-Duplikation",
        "Build-sicherer Data-Layer: startet und demonstriert ohne Datenbank, wechselt dann auf das live Neon, sobald konfiguriert",
      ],
      proves:
        "Ich kann ein echtes Full-Stack-Produkt end-to-end konzipieren und in Produktion bringen — Data-Layer, Auth, Validierung und ein unverwechselbares Design-System — nicht nur Visitenkarten-Websites.",
      liveUrl: "https://bookable.itshassan.it",
      variants: [
        { label: "Editorial", image: "image/bookable-variant-1.png" },
        { label: "Warm", image: "image/bookable-variant-2.png" },
        { label: "Bold", image: "image/bookable-variant-3.png" },
      ],
    },
  ],
};

export const caseStudiesContent: Record<Locale, CaseStudiesContent> = {
  it,
  en,
  fr,
  de,
};

export function getCaseStudiesContent(locale: Locale) {
  return caseStudiesContent[locale];
}
