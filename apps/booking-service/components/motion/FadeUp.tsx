"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Small client island: fade + rise an element on first paint. Used for hero
// blocks. Honours prefers-reduced-motion — when set, it renders the content
// statically (no transform, no opacity animation) so nothing moves.
export function FadeUp({
  children,
  className,
  delay = 0,
  y = 16,
  as = "div",
  style,
}: {
  children: ReactNode;
  className?: string;
  /** Stagger offset in seconds. */
  delay?: number;
  /** Initial vertical offset in px. */
  y?: number;
  /** Rendered element/tag. */
  as?: "div" | "section" | "header" | "p" | "span";
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
