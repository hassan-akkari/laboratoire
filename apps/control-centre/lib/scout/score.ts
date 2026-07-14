import type { JobListing } from "../connectors/types";
import type { ScoutConfig } from "./config";

/**
 * The real half of the scout: pure, deterministic scoring of a listing
 * against the tier-list config, with a human-readable rationale for every
 * point granted or denied. The mock connector feeds it today; the live one
 * will feed it tomorrow — this file doesn't care.
 */

export type ScoutTier = "hot" | "worth-a-look" | "skip";

export type ScoredListing = {
  listing: JobListing;
  score: number;
  tier: ScoutTier;
  rationale: string[];
};

export function scoreListing(
  listing: JobListing,
  config: ScoutConfig,
): ScoredListing {
  const rationale: string[] = [];
  const haystack = [listing.title, listing.summary, ...listing.stack]
    .join(" ")
    .toLowerCase();

  for (const dealBreaker of config.dealBreakers) {
    if (haystack.includes(dealBreaker)) {
      return {
        listing,
        score: 0,
        tier: "skip",
        rationale: [`deal-breaker: "${dealBreaker}"`],
      };
    }
  }

  let score = 0;

  const countryWeight = config.countryTiers[listing.country] ?? 0;
  if (countryWeight > 0) {
    score += countryWeight;
    rationale.push(`${listing.country} is a target market (+${countryWeight})`);
  } else {
    rationale.push(`${listing.country} outside target markets (+0)`);
  }

  const matched = listing.stack.filter(
    (item) => config.stackWeights[item.toLowerCase()] !== undefined,
  );
  const stackScore = matched.reduce(
    (sum, item) => sum + (config.stackWeights[item.toLowerCase()] ?? 0),
    0,
  );
  if (matched.length > 0) {
    score += stackScore;
    rationale.push(`stack match: ${matched.join(", ")} (+${stackScore})`);
  } else {
    rationale.push("no stack overlap (+0)");
  }

  const remoteBonus = config.remoteBonus[listing.remote];
  if (remoteBonus > 0) {
    score += remoteBonus;
    rationale.push(`${listing.remote} (+${remoteBonus})`);
  }

  if (listing.salaryMax !== undefined && listing.currency) {
    const floor = config.salaryFloor[listing.currency];
    if (floor !== undefined && listing.salaryMax < floor) {
      score = Math.round(score / 2);
      rationale.push(
        `salary below ${floor.toLocaleString("en-CH")} ${listing.currency} floor (score halved)`,
      );
    }
  } else {
    rationale.push("salary undisclosed (no adjustment)");
  }

  const tier: ScoutTier =
    score >= config.thresholds.hot
      ? "hot"
      : score >= config.thresholds.worthALook
        ? "worth-a-look"
        : "skip";

  return { listing, score, tier, rationale };
}

/** Score a whole feed and return it shortlist-first. */
export function buildShortlist(
  listings: JobListing[],
  config: ScoutConfig,
): ScoredListing[] {
  return listings
    .map((listing) => scoreListing(listing, config))
    .sort(
      (a, b) =>
        b.score - a.score || a.listing.company.localeCompare(b.listing.company),
    );
}
