import { AppButton, AppCard } from "@laboratoire/ui";
import { parseQuoteSearchParams } from "@/lib/bookingSchemas";
import { getExperienceBySlug } from "@/lib/data";
import { formatCurrency, quoteBooking } from "@/lib/pricing";

type CartPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function buildCheckoutHref(
  params: ReturnType<typeof parseQuoteSearchParams>,
  fallback = "/browse",
) {
  if (!params) {
    return fallback;
  }

  const query = new URLSearchParams({
    slug: params.slug,
    guests: String(params.guests),
    date: params.date,
  });

  if (params.promoCode) {
    query.set("promoCode", params.promoCode);
  }

  return `/checkout?${query.toString()}`;
}

export default async function CartPage({ searchParams }: CartPageProps) {
  const params = parseQuoteSearchParams(await searchParams);

  if (!params || !getExperienceBySlug(params.slug)) {
    return (
      // v3 wrapper: AppCard emits the v3 `.card` recipe + `.heroui-v3-warm` scope.
      <AppCard>
        <h1>Cart</h1>
        <p className="notice">
          Missing or invalid booking parameters. Open an experience and build a
          quote first.
        </p>
        <div className="button-row">
          {/* `as="a"` renders the v3 button-styled anchor (full nav, MVP-fine). */}
          <AppButton as="a" href="/browse">
            Back to listing
          </AppButton>
        </div>
      </AppCard>
    );
  }

  const quote = quoteBooking(params);
  const checkoutHref = buildCheckoutHref(params);

  return (
    <section className="layout-two">
      <AppCard>
        <h1>Cart summary</h1>
        <p>{quote.experience.title}</p>
        <p className="section-subtitle">
          {quote.experience.location} / {quote.experience.durationHours} hours /{" "}
          {quote.guests} guests / {quote.date}
        </p>
        <div className="summary-grid">
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatCurrency(quote.subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>Discount</span>
            <strong>-{formatCurrency(quote.discount)}</strong>
          </div>
          <div className="summary-row">
            <span>Service fee</span>
            <strong>{formatCurrency(quote.serviceFee)}</strong>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <strong>{formatCurrency(quote.tax)}</strong>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <strong>{formatCurrency(quote.total)}</strong>
          </div>
        </div>
        <p className="notice">
          Pricing rule: <strong>{quote.pricingRule}</strong>
          {quote.promoLabel ? ` / Promo: ${quote.promoLabel}` : ""}
        </p>
      </AppCard>

      <AppCard>
        <h2>Proceed</h2>
        <p className="section-subtitle">
          Checkout is protected: if not authenticated you will be redirected to
          login and then returned here.
        </p>
        <div className="button-row">
          {/* Primary CTA: default v3 primary variant (warm accent via scope). */}
          <AppButton as="a" href={checkoutHref}>
            Continue to checkout
          </AppButton>
          {/* `bordered` -> v3 `secondary`; `flat` -> v3 `tertiary` (see AppButton). */}
          <AppButton
            as="a"
            href={`/experiences/${quote.experience.slug}`}
            variant="bordered"
          >
            Edit booking
          </AppButton>
          <AppButton as="a" href="/browse" variant="flat">
            Back to listing
          </AppButton>
        </div>
      </AppCard>
    </section>
  );
}
