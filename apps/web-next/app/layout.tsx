import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { HEROUI_V3_THEME_CLASS } from "@laboratoire/ui";
import { Providers } from "./Providers";
import "./globals.css";

// This app is dynamic by nature: every surface reads request state at runtime
// (admin cookie gate + DB, booking-demo session cookie, server actions, the
// in-memory order store, and `searchParams`). Declaring the tree dynamic here
// makes that explicit. It also replaces the implicit whole-tree dynamic render
// the old root layout got as a side effect of calling `headers()` — without it,
// Next would try to statically prerender leaf pages (e.g. /admin/login) that
// rely on runtime-only client hooks.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cammino — Curated Rome experiences",
  description:
    "Hand-picked Rome experiences — food walks, skip-the-line entries, sunset rivers. Booked in seconds, confirmed instantly, priced with no surprises.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // ROOT LAYOUT = DOCUMENT SHELL ONLY (<html>/<body>/theme/providers + `.app-shell`
  // full-height column). Per-surface chrome and content wrappers live with their
  // routes:
  //   - booking nav + `.app-main` -> app/(booking-demo)/layout.tsx
  //   - admin topbar + `.admin-shell` -> app/admin/(authed)/layout.tsx
  //   - admin login `.stage-center` -> app/admin/login/page.tsx
  // This removes the old `x-pathname` / `isAdmin` runtime check: the booking nav
  // is structurally scoped to the booking route group and can never leak onto
  // admin pages or the apex redirect.
  //
  // THEME-FLASH MITIGATION BY CONSTRUCTION (VARIANT B):
  // The `.heroui-v3-warm` v3 theme scope is rendered on <html> by the SERVER, so
  // the very first HTML byte already carries the warm-token scope — no client
  // effect, no post-hydration class swap, no flash. `color-scheme: dark` is set
  // both inline on <html> (browser form-control/scrollbar painting before any CSS
  // loads) and by the scope's own `color-scheme: dark` rule. The existing
  // `--app-*` palette in globals.css `:root` is unconditional, so the background
  // paints warm immediately too.
  return (
    <html
      lang="en"
      // `dark` activates @heroui-v3/styles' dark NEUTRALS (--field-background,
      // --default, ... are gated behind `.dark`; without it v3 fields/secondary
      // surfaces fall back to the light :root => white inputs). The warm scope
      // (HEROUI_V3_THEME_CLASS) is imported AFTER themes/default, so its BRAND
      // overrides (--accent/--background/--surface/...) still win on top.
      className={`dark ${HEROUI_V3_THEME_CLASS}`}
      style={{ colorScheme: "dark" }}
    >
      <body>
        <Providers>
          <div className="app-shell">{children}</div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
