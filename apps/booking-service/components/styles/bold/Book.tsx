import Link from "next/link";
import { ArrowLeft, Clock, Sparkles, Tag } from "lucide-react";
import type { Service } from "@/lib/db/schema";
import { formatDuration, formatPriceRange } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { FadeUp } from "@/components/motion/FadeUp";
import { BookingFormFields } from "@/components/booking/BookingFormFields";

// Bold-modern booking page. Mirrors the bold Home/Services look: Space Grotesk
// display (`font-display`), header/footer chrome, a decisive violet accent
// panel, asymmetric two-column layout. `.theme-bold` repoints `--font-heading`.
export function Book({
  service,
  dbReady,
}: {
  service: Service;
  dbReady: boolean;
}) {
  return (
    <div className="theme-bold flex min-h-dvh flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Services
          </Link>
          <span className="font-display text-lg font-bold tracking-tight">
            Salon<span className="text-primary">.</span>
          </span>
        </div>
      </header>

      <main
        id="main"
        className="mx-auto grid w-full max-w-6xl flex-1 gap-12 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:py-20"
      >
        {/* ── Service summary: the decisive violet accent moment ──────────── */}
        <FadeUp className="lg:sticky lg:top-20">
          <p className="inline-flex items-center gap-2 rounded-4xl bg-primary/10 px-3 py-1 text-sm font-semibold tracking-wide text-primary">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Booking request
          </p>
          <h1 className="font-display mt-6 text-4xl font-bold leading-[0.95] tracking-tight text-balance sm:text-5xl">
            {service.title}
          </h1>
          {!dbReady ? (
            <Badge variant="secondary" className="mt-4">
              demo data
            </Badge>
          ) : null}
          {service.description ? (
            <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted-foreground">
              {service.description}
            </p>
          ) : null}

          <div className="mt-8 overflow-hidden rounded-4xl bg-primary p-7 text-primary-foreground shadow-xl">
            <dl className="grid gap-6">
              <div>
                <dt className="text-sm font-medium uppercase tracking-widest text-primary-foreground/80">
                  Price from
                </dt>
                <dd className="font-display nums-tabular mt-1 text-4xl font-bold tracking-tight">
                  {formatPriceRange(
                    service.priceFromCents,
                    service.priceToCents,
                  )}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-6 border-t border-white/20 pt-6">
                <div>
                  <dt className="text-sm font-medium uppercase tracking-widest text-primary-foreground/80">
                    Duration
                  </dt>
                  <dd className="font-display mt-1 inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight">
                    <Clock className="size-5" aria-hidden="true" />
                    <span className="nums-tabular">
                      {formatDuration(service.durationMin)}
                    </span>
                  </dd>
                </div>
                {service.category ? (
                  <div>
                    <dt className="text-sm font-medium uppercase tracking-widest text-primary-foreground/80">
                      Category
                    </dt>
                    <dd className="font-display mt-1 inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight">
                      <Tag className="size-5" aria-hidden="true" />
                      {service.category}
                    </dd>
                  </div>
                ) : null}
              </div>
            </dl>
          </div>
        </FadeUp>

        {/* ── The shared booking form ──────────────────────────────────── */}
        <FadeUp delay={0.15}>
          <div className="rounded-4xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Send your request
            </h2>
            <p className="mt-2 mb-8 text-sm leading-relaxed text-muted-foreground">
              No accounts, no phone tag. Tell us when works and how to reach you
              — we&rsquo;ll lock in your slot.
            </p>
            <BookingFormFields
              serviceSlug={service.slug}
              serviceTitle={service.title}
              styles={{
                // Bold = confident, violet-forward. Slightly larger controls,
                // muted-fill inputs that snap to a strong violet focus ring,
                // a pill submit and a generously rounded popover.
                formClassName: "gap-6",
                controlClassName:
                  "h-12 rounded-xl border-transparent bg-muted/60 focus-visible:border-primary focus-visible:bg-background focus-visible:ring-primary/30",
                datePickerTriggerClassName:
                  "h-12 rounded-xl border-transparent bg-muted/60 hover:bg-muted focus-visible:border-primary focus-visible:bg-background focus-visible:ring-primary/30 aria-expanded:border-primary aria-expanded:bg-background",
                datePickerPopoverClassName: "rounded-2xl",
                submitClassName: "mt-1 h-12 rounded-4xl font-display font-semibold",
                panelClassName: "rounded-4xl",
              }}
            />
          </div>
        </FadeUp>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display font-semibold text-foreground">
            Salon<span className="text-primary">.</span>
          </p>
          <p>A generic service-booking engine · beauty &amp; hair demo.</p>
        </div>
      </footer>
    </div>
  );
}
