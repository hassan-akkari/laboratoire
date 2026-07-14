import type { JobFeedConnector, JobListing } from "./types";

/**
 * Mock Indeed feed — realistic shape, fictional companies. Deliberately
 * includes listings the scoring engine should reject (wrong country, dead
 * stack, agency spam, sub-floor salary) so the shortlist demonstrably
 * filters instead of rubber-stamping. Swap for a live adapter implementing
 * the same JobFeedConnector interface when the real connector lands.
 */

const LISTINGS: JobListing[] = [
  {
    id: "ind-001",
    title: "Senior React Engineer",
    company: "Uetliberg Systems AG",
    location: "Zürich",
    country: "CH",
    remote: "hybrid",
    stack: ["react", "typescript", "next.js", "graphql"],
    salaryMin: 115000,
    salaryMax: 135000,
    currency: "CHF",
    postedAt: "2026-07-13",
    url: "https://indeed.example/ind-001",
    summary:
      "Product team, design system ownership, React 19 migration underway.",
  },
  {
    id: "ind-002",
    title: "AI Product Engineer",
    company: "Limmat Intelligence",
    location: "Zürich",
    country: "CH",
    remote: "hybrid",
    stack: ["typescript", "llm", "react", "python"],
    salaryMin: 120000,
    salaryMax: 145000,
    currency: "CHF",
    postedAt: "2026-07-14",
    url: "https://indeed.example/ind-002",
    summary:
      "Ship LLM-powered features end-to-end: prompt pipelines, evals, product UI.",
  },
  {
    id: "ind-003",
    title: "Full-stack Developer (React + .NET)",
    company: "Zuidas Digital BV",
    location: "Amsterdam",
    country: "NL",
    remote: "remote",
    stack: ["react", ".net", "azure", "postgres"],
    salaryMin: 72000,
    salaryMax: 88000,
    currency: "EUR",
    postedAt: "2026-07-12",
    url: "https://indeed.example/ind-003",
    summary: "Fintech scale-up, C# backend, React front, EU-remote friendly.",
  },
  {
    id: "ind-004",
    title: "Frontend Developer (Vue)",
    company: "Vondel Commerce",
    location: "Amsterdam",
    country: "NL",
    remote: "onsite",
    stack: ["vue", "nuxt", "php"],
    salaryMin: 55000,
    salaryMax: 65000,
    currency: "EUR",
    postedAt: "2026-07-11",
    url: "https://indeed.example/ind-004",
    summary: "E-commerce platform team, Vue 3 + Laravel.",
  },
  {
    id: "ind-005",
    title: "WordPress Developer",
    company: "PixelKraft Agentur",
    location: "Berlin",
    country: "DE",
    remote: "onsite",
    stack: ["wordpress", "php", "jquery"],
    postedAt: "2026-07-10",
    url: "https://indeed.example/ind-005",
    summary: "Agency work across ~20 client sites. Fast-paced environment!!!",
  },
  {
    id: "ind-006",
    title: ".NET Backend Engineer",
    company: "Rhône Capital Tech",
    location: "Geneva",
    country: "CH",
    remote: "onsite",
    stack: [".net", "c#", "azure", "sql-server"],
    salaryMin: 105000,
    salaryMax: 125000,
    currency: "CHF",
    postedAt: "2026-07-13",
    url: "https://indeed.example/ind-006",
    summary: "Trading platform services, strong C# fundamentals expected.",
  },
  {
    id: "ind-007",
    title: "React Developer (junior)",
    company: "Sloterdijk Startup Studio",
    location: "Amsterdam",
    country: "NL",
    remote: "hybrid",
    stack: ["react", "javascript"],
    salaryMin: 38000,
    salaryMax: 45000,
    currency: "EUR",
    postedAt: "2026-07-14",
    url: "https://indeed.example/ind-007",
    summary: "First dev hire alongside the founding engineer.",
  },
  {
    id: "ind-008",
    title: "Senior TypeScript Engineer — Developer Tools",
    company: "Eiger Devtools",
    location: "Basel",
    country: "CH",
    remote: "remote",
    stack: ["typescript", "node", "react", "llm"],
    salaryMin: 110000,
    salaryMax: 140000,
    currency: "CHF",
    postedAt: "2026-07-14",
    url: "https://indeed.example/ind-008",
    summary:
      "Build AI-assisted developer tooling; remote-first within CH/EU timezones.",
  },
];

export const indeedMockConnector: JobFeedConnector = {
  name: "Indeed",
  mode: "mock",
  async fetchListings(): Promise<JobListing[]> {
    return LISTINGS;
  },
};
