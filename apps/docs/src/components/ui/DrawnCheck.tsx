"use client";

import { motion } from "framer-motion";
import { useReducedMotionSafe } from "../../lib/useReducedMotionSafe";
import { easeOutQuart } from "./motionPresets";

type DrawnCheckProps = {
  className?: string;
  delay?: number;
};

/**
 * Checkmark that draws itself (pathLength 0 → 1) on first scroll-in — the
 * audit checklist "ticks itself" while the visitor reads. Static under
 * reduced motion. Purely decorative (aria-hidden): always pair with real
 * text, never carry meaning with the tick alone.
 */
export default function DrawnCheck({ className, delay = 0 }: DrawnCheckProps) {
  const reduceMotion = useReducedMotionSafe();

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <motion.path
        d="M4.5 12.8 9.6 17.6 19.5 6.8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? undefined : { pathLength: 0 }}
        whileInView={reduceMotion ? undefined : { pathLength: 1 }}
        // Top margin mirrors WordReveal: content already scrolled past
        // (deep links, restored scroll) resolves instantly instead of
        // waiting for a scroll-in that never happens.
        viewport={{ once: true, amount: 0.6, margin: "200% 0px -6% 0px" }}
        transition={{ duration: 0.5, delay, ease: easeOutQuart }}
      />
    </svg>
  );
}
