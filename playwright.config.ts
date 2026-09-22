import { defineConfig, devices } from "@playwright/test";
import { selectProjects, serversFor } from "./e2e/lib/cli";
import {
  DEFAULT_BOOKING_PORT,
  DEFAULT_DOCS_PORT,
  bookingServer,
  docsServer,
  portFromEnv,
} from "./e2e/lib/servers";

/**
 * Browser-level checks for the deployed surfaces of this monorepo.
 *
 * - `docs` / `docs-mobile`: the portfolio, served by `next start` from a
 *   production build (`pnpm e2e:prepare` builds it; CI builds before running)
 *   on port 3900 (`E2E_DOCS_PORT`).
 * - `booking`: Bookable's dev server on port 3902 (`E2E_BOOKING_PORT`), forced
 *   into demo mode with `DATABASE_URL=""`: sample data, nothing is written
 *   anywhere. The specs additionally never submit a valid booking.
 * - `tooling`: tests of this harness itself (CLI parsing, server isolation,
 *   env precedence). Needs no server.
 *
 * Servers are never reused (locally or in CI): a busy port fails the run
 * before any spec executes and the foreign process is left untouched. Only
 * the servers needed by the requested `--project`s are declared; an unknown
 * project name fails here, before anything starts.
 */
const CI = Boolean(process.env.CI);
const DOCS_PORT = portFromEnv("E2E_DOCS_PORT", DEFAULT_DOCS_PORT);
const BOOKING_PORT = portFromEnv("E2E_BOOKING_PORT", DEFAULT_BOOKING_PORT);
const DOCS_URL = `http://localhost:${DOCS_PORT}`;
const BOOKING_URL = `http://localhost:${BOOKING_PORT}`;

const needs = serversFor(selectProjects(process.argv.slice(2)));

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
    {
      name: "tooling",
      testDir: "e2e/tooling",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    ...(needs.docs ? [docsServer(DOCS_PORT)] : []),
    ...(needs.booking ? [bookingServer(BOOKING_PORT)] : []),
  ],
});
