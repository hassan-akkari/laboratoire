"use client";

import { motion } from "framer-motion";
import { useReducedMotionSafe } from "../../lib/useReducedMotionSafe";
import Container from "../layout/Container";
import Section from "../layout/Section";
import type { Locale } from "../../i18n/locale";
import { getTechStackContent } from "../../data/techStack";
import {
  fadeUpVariants,
  getInViewReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type TechStackSectionProps = {
  locale: Locale;
};

export default function TechStackSection({ locale }: TechStackSectionProps) {
  const reduceMotion = useReducedMotionSafe();
  const content = getTechStackContent(locale);

  return (
    <Section id="stack">
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
            {content.note}
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 md:grid-cols-3"
          variants={staggerChildrenVariants}
          {...getInViewReveal(reduceMotion, 0.1)}
        >
          {content.categories.map((category) => (
            <motion.article
              key={category.id}
              variants={fadeUpVariants}
              className="card-hover rounded-2xl border border-(--app-border) bg-(--app-card) p-6"
            >
              <h3 className="text-lg">{category.title}</h3>
              <p className="mt-2 text-sm text-(--app-muted)">
                {category.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-(--app-border) bg-(--app-bg) px-3 py-1 text-xs text-(--app-fg)"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
