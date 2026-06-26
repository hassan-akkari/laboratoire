import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, schema } from "../lib/db/client";
import { DEMO_SERVICES } from "../lib/demo-data";

// Demo vertical = beauty/hair. Schema is generic; only this data is themed.
// DEMO_SERVICES is the single source (shared with the no-DB preview fallback in
// features/services/queries.ts).

async function seed() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
  }
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is empty. Set your Neon string in .env.local before seeding.",
    );
  }

  // ── admin user (upsert by email) ──
  const passwordHash = await bcrypt.hash(password, 12);
  const existingUser = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, email))
    .limit(1);
  if (existingUser.length === 0) {
    await db.insert(schema.adminUsers).values({ email, passwordHash });
    console.log(`OK  created admin user ${email}`);
  } else {
    await db
      .update(schema.adminUsers)
      .set({ passwordHash })
      .where(eq(schema.adminUsers.email, email));
    console.log(`OK  updated password for ${email}`);
  }

  // ── settings singleton (id = 1) ──
  const existingSettings = await db
    .select()
    .from(schema.settings)
    .where(eq(schema.settings.id, 1))
    .limit(1);
  if (existingSettings.length === 0) {
    await db.insert(schema.settings).values({
      id: 1,
      businessName: "Demo Beauty Studio",
      brandDescription: "Hair, braids & treatments — by appointment.",
    });
    console.log("OK  created settings singleton");
  } else {
    console.log("-   settings singleton already exists");
  }

  // ── demo services (upsert by slug) ──
  for (const svc of DEMO_SERVICES) {
    const existing = await db
      .select()
      .from(schema.services)
      .where(eq(schema.services.slug, svc.slug))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(schema.services).values(svc);
      console.log(`OK  service: ${svc.title}`);
    } else {
      await db
        .update(schema.services)
        .set({ ...svc, updatedAt: new Date() })
        .where(eq(schema.services.slug, svc.slug));
      console.log(`-   service updated: ${svc.title}`);
    }
  }

  console.log("\nSeed complete.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
