import { FaBolt, FaCheckCircle } from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";
import type { Messages } from "../../i18n/messages";
import Container from "../layout/Container";
import Section from "../layout/Section";
import {
  fadeUpVariants,
  getInViewReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type HighlightsSectionProps = {
  highlights: string[];
  labels: Messages["highlights"];
};

export default function HighlightsSection({
  highlights,
  labels,
}: HighlightsSectionProps) {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <Section id="highlights">
      <Container>
        <motion.div
          className="section-heading"
          variants={fadeUpVariants}
          {...getInViewReveal(reduceMotion, 0.28)}
        >
          <h2 className="sub-title">{labels.title}</h2>
          <p className="section-subtitle">{labels.subtitle}</p>
        </motion.div>

        <motion.div
          className="highlights-grid"
          variants={staggerChildrenVariants}
          {...getInViewReveal(reduceMotion, 0.16)}
        >
          {highlights.map((item, index) => (
            <motion.article
              key={item}
              className="highlight-card"
              variants={fadeUpVariants}
              whileHover={reduceMotion ? undefined : { y: -4 }}
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
