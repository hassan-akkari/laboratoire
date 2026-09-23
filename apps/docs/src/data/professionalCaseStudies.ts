import type { Locale } from "../i18n/locale";
import { httpClientConcurrency } from "./professionalCaseStudies/httpClientConcurrency";
import { incrementalReactMigration } from "./professionalCaseStudies/incrementalReactMigration";
import { bffModularization } from "./professionalCaseStudies/bffModularization";

/**
 * Professional case studies: work done on an employer's live product, told
 * anonymously (no company, product, colleague or internal identifiers) and
 * with every number next to its limit. They are the "professional
 * experience" half of the home #case-studies section; Bookable and the other
 * personal projects stay in `caseStudies.ts`.
 *
 * Content is authored once per locale per study in ./professionalCaseStudies/
 * and read on the server; pages receive only their locale's payload.
 */

export type CaseStudyMetric = {
  label: string;
  /** Before/after pair (both set) ... */
  before?: string;
  after?: string;
  /** ... or a single value when there is nothing to compare against. */
  value?: string;
  /** Scope or caveat printed right next to the figure. */
  note?: string;
};

export type CaseStudyDecision = {
  title: string;
  body: string;
};

export type ProfessionalCaseStudy = {
  /** URL segment under /{locale}/case-studies/ — identical in every locale. */
  slug: ProfessionalCaseStudySlug;
  title: string;
  /** Kind of work, shown above the title ("Production incident · ASP.NET Core"). */
  eyebrow: string;
  /** When it happened / was measured. */
  period: string;
  /** One or two sentences for the home card. */
  teaser: string;
  /** Lead paragraph of the detail page. */
  summary: string;
  /** Two or three short facts for the card and the "at a glance" block. */
  highlights: string[];
  role: string;
  stack: string[];
  context: string[];
  contribution: string[];
  decisions: CaseStudyDecision[];
  difficulty: string[];
  results: string[];
  metrics: CaseStudyMetric[];
  limits: string[];
  proves: string;
  /** Who did what: my part vs the team's, in one or two sentences. */
  team: string;
  seoDescription: string;
};

/** The slim projection the home section needs for its cards. */
export type ProfessionalCaseStudyCard = Pick<
  ProfessionalCaseStudy,
  "slug" | "title" | "eyebrow" | "teaser" | "highlights" | "stack"
>;

export type ProfessionalCaseStudyLabels = {
  /** Home section: group headings + intro of the professional group. */
  groupPersonal: string;
  groupProfessional: string;
  groupProfessionalIntro: string;
  groupOther: string;
  readMore: string;
  /** Detail page. */
  backToProjects: string;
  atAGlance: string;
  role: string;
  stack: string;
  context: string;
  contribution: string;
  decisions: string;
  difficulty: string;
  results: string;
  metrics: string;
  metricBefore: string;
  metricAfter: string;
  limits: string;
  proves: string;
  team: string;
  cvTitle: string;
  cvBody: string;
  cvLink: string;
  otherStudies: string;
  previous: string;
  next: string;
};

export const PROFESSIONAL_CASE_STUDY_SLUGS = [
  "http-client-concurrency",
  "incremental-react-migration",
  "bff-modularization",
] as const;

export type ProfessionalCaseStudySlug =
  (typeof PROFESSIONAL_CASE_STUDY_SLUGS)[number];

export function isProfessionalCaseStudySlug(
  value: string,
): value is ProfessionalCaseStudySlug {
  return (PROFESSIONAL_CASE_STUDY_SLUGS as readonly string[]).includes(value);
}

export function caseStudyPath(slug: ProfessionalCaseStudySlug): string {
  return `/case-studies/${slug}`;
}

const studiesBySlug: Record<
  ProfessionalCaseStudySlug,
  Record<Locale, ProfessionalCaseStudy>
> = {
  "http-client-concurrency": httpClientConcurrency,
  "incremental-react-migration": incrementalReactMigration,
  "bff-modularization": bffModularization,
};

