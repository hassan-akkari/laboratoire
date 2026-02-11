import Link from "next/link";
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

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { orderId } = await params;
  const order = getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <section className="layout-two">
      <article className="card">
        <h1>Order confirmed</h1>
        <p className="notice ok">
          Confirmation ID: <strong>{order.id}</strong>
        </p>
        <p className="section-subtitle">
          Created at {formatTimestamp(order.createdAt)} / payment via{" "}
          {order.customer.paymentMethod}
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
          <Link href="/" className="button">
            Create another booking
          </Link>
        </div>
      </article>

      <article className="card">
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
      </article>
    </section>
  );
}
