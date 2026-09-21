import Link from "next/link";
import type { Locale } from "../../i18n/locale";
import { messages } from "../../i18n/messages";
import { localePath } from "../../i18n/routing";
import { SITE } from "../../data/site";
import Container from "./Container";

type SiteFooterProps = {
  locale: Locale;
};

/**
 * Site-wide footer, rendered by the locale layout under every page. Server
 * component on purpose: no hooks, no motion, no fetch — it must be in the
 * static HTML for crawlers and for the no-JS case. The GitHub / LinkedIn
 * URLs are the same `SITE` constants JSON-LD publishes as `sameAs`, so the
 * visible links and the structured data can never disagree.
 */
export default function SiteFooter({ locale }: SiteFooterProps) {
  const labels = messages[locale];
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__row">
          <div className="site-footer__brand">
            <Link href={localePath(locale)} className="site-footer__name">
              itshassan<span className="site-nav__brand-tld">.it</span>
            </Link>
            <p className="site-footer__tagline">{labels.footer.tagline}</p>
          </div>

          <nav aria-label={labels.footer.siteLinks} className="site-footer__nav">
            <Link href={localePath(locale, "/cv")}>{labels.nav.cv}</Link>
            <Link href={localePath(locale, "/notes")}>{labels.nav.notes}</Link>
            <Link href={localePath(locale, "/privacy")}>{labels.privacy.title}</Link>
          </nav>

          <nav aria-label={labels.footer.socialLinks} className="site-footer__nav">
            <a href={SITE.github} target="_blank" rel="me noopener noreferrer">
              GitHub
            </a>
            <a href={SITE.linkedin} target="_blank" rel="me noopener noreferrer">
              LinkedIn
            </a>
            <a href={`mailto:${SITE.email}`}>Email</a>
          </nav>
        </div>

        <p className="site-footer__meta">
          © {year} {SITE.name}
        </p>
      </Container>
    </footer>
  );
}
