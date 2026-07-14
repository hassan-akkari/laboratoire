import { z } from "zod";

const projectLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  kind: z.enum(["live", "github", "caseStudy"]).optional(),
});

const projectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  image: z.string().min(1),
  stack: z.array(z.string().min(1)).min(1),
  impact: z.array(z.string().min(1)).min(1),
  links: z.array(projectLinkSchema).max(3),
});

const cvProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  stack: z.array(z.string().min(1)).min(1),
  liveUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
});

const roadmapProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  status: z.string().min(1),
  targetApp: z.string().min(1),
  stack: z.array(z.string().min(1)).min(2),
  recruiterSignals: z.array(z.string().min(1)).min(2).max(4),
  mvpScope: z.array(z.string().min(1)).min(3).max(6),
});

const experienceSchema = z.object({
  company: z.string().min(1),
  location: z.string().min(1),
  role: z.string().min(1),
  start: z.string().min(1),
  end: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1).max(5),
});

const educationSchema = z.object({
  school: z.string().min(1),
  location: z.string().min(1),
  qualification: z.string().min(1),
  start: z.string().min(1),
  end: z.string().min(1),
  focus: z.string().min(1).optional(),
});

const generalInfoSchema = z.object({
  title: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

const stackSchema = z.object({
  daily: z.array(z.string().min(1)).min(1),
  comfortable: z.array(z.string().min(1)).min(1),
  exploring: z.array(z.string().min(1)).min(1),
});

const profileSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  focus: z.string().min(1),
  location: z.string().min(1),
  metric: z.string().min(1),
  about: z.array(z.string().min(1)).min(2),
  now: z.string().min(1),
  philosophy: z.string().min(1),
  githubUsername: z.string().min(1),
});

const contactSchema = z.object({
  email: z.string().email(),
  resumePath: z.string().min(1),
  github: z.string().url(),
  linkedin: z.string().url(),
  instagram: z.string().url().optional(),
  facebook: z.string().url().optional(),
  bookCall: z.string().url().optional(),
});

export const portfolioContentSchema = z.object({
  profile: profileSchema,
  contact: contactSchema,
  highlights: z.array(z.string().min(1)).min(4).max(6),
  stack: stackSchema,
  experience: z.array(experienceSchema).min(1),
  education: z.array(educationSchema).min(1),
  general: z.array(generalInfoSchema).min(1),
  projects: z.array(projectSchema).min(2).max(4),
  roadmap: z.array(roadmapProjectSchema).min(2).max(3),
  // Lightweight project list rendered on the /cv page (separate from the
  // heavier `projects` array used by the dormant PortfolioSection). Optional
  // so older cached payloads without it still validate.
  cvProjects: z.array(cvProjectSchema).max(4).optional(),
});

export type PortfolioContent = z.infer<typeof portfolioContentSchema>;
export type PortfolioProject = PortfolioContent["projects"][number];
export type CvProject = NonNullable<PortfolioContent["cvProjects"]>[number];
export type RoadmapProject = PortfolioContent["roadmap"][number];
export type ProfileContact = PortfolioContent["contact"];

