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
  /** When set, the card renders a "Code" link to the source (repo or folder). */
  repoUrl?: string;
  /** Plain statements about what the public demo does NOT do. */
  limits?: string[];
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
    limits: string;
    viewLive: string;
    viewCode: string;
  };
  caseStudies: CaseStudy[];
};

/** Source folder of Bookable inside the public monorepo. */
export const BOOKABLE_REPO_URL =
  "https://github.com/hassan-akkari/laboratoire/tree/main/apps/booking-service";

export const BOOKABLE_LIVE_URL = "https://bookable.itshassan.it";

const bookableVariants: CaseStudyVariant[] = [
  { label: "Editorial", image: "image/bookable-variant-1.png" },
  { label: "Warm", image: "image/bookable-variant-2.png" },
  { label: "Bold", image: "image/bookable-variant-3.png" },
];

const bookableStack = [
  "Next.js 16",
  "React 19",
  "Drizzle ORM",
  "Neon Postgres",
  "iron-session",
  "Zod",
];

const it: CaseStudiesContent = {
  sectionLabel: "Progetti e case study",
  title: "Case study reali e laboratori tecnici, separati con chiarezza.",
  subtitle:
    "I case study reali mostrano metodo e impatto. I lab tecnici mostrano profondità su flussi più complessi, senza confonderli con lavori cliente.",
  labels: {
    problem: "Problema",
    solution: "Cosa ho fatto",
    result: "Cosa fa oggi",
    stack: "Stack",
    proves: "Cosa dimostra",
    limits: "Limiti della demo",
    viewLive: "Prova la demo",
    viewCode: "Codice e spiegazioni",
  },
  caseStudies: [
    {
      id: "booking-checkout",
      title: "Bookable — Multi-Style Booking Platform",
      context:
        "Piattaforma di prenotazione full-stack per attività di servizi locali: catalogo pubblico, richiesta di prenotazione validata e dashboard admin. Progetto personale, online su bookable.itshassan.it, codice nel mio monorepo pubblico.",
      problem:
        "Un'attività locale vuole pubblicare i propri servizi e ricevere richieste online con un'identità visiva propria, non l'ennesimo template. E in fase di proposta, mostrare un solo design fisso è una posizione debole.",
      solution: [
        "Progetto realizzato da solo, end-to-end: schema e migrazioni, Server Actions, area admin, tre varianti grafiche e deploy",
        "Un solo modello di contenuti reso in tre design system completi (Editorial / Warm / Bold), scelti da un cookie letto lato server",
        "Next.js 16 App Router + Server Actions, Drizzle ORM su Neon Postgres, con un repository layer che tiene le pagine leggere",
        "Validazione Zod condivisa tra form e server; prezzi salvati in centesimi interi; errori generici verso il client",
      ],
      stack: bookableStack,
      result: [
        "Catalogo, pagina di dettaglio con galleria e form di richiesta prenotazione, in tre design commutabili live",
        "Admin con login (cookie sigillato iron-session + bcrypt): gestione servizi, prezzi, immagini e stato delle richieste",
        "Parte anche senza database (dati di esempio e banner demo); online su dominio custom con Vercel",
      ],
      limits: [
        "È un sistema di richieste, non un motore di agenda: nessuna disponibilità a slot né prevenzione delle doppie prenotazioni",
        "L'area admin non è pubblica: la demo mostra catalogo, dettaglio e form",
        "Le richieste inviate dalla demo arrivano davvero nella dashboard del progetto: usa dati fittizi",
        "Nessun rate limiting né token CSRF esplicito: postura MVP dichiarata nel README",
      ],
      proves:
        "So progettare e portare in produzione un prodotto full-stack completo — data layer, auth, validazione e un design system distintivo — non solo siti vetrina.",
      liveUrl: BOOKABLE_LIVE_URL,
      repoUrl: BOOKABLE_REPO_URL,
      variants: bookableVariants,
    },
    {
      id: "hospitality-ecommerce",
      title: "Piattaforma e-commerce hospitality — UI standards e flussi core",
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
    result: "What it does today",
    stack: "Stack",
    proves: "What it proves",
    limits: "Demo limits",
    viewLive: "Try the demo",
    viewCode: "Code and write-up",
  },
  caseStudies: [
    {
      id: "booking-checkout",
      title: "Bookable — Multi-Style Booking Platform",
      context:
        "Full-stack booking platform for local service businesses: public catalogue, validated booking-request flow and an admin dashboard. Personal project, live at bookable.itshassan.it, source in my public monorepo.",
      problem:
        "A local business wants to publish its services and take requests online with its own look, not another identical template. And when pitching, showing a single fixed design is a weak position.",
      solution: [
        "Built solo, end to end: schema and migrations, Server Actions, admin area, three design variants and the deploy",
        "One content model rendered in three complete design systems (Editorial / Warm / Bold), picked from a cookie read on the server",
        "Next.js 16 App Router + Server Actions, Drizzle ORM on Neon Postgres, with a repository layer keeping pages thin",
        "Zod validation shared between the form and the server; prices stored as integer cents; generic errors to the client",
      ],
      stack: bookableStack,
      result: [
        "Catalogue, detail page with gallery and booking-request form, in three designs switchable live",
        "Admin behind a login (sealed iron-session cookie + bcrypt): services, prices, images and request status",
        "Boots without a database (sample data plus a demo banner); live on a custom domain on Vercel",
      ],
      limits: [
        "A request system, not a scheduling engine: no slot availability and no double-booking prevention",
        "The admin area is not public: the demo shows catalogue, detail and form",
        "Requests sent from the demo really land in the project's dashboard: use made-up data",
        "No rate limiting and no explicit CSRF token: MVP posture, stated in the README",
      ],
      proves:
        "I can design and ship a complete full-stack product — data layer, auth, validation and a distinctive design system — not just brochure sites.",
      liveUrl: BOOKABLE_LIVE_URL,
      repoUrl: BOOKABLE_REPO_URL,
      variants: bookableVariants,
    },
    {
      id: "hospitality-ecommerce",
      title: "Hospitality e-commerce platform — UI standards and core flows",
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
    result: "Ce que ça fait aujourd'hui",
    stack: "Stack",
    proves: "Ce que ça prouve",
    limits: "Limites de la démo",
    viewLive: "Essayer la démo",
    viewCode: "Code et explications",
  },
  caseStudies: [
    {
      id: "booking-checkout",
      title: "Bookable — Multi-Style Booking Platform",
      context:
        "Plateforme de réservation full-stack pour des activités de services locales : catalogue public, flux de demande de réservation validé et dashboard admin. Projet personnel, en ligne sur bookable.itshassan.it, code dans mon monorepo public.",
      problem:
        "Une activité locale veut publier ses services et recevoir des demandes en ligne avec sa propre identité visuelle, pas un énième template. Et en phase de proposition, montrer un seul design figé est une position faible.",
      solution: [
        "Réalisé seul, de bout en bout : schéma et migrations, Server Actions, espace admin, trois variantes graphiques et déploiement",
        "Un seul modèle de contenu rendu dans trois design systems complets (Editorial / Warm / Bold), choisis via un cookie lu côté serveur",
        "Next.js 16 App Router + Server Actions, Drizzle ORM sur Neon Postgres, avec un repository layer qui garde les pages légères",
        "Validation Zod partagée entre le formulaire et le serveur ; prix stockés en centimes entiers ; erreurs génériques côté client",
      ],
      stack: bookableStack,
      result: [
        "Catalogue, page de détail avec galerie et formulaire de demande de réservation, dans trois designs commutables en live",
        "Admin derrière un login (cookie scellé iron-session + bcrypt) : services, prix, images et statut des demandes",
        "Démarre sans base de données (données d'exemple et bannière démo) ; en ligne sur un domaine custom via Vercel",
      ],
      limits: [
        "Un système de demandes, pas un moteur d'agenda : pas de créneaux disponibles ni de prévention des doubles réservations",
        "L'espace admin n'est pas public : la démo montre le catalogue, le détail et le formulaire",
        "Les demandes envoyées depuis la démo arrivent réellement dans le dashboard du projet : utilisez des données fictives",
        "Pas de rate limiting ni de token CSRF explicite : posture MVP, indiquée dans le README",
      ],
      proves:
        "Je sais concevoir et mettre en production un produit full-stack complet — data layer, auth, validation et un design system distinctif — pas juste des sites vitrine.",
      liveUrl: BOOKABLE_LIVE_URL,
      repoUrl: BOOKABLE_REPO_URL,
      variants: bookableVariants,
    },
    {
      id: "hospitality-ecommerce",
      title: "Plateforme e-commerce hospitality — standards UI et flux core",
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
    result: "Was es heute kann",
    stack: "Stack",
    proves: "Was es zeigt",
    limits: "Grenzen der Demo",
    viewLive: "Demo ausprobieren",
    viewCode: "Code und Erläuterungen",
  },
  caseStudies: [
    {
      id: "booking-checkout",
      title: "Bookable — Multi-Style Booking Platform",
      context:
        "Full-Stack-Buchungsplattform für lokale Dienstleister: öffentlicher Katalog, validierter Buchungsanfrage-Fluss und ein Admin-Dashboard. Persönliches Projekt, live auf bookable.itshassan.it, Quellcode in meinem öffentlichen Monorepo.",
      problem:
        "Ein lokaler Betrieb möchte seine Leistungen veröffentlichen und Anfragen online erhalten — mit eigener Identität, nicht mit dem x-ten identischen Template. Und in der Offerte ist ein einziges fixes Design eine schwache Position.",
      solution: [
        "Allein umgesetzt, end-to-end: Schema und Migrationen, Server Actions, Admin-Bereich, drei Design-Varianten und Deployment",
        "Ein Content-Modell, gerendert in drei kompletten Design-Systemen (Editorial / Warm / Bold), gewählt über ein serverseitig gelesenes Cookie",
        "Next.js 16 App Router + Server Actions, Drizzle ORM auf Neon Postgres, mit einem Repository-Layer, der die Seiten schlank hält",
        "Zod-Validierung, geteilt zwischen Formular und Server; Preise als ganzzahlige Cents gespeichert; generische Fehler zum Client",
      ],
      stack: bookableStack,
      result: [
        "Katalog, Detailseite mit Galerie und Buchungsanfrage-Formular, in drei live umschaltbaren Designs",
        "Admin hinter einem Login (versiegeltes iron-session-Cookie + bcrypt): Leistungen, Preise, Bilder und Status der Anfragen",
        "Startet auch ohne Datenbank (Beispieldaten plus Demo-Banner); live auf eigener Domain bei Vercel",
      ],
      limits: [
        "Ein Anfrage-System, keine Terminplanung: keine Slot-Verfügbarkeit und kein Schutz vor Doppelbuchungen",
        "Der Admin-Bereich ist nicht öffentlich: die Demo zeigt Katalog, Detailseite und Formular",
        "Anfragen aus der Demo landen tatsächlich im Dashboard des Projekts: bitte fiktive Daten verwenden",
        "Kein Rate-Limiting und kein explizites CSRF-Token: MVP-Stand, im README ausgewiesen",
      ],
      proves:
        "Ich kann ein vollständiges Full-Stack-Produkt konzipieren und in Produktion bringen — Data-Layer, Auth, Validierung und ein unverwechselbares Design-System — nicht nur Visitenkarten-Websites.",
      liveUrl: BOOKABLE_LIVE_URL,
      repoUrl: BOOKABLE_REPO_URL,
      variants: bookableVariants,
    },
    {
      id: "hospitality-ecommerce",
      title: "Hospitality-E-Commerce-Plattform — UI-Standards und Kernflüsse",
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
