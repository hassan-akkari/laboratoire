"use client";

import { motion } from "framer-motion";
import { useReducedMotionSafe } from "../../lib/useReducedMotionSafe";
import Container from "../layout/Container";
import Section from "../layout/Section";
import WordReveal from "../ui/WordReveal";
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
  const reduceMotion = useReducedMotionSafe();
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
          <WordReveal
            as="h2"
            className="text-3xl md:text-4xl"
            text={content.title}
          />
        </motion.div>

        {/* Editorial numbered rows (motion-v2 Tier 2): same counter language
            as the mobile menu and the process rail — data-index rendered by
            CSS attr(), hairline separators, no cards. */}
        <motion.ol
          className="whyme-list mt-12"
          variants={staggerChildrenVariants}
          {...getInViewReveal(reduceMotion, 0.1)}
        >
          {content.reasons.map((reason, index) => (
            <motion.li
              key={reason.id}
              variants={fadeUpVariants}
              className="whyme-row"
              data-index={String(index + 1).padStart(2, "0")}
            >
              <h3 className="whyme-row__title text-lg leading-snug md:text-xl">
                {reason.title}
              </h3>
              <p className="whyme-row__desc text-sm leading-relaxed text-(--app-muted) md:text-[15px]">
                {reason.description}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </Container>
    </Section>
  );
}
