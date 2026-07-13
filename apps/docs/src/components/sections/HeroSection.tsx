"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "../../lib/useReducedMotionSafe";
import { AppButton } from "@laboratoire/ui";
import { FaArrowRight } from "react-icons/fa";
import Container from "../layout/Container";
import Section from "../layout/Section";
import MagneticWrap from "../ui/MagneticWrap";
import StatValue from "../ui/StatValue";
import type { Locale } from "../../i18n/locale";
import { localePath } from "../../i18n/routing";
import { getHeroContent } from "../../data/heroContent";

type HeroSectionProps = {
  locale: Locale;
};

const PORTRAIT_SRC = "/image/portrait.webp";

/**
 * The hero entrance is CSS (`.hero-enter*` in portfolio.css), NOT
 * framer-motion: a JS mount animation serializes opacity:0 into the
 * prerendered HTML, blanking the above-the-fold content for crawlers and
 * no-JS clients and delaying LCP until hydration. CSS keyframes play
 * immediately with the stylesheet, work without JS, and the reduced-motion
 * kill switch in portfolio.css disables them wholesale. The portrait
 * deliberately animates only scale/blur (never opacity) so the LCP element
 * counts as painted from the first frame. Only the scroll parallax stays in
 * framer — it is additive and client-only by nature.
 */
export default function HeroSection({ locale }: HeroSectionProps) {
  const reduceMotion = useReducedMotionSafe();
  const content = getHeroContent(locale);

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Scroll-linked depth: three layers leave the viewport at different speeds
  // (all transform/opacity-only, all neutral at progress 0 so the prerendered
  // HTML is untouched). The text column drifts up and dims, the portrait
  // trails behind the scroll, and the halo trails even further for depth.
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -44]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.35]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const haloY = useTransform(scrollYProgress, [0, 1], [0, 56]);

  return (
    <Section id="hero" className="relative">
      <Container>
        <div
          ref={sectionRef}
          className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center"
        >
          <motion.div
            style={
              reduceMotion
                ? undefined
                : { y: contentY, opacity: contentOpacity }
            }
          >
            <p
              className="hero-enter mb-4 inline-block rounded-full border border-(--app-border) bg-(--app-card) px-3 py-1 text-xs uppercase tracking-[0.18em] text-(--app-muted)"
              style={{ "--enter-delay": "0ms" } as React.CSSProperties}
            >
              {content.badge}
            </p>
            <h1
              className="hero-enter text-4xl leading-[1.1] sm:text-5xl md:text-6xl"
              style={{ "--enter-delay": "90ms" } as React.CSSProperties}
            >
              {content.titleParts.before}
              <span className="hero-accent">{content.titleParts.accent}</span>
              {content.titleParts.after}
            </h1>
            <p
              className="hero-enter mt-6 max-w-xl text-lg text-(--app-muted)"
              style={{ "--enter-delay": "180ms" } as React.CSSProperties}
            >
              {content.subtitle}
            </p>

            <div
              className="hero-enter mt-8 grid grid-cols-1 gap-3 sm:max-w-lg sm:grid-cols-2"
              style={{ "--enter-delay": "270ms" } as React.CSSProperties}
            >
              <MagneticWrap>
                <AppButton
                  as="a"
                  href={localePath(locale, content.primaryCtaHref)}
                  size="lg"
                  fullWidth
                  className="cta-primary"
                  endContent={<FaArrowRight aria-hidden="true" />}
                >
                  {content.primaryCtaLabel}
                </AppButton>
              </MagneticWrap>
              <AppButton
                as="a"
                href={content.secondaryCtaHref}
                size="lg"
                fullWidth
                variant="bordered"
                className="cta-secondary"
              >
                {content.secondaryCtaLabel}
              </AppButton>
            </div>

            <ul
              className="hero-enter mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-(--app-muted)"
              style={{ "--enter-delay": "360ms" } as React.CSSProperties}
            >
              {content.guaranteeBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </motion.div>

          <div className="relative mx-auto flex w-full max-w-sm flex-col gap-6 md:max-w-none">
            <motion.div
              className="hero-enter-portrait relative"
              style={reduceMotion ? undefined : { y: portraitY }}
            >
              <motion.div
                aria-hidden="true"
                className="hero-halo pointer-events-none absolute inset-0 z-0"
                style={
                  reduceMotion
                    ? { background: "var(--portrait-halo)" }
                    : { background: "var(--portrait-halo)", y: haloY }
                }
              />
              <img
                src={PORTRAIT_SRC}
                alt={content.portraitAlt}
                width={840}
                height={1120}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="relative z-10 mx-auto block h-auto w-full max-w-md select-none object-contain md:max-w-none"
                style={{
                  filter: "var(--portrait-rim)",
                  maskImage: "var(--portrait-mask)",
                  WebkitMaskImage: "var(--portrait-mask)",
                }}
              />
            </motion.div>

            <div
              className="hero-enter card-hover rounded-2xl border border-(--app-border) bg-(--app-card) p-5"
              style={{ "--enter-delay": "300ms" } as React.CSSProperties}
            >
              <dl className="grid grid-cols-3 gap-3 text-center">
                {content.proofCard.stats.map((stat) => (
                  <div key={stat.id}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="text-2xl font-semibold text-(--app-fg) md:text-3xl">
                      <StatValue value={stat.value} />
                    </dd>
                    <p
                      aria-hidden="true"
                      className="mt-1 text-xs leading-tight text-(--app-muted)"
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </dl>
              <p className="mt-4 border-t border-(--app-border) pt-4 text-sm leading-relaxed text-(--app-muted)">
                {content.proofCard.quote}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
