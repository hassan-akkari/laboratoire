"use client";

import { motion, useReducedMotion } from "framer-motion";

// React Bits-style soft "aurora" bloom for the warm hero: two large, blurred
// radial blobs in the warm palette drift and breathe slowly behind the hero
// card. Purely atmospheric (aria-hidden, pointer-events-none). Hand-written.
//
// Reduced-motion: renders a single static bloom (no drift) so the warmth stays
// but nothing moves.
export function AuroraBloom() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--warm-rose),transparent_30%),transparent)] blur-2xl" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute -top-28 -right-16 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--warm-rose),transparent_25%),transparent)] blur-3xl"
        animate={{ x: [0, 24, 0], y: [0, 18, 0], scale: [1, 1.08, 1] }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--warm-blush),transparent_30%),transparent)] blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, -16, 0], scale: [1.05, 1, 1.05] }}
        transition={{
          duration: 17,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