const labels: Record<Locale, ProfessionalCaseStudyLabels> = {
  en: {
    groupPersonal: "Personal project",
    groupProfessional: "Professional experience",
    groupProfessionalIntro:
      "Three pieces of work on a live multi-tenant product: what I faced, what I decided, what I can show. Company and product are anonymized; every number comes with its limit.",
    groupOther: "Also from professional work",
    readMore: "Read the case study",
    backToProjects: "All projects",
    atAGlance: "At a glance",
    role: "My role",
    stack: "Stack",
    context: "Context",
    contribution: "What I did",
    decisions: "Decisions",
    difficulty: "The hard part",
    results: "Result",
    metrics: "Numbers, with their limits",
    metricBefore: "Before",
    metricAfter: "After",
    limits: "What these numbers do not say",
    proves: "What it proves",
    team: "Attribution",
    cvTitle: "In the CV",
    cvBody:
      "This work belongs to my current role. The full timeline, the stack and the other results are in the CV.",
    cvLink: "Open the CV",
    otherStudies: "Other case studies",
    previous: "Previous",
    next: "Next",
  },
  it: {
    groupPersonal: "Progetto personale",
    groupProfessional: "Esperienza professionale",
    groupProfessionalIntro:
      "Tre lavori su un prodotto multi-tenant in produzione: cosa ho affrontato, cosa ho deciso, cosa posso dimostrare. Azienda e prodotto sono anonimizzati; ogni numero arriva con il suo limite.",
    groupOther: "Altri interventi professionali",
    readMore: "Leggi il case study",
    backToProjects: "Tutti i progetti",
    atAGlance: "In sintesi",
    role: "Il mio ruolo",
    stack: "Stack",
    context: "Contesto",
    contribution: "Cosa ho fatto",
    decisions: "Decisioni",
    difficulty: "La difficoltà concreta",
    results: "Risultato",
    metrics: "Numeri, con i loro limiti",
    metricBefore: "Prima",
    metricAfter: "Dopo",
    limits: "Cosa questi numeri non dicono",
    proves: "Cosa dimostra",
    team: "Attribuzione",
    cvTitle: "Nel CV",
    cvBody:
      "Questo lavoro fa parte del mio ruolo attuale. Timeline completa, stack e altri risultati sono nel CV.",
    cvLink: "Apri il CV",
    otherStudies: "Altri case study",
    previous: "Precedente",
    next: "Successivo",
  },
  fr: {
    groupPersonal: "Projet personnel",
    groupProfessional: "Expérience professionnelle",
    groupProfessionalIntro:
      "Trois travaux sur un produit multi-tenant en production : ce que j'ai affronté, ce que j'ai décidé, ce que je peux démontrer. Entreprise et produit sont anonymisés ; chaque chiffre vient avec sa limite.",
    groupOther: "Autres interventions professionnelles",
    readMore: "Lire le case study",
    backToProjects: "Tous les projets",
    atAGlance: "En bref",
    role: "Mon rôle",
    stack: "Stack",
    context: "Contexte",
    contribution: "Ce que j'ai fait",
    decisions: "Décisions",
    difficulty: "La difficulté concrète",
    results: "Résultat",
    metrics: "Les chiffres, avec leurs limites",
    metricBefore: "Avant",
    metricAfter: "Après",
    limits: "Ce que ces chiffres ne disent pas",
    proves: "Ce que ça prouve",
    team: "Attribution",
    cvTitle: "Dans le CV",
    cvBody:
      "Ce travail fait partie de mon poste actuel. La chronologie complète, la stack et les autres résultats sont dans le CV.",
    cvLink: "Ouvrir le CV",
    otherStudies: "Autres case studies",
    previous: "Précédent",
    next: "Suivant",
  },
  de: {
    groupPersonal: "Persönliches Projekt",
    groupProfessional: "Berufliche Erfahrung",
    groupProfessionalIntro:
      "Drei Arbeiten an einem produktiven mandantenfähigen Produkt: was ich vorgefunden habe, was ich entschieden habe, was ich belegen kann. Unternehmen und Produkt sind anonymisiert; jede Zahl kommt mit ihrer Grenze.",
    groupOther: "Weitere berufliche Arbeiten",
    readMore: "Case Study lesen",
    backToProjects: "Alle Projekte",
    atAGlance: "Auf einen Blick",
    role: "Meine Rolle",
    stack: "Stack",
    context: "Kontext",
    contribution: "Was ich getan habe",
    decisions: "Entscheidungen",
    difficulty: "Die konkrete Schwierigkeit",
    results: "Ergebnis",
    metrics: "Zahlen, mit ihren Grenzen",
    metricBefore: "Vorher",
    metricAfter: "Nachher",
    limits: "Was diese Zahlen nicht sagen",
    proves: "Was es zeigt",
    team: "Zuordnung",
    cvTitle: "Im CV",
    cvBody:
      "Diese Arbeit gehört zu meiner aktuellen Rolle. Vollständiger Zeitverlauf, Stack und weitere Ergebnisse stehen im CV.",
    cvLink: "CV öffnen",
    otherStudies: "Weitere Case Studies",
    previous: "Zurück",
    next: "Weiter",
  },
};

export function getProfessionalCaseStudyLabels(
  locale: Locale,
): ProfessionalCaseStudyLabels {
  return labels[locale];
}

/** All studies for a locale, in the order they appear on the home page. */
export function getProfessionalCaseStudies(
  locale: Locale,
): ProfessionalCaseStudy[] {
  return PROFESSIONAL_CASE_STUDY_SLUGS.map((slug) => studiesBySlug[slug][locale]);
}

export function getProfessionalCaseStudy(
  locale: Locale,
  slug: string,
): ProfessionalCaseStudy | undefined {
  return isProfessionalCaseStudySlug(slug) ? studiesBySlug[slug][locale] : undefined;
}

/** Card projection for the home section (keeps the full text off the client). */
export function getProfessionalCaseStudyCards(
  locale: Locale,
): ProfessionalCaseStudyCard[] {
  return getProfessionalCaseStudies(locale).map(
    ({ slug, title, eyebrow, teaser, highlights, stack }) => ({
      slug,
      title,
      eyebrow,
      teaser,
      highlights,
      stack,
    }),
  );
}

/** Title lookup by slug, for the CV's "case studies" links under an experience entry. */
export function getProfessionalCaseStudyTitles(
  locale: Locale,
): Record<ProfessionalCaseStudySlug, string> {
  return Object.fromEntries(
    PROFESSIONAL_CASE_STUDY_SLUGS.map((slug) => [slug, studiesBySlug[slug][locale].title]),
  ) as Record<ProfessionalCaseStudySlug, string>;
}
