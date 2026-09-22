/** Shared constants for the browser checks. Keep in sync with apps/docs/src/data/site.ts. */
export const LOCALES = ["en", "it", "fr", "de"] as const;
export type Locale = (typeof LOCALES)[number];

export const PROFILE = {
  github: "https://github.com/hassan-akkari",
  linkedin: "https://www.linkedin.com/in/hassan-akkari",
  email: "hassan.akkari01@gmail.com",
} as const;

export const BOOKABLE = {
  live: "https://bookable.itshassan.it",
  repo: "https://github.com/hassan-akkari/laboratoire/tree/main/apps/booking-service",
} as const;
