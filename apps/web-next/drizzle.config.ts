import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  // drizzle-kit will only run when called via pnpm db:* scripts which load .env.local via tsx --env-file.
  // If we get here in another context, fail loud.
  throw new Error("DATABASE_URL is not set. Run db:* scripts via pnpm so .env.local is loaded.");
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: databaseUrl },
  strict: true,
  verbose: true,
});
