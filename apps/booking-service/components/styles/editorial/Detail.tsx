import Link from "next/link";
import type { Service } from "@/lib/db/schema";
import { formatDuration, formatPriceRange } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/FadeUp";

// Editorial-elegant service-detail page. Mirrors the editorial Home/Services/Book
// look: serif display (`font-editorial`), generous whitespace, hairline rules,
// quiet uppercase eyebrows. Category renders as a bare uppercase span (editorial's
// own idiom — NOT a Badge), the full description is shown (this is the detail
// page, no line-clamp), and the image is framed by a hairline border.
// `.theme-editorial` repoints `--font-heading` so any shadcn heading slots pick
// up Playfair too.
export function Detail({
  service,
  dbReady,
}: {
  service: Service;
  dbReady: boolean;
}) {
  return (
    <main className="theme-editorial mx-auto max-w-3xl px-6 py-16 sm:px-10 sm:py-24">
      <FadeUp className="border-b pb-10">
        <Link
          href="/services"
          className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          ← The Menu
        </Link>

        {service.category ? (
          <p className="mt-8 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-primary">
            <span aria-hidden className="h-px w-8 bg-primary/60" />
            {service.category}
          </p>
        ) : (
          <p className="mt-8 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-primary">
            <span aria-hidden className="h-px w-8 bg-primary/60" />
            From the menu
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-2">
          <h1 className="font-editorial text-4xl leading-tight font-medium tracking-tight text-balance sm:text-5xl">
            {service.title}
          </h1>
          {!dbReady ? (
            <Badge variant="secondary" className="mb-1.5">
              demo data
            </Badge>
          ) : null}
        </div>

        <dl className="mt-8 flex flex-wrap items-baseline gap-x-10 gap-y-3">
          <SummaryItem label="From">
            <span className="font-editorial text-lg tracking-tight tabular-nums">
              {formatPriceRange(service.priceFromCents, service.priceToCents)}
            </span>
          </SummaryItem>
          <SummaryItem label="Duration">
            <span className="tabular-nums">
              {formatDuration(service.durationMin)}
            </span>
          </SummaryItem>
        </dl>
      </FadeUp>

      {service.imageUrl ? (
        <FadeUp delay={0.08} className="mt-14">
          {/* Plain <img> (not next/image): no images config is wired, so a
              remote URL would 500 under next/image. width/height + the
              aspect-ratio wrapper reserve space to avoid CLS. */}
          <div className="aspect-[3/2] overflow-hidden border border-foreground/[0.08]">
            <img
              src={service.imageUrl}
              alt={service.title}
              width={1200}
              height={800}
              loading="lazy"
              className="h-full w-full max-w-full object-cover"
            />
          </div>
        </FadeUp>
      ) : null}

      {service.description ? (
        <FadeUp delay={0.12} className="mt-14">
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-primary">
            <span aria-hidden className="h-px w-8 bg-primary/60" />
            About this service
          </p>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-foreground/90 text-pretty">
            {service.description}
          </p>
        </FadeUp>
      ) : null}

      <FadeUp delay={0.16} className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t pt-10">
        <Button asChild size="lg" className="px-7">
          <Link href={`/book/${service.slug}`}>Request booking</Link>
        </Button>
        <Button asChild variant="link" size="lg" className="px-0">
          <Link href="/services">All services</Link>
        </Button>
      </FadeUp>
    </main>
  );
}

function SummaryItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-foreground/90">{children}</dd>
    </div>
  );
}
