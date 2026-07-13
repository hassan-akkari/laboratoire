"use client";

import { useSyncExternalStore } from "react";

/**
 * Hydration-safe replacement for framer-motion's useReducedMotion: framer
 * reads the media query synchronously in a useState initializer, so the
 * server (always false) and a reduced-motion client's FIRST render (true)
 * disagree — a hydration mismatch on every page for those users.
 *
 * useSyncExternalStore is the canonical fix: React uses the server snapshot
 * (false) during hydration on the client too, then immediately re-syncs to
 * the real media-query value — no mismatch, and live updates for free. The
 * portfolio.css reduced-motion kill switch already zeroes CSS animations
 * before that first re-sync.
 */

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onStoreChange: () => void): () => void {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
