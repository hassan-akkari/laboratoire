import { randomUUID } from "node:crypto";
import { AppButton, AppCard, AppInput } from "@laboratoire/ui";
import { redirect } from "next/navigation";
import { checkoutRequestSchema, parseQuoteSearchParams } from "@/lib/bookingSchemas";
import { getExperienceBySlug } from "@/lib/data";
import { processCheckout } from "@/lib/orders";
import { formatCurrency, quoteBooking } from "@/lib/pricing";

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

  if (!params || !getExperienceBySlug(params.slug)) {
    return (
      <AppCard>
        <h1>Checkout</h1>
        <p className="notice">Invalid booking context. Start from an experience page.</p>
        <div className="button-row">
          <AppButton as="a" href="/browse">
            Back to listing
          </AppButton>
        </div>
      </AppCard>
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
      <AppCard>
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
            <AppInput
              name="fullName"
              placeholder="Hassan Akkari"
              required
              minLength={2}
              aria-label="Full name"
            />
          </label>

          <label className="form-label">
            Email
            <AppInput
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              aria-label="Email"
            />
          </label>

          <label className="form-label">
            Payment method
            {/* Native <select>: a server-action form posts via `name`; AppSelect
                (v3 react-aria ListBox) needs client state, so keep the native
                control here — themed by globals.css `.field`. */}
            <select className="field" name="paymentMethod" defaultValue="card">
              <option value="card">Card</option>
              <option value="wallet">Wallet</option>
            </select>
          </label>

          <div className="button-row">
            <AppButton type="submit">Confirm order</AppButton>
            {/* `bordered` -> v3 `secondary` (see AppButton). */}
            <AppButton as="a" href={`/cart?${queryString}`} variant="bordered">
              Back to cart
            </AppButton>
          </div>
        </form>
      </AppCard>

      <AppCard>
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
          Rule: <strong>{quote.pricingRule}</strong>
          {quote.promoLabel ? ` / Promo: ${quote.promoLabel}` : ""}
        </p>
      </AppCard>
    </section>
  );
}
