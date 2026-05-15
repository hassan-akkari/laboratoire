import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { getDateWithOffset } from "../lib/date";
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

  return (
    <html lang="en">
      <body>
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
        <Analytics />
      </body>
    </html>
  );
}
