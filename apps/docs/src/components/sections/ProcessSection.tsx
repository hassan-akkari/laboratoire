"use client";

import { motion, useReducedMotion } from "framer-motion";
import Container from "../layout/Container";
import Section from "../layout/Section";
import type { Locale } from "../../i18n/locale";
import { getProcessContent } from "../../data/processSteps";
import {
  fadeUpVariants,
  getInViewReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type ProcessSectionProps = {
  locale: Locale;
};

export default function ProcessSection({ locale }: ProcessSectionProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const content = getProcessContent(locale);

  return (
    <Section id="process">
      <Container>
        <motion.div
          variants={fadeUpVariants}
          {...getInViewReveal(reduceMotion, 0.22)}
          className="max-w-2xl"
        >
          <p className="section-eyebrow mb-3 text-sm uppercase tracking-[0.18em]">
            {content.sectionLabel}
          </p>
          <h2 className="text-3xl md:text-4xl">{content.title}</h2>
          <p className="mt-4 text-base text-(--app-muted)">
            {content.subtitle}
          </p>
        </motion.div>

        <motion.ol
          className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
          variants={staggerChildrenVariants}
          {...getInViewReveal(reduceMotion, 0.1)}
        >
          {content.steps.map((step) => (
            <motion.li
              key={step.id}
              variants={fadeUpVariants}
              className="card-hover rounded-2xl border border-(--app-border) bg-(--app-card) p-6"
            >
              <span
                aria-hidden="true"
                className="text-sm font-semibold tracking-[0.2em] text-(--accent-ink)"
              >
                {step.number}
              </span>
              <h3 className="mt-3 text-lg leading-snug">{step.title}</h3>
              <p className="mt-3 text-sm text-(--app-muted)">
                {step.description}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </Container>
    </Section>
  );
}
