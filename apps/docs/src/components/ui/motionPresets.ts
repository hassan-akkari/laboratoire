import type { Variants } from "framer-motion";

export const easeOutQuart = [0.25, 1, 0.5, 1] as const;

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: easeOutQuart },
  },
};

export const softFadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.42, ease: easeOutQuart },
  },
};

export const tabSwitchVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.26, ease: easeOutQuart },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: easeOutQuart },
  },
};

export const staggerChildrenVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.09,
    },
  },
};

export const routeTransitionVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease: easeOutQuart },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.22, ease: easeOutQuart },
  },
};

export function getInViewReveal(disableMotion: boolean, amount = 0.2) {
  if (disableMotion) {
    return { initial: false as const };
  }

  return {
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, amount },
  };
}

export function getMountReveal(disableMotion: boolean) {
  if (disableMotion) {
    return { initial: false as const };
  }

  return {
    initial: "hidden" as const,
    animate: "visible" as const,
  };
}
