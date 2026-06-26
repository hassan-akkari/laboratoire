import Link from "next/link";
import type { Service } from "@/lib/db/schema";
import { formatDuration, formatPriceRange } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { FadeUp } from "@/components/motion/FadeUp";
import { BookingFormFields } from "@/components/booking/BookingFormFields";

// Editorial-elegant booking page. Mirrors the editorial Home/Services look:
// serif display (`font-editorial`), generous whitespace, hairline rules, quiet
// uppercase eyebrows. `.theme-editorial` repoints `--font-heading` so the
// shared form's CardTitle/heading slots pick up Playfair too.
export function Book({
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

        <p className="mt-8 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-primary">
          <span aria-hidden className="h-px w-8 bg-primary/60" />
          Booking request
        </p>

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

        {service.description ? (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
            {service.description}
          </p>
        ) : null}

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
          {service.category ? (
            <SummaryItem label="Category">{service.category}</SummaryItem>
          ) : null}
        </dl>
      </FadeUp>

      <FadeUp delay={0.1} className="mt-14">
        <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-primary">
          <span aria-hidden className="h-px w-8 bg-primary/60" />
          Your details
        </p>
        <h2 className="mt-4 font-editorial text-2xl font-medium tracking-tight sm:text-3xl">
          Request an appointment
        </h2>
        <p className="mt-3 mb-10 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
          Choose a date that suits you and tell us how to reach you. There&rsquo;s
          no deposit to enquire — we&rsquo;ll confirm a time by hand.
        </p>
        <BookingFormFields
          serviceSlug={service.slug}
          serviceTitle={service.title}
          styles={{
            // Editorial = airy + hairline. Inputs read as fine rules, not
            // boxes: a near-square corner, a quiet hairline border that
            // firms up to a thin ring on focus, and roomy vertical rhythm.
            formClassName: "gap-7",
            controlClassName:
              "h-12 rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:border-foreground focus-visible:ring-0 aria-invalid:border-destructive aria-invalid:ring-0",
            datePickerTriggerClassName:
              "h-12 rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none hover:bg-transparent focus-visible:border-foreground focus-visible:ring-0 aria-expanded:bg-transparent",
            submitClassName:
              "mt-2 h-12 rounded-none text-sm font-medium uppercase tracking-[0.18em]",
            panelClassName: "rounded-none border-x-0 border-b-0 border-t px-0",
          }}
        />
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
