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
});

export type PortfolioContent = z.infer<typeof portfolioContentSchema>;
export type PortfolioProject = PortfolioContent["projects"][number];
export type RoadmapProject = PortfolioContent["roadmap"][number];
export type ProfileContact = PortfolioContent["contact"];

export const githubProfileSchema = z.object({
  public_repos: z.number().int().nonnegative(),
  followers: z.number().int().nonnegative(),
  following: z.number().int().nonnegative(),
  html_url: z.string().url(),
  updated_at: z.string().datetime(),
});

export type GithubProfile = z.infer<typeof githubProfileSchema>;

export const fallbackPortfolioContent: PortfolioContent = {
  profile: {
    name: "Hassan Akkari",
    role: "Software Developer · Frontend — React 19, TypeScript",
    focus:
      "Greenfield rebuilds, payment state machines, AI-augmented adversarial review.",
    location: "Rome, Italy",
    metric: "3+ years in production · React 19 rebuild + Nexi payment integration",
    about: [
      "Software Developer (Frontend specialist) with 3+ years of production experience. Currently leading the React 19 / TypeScript rebuild of a hospitality e-commerce platform at Sibylla, after prior external development missed requirements.",
      "I shipped an end-to-end Nexi payment integration — S2S callback, idempotent state machine (pending → nexi_paid → sibylla_confirmed | failed), MediatR fire-and-forget handler, and a PowerShell replay tool for callback-race debugging.",
      "I designed forms with react-hook-form + Zod that normalise legacy backend payloads at the boundary; JWT auth with refresh tokens and XSRF protection; autonomous task ownership through Azure DevOps with UI from Figma.",
      "I built an AI-augmented engineering workflow on Claude Code — 5 read-only subagents (adversarial review, SOLID audit, TS↔C# contract-drift, payment-flow forensic tracing), a 3-tier CLAUDE.md knowledge base, and 4 SRP slash commands; surfaced 3 latent payment-flow bugs on first run.",
      "I share approach and impact openly; specific internal details stay out.",
    ],
    now: "On Sibylla Network leading the React 19 / TypeScript rebuild of a hospitality e-commerce platform; recently shipped the end-to-end Nexi payment integration with idempotent state machine, and built an AI-augmented adversarial review workflow on Claude Code that surfaced 3 latent payment-flow bugs on first run.",
    philosophy:
      "Solve the problem, then make it hard to repeat — with standards, typed contracts, and adversarial review.",
    githubUsername: "Dark-lIl-Demon",
  },
  contact: {
    email: "hassan.akkari01@gmail.com",
    resumePath: "pdf/CV-ENG-05-2026.pdf",
    github: "https://github.com/Dark-lIl-Demon",
    linkedin: "https://www.linkedin.com/in/hassan-akkari",
    instagram: "https://instagram.com/its.hassan.main?igshid=OGQ5ZDc2ODk2ZA==",
    facebook: "https://www.facebook.com/hassan.akkari.714",
  },
  highlights: [
    "Nexi payment integration (end-to-end)\nBefore: payment flow had recurring callback races and no replayable state.\nAfter: S2S callback handler with idempotent state machine (pending → nexi_paid → sibylla_confirmed | failed), MediatR fire-and-forget handler, and a PowerShell replay tool for debugging.\nResult: deterministic recovery from callback races; recurring race-condition bugs eliminated.",
    "React 19 + TypeScript rebuild from scratch\nBefore: external development missed requirements on the hospitality platform.\nAfter: ~20 API modules, ~60 query/mutation endpoints, ~35 routes, ~12 feature areas (booking, checkout, payments, wallet, account) built in-house with Redux Toolkit + RTK Query.\nResult: full ownership of frontend architecture and direction, working alongside one backend developer.",
    "AI-augmented adversarial review (Claude Code subagents)\nBefore: code review depended on team availability and missed cross-stack drift.\nAfter: 5 read-only Claude Code subagents — adversarial review, SOLID audit, TS↔C# contract-drift, payment-flow forensic tracing — on the ASP.NET Core 10 / React 19 codebase.\nResult: surfaced 3 latent payment-flow bugs on first run; repeatable AI-assisted review under a minimal-permission sandbox.",
    "Tiered project knowledge base (CLAUDE.md × 3)\nBefore: domain rules, payment state machine, and gotchas lived only in heads.\nAfter: 3-tier CLAUDE.md (root + frontend + backend) codifying domain glossary, payment state machine, and non-obvious gotchas; 4 SRP slash commands (/challenge, /audit-solid, /check-drift, /trace-payment).\nResult: adversarial review brought inline with the PR workflow; repeatable on any new feature.",
    "Form architecture + JWT auth (react-hook-form + Zod)\nBefore: inconsistent legacy backend payloads broke client-side validation.\nAfter: typed forms normalising payloads at the boundary with Zod; JWT auth with refresh tokens and XSRF protection.\nResult: predictable validation across booking, checkout, payments, wallet flows.",
    "UI standards on legacy stack (ASP.NET MVC / Razor / jQuery)\nBefore: every new page reinvented classes, styles, and utility files.\nAfter: shared CSS class system and JS utility files that became the team reference for new pages.\nResult: reduced duplication and visual inconsistency across modules; still in use after the React migration.",
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
      "Razor / MVC (legacy)",
      "Vitest",
      "Playwright (e2e + a11y)",
      "Storybook",
      "MSW",
      "Sass",
      "Framer Motion",
      "Azure DevOps",
      "CI/CD (YAML)",
      "Figma",
      "Jira",
    ],
    exploring: [
      "Claude Code custom subagents",
      "Agentic adversarial review",
      "Angular",
      "GraphQL",
    ],
  },
  experience: [
    {
      company: "Sibylla S.r.l. — Sibylla Network",
      location: "Rome, Italy",
      role: "Frontend Developer — React 19 · TypeScript · ASP.NET Core 10",
      start: "Mar 2025",
      end: "Present",
      bullets: [
        "Took ownership of frontend on a greenfield hospitality / e-commerce platform, rebuilding it in-house after prior external development missed requirements; working alongside one backend developer.",
        "Built React + TypeScript app from scratch with Redux Toolkit + RTK Query: ~20 API modules, ~60 query/mutation endpoints, ~35 routes, ~12 feature areas across booking, checkout, payments, wallet, account.",
        "Shipped end-to-end Nexi payment integration: S2S callback, idempotent state machine (pending → nexi_paid → sibylla_confirmed | failed), MediatR fire-and-forget handler, and a PowerShell replay tool for callback-race debugging.",
        "Built AI-augmented engineering workflow on Claude Code: 5 read-only subagents (adversarial review, SOLID audit, TS↔C# contract-drift, payment-flow tracing) + 3-tier CLAUDE.md knowledge base + 4 SRP slash commands; surfaced 3 latent payment-flow bugs on first run.",
        "Form architecture with react-hook-form + Zod; JWT auth with refresh tokens and XSRF protection; Vitest (unit) + Playwright (e2e + a11y); managed CI/CD pipeline (YAML) updates and resolved pipeline-blocking issues.",
      ],
    },
    {
      company: "Sibylla S.r.l. — Sibylla Platform",
      location: "Rome, Italy",
      role: "Frontend Developer — ASP.NET MVC · Razor · jQuery",
      start: "Sep 2023",
      end: "Mar 2025",
      bullets: [
        "UI on ASP.NET MVC with Razor and JavaScript/jQuery; built a reusable CSS class system and shared JS utility files that became the team reference for new pages, reducing duplication and visual inconsistency across modules.",
        "Refactor: removed unused HTML/CSS/JS, standardised naming conventions; Jira + FileZilla for tracking and deployment.",
      ],
    },
    {
      company: "BetterTogether S.r.l.",
      location: "Rome, Italy",
      role: "Frontend Developer Intern",
      start: "Oct 2022",
      end: "May 2023",
      bullets: [
        "Built front-end for automated invoicing (B2C / B2B2C) with HTML, CSS, JS and C# / ASP.NET MVC.",
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
      focus: "Italian 5-year technical secondary in IT; programming foundations, databases, networking.",
    },
  ],
  general: [
    {
      title: "Languages",
      items: ["English (C1 / fluent)", "Italian (native)", "Arabic (conversational)"],
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
      items: ["Vitest", "Playwright (e2e + a11y)", "Storybook", "MSW", "Azure DevOps", "CI/CD (YAML)", "Figma", "Jira"],
    },
  ],
  projects: [
    {
      id: "sibylla-network-ui-system",
      title: "Sibylla Network - My Frontend Journey",
      summary:
        "I started on Platform building solid foundations and reusable standards. On Network I brought a more structural approach with React and Redux Toolkit, with focus on UI consistency and predictable delivery.",
      image: "image/enterprise-nda-placeholder.svg",
      stack: ["React", "TypeScript", "Redux Toolkit", "REST APIs", "Tailwind CSS"],
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
      stack: ["Tailwind CSS", "Component refactor", "UI standards", "Frontend architecture"],
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
          href: "https://github.com/Dark-lIl-Demon",
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
};
