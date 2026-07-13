"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * Thin reading-progress bar fixed to the top edge, driven by page scroll with
 * a spring so it feels fluid rather than mechanical. Hidden entirely under
 * prefers-reduced-motion (it is decorative).
 */
export default function ScrollProgress() {
  const reduceMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  if (reduceMotion) return null;

  return (
    <motion.div aria-hidden="true" className="scroll-progress" style={{ scaleX }} />
  );
}
