import Link from "next/link";

export default function AdminNotFound() {
  return (
    <section
      className="card"
      style={{ maxWidth: 560, margin: "60px auto", padding: 28, display: "grid", gap: 14 }}
    >
      <h1 style={{ margin: 0 }}>Admin route not found</h1>
      <p style={{ margin: 0, color: "var(--app-muted)" }}>
        The URL you tried isn&apos;t a valid admin route. Use the links below.
      </p>
      <div className="button-row">
        <Link href="/admin" className="button">Leads</Link>
        <Link href="/admin/site-config" className="button button--bordered">Site config</Link>
        <Link href="/admin/login" className="button button--flat">Sign in</Link>
      </div>
    </section>
  );
}
