import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { HEROUI_V3_THEME_CLASS } from "@laboratoire/ui";
import { getDateWithOffset } from "../lib/date";
import { Providers } from "./Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web Next | Booking Checkout Engine",
  description:
    "Production-style Next.js booking and checkout flow with protected routes and pricing rules.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const seedDate = getDateWithOffset(7);
  const seedQuery = new URLSearchParams({
    slug: "rome-night-food-tour",
    guests: "2",
    date: seedDate,
  }).toString();

  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

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
      className={HEROUI_V3_THEME_CLASS}
      style={{ colorScheme: "dark" }}
    >
      <body>
        <Providers>
          <div className="app-shell">
            {!isAdmin && (
              <nav className="app-nav">
                <div className="app-nav__content">
                  <Link href="/" className="brand">
                    web-<span>next</span>
                  </Link>
                  <div className="nav-links">
                    <Link href="/">Listing</Link>
                    <Link href={`/cart?${seedQuery}`}>
                      Cart
                    </Link>
                    <Link href={`/checkout?${seedQuery}`}>
                      Checkout
                    </Link>
                    <Link href={`/login?next=${encodeURIComponent(`/checkout?${seedQuery}`)}`}>
                      Login
                    </Link>
                  </div>
                </div>
              </nav>
            )}
            <main className="app-main">{children}</main>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
