import { AppButton, AppCard } from "@laboratoire/ui";
import { notFound } from "next/navigation";
import { getOrderById } from "../../../lib/orders";
import { formatCurrency } from "../../../lib/pricing";

type ConfirmationPageProps = {
  params: Promise<{ orderId: string }>;
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatPaymentMethod(value: "card" | "wallet") {
  return value === "card" ? "Card" : "Wallet";
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { orderId } = await params;
  const order = getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <section className="layout-two">
      <AppCard>
        <h1>Order confirmed</h1>
        <p className="notice ok">
          Confirmation ID: <strong>{order.id}</strong>
        </p>
        <p className="section-subtitle">
          Created at {formatTimestamp(order.createdAt)} / payment via{" "}
          {formatPaymentMethod(order.customer.paymentMethod)}
        </p>
        <ul className="list">
          <li>Customer: {order.customer.fullName}</li>
          <li>Email: {order.customer.email}</li>
          <li>Experience: {order.quote.experience.title}</li>
          <li>
            Guests: {order.quote.guests} on {order.quote.date}
          </li>
        </ul>
        <div className="button-row">
          <AppButton as="a" href="/">
            Create another booking
          </AppButton>
        </div>
      </AppCard>

      <AppCard>
        <h2>Final total</h2>
        <div className="summary-grid">
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatCurrency(order.quote.subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>Discount</span>
            <strong>-{formatCurrency(order.quote.discount)}</strong>
          </div>
          <div className="summary-row">
            <span>Service fee</span>
            <strong>{formatCurrency(order.quote.serviceFee)}</strong>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <strong>{formatCurrency(order.quote.tax)}</strong>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <strong>{formatCurrency(order.quote.total)}</strong>
          </div>
        </div>
      </AppCard>
    </section>
  );
}
