"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { routeTransitionVariants } from "@/components/ui/motionPresets";

/**
 * Route-enter transition. A template remounts on every navigation, which
 * replays the entry animation — the App Router replacement for the SPA's
 * AnimatePresence keyed on location.pathname (exit animations across routes
 * have no App Router equivalent and are intentionally dropped).
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <motion.div
      variants={routeTransitionVariants}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
    >
      {children}
    </motion.div>
  );
}
