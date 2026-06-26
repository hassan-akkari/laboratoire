"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_OPTIONS,
  sealAdminSession,
} from "@/lib/adminSession";
import { db, dbReady, schema } from "@/lib/db/client";

// Server Action login. The client form (app/admin/login/LoginForm.tsx) calls
// this via useActionState — the documented "import the action function"
// pattern. All server-only modules (adminSession, db) stay on the server.
//
// SECURITY:
//  - Generic failure message ("Invalid email or password") for EVERY failure
//    mode (bad payload, unknown email, wrong password) → no user enumeration.
//  - Constant-ish path: when the email is unknown we still run a bcrypt.compare
//    against a fixed dummy hash, so a missing user and a wrong password take
//    roughly the same time (mitigates timing-based enumeration).
//  - Password is never logged; only bcrypt hashes are compared.
//  - The session secret lives in ADMIN_SESSION_SECRET (read inside sealData),
//    never here, never sent to the client.

export type LoginState = { error: string | null };

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

const GENERIC_ERROR = "Invalid email or password";

// A real bcrypt hash (of a random throwaway string) used as the comparison
// target when no user row exists, so the failure path still spends time in
// bcrypt.compare rather than returning early. Value is irrelevant — it must
// simply never match a real password.
const DUMMY_HASH = "$2b$12$C6UzMDM.H6dfI/f/IKcEeO3Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Zu";

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: GENERIC_ERROR };
  }
  const { email, password } = parsed.data;

  let userId: string | null = null;

  try {
    // === DEV-ONLY ESCAPE HATCH (mirrors web-next's DEV_NO_DB idea) ===
    // Only when there is NO database AND we are not in production: authenticate
    // against ADMIN_EMAIL + ADMIN_PASSWORD directly so the auth wiring can be
    // exercised before Neon is provisioned. Production / a configured DB always
    // takes the real bcrypt-vs-booking_admin_users path below.
    if (!dbReady && process.env.NODE_ENV !== "production") {
      const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const expectedPassword = process.env.ADMIN_PASSWORD;
      // Spend time in bcrypt regardless, to keep the timing profile flat
      // (the result is intentionally unused — the env compare below decides).
      await bcrypt.compare(password, DUMMY_HASH);
      if (
        !expectedEmail ||
        !expectedPassword ||
        email.toLowerCase() !== expectedEmail ||
        password !== expectedPassword
      ) {
        return { error: GENERIC_ERROR };
      }
      userId = "dev-no-db-user";
    } else {
      // === PRIMARY PATH: bcrypt vs booking_admin_users (Drizzle `adminUsers`) ===
      const rows = await db
        .select()
        .from(schema.adminUsers)
        .where(eq(schema.adminUsers.email, email))
        .limit(1);
      const user = rows[0];

      // Constant-ish: compare against the row's hash, or a dummy hash when the
      // email is unknown. Either way bcrypt.compare runs once.
      const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
      if (!user || !ok) {
        return { error: GENERIC_ERROR };
      }
      userId = user.id;
    }
  } catch (err) {
    // Never leak raw DB/driver errors to the client.
    console.error("[booking-service] loginAction failed:", err);
    return { error: "Something went wrong. Please try again." };
  }

  // Success: seal the session + set the cookie, THEN redirect. `redirect()`
  // throws NEXT_REDIRECT internally, so it MUST sit outside the try/catch above
  // (otherwise the catch would swallow the control-flow throw).
  const sealed = await sealAdminSession({ userId });
  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, sealed, ADMIN_COOKIE_OPTIONS);
  redirect("/admin");
}
