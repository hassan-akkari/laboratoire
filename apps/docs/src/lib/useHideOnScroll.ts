"use client";

import { useEffect, useState } from "react";

/**
 * Hide-on-scroll for the sticky nav: hidden while scrolling DOWN past
 * `threshold`, shown again on any scroll UP (the "senior navbar" pattern —
 * content gets the viewport back, the nav is one flick away).
 *
 * Returns `false` on the server and first client render (SSR-safe: the nav is
 * always visible in the prerendered HTML). The actual hide/show is a CSS
 * transform+transition on the consumer, so the global reduced-motion kill
 * switch makes the toggle instant rather than animated.
 */
export function useHideOnScroll(disabled = false, threshold = 160): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (disabled) return;

    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        // Dead zone so sub-pixel/rubber-band jitter never flickers the nav.
        if (Math.abs(delta) > 6) {
          setHidden(y > threshold && delta > 0);
          lastY = y;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [disabled, threshold]);

  // Derived, not set in the effect (react-hooks/set-state-in-effect): while
  // disabled the nav is always shown, and the stale flag is irrelevant
  // because scroll is locked (menu open) for the whole disabled window.
  return disabled ? false : hidden;
}
