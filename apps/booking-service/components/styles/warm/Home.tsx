import Link from "next/link";
import { Heart, Leaf, Scissors, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/FadeUp";
import { AuroraBloom } from "./AuroraBloom";

// Marketing landing dressed as a high-end beauty salon. Warm-luxe ("Atelier de
// Beauté") aesthetic: cream canvas, soft gradient hero, Fraunces display
// headline (via `.theme-warm` → `font-heading`). The React Bits hero effect is
// the drifting <AuroraBloom> behind the hero card.

const featurePills = [
  { icon: Scissors, label: "Expert stylists" },
  { icon: Leaf, label: "Clean, calming space" },
  { icon: Sparkles, label: "Bespoke finishes" },
];

const trustSignals = [
  { stat: "4.9★", label: "From 600+ guests" },
  { stat: "12 yrs", label: "Crafting in studio" },
  { stat: "Same-day", label: "Booking requests" },
];

export function Home() {
  return (
    <main className="theme-warm warm-canvas relative min-h-dvh overflow-hidden">
      <section className="mx-auto flex min-h-dvh max-w-5xl flex-col justify-center px-6 py-20">
        <FadeUp className="warm-hero relative overflow-hidden rounded-[2rem] border border-(--warm-line) px-8 py-14 shadow-[0_30px_70px_-40px_oklch(0.45_0.08_30/35%)] sm:px-14 sm:py-20">
          {/* Soft animated bloom behind the hero (React Bits-style). */}
          <AuroraBloom />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-(--warm-line) bg-[color-mix(in_oklch,var(--warm-cream),transparent_30%)] px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-(--warm-ink-soft) uppercase backdrop-blur-sm">
              <Heart className="size-3.5 text-primary" aria-hidden="true" />
              Atelier de Beauté
            </span>

            <h1 className="font-heading mt-6 max-w-2xl text-4xl leading-[1.08] font-medium tracking-tight text-balance text-(--warm-ink) sm:text-6xl">
              Slow down, settle in, and leave feeling{" "}
              <span className="italic text-primary">radiant</span>.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-(--warm-ink-soft)">
              A warm little studio for hair, braids, and restorative treatments.
              Choose what you&rsquo;d love, send a request in seconds, and
              we&rsquo;ll hold a quiet, unhurried chair just for you.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full px-8 text-base shadow-[0_12px_30px_-12px_oklch(0.457_0.24_277/55%)]"
              >
                <Link href="/services">Browse the menu</Link>
              </Button>
              <span className="text-sm text-(--warm-ink-soft)">
                No card needed · request &amp; we confirm
              </span>
            </div>

            {/* Feature pills */}
            <ul className="mt-10 flex flex-wrap gap-3">
              {featurePills.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-(--warm-line) bg-[color-mix(in_oklch,var(--warm-cream),transparent_20%)] px-4 py-2 text-sm font-medium text-(--warm-ink) backdrop-blur-sm"
                >
                  <Icon className="size-4 text-primary" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </FadeUp>

        {/* Trust signals */}
        <dl className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {trustSignals.map(({ stat, label }, i) => (
            <FadeUp
              key={label}
              as="div"
              delay={0.15 + i * 0.08}
              className="rounded-2xl border border-(--warm-line) bg-[color-mix(in_oklch,var(--warm-cream),transparent_25%)] px-6 py-5 backdrop-blur-sm"
            >
              <dt className="font-heading flex items-center gap-2 text-2xl font-medium text-(--warm-ink)">
                {stat.includes("★") ? (
                  <Star
                    className="size-5 fill-primary text-primary"
                    aria-hidden="true"
                  />
                ) : null}
                {stat}
              </dt>
              <dd className="mt-1 text-sm text-(--warm-ink-soft)">{label}</dd>
            </FadeUp>
          ))}
        </dl>
      </section>
    </main>
  );
}
