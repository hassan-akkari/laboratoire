import Link from "next/link";
import { ArrowLeft, Clock, Heart, Tag } from "lucide-react";
import type { Service } from "@/lib/db/schema";
import { formatDuration, formatPriceRange } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { FadeUp } from "@/components/motion/FadeUp";
import { BookingFormFields } from "@/components/booking/BookingFormFields";

// Warm-luxe "Atelier de Beauté" booking page. Mirrors the warm Home/Services
// look: cream canvas, soft gradient hero card, Fraunces display via
// `.theme-warm` → `--font-heading`, rounded pill controls, warm-neutral lines.
export function Book({
  service,
  dbReady,
}: {
  service: Service;
  dbReady: boolean;
}) {
  return (
    <main className="theme-warm warm-canvas min-h-dvh">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <FadeUp as="header" className="mb-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-(--warm-ink-soft) transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            The Menu
          </Link>

          <p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            <Heart className="size-3.5" aria-hidden="true" />
            Booking request
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-4xl font-medium tracking-tight text-(--warm-ink) sm:text-5xl">
              {service.title}
            </h1>
            {!dbReady ? <Badge variant="secondary">demo data</Badge> : null}
          </div>

          {service.description ? (
            <p className="mt-3 max-w-prose text-lg leading-relaxed text-(--warm-ink-soft)">
              {service.description}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="font-heading text-2xl font-medium text-(--warm-ink)">
              {formatPriceRange(service.priceFromCents, service.priceToCents)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-(--warm-line) bg-[color-mix(in_oklch,var(--warm-cream),transparent_20%)] px-3 py-1 text-sm text-(--warm-ink-soft)">
              <Clock className="size-4" aria-hidden="true" />
              {formatDuration(service.durationMin)}
            </span>
            {service.category ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-(--warm-line) bg-[color-mix(in_oklch,var(--warm-cream),transparent_20%)] px-3 py-1 text-sm text-(--warm-ink-soft)">
                <Tag className="size-3.5" aria-hidden="true" />
                {service.category}
              </span>
            ) : null}
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="warm-hero relative overflow-hidden rounded-[2rem] border border-(--warm-line) px-6 py-8 shadow-[0_30px_70px_-40px_oklch(0.45_0.08_30/35%)] sm:px-10 sm:py-10">
            <p className="mb-7 max-w-prose leading-relaxed text-(--warm-ink-soft)">
              No card needed — send a request and we&rsquo;ll hold a quiet,
              unhurried chair just for you.
            </p>
            <BookingFormFields
              serviceSlug={service.slug}
              serviceTitle={service.title}
              styles={{
                controlClassName:
                  "border-(--warm-line) bg-[color-mix(in_oklch,var(--warm-cream),transparent_25%)] text-(--warm-ink) placeholder:text-(--warm-ink-soft)/70 rounded-xl",
                submitClassName:
                  "rounded-full shadow-[0_12px_30px_-12px_oklch(0.457_0.24_277/55%)]",
                panelClassName:
                  "border-(--warm-line) bg-[color-mix(in_oklch,var(--warm-cream),transparent_20%)]",
              }}
            />
          </div>
        </FadeUp>
      </div>
    </main>
  );
}
