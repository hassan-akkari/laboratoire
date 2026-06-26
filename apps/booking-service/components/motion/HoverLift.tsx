"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Spring hover lift for cards. Wraps content in a motion element that rises a
// few px on hover/focus-within with a soft spring. Reduced-motion renders a
// plain div with no transform. `h-full` is passed through so it fills its grid
// cell like the card it wraps.
export function HoverLift({
  children,
  className,
  lift = 6,
}: {
  children: ReactNode;
  className?: string;
  /** Upward travel in px on hover. */
  lift?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={false}
      whileHover={{ y: -lift }}
      whileFocus={{ y: -lift }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
    >
      {children}
    </motion.div>
  );
}
