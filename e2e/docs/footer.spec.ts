import { expect, test } from "@playwright/test";
import { LOCALES, PROFILE } from "../fixtures/site";

test.describe("site footer", () => {
  for (const locale of LOCALES) {
    test(`renders once with profile, privacy and locale links (${locale})`, async ({ page }) => {
      await page.goto(`/${locale}`);

      const footer = page.locator("footer");
      await expect(footer).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute("lang", new RegExp(`^${locale}`));

      const github = footer.locator(`a[href="${PROFILE.github}"]`);
      const linkedin = footer.locator(`a[href="${PROFILE.linkedin}"]`);
      for (const link of [github, linkedin]) {
        await expect(link).toHaveCount(1);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /noopener/);
        await expect(link).toHaveAttribute("rel", /noreferrer/);
      }
      await expect(footer.locator(`a[href="mailto:${PROFILE.email}"]`)).toHaveCount(1);

      // Internal links stay in the current locale; the brand goes to the locale home.
      for (const path of ["", "/cv", "/notes", "/privacy"]) {
        await expect(footer.locator(`a[href="/${locale}${path}"]`)).toHaveCount(1);
      }

      // Two labelled navs (site links, profiles).
      await expect(footer.getByRole("navigation")).toHaveCount(2);

      // The footer itself never overflows the viewport (page-level overflow on
      // the DE home is a separate, known issue: F19 in .claude/_followup.md).
      const box = await footer.boundingBox();
      const viewport = page.viewportSize();
      expect(box, "footer bounding box").not.toBeNull();
      expect(box!.x, "footer left edge").toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width, "footer right edge vs viewport").toBeLessThanOrEqual(viewport!.width + 1);
    });
  }

  test("is reachable by keyboard and every footer link shows a visible focus ring (en)", async ({ page }) => {
    await page.goto("/en");
    await page.locator("footer").scrollIntoViewIfNeeded();

    // Start from the first footer link, then Tab through the rest.
    await page.locator("footer a").first().focus();
    const seen: string[] = [];
    for (let i = 0; i < 12; i += 1) {
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || !el.closest("footer")) return null;
        const cs = getComputedStyle(el);
        return {
          href: el.getAttribute("href"),
          visible: el.matches(":focus-visible") && cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2,
        };
      });
      if (!info) break;
      expect(info.visible, `focus ring missing on ${info.href}`).toBe(true);
      seen.push(info.href ?? "");
      await page.keyboard.press("Tab");
    }
    expect(seen.length, "footer links visited by Tab").toBeGreaterThanOrEqual(7);
  });

  test("is hidden in print", async ({ page }) => {
    await page.goto("/en");
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("footer")).toBeHidden();
  });
});
