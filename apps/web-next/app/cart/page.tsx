import Link from "next/link";
import { parseQuoteSearchParams } from "../../lib/bookingSchemas";
import { formatCurrency, quoteBooking } from "../../lib/pricing";

type CartPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function buildCheckoutHref(
  params: ReturnType<typeof parseQuoteSearchParams>,
  fallback = "/",
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

  if (!params) {
    return (
      <section className="card">
        <h1>Cart</h1>
        <p className="notice">
          Missing or invalid booking parameters. Open an experience and build a
          quote first.
        </p>
        <div className="button-row">
          <Link href="/" className="button">
            Back to listing
          </Link>
        </div>
      </section>
    );
  }

  const quote = quoteBooking(params);
  const checkoutHref = buildCheckoutHref(params);

  return (
    <section className="layout-two">
      <article className="card">
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
      </article>

      <article className="card">
        <h2>Proceed</h2>
        <p className="section-subtitle">
          Checkout is protected: if not authenticated you will be redirected to
          login and then returned here.
        </p>
        <div className="button-row">
          <Link href={checkoutHref} className="button">
            Continue to checkout
          </Link>
          <Link
            href={`/experiences/${quote.experience.slug}`}
            className="button button--bordered"
          >
            Edit booking
          </Link>
          <Link href="/" className="button button--flat">
            Back to listing
          </Link>
        </div>
      </article>
    </section>
  );
}
