"use client";

import { motion, useReducedMotion } from "framer-motion";
import Container from "../layout/Container";
import Section from "../layout/Section";
import type { Locale } from "../../i18n/locale";
import { getTargetClientsContent } from "../../data/targetClients";
import {
  fadeUpVariants,
  getInViewReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type TargetClientsSectionProps = {
  locale: Locale;
};

export default function TargetClientsSection({
  locale,
}: TargetClientsSectionProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const content = getTargetClientsContent(locale);

  return (
    <Section id="target">
      <Container>
        <motion.div
          variants={fadeUpVariants}
          {...getInViewReveal(reduceMotion, 0.22)}
          className="max-w-2xl"
        >
          <p className="mb-3 text-sm uppercase tracking-[0.18em] text-(--app-muted)">
            {content.sectionLabel}
          </p>
          <h2 className="text-3xl md:text-4xl">{content.title}</h2>
          <p className="mt-4 text-base text-(--app-muted)">
            {content.subtitle}
          </p>
        </motion.div>

        <motion.ul
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerChildrenVariants}
          {...getInViewReveal(reduceMotion, 0.1)}
        >
          {content.clients.map((client) => (
            <motion.li
              key={client.id}
              variants={fadeUpVariants}
              className="rounded-2xl border border-(--app-border) bg-(--app-card) p-6"
            >
              <h3 className="text-lg">{client.label}</h3>
              <p className="mt-2 text-sm text-(--app-muted)">
                {client.description}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </Section>
  );
}
