/**
 * webServer definitions for playwright.config.ts, kept here so the tooling
 * specs can assert their invariants without loading the whole config.
 */

export const DEFAULT_DOCS_PORT = 3900;
export const DEFAULT_BOOKING_PORT = 3902;

export type WebServerConfig = {
  command: string;
  url: string;
  reuseExistingServer: boolean;
  timeout: number;
  env?: Record<string, string>;
};

/**
 * Portfolio: `next start` of a production build on a port nobody uses for
 * development (3000 is `pnpm dev`). Never reuses a running server, locally or
 * in CI: an old build on the port would silently test the wrong thing.
 */
export function docsServer(port: number = DEFAULT_DOCS_PORT): WebServerConfig {
  return {
    command: `pnpm -F docs exec next start --port ${port}`,
    url: `http://localhost:${port}/en`,
    reuseExistingServer: false,
    timeout: 120_000,
  };
}

/**
 * Bookable: its dev server on a dedicated port (3002 is `pnpm dev:booking`),
 * forced into demo mode. `DATABASE_URL=""` is set on the spawned process, and
 * Next never overrides a variable that already exists in the process
 * environment, so a developer's `.env.local` cannot connect the suite to a
 * database. `reuseExistingServer` is always false: if the port is busy the
 * run fails before any spec executes, and the foreign process is left alone.
 */
export function bookingServer(port: number = DEFAULT_BOOKING_PORT): WebServerConfig {
  return {
    command: `pnpm -F booking-service exec next dev --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
    timeout: 180_000,
    env: { DATABASE_URL: "" },
  };
}

export function portFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`${name} must be a TCP port (1-65535), got "${raw}".`);
  }
  return port;
}
