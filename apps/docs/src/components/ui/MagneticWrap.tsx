"use client";

import { useRef, type ReactNode } from "react";
import { motion, useSpring } from "framer-motion";
import { useReducedMotionSafe } from "../../lib/useReducedMotionSafe";

type MagneticWrapProps = {
  children: ReactNode;
  className?: string;
  /** Fraction of the pointer's offset-from-center applied to the child. */
  strength?: number;
  /** Hard cap (px) so large hit areas can't fling the child around. */
  maxOffset?: number;
};

function clampOffset(value: number, max: number): number {
  return Math.min(max, Math.max(-max, value));
}

/**
 * Magnetic hover: the wrapped element leans a few spring-driven pixels toward
 * the cursor and snaps back on leave. Mouse-only (pointerType check), capped
 * at `maxOffset`, and rendered as a plain div under reduced motion — both
 * branches emit a <div>, so hydration stays consistent while
 * useReducedMotionSafe resolves.
 *
 * Transform starts at 0/0, so nothing is serialized into the prerendered
 * HTML (SSR visibility rule — see HeroSection).
 */
export default function MagneticWrap({
  children,
  className,
  strength = 0.22,
  maxOffset = 7,
}: MagneticWrapProps) {
  const reduceMotion = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 260, damping: 20, mass: 0.6 });
  const y = useSpring(0, { stiffness: 260, damping: 20, mass: 0.6 });

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(
      clampOffset((event.clientX - rect.left - rect.width / 2) * strength, maxOffset),
    );
    y.set(
      clampOffset((event.clientY - rect.top - rect.height / 2) * strength, maxOffset),
    );
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </motion.div>
  );
}
