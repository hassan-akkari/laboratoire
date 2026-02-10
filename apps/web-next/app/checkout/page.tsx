import { randomUUID } from "node:crypto";
import Link from "next/link";
import { redirect } from "next/navigation";
import { checkoutRequestSchema, parseQuoteSearchParams } from "../../lib/bookingSchemas";
import { processCheckout } from "../../lib/orders";
import { formatCurrency, quoteBooking } from "../../lib/pricing";

type CheckoutPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toQueryString(params: {
  slug: string;
  guests: number;
  date: string;
  promoCode?: string;
}) {
  const query = new URLSearchParams({
    slug: params.slug,
    guests: String(params.guests),
    date: params.date,
  });

  if (params.promoCode) {
    query.set("promoCode", params.promoCode);
  }

  return query.toString();
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = parseQuoteSearchParams(await searchParams);

  if (!params) {
    return (
      <section className="card">
        <h1>Checkout</h1>
        <p className="notice">Invalid booking context. Start from an experience page.</p>
        <div className="button-row">
          <Link href="/" className="button">
            Back to listing
          </Link>
        </div>
      </section>
    );
  }

  const quote = quoteBooking(params);
  const queryString = toQueryString(params);
  const idempotencyKey = randomUUID();

  async function submitOrder(formData: FormData) {
    "use server";

    const parsed = checkoutRequestSchema.safeParse({
      slug: formData.get("slug"),
      guests: formData.get("guests"),
      date: formData.get("date"),
      promoCode: formData.get("promoCode"),
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      paymentMethod: formData.get("paymentMethod"),
      idempotencyKey: formData.get("idempotencyKey"),
    });

    if (!parsed.success) {
      redirect(`/cart?${queryString}`);
    }

    const order = processCheckout(parsed.data);
    redirect(`/confirmation/${order.id}`);
  }

  return (
    <section className="layout-two">
      <article className="card">
        <h1>Checkout</h1>
        <p className="section-subtitle">
          Protected route unlocked. Submit once or multiple times: same idempotency
          key returns the same order.
        </p>
        <form action={submitOrder} className="form-grid">
          <input type="hidden" name="slug" value={params.slug} />
          <input type="hidden" name="guests" value={params.guests} />
          <input type="hidden" name="date" value={params.date} />
          <input type="hidden" name="promoCode" value={params.promoCode ?? ""} />
          <input type="hidden" name="idempotencyKey" value={idempotencyKey} />

          <label className="form-label">
            Full name
            <input
              className="field"
              name="fullName"
              placeholder="Hassan Akkari"
              required
              minLength={2}
            />
          </label>

          <label className="form-label">
            Email
            <input
              className="field"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="form-label">
            Payment method
            <select className="field" name="paymentMethod" defaultValue="card">
              <option value="card">Card</option>
              <option value="wallet">Wallet</option>
            </select>
          </label>

          <div className="button-row">
            <button className="button" type="submit">
              Confirm order
            </button>
            <Link className="button button--bordered" href={`/cart?${queryString}`}>
              Back to cart
            </Link>
          </div>
        </form>
      </article>

      <article className="card">
        <h2>Order preview</h2>
        <p>{quote.experience.title}</p>
        <p className="section-subtitle">
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
          <div className="summary-row total">
            <span>Total</span>
            <strong>{formatCurrency(quote.total)}</strong>
          </div>
        </div>
        <p className="notice">
          Rule: <strong>{quote.pricingRule}</strong>
          {quote.promoLabel ? ` / Promo: ${quote.promoLabel}` : ""}
        </p>
      </article>
    </section>
  );
}
