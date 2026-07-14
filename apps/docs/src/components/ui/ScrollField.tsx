"use client";

import { useEffect, useRef } from "react";
import { useReducedMotionSafe } from "../../lib/useReducedMotionSafe";

/**
 * Scroll-reactive particle field (motion-v2 Tier 2, take 2 — replaces the
 * aurora blobs, whose minute-long drift cycles parked them into desaturated
 * stacks at the viewport edge). A fixed full-viewport canvas of small dots
 * on parallax depths: idle they sit almost still with a slow twinkle; while
 * the visitor scrolls they slide at depth-dependent speed and stretch into
 * short motion streaks proportional to scroll velocity, settling the moment
 * scrolling stops. The background answers the scroll instead of decorating
 * around it.
 *
 * Perf/a11y contract: one rAF loop, ~120 particles, plain 2D canvas (no
 * filters, no shadows), DPR capped at 2, loop paused while the tab is
 * hidden. Reduced motion: a single static dot frame — no loop, no streaks —
 * redrawn only on resize/theme change. aria-hidden decoration.
 */

type Particle = {
  x: number; // 0..1 across width
  y: number; // 0..1 across height
  depth: number; // 0..1 — drives parallax speed, size, brightness
  phase: number; // twinkle offset
};

const DENSITY = 1 / 10500; // particles per CSS px²
const MIN_PARTICLES = 70;
const MAX_PARTICLES = 190;
const MAX_STREAK = 84; // px trail on the deepest layer at full velocity

function buildParticles(width: number, height: number): Particle[] {
  const count = Math.min(
    MAX_PARTICLES,
    Math.max(MIN_PARTICLES, Math.round(width * height * DENSITY)),
  );
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    depth: Math.random(),
    phase: Math.random() * Math.PI * 2,
  }));
}

export default function ScrollField() {
  const reduceMotion = useReducedMotionSafe();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let velocity = 0; // smoothed px/frame
    let lastScrollY = window.scrollY;
    let resizeTimer = 0;

    const isLight = () => document.documentElement.classList.contains("light");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = buildParticles(width, height);
    };

    const draw = (time: number, scrollY: number) => {
      context.clearRect(0, 0, width, height);
      const light = isLight();
      const rgb = light ? "24, 26, 34" : "232, 234, 244";
      const baseAlpha = light ? 0.34 : 0.42;
      const speedBoost = Math.min(Math.abs(velocity) / 46, 0.5);

      for (const p of particles) {
        // Deeper (closer) particles scroll faster and streak longer — the
        // whole field shears with depth instead of sliding as one sheet.
        const parallax = 0.08 + 0.3 * p.depth;
        const px = p.x * width;
        const py =
          (((p.y * height - scrollY * parallax) % height) + height) % height;
        const radius = 0.6 + 1.2 * p.depth;
        const twinkle = reduceMotion
          ? 1
          : 0.78 +
            0.22 * Math.sin(time * 0.0011 * (0.6 + p.depth) + p.phase);
        const alpha =
          baseAlpha * (0.3 + 0.7 * p.depth) * twinkle * (1 + speedBoost);
        const streak = reduceMotion
          ? 0
          : Math.max(
              -MAX_STREAK,
              Math.min(MAX_STREAK, velocity * (0.2 + 0.8 * p.depth) * 0.6),
            );

        if (Math.abs(streak) < 1.2) {
          context.beginPath();
          context.arc(px, py, radius, 0, Math.PI * 2);
          context.fillStyle = `rgba(${rgb}, ${alpha})`;
          context.fill();
        } else {
          // Trail points opposite the on-screen motion, like exposure blur.
          context.beginPath();
          context.moveTo(px, py);
          context.lineTo(px, py + streak);
          context.lineWidth = radius * 1.5;
          context.lineCap = "round";
          context.strokeStyle = `rgba(${rgb}, ${Math.min(alpha, 0.8)})`;
          context.stroke();
        }
      }
    };

    const tick = (time: number) => {
      const scrollY = window.scrollY;
      velocity += (scrollY - lastScrollY - velocity) * 0.16;
      lastScrollY = scrollY;
      if (Math.abs(velocity) < 0.01) velocity = 0;
      draw(time, scrollY);
      raf = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (raf) return;
      lastScrollY = window.scrollY;
      raf = window.requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
    };

    const handleVisibility = () => {
      if (document.hidden) stopLoop();
      else if (!reduceMotion) startLoop();
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        if (reduceMotion) draw(0, window.scrollY);
      }, 120);
    };

    resize();

    let themeObserver: MutationObserver | undefined;
    if (reduceMotion) {
      draw(0, window.scrollY);
      // No running loop to pick up a theme flip — watch the class instead.
      themeObserver = new MutationObserver(() => draw(0, window.scrollY));
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    } else {
      startLoop();
    }

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stopLoop();
      window.clearTimeout(resizeTimer);
      themeObserver?.disconnect();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className="scroll-field" aria-hidden="true" />;
}
