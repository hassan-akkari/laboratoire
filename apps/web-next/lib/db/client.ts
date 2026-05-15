import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;
const devNoDb =
  process.env.DEV_NO_DB === "1" && process.env.NODE_ENV !== "production";

// MVP-ONLY ESCAPE HATCH: when developing locally before Neon is provisioned,
// set DEV_NO_DB=1 in .env.local. The login route has a parallel branch that
// validates ADMIN_EMAIL+ADMIN_PASSWORD against env directly (no bcrypt, no DB),
// which only activates when DEV_NO_DB=1. Production is protected by the
// NODE_ENV check above and by the throw below.
if (!databaseUrl && !devNoDb) {
  throw new Error("DATABASE_URL is not set");
}

if (devNoDb) {
  console.warn(
    "[admin] DEV_NO_DB=1 — login route is using env-compare bypass. " +
      "DB queries will throw. Remove DEV_NO_DB once DATABASE_URL is set.",
  );
}

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;
export const db: DrizzleDb = databaseUrl
  ? drizzle(neon(databaseUrl), { schema })
  : (null as unknown as DrizzleDb);
export { schema };
