import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import {
  Fraunces,
  Inter,
  Playfair_Display,
  Space_Grotesk,
} from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { StyleSwitcher } from "@/components/StyleSwitcher";
import { DemoModeBanner } from "@/components/DemoModeBanner";
import { dbReady } from "@/lib/db/client";
import { getStyle } from "@/lib/style";

// All three competing designs ship together. To avoid a font-variable collision
// (editorial wanted `--font-serif`; warm AND bold both wanted `--font-display`),
// every display face gets its OWN namespaced variable. Each variant's components
// opt into their own face via the `font-editorial` / `font-warm` /
// `font-bold-display` utilities (registered in globals.css `@theme inline`).

// Body type: a clean, legible humanist sans (shared across all variants).
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// Editorial — high-contrast magazine serif.
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
});

// Warm — a characterful serif. `opsz` + `SOFT` optical axes give a tactile,
// editorial-spa feel. NOTE: next/font forbids pinning `weight` when `axes` is
// set (the variable font supplies the full weight range), so weight is omitted.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-warm",
  axes: ["opsz", "SOFT"],
});

// Bold — geometric, confident display face.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-bold-display",
  weight: ["500", "600", "700"],
});

// Reads request state (DB, cookies, server actions) → render dynamically.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Booking Service",
  description:
    "A generic service-booking app: public catalogue, booking requests, and an admin dashboard. Seeded here with a beauty/hair demo.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  // Read the active variant once at the layout level so the switcher can mount
  // pre-selected on every page.
  const style = await getStyle();

  return (
    <html
      lang="en"
      className={cn(
        "font-sans",
        inter.variable,
        playfair.variable,
        fraunces.variable,
        spaceGrotesk.variable,
      )}
    >
      <body className="min-h-dvh">
        {children}
        <StyleSwitcher active={style} />
        {/* Public-surface demo notice — only when no DB is connected. The
            component self-hides on /admin (which has its own setup cards). */}
        {!dbReady ? <DemoModeBanner /> : null}
        <Toaster />
      </body>
    </html>
  );
}
