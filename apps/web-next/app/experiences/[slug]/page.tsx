import { AppButton, AppCard, AppChip, AppInput } from "@laboratoire/ui";
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
          <AppChip>{experience.location}</AppChip>
          <AppChip>{experience.durationHours} hours</AppChip>
          <AppChip>
            {experience.priceModel === "minimum_group"
              ? "Minimum group pricing"
              : "Per-person pricing"}
          </AppChip>
        </div>
      </section>

      <section className="layout-two">
        <AppCard>
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
        </AppCard>

        <AppCard>
          <h2>Build quote</h2>
          <form className="form-grid" action="/cart" method="get">
            <input type="hidden" name="slug" value={experience.slug} />
            <label className="form-label">
              Guests
              <AppInput
                type="number"
                min={1}
                max={12}
                name="guests"
                defaultValue="2"
                required
                aria-label="Guests"
              />
            </label>
            <label className="form-label">
              Date
              <AppInput
                type="date"
                name="date"
                min={getMinDate()}
                defaultValue={getDefaultBookingDate()}
                required
                aria-label="Date"
              />
            </label>
            <label className="form-label">
              Promo code (optional)
              <AppInput
                type="text"
                name="promoCode"
                placeholder="NETWORK10"
                aria-label="Promo code (optional)"
              />
            </label>
            <AppButton type="submit">Continue to cart</AppButton>
          </form>
          <div className="button-row">
            {/* `bordered` -> v3 `secondary` (see AppButton). */}
            <AppButton as="a" href="/" variant="bordered">
              Back to listing
            </AppButton>
          </div>
        </AppCard>
      </section>
    </>
  );
}
