"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "../../lib/useReducedMotionSafe";
import type { CaseStudyVariant } from "../../data/caseStudies";
import { easeOutQuart } from "../ui/motionPresets";

type BookableShowcaseProps = {
  variants: CaseStudyVariant[];
  /** Already resolved to a root-absolute URL by the parent. */
  resolveSrc: (image: string) => string;
  title: string;
};

const AUTO_CYCLE_MS = 3600;

/**
 * Interactive style-switcher for the Bookable project card. Mirrors the app's
 * signature feature: one content model, three design systems, switched live.
 * The screenshots are layered and crossfaded (opacity only — no layout shift);
 * auto-cycling pauses as soon as the user hovers, focuses, or picks a variant.
 */
export default function BookableShowcase({
  variants,
  resolveSrc,
  title,
}: BookableShowcaseProps) {
  const reduceMotion = useReducedMotionSafe();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Once the user interacts, stop auto-cycling for good — they're in control.
  const interactedRef = useRef(false);

  const select = useCallback((index: number) => {
    interactedRef.current = true;
    setActive(index);
  }, []);

  useEffect(() => {
    if (reduceMotion || paused || interactedRef.current) {
      return;
    }
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % variants.length);
    }, AUTO_CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused, variants.length]);

  return (
    <div
      className="bookable-showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="bookable-showcase__stage" aria-live="polite">
        {variants.map((variant, index) => {
          const isActive = index === active;
          return (
            <motion.img
              key={variant.label}
              src={resolveSrc(variant.image)}
              alt={`${title} — ${variant.label} design variant`}
              className="bookable-showcase__frame"
              // Lazy: the showcase sits far below the fold, so ~274 KB of
              // frames must not compete with the hero/LCP on first load. The
              // browser still fetches all three as the section approaches the
              // viewport — well before the auto-rotate needs them.
              loading="lazy"
              decoding="async"
              draggable={false}
              aria-hidden={!isActive}
              initial={false}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.55, ease: easeOutQuart }
              }
              style={{ zIndex: isActive ? 2 : 1 }}
            />
          );
        })}
        <span className="bookable-showcase__hint" aria-hidden="true">
          Live style switch
        </span>
      </div>

      <div
        className="bookable-showcase__tabs"
        role="group"
        aria-label={`${title} design variants`}
      >
        {variants.map((variant, index) => {
          const isActive = index === active;
          return (
            <button
              key={variant.label}
              type="button"
              className={`bookable-showcase__tab${
                isActive ? " is-active" : ""
              }`}
              aria-pressed={isActive}
              onClick={() => select(index)}
            >
              {isActive && !reduceMotion ? (
                <motion.span
                  layoutId="bookable-tab-indicator"
                  className="bookable-showcase__tab-bg"
                  transition={{ duration: 0.3, ease: easeOutQuart }}
                />
              ) : null}
              <span className="bookable-showcase__tab-label">
                {variant.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
