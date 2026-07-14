/**
 * The tier list, as data. This is YOUR search profile — edit freely; the
 * scoring engine (score.ts) never hard-codes a preference.
 */

export type ScoutConfig = {
  /** country → tier weight; countries not listed score zero for location. */
  countryTiers: Record<string, number>;
  /** stack keywords → weight; a listing scores the sum of its matches. */
  stackWeights: Record<string, number>;
  /** Yearly salary floor per currency; listings BELOW the floor are demoted. */
  salaryFloor: Record<string, number>;
  /** Any of these in title/stack/summary sinks the listing outright. */
  dealBreakers: string[];
  remoteBonus: Record<"remote" | "hybrid" | "onsite", number>;
  /** score ≥ hot → apply today; score ≥ worthALook → review; else skip. */
  thresholds: { hot: number; worthALook: number };
};

export const defaultScoutConfig: ScoutConfig = {
  countryTiers: { CH: 30, NL: 24 },
  stackWeights: {
    react: 18,
    "next.js": 10,
    typescript: 12,
    ".net": 14,
    "c#": 8,
    llm: 12,
    node: 6,
    postgres: 6,
    azure: 4,
  },
  salaryFloor: { CHF: 95000, EUR: 60000 },
  dealBreakers: ["wordpress", "jquery", "junior"],
  remoteBonus: { remote: 10, hybrid: 6, onsite: 0 },
  thresholds: { hot: 60, worthALook: 40 },
};
