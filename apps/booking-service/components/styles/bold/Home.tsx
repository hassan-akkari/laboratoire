import Link from "next/link";
import { ArrowRight, CalendarCheck, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/FadeUp";
import { StaggerItem, StaggerList } from "@/components/motion/StaggerList";
import { ShimmerText } from "./ShimmerText";

// Public landing — bold-modern. Space Grotesk display type (via `font-display`),
// one decisive violet accent moment (the hero stat panel), asymmetric hero grid.
// The React Bits hero effect is the animated <ShimmerText> sweep on the accent
// line. `.theme-bold` repoints `--font-heading` to Space Grotesk.

const STEPS = [
  {
    title: "Browse the catalogue",
    body: "See every service with transparent pricing and realistic durations — no hidden fees.",
    icon: Sparkles,
  },
  {
    title: "Send a booking request",
    body: "Pick a service and tell us when works for you. It takes well under a minute.",
    icon: CalendarCheck,
  },
  {
    title: "Get confirmed",
    body: "We review the request and lock in your slot. You will hear back quickly.",
    icon: Clock,
  },
] as const;

export function Home() {
  return (
    <div className="theme-bold flex min-h-dvh flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-tight focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
          >
            Salon<span className="text-primary">.</span>
          </Link>
          <Button asChild variant="ghost" size="lg">
            <Link href="/services">Services</Link>
          </Button>
        </div>
      </header>

      <main id="main" className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section
          aria-labelledby="hero-heading"
          className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28"
        >
          <FadeUp>
            <p className="inline-flex items-center gap-2 rounded-4xl bg-primary/10 px-3 py-1 text-sm font-semibold tracking-wide text-primary">
              <Sparkles className="size-3.5" aria-hidden="true" />
              High-end beauty &amp; hair studio
            </p>
            <h1
              id="hero-heading"
              className="font-display mt-6 text-5xl font-bold leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl"
            >
              Looking sharp
              <br />
              <ShimmerText>starts here.</ShimmerText>
            </h1>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted-foreground">
              Precision cuts, expert braiding and restorative treatments —
              booked in seconds. Browse the full catalogue, send a request, and
              we will lock in your slot.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-12 px-6 text-base">
                <Link href="/services">
                  Browse services
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 px-6 text-base"
              >
                <Link href="/services#categories">See what we do</Link>
              </Button>
            </div>
          </FadeUp>

          {/* Decisive violet accent moment: a bold gradient stat panel. */}
          <FadeUp
            delay={0.18}
            className="relative overflow-hidden rounded-4xl bg-primary p-8 text-primary-foreground shadow-xl sm:p-10"
          >
            <div
              role="img"
              aria-label="Studio highlights: over twelve hundred bookings, a 4.9 out of 5 average rating, and same-week availability."
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-white/10 blur-2xl"
              />
              <dl className="relative grid gap-8">
                <div>
                  <dt className="text-sm font-medium uppercase tracking-widest text-primary-foreground/80">
                    Bookings made
                  </dt>
                  <dd className="font-display nums-tabular mt-1 text-5xl font-bold tracking-tight">
                    1,200+
                  </dd>
                </div>
                <div className="grid grid-cols-2 gap-6 border-t border-white/20 pt-8">
                  <div>
                    <dt className="text-sm font-medium uppercase tracking-widest text-primary-foreground/80">
                      Avg. rating
                    </dt>
                    <dd className="font-display nums-tabular mt-1 text-3xl font-bold tracking-tight">
                      4.9 / 5
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium uppercase tracking-widest text-primary-foreground/80">
                      Availability
                    </dt>
                    <dd className="font-display mt-1 text-3xl font-bold tracking-tight">
                      This week
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </FadeUp>
        </section>

        {/* ── How it works ────────────────────────────────────────────── */}
        <section aria-labelledby="steps-heading" className="border-t bg-muted/40">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2
              id="steps-heading"
              className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Three steps to booked
            </h2>
            <p className="mt-3 max-w-prose text-muted-foreground">
              No accounts, no phone tag. The whole flow is built to get you in
              the chair faster.
            </p>
            <StaggerList
              as="ol"
              className="mt-12 grid gap-6 sm:grid-cols-3"
            >
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <StaggerItem
                    as="li"
                    key={step.title}
                    className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
                      >
                        <Icon className="size-5" />
                      </span>
                      <span className="font-display nums-tabular text-sm font-semibold text-muted-foreground">
                        Step {i + 1}
                      </span>
                    </div>
                    <h3 className="font-display mt-5 text-xl font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </StaggerItem>
                );
              })}
            </StaggerList>
          </div>
        </section>
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
