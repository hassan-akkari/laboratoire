import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="card">
      <h1>Page not found</h1>
      <p className="notice">
        The requested route does not exist in this demo. If you came from a
        confirmation link, the in-memory order state may have expired.
      </p>
      <div className="button-row">
        <Link href="/" className="button">
          Back to listing
        </Link>
      </div>
    </section>
  );
}
