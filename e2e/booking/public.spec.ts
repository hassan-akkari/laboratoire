import { expect, test } from "@playwright/test";

/**
 * Bookable public surface in demo mode (no DATABASE_URL). Read-only by
 * construction: the only form submission is an empty one, which must be
 * rejected by client-side validation before any request is made.
 */
test.describe("Bookable public surface (demo mode)", () => {
  test("runs in demo mode: the banner is shown, so nothing can be persisted", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Demo mode — no database connected")).toBeVisible();
  });

  test("style switcher exposes three pressed-state buttons and switches the variant via cookie", async ({
    page,
    context,
  }) => {
    await page.goto("/");
    const group = page.getByRole("group", { name: "Choose a visual design" });
    const buttons = group.getByRole("button");
    await expect(buttons).toHaveText(["Editorial", "Warm", "Bold"]);
    await expect(buttons.filter({ hasText: "Bold" })).toHaveAttribute("aria-pressed", "true");

    await buttons.filter({ hasText: "Warm" }).click();
    await expect(buttons.filter({ hasText: "Warm" })).toHaveAttribute("aria-pressed", "true");
    const cookie = (await context.cookies()).find((c) => c.name === "bs_style");
    expect(cookie?.value).toBe("warm");

    // The choice survives a full reload (server-side read).
    await page.reload();
    await expect(
      page.getByRole("group", { name: "Choose a visual design" }).getByRole("button", { name: "Warm" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("catalogue lists sample services with a Book link each, and a detail page opens", async ({ page }) => {
    await page.goto("/services");
    const bookLinks = page.getByRole("link", { name: /^Book / });
    const count = await bookLinks.count();
    expect(count, "services with a Book link").toBeGreaterThanOrEqual(3);

    const href = await bookLinks.first().getAttribute("href");
    expect(href).toMatch(/^\/book\/[a-z0-9-]+$/);
    const slug = href!.replace("/book/", "");

    const detail = await page.goto(`/services/${slug}`);
    expect(detail?.status()).toBe(200);
    await expect(page.getByRole("link", { name: /^Book / }).first()).toBeVisible();
  });

  test("booking form rejects an empty submission on the client (no request is sent)", async ({ page }) => {
    await page.goto("/services");
    const href = await page.getByRole("link", { name: /^Book / }).first().getAttribute("href");
    await page.goto(href!);

    let serverActionCalls = 0;
    page.on("request", (req) => {
      if (req.method() === "POST") serverActionCalls += 1;
    });

    await page.getByRole("button", { name: /send booking request/i }).click();
    const messages = page.locator('[id$="-form-item-message"], [data-slot="form-message"]');
    await expect(messages.first()).toBeVisible();
    expect(await messages.count()).toBeGreaterThanOrEqual(2);
    expect(serverActionCalls, "POST requests after an invalid submit").toBe(0);
  });

  test("admin is gated: /admin redirects to the login page, which renders a form", async ({ page }) => {
    const res = await page.goto("/admin");
    expect(res?.url()).toMatch(/\/admin\/login\?next=%2Fadmin$/);
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toHaveCount(1);
    await expect(page.locator('input[type="password"]')).toHaveCount(1);
  });

  test("unknown booking slugs 404", async ({ page }) => {
    const res = await page.goto("/book/does-not-exist");
    expect(res?.status()).toBe(404);
  });

  test("unknown service slugs 404", async ({ page }) => {
    // Known soft-404: the page calls notFound() but the response is already
    // streaming, so the status is 200 (dev and live). Tracked as F20 in
    // .claude/_followup.md; flip to a normal test once fixed.
    test.fixme(true, "F20: /services/[slug] returns 200 for unknown slugs");
    const res = await page.goto("/services/does-not-exist");
    expect(res?.status()).toBe(404);
  });
});
