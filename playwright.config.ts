import { defineConfig, devices } from "@playwright/test";

/**
 * Browser-level checks for the deployed surfaces of this monorepo.
 *
 * - `docs` / `docs-mobile`: the portfolio, served by `next start` from a
 *   production build (`pnpm e2e:prepare` builds it; CI builds before running).
 * - `booking`: Bookable's dev server forced into demo mode (empty
 *   `DATABASE_URL`): sample data, nothing is written anywhere. The specs still
 *   never submit a valid booking, so a misconfigured environment cannot create
 *   real rows.
 *
 * Locally, an already-running server on the same port is reused; in CI the
 * servers are always started fresh.
 */
const CI = Boolean(process.env.CI);
const DOCS_URL = "http://localhost:3000";
const BOOKING_URL = "http://localhost:3002";

/**
 * Playwright starts every `webServer` entry regardless of `--project`, so a
 * booking-only run would still need a docs production build. Read the
 * requested projects from argv and only start the servers those need.
 */
function requestedProjects(): Set<string> {
  const names = new Set<string>();
  const argv = process.argv;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--project" && argv[i + 1]) names.add(argv[i + 1]);
    else if (arg.startsWith("--project=")) names.add(arg.slice("--project=".length));
  }
  return names;
}
const projects = requestedProjects();
const wantsDocs = projects.size === 0 || projects.has("docs") || projects.has("docs-mobile");
const wantsBooking = projects.size === 0 || projects.has("booking");

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  workers: CI ? 2 : undefined,
  reporter: CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "docs",
      testDir: "e2e/docs",
      use: { ...devices["Desktop Chrome"], baseURL: DOCS_URL },
    },
    {
      name: "docs-mobile",
      testDir: "e2e/docs",
      use: { ...devices["Pixel 7"], baseURL: DOCS_URL },
    },
    {
      name: "booking",
      testDir: "e2e/booking",
      use: { ...devices["Desktop Chrome"], baseURL: BOOKING_URL },
    },
  ],
  webServer: [
    ...(wantsDocs
      ? [
          {
            command: "pnpm -F docs start",
            url: `${DOCS_URL}/en`,
            reuseExistingServer: !CI,
            timeout: 120_000,
          },
        ]
      : []),
    ...(wantsBooking
      ? [
          {
            command: "pnpm -F booking-service dev",
            url: BOOKING_URL,
            reuseExistingServer: !CI,
            timeout: 180_000,
            // Demo mode on purpose: an empty value wins over .env.local (Next
            // never overrides a variable already present in the process env).
            env: { DATABASE_URL: "" },
          },
        ]
      : []),
  ],
});
