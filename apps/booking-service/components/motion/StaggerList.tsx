"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Stagger-in container + item, for the service-card grids. The parent
// orchestrates a ~55ms cascade; each item fades + rises. Reduced-motion renders
// plain elements with no animation. Use <StaggerList as="ul"> with
// <StaggerItem as="li"> children so the markup stays semantic.
//
// The prop surface is intentionally small (className + a couple of passthrough
// a11y attributes). The list/item tags are a small closed union, so we resolve
// the concrete motion component and render it without forwarding a tag-specific
// prop bag (which would clash across the union).

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type ListTag = "ul" | "ol" | "div" | "dl";
type ItemTag = "li" | "div";

type CommonProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
};

export function StaggerList({
  children,
  className,
  as = "ul",
  id,
  "aria-label": ariaLabel,
}: CommonProps & { as?: ListTag }) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Tag = as;
    return (
      <Tag className={className} id={id} aria-label={ariaLabel}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      id={id}
      aria-label={ariaLabel}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "li",
  id,
  "aria-label": ariaLabel,
}: CommonProps & { as?: ItemTag }) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Tag = as;
    return (
      <Tag className={className} id={id} aria-label={ariaLabel}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      id={id}
      aria-label={ariaLabel}
      variants={item}
    >
      {children}
    </MotionTag>
  );
}
