import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

let instance: DrizzleDb | null = null;

/**
 * LAZY INIT — deliberately NOT at module scope: `next build` ("Collecting
 * page data") imports every API route module, so a module-scope throw made
 * the BUILD require DATABASE_URL (it broke Vercel preview deployments, whose
 * env vars are Production-scoped). Resolving the env on first query keeps the
 * exact same runtime guarantee — any DB access without DATABASE_URL still
 * fails loudly — without coupling the build to runtime secrets.
 *
 * MVP-ONLY ESCAPE HATCH (unchanged semantics): when developing locally before
 * Neon is provisioned, set DEV_NO_DB=1 in .env.local. The login route has a
 * parallel branch that validates ADMIN_EMAIL+ADMIN_PASSWORD against env
 * directly (no bcrypt, no DB), which only activates when DEV_NO_DB=1; any
 * actual DB query still throws. Production ignores DEV_NO_DB via the
 * NODE_ENV check below.
 */
function getDb(): DrizzleDb {
  if (instance) return instance;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    const devNoDb =
      process.env.DEV_NO_DB === "1" && process.env.NODE_ENV !== "production";
    if (devNoDb) {
      throw new Error(
        "[admin] DEV_NO_DB=1 — DB query attempted without a database. " +
          "Remove DEV_NO_DB once DATABASE_URL is set.",
      );
    }
    throw new Error("DATABASE_URL is not set");
  }

  instance = drizzle(neon(databaseUrl), { schema });
  return instance;
}

export const db: DrizzleDb = new Proxy({} as DrizzleDb, {
  get(_target, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(real)
      : value;
  },
});
export { schema };
