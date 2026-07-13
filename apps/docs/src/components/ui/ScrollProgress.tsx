"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin reading-progress bar fixed to the top edge, driven by page scroll with
 * a spring so it feels fluid rather than mechanical. Decorative: hidden for
 * prefers-reduced-motion users via CSS (portfolio.css) rather than a JS
 * branch — useReducedMotion would desync server and first client render and
 * cause a hydration mismatch.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div aria-hidden="true" className="scroll-progress" style={{ scaleX }} />
  );
}
