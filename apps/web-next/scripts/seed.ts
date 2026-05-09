import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, schema } from "../lib/db/client";

async function seed() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const existingUser = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (existingUser.length === 0) {
    await db.insert(schema.users).values({ email, passwordHash });
    console.log(`OK Created admin user ${email}`);
  } else {
    await db
      .update(schema.users)
      .set({ passwordHash })
      .where(eq(schema.users.email, email));
    console.log(`OK Updated password for ${email}`);
  }

  const existingConfig = await db
    .select()
    .from(schema.siteConfig)
    .where(eq(schema.siteConfig.id, 1))
    .limit(1);

  if (existingConfig.length === 0) {
    await db.insert(schema.siteConfig).values({
      id: 1,
      phone: "",
      contactEmail: email,
      notifyEmail: null,
    });
    console.log("OK Created site_config singleton row");
  } else {
    console.log("- site_config singleton already exists");
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
