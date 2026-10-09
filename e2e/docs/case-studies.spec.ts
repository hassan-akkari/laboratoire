import { expect, test } from "@playwright/test";
import { LOCALES } from "../fixtures/site";

/**
 * Professional case studies: three anonymized employer stories, each with a
 * home card and a detail page under /{locale}/case-studies/<slug>. Keep in
 * sync with PROFESSIONAL_CASE_STUDY_SLUGS in apps/docs/src/data.
 */
const SLUGS = [
  "http-client-concurrency",
  "incremental-react-migration",
  "bff-modularization",
] as const;

test.describe("professional case studies", () => {
  for (const locale of LOCALES) {
    test(`home cards link to the three studies and a detail page renders (${locale})`, async ({
      page,
    }) => {
      await page.goto(`/${locale}`);
      const section = page.locator("#case-studies");
      await section.scrollIntoViewIfNeeded();

      for (const slug of SLUGS) {
        await expect(section.locator(`a[href="/${locale}/case-studies/${slug}"]`)).toHaveCount(1);
      }
      // Bookable stays the first card, and the only personal one.
      await expect(section.locator("article").first()).toContainText(/Bookable/);

      const response = await page.goto(`/${locale}/case-studies/${SLUGS[1]}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator(`a[href="/${locale}#case-studies"]`)).toHaveCount(1);
      await expect(page.locator(`.cs-cv a[href="/${locale}/cv"]`)).toHaveCount(1);
      // The middle study has both a previous and a next neighbour.
      await expect(page.locator("nav.cs-pager a")).toHaveCount(2);
    });
  }

  test("every detail page answers 200 with metrics, limits and no employer name (en)", async ({
    page,
  }) => {
    for (const slug of SLUGS) {
      const response = await page.goto(`/en/case-studies/${slug}`);
      expect(response?.status(), slug).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator(".cs-metrics li").first()).toBeVisible();
      await expect(page.locator("#cs-limits")).toBeVisible();
      expect(await page.locator("body").innerText()).not.toMatch(/sibylla/i);
    }
  });

  test("an unknown slug is a real 404", async ({ page }) => {
    const response = await page.goto("/en/case-studies/does-not-exist");
    expect(response?.status()).toBe(404);
  });

  test("the CV links the professional role to the three studies (en)", async ({ page }) => {
    await page.goto("/en/cv");
    await expect(page.locator(".cv-case-links a")).toHaveCount(SLUGS.length);
    for (const slug of SLUGS) {
      await expect(page.locator(`.cv-case-links a[href="/en/case-studies/${slug}"]`)).toHaveCount(1);
    }
  });

  test("keyboard: a card link takes focus and Enter opens the study (en)", async ({ page }) => {
    await page.goto("/en");
    const link = page.locator(`#case-studies a[href="/en/case-studies/${SLUGS[0]}"]`);
    await link.scrollIntoViewIfNeeded();
    await link.focus();
    await expect(link).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`/en/case-studies/${SLUGS[0]}$`));
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("professional case studies — reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("home case-study cards are visible under prefers-reduced-motion (F24)", async ({ page }) => {
    await page.goto("/en");
    await page.locator("#case-studies").scrollIntoViewIfNeeded();
    // Let the reduced-motion re-sync and any instant "visible" resolution settle.
    await page.waitForTimeout(1500);
    const opacities = await page
      .locator("#case-studies article")
      .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).opacity));
    expect(opacities.length).toBeGreaterThanOrEqual(SLUGS.length + 1);
    for (const opacity of opacities) expect(Number(opacity)).toBe(1);
  });

  test("a detail page has no invisible content under prefers-reduced-motion", async ({ page }) => {
    await page.goto(`/en/case-studies/${SLUGS[2]}`);
    const invisible = await page
      .locator("article.cs-page *")
      .evaluateAll((nodes) => nodes.filter((node) => getComputedStyle(node).opacity === "0").length);
    expect(invisible).toBe(0);
    await expect(page.locator("#cs-results")).toBeVisible();
  });
});
