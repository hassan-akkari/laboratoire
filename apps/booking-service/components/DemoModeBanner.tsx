"use client";

import { usePathname } from "next/navigation";
import { Database } from "lucide-react";

// Site-wide demo-mode notice for the PUBLIC surface. Rendered by the root layout
// (which passes `dbReady`); the admin pages already show their own per-page
// "Database not configured" cards, so this self-hides on /admin routes — the
// same rule the floating StyleSwitcher uses.
//
// Why a dedicated banner: each design variant already shows a tiny inline
// "demo data" Badge, but that is easy to miss. On a live portfolio deployment a
// visitor might submit the booking form and not realise the request was
// validated but never stored. This banner states the three facts plainly,
// once, without fighting the StyleSwitcher (top-right): it sits at the bottom,
// centered, and is intentionally low-key so it stays portfolio-safe.
//
// It is a tiny client component ONLY so it can read the pathname to self-hide on
// /admin (mirroring StyleSwitcher). It holds no state and fetches nothing.
//
// `print:hidden` mirrors the StyleSwitcher so neither shows up in screenshots
// taken via the browser's print/PDF path.
export function DemoModeBanner() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 print:hidden">
      <div
        role="status"
        className="pointer-events-auto flex max-w-xl items-start gap-3 rounded-xl border border-border bg-background/85 px-4 py-3 text-left shadow-lg ring-1 ring-foreground/5 backdrop-blur-md supports-backdrop-filter:bg-background/70"
      >
        <span
          aria-hidden="true"
          className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <Database className="size-4" />
        </span>
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">
            Demo mode — no database connected
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Services shown are sample data, and booking requests are validated
            but <span className="font-medium text-foreground">not stored</span>.
            This is intentional for the public demo. Connect{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.7rem]">
              DATABASE_URL
            </code>{" "}
            to go live.
          </p>
        </div>
      </div>
    </div>
  );
}
