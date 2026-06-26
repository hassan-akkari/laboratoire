import Link from "next/link";
import type { ReactNode } from "react";
import { getDateWithOffset } from "@/lib/date";

/**
 * Booking-demo chrome.
 *
 * Wraps every parked booking route (`/browse`, `/experiences/*`, `/cart`,
 * `/checkout`, `/confirmation/*`, `/login`) with the demo nav + the `.app-main`
 * content column. Rendering `.app-nav` as a sibling of `.app-main` (both inside
 * the root `.app-shell`) reproduces the original booking layout exactly, while
 * scoping it to this route group — so the nav is structurally absent from
 * `/admin` and the apex redirect with no `x-pathname` / `isAdmin` check.
 *
 * The apex `/` redirects to `/admin`; the booking demo's own landing page is
 * `/browse` (the experiences listing), which the brand + "Listing" links target.
 */
export default function BookingDemoLayout({
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

  return (
    <>
      <nav className="app-nav">
        <div className="app-nav__content">
          <Link href="/browse" className="brand">
            Cam<span>mino</span>
          </Link>
          <div className="nav-links">
            <Link href="/browse">Listing</Link>
            <Link href={`/cart?${seedQuery}`}>Cart</Link>
            <Link href={`/checkout?${seedQuery}`}>Checkout</Link>
            <Link
              href={`/login?next=${encodeURIComponent(`/checkout?${seedQuery}`)}`}
            >
              Login
            </Link>
          </div>
        </div>
      </nav>
      <main className="app-main">{children}</main>
    </>
  );
}
