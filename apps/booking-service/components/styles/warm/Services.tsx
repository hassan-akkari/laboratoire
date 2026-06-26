import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import type { Service } from "@/lib/db/schema";
import { formatDuration, formatPriceRange } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FadeUp } from "@/components/motion/FadeUp";
import { StaggerItem, StaggerList } from "@/components/motion/StaggerList";

// Warm-luxe "Atelier de Beauté" services view. Data arrives as props (fetched
// once by the page). Presentation matches the warm design: cream canvas, tinted
// cards, rounded pill CTAs. Card entrance uses the framer-motion StaggerList;
// hover lift stays on the CSS `.warm-lift` (cheap, composited, reduced-motion
// safe). `.theme-warm` repoints `--font-heading` to Fraunces.

// Map a free-text category to one of the warm card-tint classes (in globals.css).
// Unknown categories fall back to a soft plum wash.
function tintFor(category: string | null): string {
  switch (category?.toLowerCase()) {
    case "hair":
      return "warm-tint-hair";
    case "braids":
      return "warm-tint-braids";
    case "treatment":
      return "warm-tint-treatment";
    default:
      return "warm-tint-default";
  }
}

export function Services({
  services,
  dbReady,
}: {
  services: Service[];
  dbReady: boolean;
}) {
  return (
    <main className="theme-warm warm-canvas min-h-dvh">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <FadeUp as="header" className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-(--warm-ink-soft) transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Home
          </Link>

          <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            The Menu
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-4xl font-medium tracking-tight text-(--warm-ink) sm:text-5xl">
              Treat yourself
            </h1>
            {!dbReady ? <Badge variant="secondary">demo data</Badge> : null}
          </div>

          <p className="mt-3 max-w-prose text-lg leading-relaxed text-(--warm-ink-soft)">
            Browse what&rsquo;s on offer, then send a booking request —
            we&rsquo;ll confirm a time that suits you.
          </p>
        </FadeUp>

        {services.length === 0 ? (
          <EmptyNotice />
        ) : (
          <StaggerList
            as="ul"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((s) => (
              <StaggerItem as="li" key={s.id}>
                <Card
                  className={`warm-lift relative h-full border-(--warm-line) ring-foreground/5 ${tintFor(
                    s.category,
                  )}`}
                >
                  <CardHeader>
                    {s.category ? (
                      <Badge
                        variant="outline"
                        className="mb-2 w-fit border-(--warm-line) bg-[color-mix(in_oklch,var(--warm-cream),transparent_20%)] text-(--warm-ink-soft)"
                      >
                        <Tag className="size-3" aria-hidden="true" />
                        {s.category}
                      </Badge>
                    ) : null}
                    <CardTitle className="text-xl text-(--warm-ink)">
                      {s.title}
                    </CardTitle>
                    {s.description ? (
                      <CardDescription className="line-clamp-3 text-(--warm-ink-soft)">
                        {s.description}
                      </CardDescription>
                    ) : null}
                  </CardHeader>

                  <CardContent className="mt-auto">
                    <div className="flex items-end justify-between gap-3 border-t border-(--warm-line) pt-4">
                      <span className="font-heading text-2xl font-medium text-(--warm-ink)">
                        {formatPriceRange(s.priceFromCents, s.priceToCents)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-(--warm-ink-soft)">
                        <Clock className="size-4" aria-hidden="true" />
                        {formatDuration(s.durationMin)}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="flex-col items-stretch gap-2.5 bg-transparent">
                    <Button
                      asChild
                      className="h-11 w-full rounded-full text-base shadow-[0_10px_24px_-12px_oklch(0.457_0.24_277/55%)]"
                    >
                      <Link href={`/book/${s.slug}`}>
                        Book {s.title.toLowerCase()}
                      </Link>
                    </Button>
                    {/* Sibling link (not nested) to the detail page — soft warm
                        idiom. Unique accessible name per card. */}
                    <Link
                      href={`/services/${s.slug}`}
                      aria-label={`View details for ${s.title}`}
                      className="rounded-full py-1 text-center text-sm font-medium text-(--warm-ink-soft) transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      View details
                    </Link>
                  </CardFooter>
                </Card>
              </StaggerItem>
            ))}
          </StaggerList>
        )}
      </div>
    </main>
  );
}

function EmptyNotice() {
  return (
    <div className="rounded-2xl border border-dashed border-(--warm-line) bg-[color-mix(in_oklch,var(--warm-cream),transparent_25%)] p-10 text-center">
      <h2 className="font-heading text-xl font-medium text-(--warm-ink)">
        No services yet
      </h2>
      <p className="mt-2 text-sm text-(--warm-ink-soft)">
        Run{" "}
        <code className="rounded bg-[color-mix(in_oklch,var(--warm-sand),transparent_20%)] px-1.5 py-0.5 font-mono text-(--warm-ink)">
          pnpm -F booking-service db:seed
        </code>{" "}
        to load the demo catalogue, or add services from the admin dashboard.
      </p>
    </div>
  );
}
