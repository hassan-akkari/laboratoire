"use client";

import { motion } from "framer-motion";
import { useReducedMotionSafe } from "../../lib/useReducedMotionSafe";
import Container from "../layout/Container";
import Section from "../layout/Section";
import WordReveal from "../ui/WordReveal";
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

type StackChip = {
  item: string;
  category: string;
};

type StackCategory = ReturnType<
  typeof getTechStackContent
>["categories"][number];

/** Interleave every category's chips, then take alternate halves so both
 * marquee rows mix categories instead of clustering them. */
function splitChips(categories: StackCategory[], half: 0 | 1): StackChip[] {
  const all = categories.flatMap((category) =>
    category.items.map((item) => ({ item, category: category.id })),
  );
  return all.filter((_, index) => index % 2 === half);
}

function MarqueeRow({
  items,
  reverse,
}: {
  items: StackChip[];
  reverse?: boolean;
}) {
  const group = (hidden: boolean) => (
    <ul
      className="stack-marquee__group"
      aria-hidden={hidden || undefined}
    >
      {items.map((chip) => (
        <li key={chip.item} className="stack-chip" data-category={chip.category}>
          <span className="stack-chip__dot" aria-hidden="true" />
          {chip.item}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={
        reverse
          ? "stack-marquee__row stack-marquee__row--reverse"
          : "stack-marquee__row"
      }
    >
      <div className="stack-marquee__track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}

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
          <WordReveal
            as="h2"
            className="text-3xl md:text-4xl"
            text={content.title}
          />
          <p className="mt-4 text-base text-(--app-muted)">
            {content.note}
          </p>
        </motion.div>

        {/* Marquee (motion-v2 Tier 2): the chips leave the cards and stream
            in two counter-scrolling rows — pure CSS animation, duplicated
            group for the seamless wrap, paused on hover, wraps statically
            under reduced motion. Cards below keep title + description. */}
        <div className="stack-marquee mt-12" aria-label={content.sectionLabel}>
          <MarqueeRow items={splitChips(content.categories, 0)} />
          <MarqueeRow items={splitChips(content.categories, 1)} reverse />
        </div>

        <motion.div
          className="mt-10 grid gap-6 md:grid-cols-3"
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
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
