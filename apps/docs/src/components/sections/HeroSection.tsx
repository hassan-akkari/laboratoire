import { motion, useReducedMotion } from "framer-motion";
import { AppButton } from "@laboratoire/ui";
import { FaArrowRight } from "react-icons/fa";
import Container from "../layout/Container";
import Section from "../layout/Section";
import type { Locale } from "../../i18n/locale";
import { getHeroContent } from "../../data/heroContent";
import {
  fadeUpVariants,
  getMountReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type HeroSectionProps = {
  locale: Locale;
};

const PORTRAIT_SRC = `${import.meta.env.BASE_URL}image/portrait.png`;

export default function HeroSection({ locale }: HeroSectionProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const content = getHeroContent(locale);

  return (
    <Section id="hero" className="relative">
      <Container>
        <motion.div
          className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center"
          variants={staggerChildrenVariants}
          {...getMountReveal(reduceMotion)}
        >
          <motion.div variants={fadeUpVariants}>
            <p className="mb-4 inline-block rounded-full border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--app-muted)]">
              {content.badge}
            </p>
            <h1 className="text-4xl leading-[1.1] sm:text-5xl md:text-6xl">
              {content.titleParts.before}
              <span className="text-[var(--app-accent)]">
                {content.titleParts.accent}
              </span>
              {content.titleParts.after}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[var(--app-muted)]">
              {content.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <AppButton
                as="a"
                href={content.primaryCtaHref}
                size="lg"
                endContent={<FaArrowRight aria-hidden="true" />}
              >
                {content.primaryCtaLabel}
              </AppButton>
              <AppButton
                as="a"
                href={content.secondaryCtaHref}
                size="lg"
                variant="bordered"
              >
                {content.secondaryCtaLabel}
              </AppButton>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--app-muted)]">
              {content.guaranteeBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            className="relative mx-auto flex w-full max-w-sm flex-col gap-6 md:max-w-none"
          >
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0"
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
                style={{ filter: "var(--portrait-rim)" }}
              />
            </div>

            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-5">
              <dl className="grid grid-cols-3 gap-3 text-center">
                {content.proofCard.stats.map((stat) => (
                  <div key={stat.id}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="text-2xl font-semibold text-[var(--app-fg)] md:text-3xl">
                      {stat.value}
                    </dd>
                    <p
                      aria-hidden="true"
                      className="mt-1 text-xs leading-tight text-[var(--app-muted)]"
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </dl>
              <p className="mt-4 border-t border-[var(--app-border)] pt-4 text-sm leading-relaxed text-[var(--app-muted)]">
                {content.proofCard.quote}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
