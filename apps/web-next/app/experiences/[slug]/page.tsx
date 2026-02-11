import Link from "next/link";
import { notFound } from "next/navigation";
import { getExperienceBySlug } from "../../../lib/data";
import { getDateWithOffset } from "../../../lib/date";

type ExperienceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function getDefaultBookingDate() {
  return getDateWithOffset(7);
}

function getMinDate() {
  return getDateWithOffset(0);
}

export default async function ExperienceDetailPage({
  params,
}: ExperienceDetailPageProps) {
  const { slug } = await params;
  const experience = getExperienceBySlug(slug);

  if (!experience) {
    notFound();
  }

  return (
    <>
      <section>
        <p className="section-subtitle">Experience detail</p>
        <h1 className="section-title">{experience.title}</h1>
        <p className="section-subtitle">{experience.summary}</p>
        <div className="meta-row">
          <span className="chip">{experience.location}</span>
          <span className="chip">{experience.durationHours} hours</span>
          <span className="chip">
            {experience.priceModel === "minimum_group"
              ? "Minimum group pricing"
              : "Per-person pricing"}
          </span>
        </div>
      </section>

      <section className="layout-two">
        <article className="card">
          <h2>Why this route matters</h2>
          <ul className="list">
            {experience.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="notice">
            Price input is validated server-side later in cart and checkout to avoid
            inconsistent totals.
          </p>
        </article>

        <article className="card">
          <h2>Build quote</h2>
          <form className="form-grid" action="/cart" method="get">
            <input type="hidden" name="slug" value={experience.slug} />
            <label className="form-label">
              Guests
              <input
                className="field"
                type="number"
                min={1}
                max={12}
                name="guests"
                defaultValue={2}
                required
              />
            </label>
            <label className="form-label">
              Date
              <input
                className="field"
                type="date"
                name="date"
                min={getMinDate()}
                defaultValue={getDefaultBookingDate()}
                required
              />
            </label>
            <label className="form-label">
              Promo code (optional)
              <input
                className="field"
                type="text"
                name="promoCode"
                placeholder="NETWORK10"
              />
            </label>
            <button className="button" type="submit">
              Continue to cart
            </button>
          </form>
          <div className="button-row">
            <Link href="/" className="button button--bordered">
              Back to listing
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
