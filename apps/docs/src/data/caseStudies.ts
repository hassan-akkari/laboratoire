import type { Locale } from "../i18n/locale";

export type CaseStudy = {
  id: string;
  title: string;
  context: string;
  problem: string;
  solution: string[];
  stack: string[];
  result: string[];
  proves: string;
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
  };
  caseStudies: CaseStudy[];
};

const it: CaseStudiesContent = {
  sectionLabel: "Progetti e case study",
  title: "Cose che ho costruito davvero, raccontate per intero.",
  subtitle:
    "Su alcuni progetti ho NDA: ti racconto problema, soluzione e risultato senza tirare fuori screenshot riservati.",
  labels: {
    problem: "Problema",
    solution: "Cosa ho fatto",
    result: "Risultato",
    stack: "Stack",
    proves: "Cosa dimostra",
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
        "UI più coerente tra moduli",
        "Meno regressioni al rilascio",
        "Meno tempo perso a discutere convenzioni durante le PR",
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
        "Layout coerenti tra pagine simili",
        "Iterazione UI più veloce per il team",
        "Dipendenze vendor ridotte e più controllo sul design system",
      ],
      proves:
        "Posso modernizzare un sito esistente senza buttare via tutto il lavoro fatto prima.",
    },
    {
      id: "booking-checkout",
      title: "Booking + checkout MVP (Next.js)",
      context:
        "Progetto interno di laboratorio per validare un flusso di prenotazione/pagamento end-to-end con regole di prezzo reali.",
      problem:
        "Serviva un riferimento concreto per mostrare come gestisco un flusso che mescola listing, dettaglio, carrello, checkout, gate di accesso e regole di sconto.",
      solution: [
        "Architettura Next.js App Router con Server Actions e Route Handlers",
        "Motore di prezzo con promo code, fasce a persona / minimo gruppo, IVA e service fee",
        "Gate di accesso al checkout con redirect puliti e idempotenza ordini",
        "Validazione con Zod e test su pricing/sessione/ordini",
      ],
      stack: ["Next.js", "TypeScript", "Server Actions", "Zod", "Vitest"],
      result: [
        "Flusso completo navigabile in locale dal browse al checkout",
        "Codice testato sui punti critici (pricing, idempotency, redirect)",
        "Base riutilizzabile per progetti reali di prenotazione/booking",
      ],
      proves:
        "So gestire flussi tecnici complessi (pagamenti, regole di prezzo, sessioni) con codice pulito e testato, non solo siti vetrina.",
    },
  ],
};

const en: CaseStudiesContent = {
  sectionLabel: "Projects & case studies",
  title: "Things I actually built, told end to end.",
  subtitle:
    "Some projects are under NDA: I'll walk you through problem, solution and outcome without leaking confidential screenshots.",
  labels: {
    problem: "Problem",
    solution: "What I did",
    result: "Result",
    stack: "Stack",
    proves: "What it proves",
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
        "More consistent UI across modules",
        "Fewer release regressions",
        "Less time wasted debating conventions on PRs",
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
        "Consistent layouts across similar pages",
        "Faster UI iteration for the team",
        "Reduced vendor dependencies and more control over the design system",
      ],
      proves:
        "I can modernise an existing site without throwing away the work already done.",
    },
    {
      id: "booking-checkout",
      title: "Booking + checkout MVP (Next.js)",
      context:
        "Internal lab project to validate an end-to-end booking/payment flow with real pricing rules.",
      problem:
        "I needed a concrete reference to show how I handle a flow mixing listing, detail, cart, checkout, access gate, and discount rules.",
      solution: [
        "Next.js App Router architecture with Server Actions and Route Handlers",
        "Pricing engine with promo codes, per-person / minimum-group tiers, VAT, and service fee",
        "Access gate on checkout with clean redirects and order idempotency",
        "Zod validation and tests on pricing/session/orders",
      ],
      stack: ["Next.js", "TypeScript", "Server Actions", "Zod", "Vitest"],
      result: [
        "Full flow navigable locally from browse to checkout",
        "Code tested on critical points (pricing, idempotency, redirect)",
        "Reusable base for real booking projects",
      ],
      proves:
        "I can handle complex technical flows (payments, pricing rules, sessions) with clean and tested code — not just brochure sites.",
    },
  ],
};

const fr: CaseStudiesContent = {
  sectionLabel: "Projets & case studies",
  title: "Des choses que j'ai vraiment construites, racontées de bout en bout.",
  subtitle:
    "Certains projets sont sous NDA : je vous explique problème, solution et résultat sans sortir de captures confidentielles.",
  labels: {
    problem: "Problème",
    solution: "Ce que j'ai fait",
    result: "Résultat",
    stack: "Stack",
    proves: "Ce que ça prouve",
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
        "UI plus cohérente entre modules",
        "Moins de régressions en release",
        "Moins de temps perdu à débattre des conventions en PR",
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
        "Layouts cohérents entre pages similaires",
        "Itération UI plus rapide pour l'équipe",
        "Dépendances vendor réduites et plus de contrôle sur le design system",
      ],
      proves:
        "Je peux moderniser un site existant sans jeter le travail déjà fait.",
    },
    {
      id: "booking-checkout",
      title: "Booking + checkout MVP (Next.js)",
      context:
        "Projet labo interne pour valider un flux réservation/paiement end-to-end avec de vraies règles de prix.",
      problem:
        "Il me fallait une référence concrète pour montrer comment je gère un flux mêlant listing, détail, panier, checkout, gate d'accès et règles de remise.",
      solution: [
        "Architecture Next.js App Router avec Server Actions et Route Handlers",
        "Moteur de prix avec promo codes, tarifs par personne / minimum groupe, TVA et frais de service",
        "Gate d'accès au checkout avec redirects propres et idempotence des commandes",
        "Validation Zod et tests sur pricing/session/orders",
      ],
      stack: ["Next.js", "TypeScript", "Server Actions", "Zod", "Vitest"],
      result: [
        "Flux complet navigable en local du browse au checkout",
        "Code testé sur les points critiques (pricing, idempotence, redirect)",
        "Base réutilisable pour de vrais projets de réservation",
      ],
      proves:
        "Je gère des flux techniques complexes (paiements, règles de prix, sessions) avec du code propre et testé — pas juste des sites vitrine.",
    },
  ],
};

export const caseStudiesContent: Record<Locale, CaseStudiesContent> = {
  it,
  en,
  fr,
};

export function getCaseStudiesContent(locale: Locale) {
  return caseStudiesContent[locale];
}
