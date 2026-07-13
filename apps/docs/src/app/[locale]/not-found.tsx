import Link from "next/link";

/**
 * Localized-enough 404 (not-found boundaries cannot read route params, so the
 * copy is trilingual). Replaces the SPA's silent catch-all redirect to "/"
 * with a real 404 status — the SEO-correct behavior for dead URLs. The home
 * link goes through "/" so the proxy re-localizes it.
 */
export default function NotFound() {
  return (
    <section id="not-found">
      <div className="container">
        <div style={{ maxWidth: "70ch", margin: "0 auto", padding: "96px 0" }}>
          <h1 className="sub-title">404</h1>
          <p>
            Pagina non trovata · Page not found · Page introuvable · Seite
            nicht gefunden
          </p>
          <p style={{ marginTop: 32 }}>
            <Link href="/">← Home</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
