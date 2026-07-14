"use client";

import { Fragment } from "react";
import { motion, type Variants } from "framer-motion";
import { useReducedMotionSafe } from "../../lib/useReducedMotionSafe";
import { easeOutQuart } from "./motionPresets";

type WordRevealProps = {
  text: string;
  as?: "h2" | "h3" | "p";
  className?: string;
};

/**
 * Word-by-word heading reveal (motion-v2 Tier 2): each word sits in an
 * overflow-hidden mask and slides up on first scroll-in, staggered by the
 * PARENT's staggerChildren.
 *
 * - The viewport trigger lives on the heading, NOT on the words: a word
 *   translated below its mask is fully clipped, so its intersection ratio
 *   is permanently 0 and a per-word whileInView would never fire.
 * - Words are real text nodes server-rendered in order → SEO intact.
 * - The hidden variant includes opacity:0 ON PURPOSE: the layout's
 *   <noscript> override keys on `[style*="opacity:0"]` to force
 *   below-the-fold content visible for no-JS clients.
 * - Reduced motion renders the plain tag, no spans.
 */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const wordVariants: Variants = {
  hidden: { y: "112%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.55, ease: easeOutQuart },
  },
};

const MOTION_TAG = {
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
} as const;

export default function WordReveal({
  text,
  as = "h2",
  className,
}: WordRevealProps) {
  const reduceMotion = useReducedMotionSafe();

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = MOTION_TAG[as];
  const words = text.split(" ");

  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      // Top margin extends the trigger zone 3 viewports UP: content the
      // visitor has already scrolled past (deep links, restored scroll,
      // fast anchor jumps) reveals immediately instead of sitting hidden
      // above them. Bottom -8% keeps the on-scroll entrance meaningful.
      viewport={{ once: true, amount: 0.5, margin: "300% 0px -8% 0px" }}
    >
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="word-reveal__mask">
            <motion.span className="word-reveal__word" variants={wordVariants}>
              {word}
            </motion.span>
          </span>
          {/* The space lives BETWEEN the masks: inside the inline-block it
              would be collapsed as a trailing space and the words would run
              together. */}
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </MotionTag>
  );
}
