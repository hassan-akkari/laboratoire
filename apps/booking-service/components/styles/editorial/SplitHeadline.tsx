"use client";

import { Fragment, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

// React Bits-style "split text" reveal for the editorial hero headline: each
// word rises and fades in, staggered, for a calm magazine-masthead entrance.
// Hand-written (no extra dep). Segments let us style runs (e.g. an italic word)
// while keeping the per-word stagger.
//
// Reduced-motion: renders the words statically with no animation.

export type HeadlineSegment = {
  /** The text run; split into words for the stagger. */
  text: string;
  /** Optional class applied to every word in this run (e.g. "italic"). */
  className?: string;
};

const word = {
  hidden: { opacity: 0, y: "0.5em" },
  show: {
    opacity: 1,
    y: "0em",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export function SplitHeadline({
  segments,
  className,
  id,
}: {
  segments: HeadlineSegment[];
  className?: string;
  id?: string;
}) {
  const reduce = useReducedMotion();

  // Build a flat, accessible string for screen readers; the visible words are
  // aria-hidden so the heading isn't announced word-by-word.
  const flat = segments.map((s) => s.text).join("");

  if (reduce) {
    return (
      <h1 id={id} className={className}>
        {segments.map((s, i) => (
          <span key={i} className={s.className}>
            {s.text}
          </span>
        ))}
      </h1>
    );
  }

  return (
    <h1 id={id} className={className}>
      <span className="sr-only">{flat}</span>
      <motion.span
        aria-hidden="true"
        variants={container}
        initial="hidden"
        animate="show"
        className="inline"
      >
        {segments.map((seg, si) => {
          // Split into words, preserving the trailing spaces between them.
          const parts = seg.text.split(/(\s+)/);
          return (
            <Fragment key={si}>
              {parts.map((part, pi) => {
                if (/^\s+$/.test(part)) return <Fragment key={pi}>{part}</Fragment>;
                if (part === "") return null;
                return (
                  <span
                    key={pi}
                    className="inline-block overflow-hidden align-bottom"
                  >
                    <motion.span
                      variants={word}
                      className={`inline-block ${seg.className ?? ""}`}
                    >
                      {part as ReactNode}
                    </motion.span>
                  </span>
                );
              })}
            </Fragment>
          );
        })}
      </motion.span>
    </h1>
  );
}
