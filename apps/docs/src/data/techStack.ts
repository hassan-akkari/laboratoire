import type { Locale } from "../i18n/locale";

export type TechCategory = {
  id: string;
  title: string;
  description: string;
  items: string[];
};

export type TechStackContent = {
  sectionLabel: string;
  title: string;
  note: string;
  categories: TechCategory[];
};

const it: TechStackContent = {
  sectionLabel: "Tecnologie",
  title:
    "Stack moderno, scelto in base al progetto. Non al gusto del momento.",
  note: "Lo stack lo scelgo io in base al progetto: per una landing 'semplice' non ti faccio pagare una web app full-stack, e per una web app non ti propongo WordPress.",
  categories: [
    {
      id: "frontend",
      title: "Frontend moderno",
      description:
        "Quello che vede il cliente: veloce, responsive, facile da modificare in futuro.",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Vite",
        "Framer Motion",
      ],
    },
    {
      id: "backend",
      title: "Backend e integrazioni",
      description:
        "Quello che fa funzionare le cose: API, form, autenticazione, gestione dati.",
      items: [
        "Node.js",
        "REST APIs",
        "ASP.NET / C#",
        "SQL Server",
        "Server Actions",
        "Zod",
      ],
    },
    {
      id: "quality",
      title: "Qualità e delivery",
      description:
        "Quello che fa la differenza: codice testato, performance reali, manutenzione semplice.",
      items: [
        "Vitest / Playwright",
        "ESLint / strict TypeScript",
        "Component-first architecture",
        "Mobile-first / accessibilità base",
        "CI lint+typecheck+test",
        "Vercel / OVH deploy",
      ],
    },
  ],
};

const en: TechStackContent = {
  sectionLabel: "Tech stack",
  title:
    "A modern stack, chosen for your project. Not for the latest hype.",
  note: "I pick the stack based on your project: for a 'simple' landing I won't bill you a full-stack web app, and for a web app I won't pitch you WordPress.",
  categories: [
    {
      id: "frontend",
      title: "Modern frontend",
      description:
        "What the client sees: fast, responsive, easy to update later.",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Vite",
        "Framer Motion",
      ],
    },
    {
      id: "backend",
      title: "Backend & integrations",
      description:
        "What makes things actually work: APIs, forms, auth, data handling.",
      items: [
        "Node.js",
        "REST APIs",
        "ASP.NET / C#",
        "SQL Server",
        "Server Actions",
        "Zod",
      ],
    },
    {
      id: "quality",
      title: "Quality & delivery",
      description:
        "What makes the difference: tested code, real performance, easy maintenance.",
      items: [
        "Vitest / Playwright",
        "ESLint / strict TypeScript",
        "Component-first architecture",
        "Mobile-first / basic accessibility",
        "CI lint+typecheck+test",
        "Vercel / OVH deploy",
      ],
    },
  ],
};

const fr: TechStackContent = {
  sectionLabel: "Technologies",
  title:
    "Stack moderne, choisi pour votre projet. Pas pour la mode du moment.",
  note: "Je choisis le stack selon le projet : pour une landing 'simple' je ne vous facture pas une web app full-stack, et pour une web app je ne vous propose pas WordPress.",
  categories: [
    {
      id: "frontend",
      title: "Frontend moderne",
      description:
        "Ce que voit le client : rapide, responsive, facile à modifier plus tard.",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Vite",
        "Framer Motion",
      ],
    },
    {
      id: "backend",
      title: "Backend et intégrations",
      description:
        "Ce qui fait fonctionner les choses : API, formulaires, authentification, gestion des données.",
      items: [
        "Node.js",
        "REST APIs",
        "ASP.NET / C#",
        "SQL Server",
        "Server Actions",
        "Zod",
      ],
    },
    {
      id: "quality",
      title: "Qualité et delivery",
      description:
        "Ce qui fait la différence : code testé, vraies performances, maintenance simple.",
      items: [
        "Vitest / Playwright",
        "ESLint / strict TypeScript",
        "Architecture component-first",
        "Mobile-first / accessibilité de base",
        "CI lint+typecheck+test",
        "Vercel / OVH deploy",
      ],
    },
  ],
};

const de: TechStackContent = {
  sectionLabel: "Technologien",
  title: "Ein moderner Stack, gewählt für Ihr Projekt. Nicht für den Hype des Monats.",
  note: "Den Stack wähle ich passend zum Projekt: Für eine «einfache» Landing Page verrechne ich Ihnen keine Full-Stack-Web-App — und für eine Web-App schlage ich Ihnen kein WordPress vor.",
  categories: [
    {
      id: "frontend",
      title: "Modernes Frontend",
      description:
        "Was der Kunde sieht: schnell, responsiv, später einfach anzupassen.",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Vite",
        "Framer Motion",
      ],
    },
    {
      id: "backend",
      title: "Backend & Integrationen",
      description:
        "Was die Dinge zum Laufen bringt: APIs, Formulare, Authentifizierung, Datenverwaltung.",
      items: [
        "Node.js",
        "REST APIs",
        "ASP.NET / C#",
        "SQL Server",
        "Server Actions",
        "Zod",
      ],
    },
    {
      id: "quality",
      title: "Qualität & Delivery",
      description:
        "Was den Unterschied macht: getesteter Code, echte Performance, einfache Wartung.",
      items: [
        "Vitest / Playwright",
        "ESLint / strict TypeScript",
        "Component-first-Architektur",
        "Mobile-first / Basis-Barrierefreiheit",
        "CI lint+typecheck+test",
        "Vercel / OVH Deploy",
      ],
    },
  ],
};

export const techStackContent: Record<Locale, TechStackContent> = {
  it,
  en,
  fr,
  de,
};

export function getTechStackContent(locale: Locale) {
  return techStackContent[locale];
}
