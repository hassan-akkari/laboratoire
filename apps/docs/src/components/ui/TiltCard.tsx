"use client";

import type { PointerEvent, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "../../lib/useReducedMotionSafe";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
};

/** Max tilt in degrees — subtle on purpose; this is depth, not a gimmick. */
const MAX_TILT = 1.8;

const SPRING = { stiffness: 210, damping: 27, restDelta: 0.001 };

/**
 * Pointer-following 3D tilt (motion-v2 Tier 2). Mouse-only by contract
 * (pointerType guard — touch scrolling must never wiggle cards), springs
 * back to flat on leave, plain div under reduced motion.
 *
 * Composition note: the tilt lives on framer's `transform`; the card-hover
 * lift lives on the CSS `translate` property — separate properties, no
 * override fights (the original card-lift lesson).
 */
export default function TiltCard({ children, className }: TiltCardProps) {
  const reduceMotion = useReducedMotionSafe();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(
    useTransform(py, [0, 1], [MAX_TILT, -MAX_TILT]),
    SPRING,
  );
  const rotateY = useSpring(
    useTransform(px, [0, 1], [-MAX_TILT, MAX_TILT]),
    SPRING,
  );

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1300 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
