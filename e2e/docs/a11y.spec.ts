import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * axe-core audit of the public pages. Fails on `critical` and `serious`
 * violations (WCAG 2.x A/AA rule tags); `moderate` and `minor` are printed
 * so they stay visible without blocking. Add a page here when you add a route.
 */
const PAGES = ["/en", "/en/cv", "/en/notes", "/en/privacy", "/it", "/de"] as const;

/**
 * Rules downgraded to advisory until their debt is paid. Each entry must
 * point at a followup item; remove the entry when the fix lands so the rule
 * starts blocking again. Never add `critical` findings here.
 */
const TEMPORARY_ADVISORY: Record<string, string> = {
  // F22: notes-teaser CTA, CV meta line and CV project links fall below 4.5:1
  // on the dark theme. Token change in apps/docs/src/styles/portfolio.css.
  "color-contrast": "F22",
};

test.describe("accessibility (axe)", () => {
  for (const path of PAGES) {
    test(`no serious or critical violations on ${path}`, async ({ page }, testInfo) => {
      await page.goto(path);
      // Reveal below-the-fold sections that animate in on scroll.
      await page.evaluate(async () => {
        const step = Math.max(400, window.innerHeight / 2);
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
        window.scrollTo(0, 0);
      });

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const blocking = results.violations.filter(
        (v) => v.impact === "critical" || (v.impact === "serious" && !(v.id in TEMPORARY_ADVISORY)),
      );
      const advisory = results.violations.filter((v) => !blocking.includes(v));

      if (advisory.length > 0) {
        testInfo.annotations.push({
          type: "axe-advisory",
          description: advisory
            .map((v) => `${v.id} (${v.impact}${TEMPORARY_ADVISORY[v.id] ? `, ${TEMPORARY_ADVISORY[v.id]}` : ""}) ×${v.nodes.length}`)
            .join("; "),
        });
      }

      expect(
        blocking.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          targets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
        })),
      ).toEqual([]);
    });
  }
});
