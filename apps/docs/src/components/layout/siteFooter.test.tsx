import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

// next/link needs the App Router context at runtime; for a static-markup
// contract test a plain anchor is the observable output we care about.
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => createElement("a", { href, ...rest }, children),
}));

import SiteFooter from "./SiteFooter";
import { SITE } from "../../data/site";
import { LOCALES } from "../../i18n/locale";

function render(locale: (typeof LOCALES)[number]) {
  return renderToStaticMarkup(createElement(SiteFooter, { locale }));
}

describe("SiteFooter", () => {
  it("renders one <footer> landmark with GitHub, LinkedIn and email links", () => {
    const html = render("en");

    expect(html.match(/<footer/g)).toHaveLength(1);
    expect(html).toContain(`href="${SITE.github}"`);
    expect(html).toContain(`href="${SITE.linkedin}"`);
    expect(html).toContain(`href="mailto:${SITE.email}"`);
  });

  it("opens the profile links in a new tab without a referrer or opener", () => {
    const html = render("en");
    const anchors = html.match(/<a [^>]*>/g) ?? [];
    const external = anchors.filter((a) => a.includes("https://"));

    expect(external).toHaveLength(2);
    for (const a of external) {
      expect(a).toContain('target="_blank"');
      expect(a).toMatch(/rel="[^"]*noopener[^"]*"/);
      expect(a).toMatch(/rel="[^"]*noreferrer[^"]*"/);
    }
  });

  it.each(LOCALES)("links CV, notes and privacy under the %s locale prefix", (locale) => {
    const html = render(locale);

    expect(html).toContain(`href="/${locale}/cv"`);
    expect(html).toContain(`href="/${locale}/notes"`);
    expect(html).toContain(`href="/${locale}/privacy"`);
    // Brand link goes to the locale home, never to the bare root.
    expect(html).toContain(`href="/${locale}"`);
  });
});
