import Link from "next/link";
import { ArrowLeft, Clock, Heart, Tag } from "lucide-react";
import type { Service } from "@/lib/db/schema";
import { formatDuration, formatPriceRange } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/FadeUp";

// Warm-luxe "Atelier de Beauté" service-detail page. Mirrors the warm
// Home/Services/Book look: cream canvas, Fraunces display via `.theme-warm` →
// `--font-heading`, warm-neutral lines, rounded pill CTAs, lucide icons.
// Category uses warm's native idiom — a Badge variant="outline" with a Tag icon
// (matching warm/Services). The full description is shown (no line-clamp).
export function Detail({
  service,
  dbReady,
}: {
  service: Service;
  dbReady: boolean;
}) {
  // Effective hero = explicit imageUrl, else the first gallery image, else none.
  // When the hero is sourced FROM the gallery (no imageUrl), drop images[0] so it
  // isn't shown twice; otherwise show the whole gallery.
  const heroSrc = service.imageUrl ?? service.images[0] ?? null;
  const galleryImages = service.imageUrl
    ? service.images
    : service.images.slice(1);

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
            On the menu
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-4xl font-medium tracking-tight text-(--warm-ink) sm:text-5xl">
              {service.title}
            </h1>
            {!dbReady ? <Badge variant="secondary">demo data</Badge> : null}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="font-heading text-2xl font-medium text-(--warm-ink)">
              {formatPriceRange(service.priceFromCents, service.priceToCents)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-(--warm-line) bg-[color-mix(in_oklch,var(--warm-cream),transparent_20%)] px-3 py-1 text-sm text-(--warm-ink-soft)">
              <Clock className="size-4" aria-hidden="true" />
              {formatDuration(service.durationMin)}
            </span>
            {service.category ? (
              <Badge
                variant="outline"
                className="border-(--warm-line) bg-[color-mix(in_oklch,var(--warm-cream),transparent_20%)] text-(--warm-ink-soft)"
              >
                <Tag className="size-3" aria-hidden="true" />
                {service.category}
              </Badge>
            ) : null}
          </div>
        </FadeUp>

        {heroSrc ? (
          <FadeUp delay={0.08} className="mb-10">
            {/* Plain <img> (not next/image): no images config is wired, so a
                remote URL would 500 under next/image. width/height + the
                aspect-ratio wrapper reserve space to avoid CLS. */}
            <div className="aspect-3/2 overflow-hidden rounded-[2rem] border border-(--warm-line)">
              <img
                src={heroSrc}
                alt={service.title}
                width={1200}
                height={800}
                loading="eager"
                className="h-full w-full max-w-full object-cover"
              />
            </div>
          </FadeUp>
        ) : null}

        {/* Gallery: warm idiom — softly rounded, tinted-cream tiles with the
            warm hairline border. Empty gallery renders nothing. Each tile keeps
            its aspect ratio (no CLS), lazy-loads, and has a unique, meaningful
            alt. */}
        {galleryImages.length > 0 ? (
          <FadeUp delay={0.1} className="mb-10">
            <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3">
              {galleryImages.map((src, i) => (
                <li
                  key={src}
                  className="aspect-square overflow-hidden rounded-[1.25rem] border border-(--warm-line) bg-[color-mix(in_oklch,var(--warm-cream),transparent_20%)]"
                >
                  <img
                    src={src}
                    alt={`${service.title} — photo ${i + 1}`}
                    width={600}
                    height={600}
                    loading="lazy"
                    className="h-full w-full max-w-full object-cover"
                  />
                </li>
              ))}
            </ul>
          </FadeUp>
        ) : null}

        <FadeUp delay={0.12}>
          <div className="warm-hero relative overflow-hidden rounded-[2rem] border border-(--warm-line) px-6 py-8 shadow-[0_30px_70px_-40px_oklch(0.45_0.08_30/35%)] sm:px-10 sm:py-10">
            {service.description ? (
              <>
                <h2 className="font-heading text-2xl font-medium tracking-tight text-(--warm-ink)">
                  About this service
                </h2>
                <p className="mt-3 max-w-prose text-lg leading-relaxed text-pretty text-(--warm-ink-soft)">
                  {service.description}
                </p>
              </>
            ) : (
              <h2 className="font-heading text-2xl font-medium tracking-tight text-(--warm-ink)">
                Ready when you are
              </h2>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full px-8 text-base shadow-[0_12px_30px_-12px_oklch(0.457_0.24_277/55%)]"
              >
                <Link href={`/book/${service.slug}`}>Request booking</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-12 rounded-full px-6 text-base text-(--warm-ink-soft) hover:text-primary"
              >
                <Link href="/services">All services</Link>
              </Button>
            </div>
          </div>
        </FadeUp>
      </div>
    </main>
  );
}
