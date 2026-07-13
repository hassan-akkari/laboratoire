"use client";

import { useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { routeTransitionVariants } from "@/components/ui/motionPresets";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * True on the client once the first page has mounted. Module-level on purpose:
 * a template REMOUNTS on every navigation, so component state can't tell the
 * first load apart from later ones. On the server this stays false, which
 * keeps the prerendered HTML fully VISIBLE (no opacity:0 snapshot — the SEO
 * point of the migration); the enter animation then only plays on client-side
 * navigations, where it can't hurt crawlers or first paint.
 */
let hasHydratedOnce = false;

export default function Template({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotionSafe();
  const animateEntry = hasHydratedOnce && !reduceMotion;

  useEffect(() => {
    hasHydratedOnce = true;
  }, []);

  return (
    <motion.div
      variants={routeTransitionVariants}
      initial={animateEntry ? "hidden" : false}
      animate="visible"
    >
      {children}
    </motion.div>
  );
}
