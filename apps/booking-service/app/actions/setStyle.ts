"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  DEFAULT_STYLE,
  parseStyle,
  STYLE_COOKIE,
  type StyleVariant,
} from "@/lib/style-shared";

// Server Action invoked by the StyleSwitcher. Writes the chosen design variant
// to the cookie, then revalidates the whole layout so the next render (the
// router.refresh() the client triggers) renders the new variant immediately.
//
// httpOnly is intentionally false: the value is a purely cosmetic UI preference,
// not a secret, and keeping it readable lets a future client-only path (set
// cookie + refresh, no round-trip) work too. path "/" so it applies app-wide.
export async function setStyle(variant: StyleVariant): Promise<void> {
  // Re-validate on the server: never trust the client to send a valid enum.
  const safe = parseStyle(variant) ?? DEFAULT_STYLE;

  const store = await cookies();
  store.set(STYLE_COOKIE, safe, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year — remember the visitor's pick
  });

  // Layout-level revalidation: every route re-reads getStyle() on next render.
  revalidatePath("/", "layout");
}
