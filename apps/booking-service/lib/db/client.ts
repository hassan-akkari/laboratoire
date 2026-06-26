import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

// IMPORTANT: never throw at module load. `next build` imports this module during
// page-data collection with NODE_ENV=production but no DATABASE_URL (Neon is
// provisioned later), and a top-level throw would abort the whole build. Instead
// we expose `dbReady`: the query layer returns empty/null when false, and the UI
// renders a setup state. A real deploy MUST set DATABASE_URL — the query layer
// (not this file) is the right place to enforce that at request time if needed.
if (!databaseUrl) {
  console.warn(
    "[booking-service] DATABASE_URL is empty — DB queries return empty results " +
      "and the UI shows a setup state. Set DATABASE_URL (Neon) and run " +
      "`pnpm -F booking-service db:push` + `db:seed` to go live.",
  );
}

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;
export const db: DrizzleDb = databaseUrl
  ? drizzle(neon(databaseUrl), { schema })
  : (null as unknown as DrizzleDb);

/** True when a real DB connection is configured. Use to render setup states. */
export const dbReady = Boolean(databaseUrl);

export { schema };
