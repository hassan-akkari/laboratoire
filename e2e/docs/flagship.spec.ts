import { expect, test } from "@playwright/test";
import { BOOKABLE, LOCALES } from "../fixtures/site";

/**
 * The Bookable case study is the portfolio's flagship. These checks find the
 * card by its title (not by position) so they hold before and after ordering
 * changes; the "first position" rule lives in the unit test next to the data.
 */
test.describe("Bookable case study", () => {
  for (const locale of LOCALES) {
    test(`card has the live demo link and the style-switcher showcase (${locale})`, async ({ page }) => {
      await page.goto(`/${locale}`);
      const section = page.locator("#case-studies");
      await section.scrollIntoViewIfNeeded();

      const card = section.locator("article", { hasText: /Bookable/ });
      await expect(card).toHaveCount(1);

      const live = card.locator(`a[href="${BOOKABLE.live}"]`);
      await expect(live).toHaveCount(1);
      await expect(live).toHaveAttribute("target", "_blank");
      await expect(live).toHaveAttribute("rel", /noreferrer/);

      const tabs = card.getByRole("group").getByRole("button");
      await expect(tabs).toHaveText(["Editorial", "Warm", "Bold"]);

      // Picking a variant is reflected in aria-pressed and swaps the visible frame.
      await tabs.nth(2).click();
      await expect(tabs.nth(2)).toHaveAttribute("aria-pressed", "true");
      await expect(tabs.nth(0)).toHaveAttribute("aria-pressed", "false");
      const shown = card.locator("img[aria-hidden='false']");
      await expect(shown).toHaveCount(1);
      await expect(shown).toHaveAttribute("src", /bookable-variant-3/);
    });
  }

  test("CV lists Bookable as a project with a working live link (en)", async ({ page }) => {
    await page.goto("/en/cv");
    const project = page.locator("article.cv-block", { hasText: /^Bookable/ }).first();
    await expect(project).toBeVisible();
    await expect(project.locator(`a[href="${BOOKABLE.live}"]`)).toHaveCount(1);
  });
});
