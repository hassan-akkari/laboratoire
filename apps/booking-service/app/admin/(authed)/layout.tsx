import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdminSession } from "@/lib/adminSession";
import { LogoutButton } from "./LogoutButton";

// The REAL gate for every page in the (authed) group. Middleware only checks
// cookie PRESENCE; this layout unseals + validates the session server-side and
// redirects to /admin/login when it is missing/invalid. Defence in depth: never
// trust middleware alone.
export default async function AdminAuthedLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdminSession();

  return (
    <div className="min-h-dvh bg-muted/20">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-5">
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-sm text-sm font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary text-[0.7rem] font-bold text-primary-foreground">
                B
              </span>
              <span>
                Booking
                <span className="text-muted-foreground"> · Admin</span>
              </span>
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link
                href="/admin"
                className="rounded-md px-2 py-1 text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                Bookings
              </Link>
              <Link
                href="/admin/services"
                className="rounded-md px-2 py-1 text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                Services
              </Link>
            </nav>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
