import Link from "next/link";
import { getDateWithOffset } from "../lib/date";
import { experiences } from "../lib/data";

export const revalidate = 300;

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function normalizeQuery(raw: string | string[] | undefined) {
  if (Array.isArray(raw)) {
    return raw[0]?.toLowerCase().trim() ?? "";
  }

  return raw?.toLowerCase().trim() ?? "";
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = (await searchParams) ?? {};
  const query = normalizeQuery(params.q);
  const seedDate = getDateWithOffset(7);

  const filtered = query
    ? experiences.filter((experience) => {
        return (
          experience.title.toLowerCase().includes(query) ||
          experience.location.toLowerCase().includes(query) ||
          experience.summary.toLowerCase().includes(query)
        );
      })
    : experiences;

  return (
    <>
      <section className="hero-card">
        <h1>Booking and Checkout Engine (MVP)</h1>
        <p>
          Next.js App Router demo focused on concrete capability proof: protected checkout,
          server-validated pricing rules, and idempotent order confirmation.
        </p>
        <div className="signal-grid">
          <div className="signal-pill">SSR-ready listing + details</div>
          <div className="signal-pill">Route handler API boundaries</div>
          <div className="signal-pill">Auth gate + redirect to original route</div>
          <div className="signal-pill">Price rules engine with unit tests</div>
        </div>
      </section>

      <section>
        <h2 className="section-title">Experience listing</h2>
        <p className="section-subtitle">
          Search by title, location, or short description. Then open detail and
          continue to cart.
        </p>
        <form className="search-row" method="get">
          <input
            className="field"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search experiences..."
            aria-label="Search experiences"
          />
          <button className="button" type="submit">
            Search
          </button>
          {query ? (
            <Link className="button button--flat" href="/">
              Clear
            </Link>
          ) : null}
        </form>
      </section>

      <section className="cards-grid">
        {filtered.map((experience) => (
          <article key={experience.slug} className="card">
            <h3>{experience.title}</h3>
            <p>{experience.summary}</p>
            <div className="meta-row">
              <span className="chip">{experience.location}</span>
              <span className="chip">{experience.durationHours}h</span>
              <span className="chip">
                {experience.priceModel === "minimum_group"
                  ? "minimum group"
                  : "per person"}
              </span>
            </div>
            <div className="button-row">
              <Link className="button" href={`/experiences/${experience.slug}`}>
                Open detail
              </Link>
              <Link
                className="button button--bordered"
                href={`/cart?slug=${experience.slug}&guests=2&date=${seedDate}`}
              >
                Quick cart
              </Link>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
