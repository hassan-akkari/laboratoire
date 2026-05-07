import { motion, useReducedMotion } from "framer-motion";
import { AppButton } from "@laboratoire/ui";
import { FaWhatsapp, FaCalendarAlt, FaRegEnvelope } from "react-icons/fa";
import Container from "../layout/Container";
import Section from "../layout/Section";
import type { Locale } from "../../i18n/locale";
import { SITE, mailtoLink } from "../../data/site";
import { getHeroContent } from "../../data/heroContent";
import {
  fadeUpVariants,
  getMountReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type HeroSectionProps = {
  locale: Locale;
};

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
                target="_blank"
                rel="noreferrer"
                size="lg"
                startContent={<FaWhatsapp aria-hidden="true" />}
              >
                {content.primaryCtaLabel}
              </AppButton>
              <AppButton
                as="a"
                href={content.secondaryCtaHref}
                size="lg"
                variant="bordered"
                startContent={<FaCalendarAlt aria-hidden="true" />}
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

          <motion.aside
            variants={fadeUpVariants}
            className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6"
          >
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--app-muted)]">
              {content.aside.title}
            </p>
            <ul className="mt-4 space-y-3 text-base">
              {content.aside.bullets.map((bullet) => (
                <li key={bullet.id} className="flex gap-3">
                  <span className="text-[var(--app-accent)]">→</span>
                  <span>{bullet.label}</span>
                </li>
              ))}
            </ul>
            <a
              href={mailtoLink("Richiesta info")}
              className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--app-fg)] underline-offset-4 hover:underline"
            >
              <FaRegEnvelope aria-hidden="true" /> {SITE.email}
            </a>
          </motion.aside>
        </motion.div>
      </Container>
    </Section>
  );
}
