import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
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
import { HoverLift } from "@/components/motion/HoverLift";

// Bold-modern services view. Data arrives as props (fetched once by the page).
// Categories are a pure transform of the already-fetched rows — no extra fetch.
// `.theme-bold` repoints `--font-heading` (CardTitle) to Space Grotesk.
export function Services({
  services,
  dbReady,
}: {
  services: Service[];
  dbReady: boolean;
}) {
  // Derive the distinct categories present for a quick scan strip.
  const categories = [
    ...new Set(
      services.map((s) => s.category).filter((c): c is string => Boolean(c)),
    ),
  ];

  return (
    <div className="theme-bold flex min-h-dvh flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Home
          </Link>
          <span className="font-display text-lg font-bold tracking-tight">
            Salon<span className="text-primary">.</span>
          </span>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
        {/* ── Page intro ───────────────────────────────────────────────── */}
        <FadeUp className="max-w-2xl">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Services
            </h1>
            {!dbReady ? (
              <Badge variant="secondary" className="translate-y-0.5">
                demo data
              </Badge>
            ) : null}
          </div>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Browse what&rsquo;s on offer — transparent pricing, honest durations
            — then send a booking request.
          </p>
        </FadeUp>

        {categories.length > 0 ? (
          <nav
            id="categories"
            aria-label="Service categories"
            className="mt-8 scroll-mt-24"
          >
            <ul className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c}>
                  <Badge variant="outline">{c}</Badge>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {/* ── Catalogue ────────────────────────────────────────────────── */}
        {services.length === 0 ? (
          <EmptyNotice />
        ) : (
          <StaggerList
            as="ul"
            aria-label="Available services"
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((s) => (
              <StaggerItem as="li" key={s.id}>
                <ServiceCard service={s} />
              </StaggerItem>
            ))}
          </StaggerList>
        )}
      </main>
    </div>
  );
}

function ServiceCard({ service: s }: { service: Service }) {
  // Spring hover lift via the motion island (reduced-motion safe).
  return (
    <HoverLift className="h-full">
      <Card className="group/service h-full transition-shadow duration-200 ease-out hover:shadow-lg">
        <CardHeader>
          {s.category ? (
            <Badge variant="outline" className="mb-2 w-fit">
              {s.category}
            </Badge>
          ) : null}
          <CardTitle className="text-lg leading-tight">{s.title}</CardTitle>
          {s.description ? (
            <CardDescription className="line-clamp-3 leading-relaxed">
              {s.description}
            </CardDescription>
          ) : null}
        </CardHeader>

        <CardContent className="mt-auto flex items-end justify-between gap-3">
          <p className="font-display nums-tabular text-2xl font-bold tracking-tight">
            {formatPriceRange(s.priceFromCents, s.priceToCents)}
          </p>
          <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-4" aria-hidden="true" />
            <span className="nums-tabular">{formatDuration(s.durationMin)}</span>
          </p>
        </CardContent>

        <CardFooter>
          <Button asChild size="lg" className="h-11 w-full text-base">
            {/* Visible label stays decisive ("Book"); the aria-label disambiguates
                for screen readers so each card's link has a unique, clear name. */}
            <Link href={`/book/${s.slug}`} aria-label={`Book ${s.title}`}>
              <span aria-hidden="true">Book</span>
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </HoverLift>
  );
}

function EmptyNotice() {
  return (
    <div className="mt-12 rounded-2xl border border-dashed bg-card p-10 text-center text-card-foreground">
      <h2 className="font-display text-xl font-semibold tracking-tight">
        No services yet
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Run <code className="font-mono">pnpm -F booking-service db:seed</code> to
        load the demo catalogue, or add services from the admin dashboard.
      </p>
    </div>
  );
}
