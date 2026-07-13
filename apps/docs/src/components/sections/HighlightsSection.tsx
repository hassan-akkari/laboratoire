"use client";

import { FaBolt, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "../../lib/useReducedMotionSafe";
import type { Messages } from "../../i18n/messages";
import Container from "../layout/Container";
import Section from "../layout/Section";
import { easeOutQuart } from "../ui/motionPresets";

type HighlightsSectionProps = {
  highlights: string[];
  labels: Messages["highlights"];
};

export default function HighlightsSection({
  highlights,
  labels,
}: HighlightsSectionProps) {
  const reduceMotion = useReducedMotionSafe();
  const revealTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.42, ease: easeOutQuart };
  const revealProps = reduceMotion
    ? { initial: false as const }
    : {
        initial: { y: 12 },
        whileInView: { y: 0 },
        viewport: { once: true, amount: 0.12 },
      };

  return (
    <Section id="highlights">
      <Container>
        <motion.div
          className="section-heading"
          {...revealProps}
          transition={revealTransition}
        >
          <h2 className="sub-title">{labels.title}</h2>
          <p className="section-subtitle">{labels.subtitle}</p>
        </motion.div>

        <motion.div
          className="highlights-grid"
          {...revealProps}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.48, delay: 0.05, ease: easeOutQuart }
          }
        >
          {highlights.map((item, index) => (
            <motion.article
              key={`${index}-${item.slice(0, 24)}`}
              className="highlight-card"
              whileHover={reduceMotion ? undefined : { y: -4 }}
              initial={reduceMotion ? false : { y: 10 }}
              whileInView={reduceMotion ? undefined : { y: 0 }}
              viewport={reduceMotion ? undefined : { once: true, amount: 0.12 }}
              transition={revealTransition}
            >
              <span className="highlight-icon" aria-hidden="true">
                {index % 2 === 0 ? <FaBolt /> : <FaCheckCircle />}
              </span>
              <p>{item}</p>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
