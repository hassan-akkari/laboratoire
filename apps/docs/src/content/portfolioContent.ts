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
      "Frontend-focused software developer improving products by modernizing UI architecture, standardizing components, and removing delivery friction.",
    location: "Rome, Italy",
    metric: "Lead frontend on Sibylla Network and TTC modules",
    about: [
      "I am a frontend-focused software developer who improves products by modernizing UI architecture, standardizing components, and reducing team friction.",
      "On Sibylla Network and TTC workflows, I lead frontend delivery across stays, experiences, products, services, and payments.",
      "I recently helped drive the shift from Bootstrap and vendor packages to a Tailwind-based approach, improving UI consistency and component reuse.",
    ],
    now: "Driving Sibylla Network and TTC improvements with reusable React and Redux Toolkit patterns and faster delivery cycles.",
    philosophy: "I push practical change: standardize first, then speed up delivery.",
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
    "Lead frontend on Sibylla Network, owning architecture, standards, and delivery across stays, experiences, products, services, and payments.",
    "Designed and implemented React plus Redux Toolkit structure to keep state management scalable and consistent.",
    "Established UI and UX standards with reusable components, layouts, and logic to reduce inconsistency.",
    "Pushed a transition from Bootstrap and vendor UI packages to a Tailwind-driven workflow.",
    "Unblock teammates quickly by fixing edge cases and simplifying messy UI code without slowing delivery.",
    "Bridge frontend and backend when needed, including REST integration and .NET MVC with SQL support tasks.",
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
      company: "Sibylla Network / TTC",
      location: "Italy",
      role: "Frontend Developer (Architecture and Delivery)",
      start: "Current",
      end: "Present",
      bullets: [
        "Lead frontend implementation across stays, experiences, products, services, and payments modules.",
        "Built scalable React plus Redux Toolkit patterns for predictable state and faster delivery.",
        "Drove migration from Bootstrap and vendor packages to Tailwind to reduce UI fragmentation.",
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
      title: "Sibylla Network - Frontend Architecture and UI System",
      summary:
        "Frontend ownership for a multi-domain ecosystem, with scalable React and RTK patterns plus reusable UI standards.",
      image: "image/WorkBetterTgter.png",
      stack: ["React", "TypeScript", "Redux Toolkit", "REST APIs", "Tailwind CSS"],
      impact: [
        "Led frontend architecture and delivery across key business areas.",
        "Standardized components and layout rules to improve UI consistency.",
        "Enabled faster onboarding and smoother feature delivery through reusable patterns.",
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
    {
      id: "bootstrap-tailwind-modernization",
      title: "Bootstrap to Tailwind Modernization",
      summary:
        "Migration from Bootstrap and vendor UI packages to a Tailwind workflow focused on consistency, speed, and maintainability.",
      image: "image/LaBrochure.png",
      stack: ["Tailwind CSS", "Component refactor", "UI standards", "Frontend architecture"],
      impact: [
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
        "Shows SSR and caching awareness with listing and detail pages.",
        "Demonstrates auth and protected checkout routes with redirect handling.",
        "Includes pricing rules engine and promo logic with unit test coverage.",
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
        "Proves enterprise app architecture with clear feature boundaries.",
        "Highlights form-heavy workflows and robust validation strategy.",
        "Demonstrates role-based access and review-to-publish lifecycle.",
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
