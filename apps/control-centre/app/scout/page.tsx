import { indeedMockConnector } from "@/lib/connectors/indeed.mock";
import { defaultScoutConfig } from "@/lib/scout/config";
import { buildShortlist, type ScoredListing } from "@/lib/scout/score";

const TIER_CHIP: Record<ScoredListing["tier"], { className: string; label: string }> = {
  hot: { className: "chip hot", label: "apply today" },
  "worth-a-look": { className: "chip ice", label: "worth a look" },
  skip: { className: "chip", label: "skip" },
};

function salaryLabel(entry: ScoredListing): string {
  const { salaryMin, salaryMax, currency } = entry.listing;
  if (salaryMin === undefined || salaryMax === undefined || !currency) {
    return "salary n/d";
  }
  return `${Math.round(salaryMin / 1000)}–${Math.round(salaryMax / 1000)}k ${currency}`;
}

export default async function ScoutPage() {
  const listings = await indeedMockConnector.fetchListings();
  const shortlist = buildShortlist(listings, defaultScoutConfig);
  const kept = shortlist.filter((entry) => entry.tier !== "skip");
  const skipped = shortlist.filter((entry) => entry.tier === "skip");

  return (
    <>
      <h1 className="page-title">
        Job scout{" "}
        <span className={`chip ${indeedMockConnector.mode}`}>
          {indeedMockConnector.name} · {indeedMockConnector.mode}
        </span>
      </h1>
      <p className="page-sub">
        The feed is mock; the scoring is real. Every listing is ranked against
        the tier list in <code className="mono">lib/scout/config.ts</code>{" "}
        (CH/NL, React/TS/.NET/LLM, salary floors) with the rationale spelled
        out — swap in the live connector and this page doesn&apos;t change.
      </p>

      <h2 className="section-title">
        This morning&apos;s shortlist — {kept.length} of {shortlist.length}
      </h2>
      <ul className="rows">
        {kept.map((entry) => (
          <li className="row" key={entry.listing.id}>
            <span className="title">{entry.listing.company}</span>
            <span className={TIER_CHIP[entry.tier].className}>
              {TIER_CHIP[entry.tier].label}
            </span>
            <span className="meta">
              score {entry.score} · {salaryLabel(entry)}
            </span>
            <span className="sub">
              {entry.listing.title} · {entry.listing.location} (
              {entry.listing.country}) · {entry.listing.remote} —{" "}
              {entry.listing.summary}
            </span>
            <span className="sub mono">↳ {entry.rationale.join(" · ")}</span>
          </li>
        ))}
      </ul>

      <h2 className="section-title">Filtered out — {skipped.length}</h2>
      <ul className="rows">
        {skipped.map((entry) => (
          <li className="row" key={entry.listing.id}>
            <span className="muted">{entry.listing.company}</span>
            <span className="sub mono muted">
              {entry.listing.title} · {entry.listing.location} — ↳{" "}
              {entry.rationale.join(" · ")}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
