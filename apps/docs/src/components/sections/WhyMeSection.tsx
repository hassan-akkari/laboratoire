"use client";

import { motion, useReducedMotion } from "framer-motion";
import Container from "../layout/Container";
import Section from "../layout/Section";
import type { Locale } from "../../i18n/locale";
import { getWhyMeContent } from "../../data/whyMe";
import {
  fadeUpVariants,
  getInViewReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type WhyMeSectionProps = {
  locale: Locale;
};

export default function WhyMeSection({ locale }: WhyMeSectionProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const content = getWhyMeContent(locale);

  return (
    <Section id="why-me">
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
        </motion.div>

        <motion.ul
          className="mt-12 grid gap-6 md:grid-cols-2"
          variants={staggerChildrenVariants}
          {...getInViewReveal(reduceMotion, 0.1)}
        >
          {content.reasons.map((reason) => (
            <motion.li
              key={reason.id}
              variants={fadeUpVariants}
              className="card-hover rounded-2xl border border-(--app-border) bg-(--app-card) p-6"
            >
              <h3 className="text-lg leading-snug">{reason.title}</h3>
              <p className="mt-3 text-sm text-(--app-muted)">
                {reason.description}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </Section>
  );
}
