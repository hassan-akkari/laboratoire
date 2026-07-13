"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { AppButton } from "@laboratoire/ui";
import { FaArrowRight } from "react-icons/fa";
import Container from "../layout/Container";
import Section from "../layout/Section";
import type { Locale } from "../../i18n/locale";
import { localePath } from "../../i18n/routing";
import { getHeroContent } from "../../data/heroContent";
import { easeOutQuart, getMountReveal } from "../ui/motionPresets";

type HeroSectionProps = {
  locale: Locale;
};

const PORTRAIT_SRC = "/image/portrait.png";

/* Hero-only choreography: a slightly slower, blur-to-sharp entrance with a
 * tighter stagger than the shared presets — the first impression earns a
 * richer curve (400-600ms fluid range) than in-flow section reveals. */
const heroStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.05, staggerChildren: 0.12 },
  },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: easeOutQuart },
  },
};

const heroPortrait: Variants = {
  hidden: { opacity: 0, scale: 1.04, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: easeOutQuart },
  },
};

export default function HeroSection({ locale }: HeroSectionProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const content = getHeroContent(locale);

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Subtle parallax: the portrait trails the scroll slightly (transform-only).
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 36]);

  return (
    <Section id="hero" className="relative">
      <Container>
        <motion.div
          ref={sectionRef}
          className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center"
          variants={heroStagger}
          {...getMountReveal(reduceMotion)}
        >
          <div>
            <motion.p
              variants={heroItem}
              className="mb-4 inline-block rounded-full border border-(--app-border) bg-(--app-card) px-3 py-1 text-xs uppercase tracking-[0.18em] text-(--app-muted)"
            >
              {content.badge}
            </motion.p>
            <motion.h1
              variants={heroItem}
              className="text-4xl leading-[1.1] sm:text-5xl md:text-6xl"
            >
              {content.titleParts.before}
              <span className="hero-accent">{content.titleParts.accent}</span>
              {content.titleParts.after}
            </motion.h1>
            <motion.p
              variants={heroItem}
              className="mt-6 max-w-xl text-lg text-(--app-muted)"
            >
              {content.subtitle}
            </motion.p>

            <motion.div
              variants={heroItem}
              className="mt-8 grid grid-cols-1 gap-3 sm:max-w-lg sm:grid-cols-2"
            >
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
            </motion.div>

            <motion.ul
              variants={heroItem}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-(--app-muted)"
            >
              {content.guaranteeBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            variants={heroPortrait}
            className="relative mx-auto flex w-full max-w-sm flex-col gap-6 md:max-w-none"
          >
            <motion.div
              className="relative"
              style={reduceMotion ? undefined : { y: portraitY }}
            >
              <div
                aria-hidden="true"
                className="hero-halo pointer-events-none absolute inset-0 z-0"
                style={{ background: "var(--portrait-halo)" }}
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

            <div className="card-hover rounded-2xl border border-(--app-border) bg-(--app-card) p-5">
              <dl className="grid grid-cols-3 gap-3 text-center">
                {content.proofCard.stats.map((stat) => (
                  <div key={stat.id}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="text-2xl font-semibold text-(--app-fg) md:text-3xl">
                      {stat.value}
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
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
