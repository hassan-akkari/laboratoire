"use client";

import { useEffect } from "react";

/**
 * One delegated pointermove listener that writes --spot-x/--spot-y (pointer
 * position in card-local px) onto whichever `.card-hover` surface the cursor
 * is over. The glow itself is pure CSS (`.card-hover::after` in
 * portfolio.css), gated behind `(hover:hover) and (pointer:fine)` — this
 * component mirrors that gate so touch devices never pay for the listener.
 *
 * Renders nothing; mount once in the locale layout.
 */
export default function CardSpotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      const card = event.target.closest<HTMLElement>(".card-hover");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => document.removeEventListener("pointermove", onPointerMove);
  }, []);

  return null;
}
