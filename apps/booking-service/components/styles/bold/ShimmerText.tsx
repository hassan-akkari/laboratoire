"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

// React Bits-style animated gradient/shimmer for the bold hero's accent run
// ("starts here."). A violet→light gradient is clipped to the text and its
// background-position sweeps across, giving a subtle moving sheen. Hand-written.
//
// Reduced-motion: renders a static solid `text-primary` span (no sweep), so the
// accent colour stays but nothing animates.
export function ShimmerText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <span className={`text-primary ${className ?? ""}`}>{children}</span>;
  }

  return (
    <motion.span
      className={`bg-clip-text text-transparent ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(110deg, var(--primary) 30%, color-mix(in oklch, var(--primary), white 55%) 50%, var(--primary) 70%)",
        backgroundSize: "220% 100%",
        // Keep the clipped fill crisp across engines.
        WebkitBackgroundClip: "text",
      }}
      initial={{ backgroundPositionX: "120%" }}
      animate={{ backgroundPositionX: "-20%" }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.span>
  );
}
