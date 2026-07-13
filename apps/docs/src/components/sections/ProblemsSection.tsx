"use client";

import { motion, useReducedMotion } from "framer-motion";
import Container from "../layout/Container";
import Section from "../layout/Section";
import type { Locale } from "../../i18n/locale";
import { getProblemsContent } from "../../data/problems";
import {
  fadeUpVariants,
  getInViewReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type ProblemsSectionProps = {
  locale: Locale;
};

export default function ProblemsSection({ locale }: ProblemsSectionProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const content = getProblemsContent(locale);

  return (
    <Section id="problems">
      <Container>
        <motion.div
          variants={fadeUpVariants}
          {...getInViewReveal(reduceMotion, 0.2)}
          className="max-w-2xl"
        >
          <p className="section-eyebrow mb-3 text-sm uppercase tracking-[0.18em]">
            {content.sectionLabel}
          </p>
          <h2 className="text-3xl md:text-4xl">{content.title}</h2>
        </motion.div>

        <motion.ul
          className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerChildrenVariants}
          {...getInViewReveal(reduceMotion, 0.1)}
        >
          {content.problems.map((problem) => (
            <motion.li
              key={problem.id}
              variants={fadeUpVariants}
              className="card-hover rounded-2xl border border-(--app-border) bg-(--app-card) p-6"
            >
              <h3 className="text-lg leading-snug">{problem.title}</h3>
              <p className="mt-3 text-sm text-(--app-muted)">
                {problem.description}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </Section>
  );
}
