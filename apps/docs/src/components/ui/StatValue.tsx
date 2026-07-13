"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { useReducedMotionSafe } from "../../lib/useReducedMotionSafe";

type StatValueProps = {
  /** Raw stat string, e.g. "5+", "24h", "0". */
  value: string;
};

/**
 * Count-up stat: the number rolls 0 → target the first time it scrolls into
 * view. Three invariants:
 *   - SSR/first paint shows the FINAL value (state initializes to the target),
 *     so crawlers/no-JS/hydration all see the real number;
 *   - a hidden ghost span reserves the final width, so the rolling digits
 *     never shift layout;
 *   - a visually-hidden span carries the stable value for screen readers
 *     (the animated span is aria-hidden).
 * Reduced motion or a non-numeric-leading value ⇒ static text.
 */
export default function StatValue({ value }: StatValueProps) {
  const match = /^(\d+)(.*)$/.exec(value.trim());
  const target = match ? Number(match[1]) : null;
  const suffix = match?.[2] ?? "";

  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotionSafe();
  const [display, setDisplay] = useState<number | null>(target);

  useEffect(() => {
    if (!inView || reduceMotion || target === null || target <= 0) return;
    const controls = animate(0, target, {
      duration: 1.1,
      ease: [0.25, 1, 0.5, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, target]);

  if (target === null) {
    return <>{value}</>;
  }

  return (
    <span ref={ref} className="stat-value">
      <span className="stat-value__live" aria-hidden="true">
        {display}
        {suffix}
      </span>
      <span className="stat-value__ghost" aria-hidden="true">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