export const fallbackPortfolioContent: PortfolioContent = {
  profile: {
    name: "Hassan Akkari",
    role: "Software Engineer · Full-Stack, Frontend-led",
    focus:
      "Greenfield rebuilds, exactly-once payment flows, AI-augmented engineering.",
    location: "Rome, Italy",
    metric:
      "~2.5 years in production · React 19 migration + exactly-once Nexi payment flow",
    about: [
      "Full-stack software engineer, strongest on the frontend, with ~2.5 years shipping production systems for a hospitality software company. I lead the page-by-page migration of a multi-tenant management SaaS from legacy Razor / jQuery to React 19, and own an e-commerce platform's payment, kiosk and marketplace surfaces end-to-end — including an exactly-once Nexi payment flow over a non-idempotent downstream.",
      "I architected the React 19 frontend as three independent SPAs (marketplace, kiosk, quote landing) on Redux Toolkit + RTK Query: a single-flight 401-refresh auth layer, a ports-and-adapters payment architecture (Nexi / wallet / discount behind one provider interface), and react-hook-form + Zod over inconsistent legacy payloads. I also led a security and tenancy audit that surfaced cross-tenant access (IDOR) and an issued-but-never-validated CSRF token.",
      "I built the team's AI-augmented engineering workflow on Claude Code — per-layer instruction files, narrow tool-scoped specialist subagents, an orchestration skill that injects the right invariants, and a plan-first process where a human approves before anything mutates; the review subagents surfaced three latent payment-flow bugs before release.",
      "I share approach and impact openly; specific internal details stay out.",
    ],
    now: "At Sibylla I lead the page-by-page React 19 migration of a multi-tenant hospitality SaaS (Portal) and own the e-commerce platform's payment, kiosk and marketplace surfaces (Network) — including an exactly-once Nexi flow over a non-idempotent downstream — while running the team's AI-augmented engineering workflow on Claude Code.",
    philosophy:
      "Solve the problem, then make it hard to repeat — with standards, typed contracts, and adversarial review.",
    githubUsername: "hassan-akkari",
  },
  contact: {
    email: "hassan.akkari01@gmail.com",
    resumePath: "pdf/CV-ENG-06-2026.pdf",
    github: "https://github.com/hassan-akkari",
    linkedin: "https://www.linkedin.com/in/hassan-akkari",
    instagram: "https://instagram.com/its.hassan.main?igshid=OGQ5ZDc2ODk2ZA==",
    facebook: "https://www.facebook.com/hassan.akkari.714",
  },
  highlights: [
    'Exactly-once Nexi payment flow\nBefore: a non-idempotent downstream booking system risked double bookings and lost confirmations on retransmitted gateway callbacks.\nAfter: a local payment-lock keyed by a unique transaction code and a MediatR state machine (pending → nexi_paid → confirmed | failed) that no-ops on replays, plus a guard against silent "HTTP 200 but failed" responses.\nResult: no payment confirmed without a real booking; double bookings and lost confirmations eliminated.',
    "React 19 frontend as three independent SPAs\nBefore: the rebuilt e-commerce platform needed marketplace, kiosk and quote-landing surfaces owned end-to-end.\nAfter: three SPAs on Redux Toolkit + RTK Query with a single-flight 401-refresh auth layer, a ports-and-adapters payment architecture (Nexi / wallet / discount behind one interface), and react-hook-form + Zod over legacy payloads.\nResult: principal contributor and top author by commit volume; booking, cart, checkout, wallet and account from zero to production.",
    "Multi-tenant SaaS migration without a big-bang rewrite\nBefore: a multi-tenant hospitality-management SaaS was locked in legacy ASP.NET MVC / Razor / jQuery.\nAfter: a page-by-page React 19 migration mounted behind a backend-for-frontend, with a route manifest deciding per page whether to SPA-navigate or full-reload.\nResult: pages move incrementally with no big-bang rewrite; deploy pipeline hardened against stale frontend bundles.",
    "Security & tenancy audit (IDOR + CSRF)\nBefore: multi-tenant data isolation and CSRF handling had not been adversarially reviewed.\nAfter: led a security and tenancy audit, filtering the tenant claim on the row (not via a parent join) and reviewing the request path end-to-end.\nResult: surfaced cross-tenant access (IDOR) and an issued-but-never-validated CSRF token, among other findings.",
    "AI-augmented engineering framework (Claude Code)\nBefore: AI-assisted migration was ad-hoc and risked unbounded blast radius.\nAfter: per-layer instruction files, narrow tool-scoped specialist subagents, an orchestration skill that classifies a task and injects the right invariants, and a plan-first process where a human approves before anything mutates.\nResult: a repeatable migration pipeline; read-only review subagents surfaced three latent payment-flow bugs before release.",
  ],
  stack: {
    daily: [
      "React 19",
      "TypeScript",
      "Next.js",
      "Redux Toolkit",
      "RTK Query",
      "react-hook-form",
      "Zod",
      "Tailwind CSS",
      "Vite",
      "Turbo",
      "pnpm",
    ],
    comfortable: [
      "ASP.NET Core 10",
      "C#",
      "MediatR",
      "SQL Server",
      "Dapper",
      "Vitest",
      "Playwright (e2e + a11y)",
      "Storybook",
      "MSW",
      "Azure DevOps",
      "CI/CD (YAML)",
      "Figma",
    ],
    exploring: [
      "Claude Code custom subagents",
      "Agentic adversarial review",
      "Drizzle ORM / Neon Postgres",
      "Angular",
    ],
  },
  experience: [
    {
      company: "Sibylla S.r.l. — Sibylla Network",
      location: "Rome, Italy",
      role: "Software Engineer — Network (hospitality e-commerce) · React 19 · ASP.NET Core 10",
      start: "Mar 2025",
      end: "Present",
      bullets: [
        "Principal contributor and top author by commit volume on the hospitality e-commerce platform, rebuilt in-house after prior external development missed requirements; sole author of the quote-payment flow, founder of the React self-service check-in kiosk, and dominant author of the marketplace SPA — booking, cart, checkout, wallet and account, from zero to production.",
        'Made quote-payment confirmation exactly-once over a non-idempotent downstream: a payment-lock keyed by a unique transaction code and a MediatR state machine (pending → nexi_paid → confirmed | failed) that no-ops on retransmitted gateway callbacks, with a guard against silent "HTTP 200 but failed" responses.',
        "Architected the React 19 frontend as three independent SPAs (marketplace, kiosk, quote landing) on Redux Toolkit + RTK Query: a single-flight 401-refresh auth layer, a ports-and-adapters payment architecture (Nexi / wallet / discount behind one provider interface), and react-hook-form + Zod over inconsistent legacy payloads. Tested with Vitest and Playwright (e2e + a11y) on an Azure DevOps release train.",
        "Designed the team's AI-augmented engineering framework on Claude Code (per-layer instruction files, tool-scoped specialist subagents, a plan-first orchestration skill) and built read-only review subagents over the ASP.NET Core / React codebase — surfacing three latent payment-flow bugs before release.",
      ],
    },
    {
      company: "Sibylla S.r.l. — Portal",
      location: "Rome, Italy",
      role: "Software Engineer — Portal (multi-tenant hospitality SaaS) · React 19 · ASP.NET Core · BFF",
      start: "Sep 2023",
      end: "Present",
      bullets: [
        "Leading the page-by-page migration of a multi-tenant hospitality-management SaaS from legacy ASP.NET MVC / Razor / jQuery to React 19, mounted into the existing app behind a backend-for-frontend; a route manifest decides per page whether to SPA-navigate or full-reload, so pages move incrementally with no big-bang rewrite.",
        "Audited and hardened multi-tenant data isolation (tenant claim filtered on the row, not via a parent join) and led a security and tenancy audit that surfaced cross-tenant access (IDOR) and an issued-but-never-validated CSRF token, among other findings.",
        "Earlier on Portal: built a reusable CSS class system and shared JS utility files that became the team reference for new pages, reducing duplication across modules; hardened the deploy pipeline against stale frontend bundles.",
      ],
    },
    {
      company: "BetterTogether S.r.l.",
      location: "Rome, Italy",
      role: "Frontend Developer · Intern",
      start: "Oct 2022",
      end: "May 2023",
      bullets: [
        "Front end for automated invoicing (B2C / B2B2C) with HTML, CSS, JS and C# / ASP.NET MVC.",
        "Integrated Aruba APIs for electronic invoicing; standardised UI and refactored legacy code before release.",
      ],
    },
  ],
  education: [
    {
      school: "HCUC (Harrow, Richmond, Uxbridge College)",
      location: "London, United Kingdom",
      qualification: "Level 3 Diploma · Computing",
      start: "Sep 2019",
      end: "Jun 2021",
      focus: "Software foundations, data concepts, web development basics.",
    },
    {
      school: "ITIS Leonardo da Vinci",
      location: "Rome, Italy",
      qualification: "Technical Diploma · Information Technology",
      start: "Sep 2009",
      end: "Jun 2014",
      focus:
        "Italian 5-year technical secondary in IT; programming foundations, databases, networking.",
    },
  ],
  general: [
    {
      title: "Languages",
      items: [
        "English (C1 / fluent)",
        "Italian (native)",
        "Arabic (conversational)",
      ],
    },
    {
      title: "AI-augmented dev",
      items: [
        "Claude Code · custom subagents",
        "CLAUDE.md tiered knowledge bases",
        "Agentic adversarial review",
        "SRP-scoped slash commands",
      ],
    },
    {
      title: "Testing & tooling",
      items: [
        "Vitest",
        "Playwright (e2e + a11y)",
        "Storybook",
        "MSW",
        "Azure DevOps",
        "CI/CD (YAML)",
        "Figma",
        "Jira",
      ],
    },
  ],
  projects: [
    {
      id: "sibylla-network-ui-system",
      title: "Sibylla Network - My Frontend Journey",
      summary:
        "I started on Platform building solid foundations and reusable standards. On Network I brought a more structural approach with React and Redux Toolkit, with focus on UI consistency and predictable delivery.",
      image: "image/enterprise-nda-placeholder.svg",
      stack: [
        "React",
        "TypeScript",
        "Redux Toolkit",
        "REST APIs",
        "Tailwind CSS",
      ],
      impact: [
        "Problem: fragmented UI and duplicated rules across modules.",
        "Intervention: standards + reusable patterns on core flows.",
        "Result: stronger UI consistency and fewer release regressions.",
      ],
      links: [
        {
          label: "Live product",
          href: "https://sibyllanetwork.com",
          kind: "live",
        },
        {
          label: "Want to know what I built?",
          href: "#contact",
          kind: "caseStudy",
        },
      ],
    },
    {
      id: "bootstrap-tailwind-modernization",
      title: "Bootstrap to Tailwind Modernization",
      summary:
        "Migration from Bootstrap and vendor UI packages to a Tailwind workflow focused on consistency, speed, and maintainability.",
      image: "image/LaBrochure.png",
      stack: [
        "Tailwind CSS",
        "Component refactor",
        "UI standards",
        "Frontend architecture",
      ],
      impact: [
        "More consistent UI standards across modules and components.",
        "Reduced vendor dependency and fragmented UI behaviour.",
        "Improved layout and component iteration speed for the team.",
        "Created reusable utility patterns that scale better across modules.",
      ],
      links: [
        {
          label: "Case Study",
          href: "#contact",
          kind: "caseStudy",
        },
        {
          label: "GitHub",
          href: "https://github.com/hassan-akkari",
          kind: "github",
        },
      ],
    },
  ],
  roadmap: [
    {
      id: "next-booking-checkout-engine",
      title: "Next.js Booking and Checkout Engine",
      summary:
        "Production-style booking flow: search, detail, cart, checkout, and confirmation with resilient API boundaries.",
      status: "Planned MVP",
      targetApp: "apps/web-next",
      stack: [
        "Next.js App Router",
        "TypeScript",
        "Server Actions and Route Handlers",
        "Zod",
        "Playwright",
      ],
      recruiterSignals: [
        "I use this build to practice SSR and caching between listing and detail pages.",
        "I experiment with a login gate on checkout and clean redirect handling.",
        "I use it to sharpen pricing rules and promo logic with unit tests.",
      ],
      mvpScope: [
        "Build listing to detail to cart to checkout user flow.",
        "Implement price rules engine plus promo code breakdown.",
        "Add login gate for checkout and mock payment confirmation.",
        "Ship deploy-ready preview with CI lint, typecheck, and tests.",
      ],
    },
    {
      id: "angular-experiences-admin-console",
      title: "Angular Experiences Admin Console",
      summary:
        "Enterprise-focused admin panel for creating, reviewing, and publishing experiences with roles and audit visibility.",
      status: "Planned MVP",
      targetApp: "apps/admin-angular",
      stack: [
        "Angular",
        "RxJS",
        "Reactive Forms",
        "Angular Router Guards",
        "Jest or Karma",
      ],
      recruiterSignals: [
        "I use it to practice modular enterprise-style feature boundaries.",
        "I experiment with form-heavy flows and robust validation patterns.",
        "I test role-based access with a draft-to-published workflow.",
      ],
      mvpScope: [
        "Create admin roles: viewer, editor, admin with route guards.",
        "Build experience wizard with conditional fields and validation.",
        "Add review workflow: draft, review, published with audit trail.",
        "Implement filterable table plus CSV export and test coverage.",
      ],
    },
  ],
  cvProjects: [
    {
      name: "Bookable — Multi-Style Booking Platform",
      description:
        "Live full-stack booking platform: one content model rendered in three runtime-switchable design systems, a validated booking-request flow, and a secure admin dashboard.",
      stack: [
        "Next.js 16",
        "React 19",
        "Drizzle ORM",
        "Neon Postgres",
        "iron-session",
        "Zod",
      ],
      liveUrl: "https://bookable.itshassan.it",
    },
    {
      name: "laboratoire — React 19 / TypeScript monorepo",
      description:
        "Solo pnpm + Turbo monorepo. Built the server-side core of a Next.js App Router booking flow — idempotent orders, server-side price re-validation, and a Cal.com webhook with timing-safe HMAC verification — behind iron-session admin auth and a secretless CI gate.",
      stack: [
        "Next.js",
        "TypeScript",
        "Drizzle ORM",
        "Neon Postgres",
        "Vitest",
      ],
      repoUrl: "https://github.com/hassan-akkari",
    },
  ],
};
