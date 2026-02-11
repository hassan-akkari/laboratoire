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
  bullets: z.array(z.string().min(1)).min(1).max(3),
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
    role: "Frontend-focused Software Developer",
    focus:
      "UI standards, reusable components, core flows (React/TS/RTK).",
    location: "Rome, Italy",
    metric: "Frontend engineer - UI architecture & delivery",
    about: [
      "I have worked on Sibylla in a fast-moving environment: if you do not create order, the project creates friction. I started on Platform building solid foundations (jQuery/HTML/CSS) and reusable UI standards; today on Network I work more structurally with React + Redux Toolkit on core flows.",
      "I solve the problem, then make it hard to repeat: standards, reuse, structure.",
      "I reduce team friction: clear conventions and reusable components.",
      "When needed, I connect FE/BE: APIs, MVC, queries, and debugging.",
      "I am happy to share approach and impact; some internal details stay out.",
    ],
    now: "Currently on Sibylla Network: improving delivery with reusable patterns and cleaner architecture. I cannot show internals, but I can clearly explain what I built and why it helped.",
    philosophy:
      "Standardize first, then accelerate. Clean code helps the whole team ship faster.",
    githubUsername: "Dark-lIl-Demon",
  },
  contact: {
    email: "hassan.akkari01@gmail.com",
    resumePath: "pdf/CV-ENG-102025.pdf",
    github: "https://github.com/Dark-lIl-Demon",
    linkedin: "https://www.linkedin.com/in/hassan-akkari",
    instagram: "https://instagram.com/its.hassan.main?igshid=OGQ5ZDc2ODk2ZA==",
    facebook: "https://www.facebook.com/hassan.akkari.714",
  },
  highlights: [
    "UI standards (classes/styles)\nBefore: conventions were scattered and duplicated across modules.\nAfter: shared standards reused over time by the team.\nResult: fewer regressions and faster maintenance.",
    "Network reusable patterns (React + Redux Toolkit)\nBefore: logic was distributed and hard to scale.\nAfter: patterns and flows became more predictable.\nResult: more stable delivery on core flows.",
    "UI consistency (Bootstrap -> Tailwind where applicable)\nBefore: inconsistent layouts and similar-but-different components.\nAfter: more consistent standards and composition.\nResult: faster iterations on core flows.",
    "Debugging edge cases and complex bugs\nBefore: long blockers and fragmented diagnosis.\nAfter: quick isolation, targeted fixes, prevention where possible.\nResult: team unblocked without slowing release.",
  ],
  stack: {
    daily: [
      "React (TSX)",
      "Redux Toolkit",
      "TypeScript",
      "JavaScript",
      "jQuery",
      "HTML5/CSS3",
      "Tailwind CSS",
    ],
    comfortable: [
      "ASP.NET MVC",
      "C#",
      "SQL Server",
      "REST APIs",
      "UI standardization",
      "Cross-domain feature delivery",
    ],
    exploring: [
      "Angular",
      "GraphQL",
      "Design tokens and component governance",
    ],
  },
  experience: [
    {
      company: "Sibylla (Platform and Network)",
      location: "Italy",
      role: "Frontend Developer (Platform Foundations and Network Delivery)",
      start: "Current",
      end: "Present",
      bullets: [
        "Started on Sibylla Platform, strengthening frontend fundamentals with jQuery, HTML, and CSS.",
        "Introduced reusable class and style standards that became shared conventions and are still used.",
        "Now on Sibylla Network, lead implementation across booking, catalog, and checkout with scalable React and Redux Toolkit patterns.",
      ],
    },
    {
      company: "BetterTogether",
      location: "Rome, Italy",
      role: "Junior Developer Intern",
      start: "Oct 2022",
      end: "Jun 2023",
      bullets: [
        "Built and maintained internal web features with focus on forms and data validation.",
        "Integrated front-end workflows with .NET services and SQL Server data.",
        "Contributed bug fixes and refactors on critical business flows before release.",
      ],
    },
  ],
  education: [
    {
      school: "Uxbridge College",
      location: "London, UK",
      qualification: "Diploma in Computer Science",
      start: "Sep 2019",
      end: "Jun 2021",
      focus: "Software foundations, data concepts, and web development basics.",
    },
  ],
  general: [
    {
      title: "Languages",
      items: ["Italian", "English", "Arabic (Darija)"],
    },
    {
      title: "Collaboration",
      items: ["Code reviews", "Team handoff", "Agile iteration"],
    },
    {
      title: "Tooling",
      items: ["GitHub", "CI basics", "Figma handoff"],
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
