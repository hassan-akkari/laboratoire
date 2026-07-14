"use client";

import { useCallback, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
} from "framer-motion";
import { useReducedMotionSafe } from "../../lib/useReducedMotionSafe";
import Container from "../layout/Container";
import Section from "../layout/Section";
import WordReveal from "../ui/WordReveal";
import type { Locale } from "../../i18n/locale";
import { getProcessContent } from "../../data/processSteps";
import type { ProcessStep } from "../../data/processSteps";
import {
  easeOutQuart,
  fadeUpVariants,
  getInViewReveal,
} from "../ui/motionPresets";

type ProcessSectionProps = {
  locale: Locale;
};

/**
 * Viewport band (IntersectionObserver rootMargin) that decides which step is
 * "active": a step activates while it overlaps the middle ~14% strip of the
 * viewport — narrow enough that at most two steps ever sit inside it.
 */
const ACTIVATION_BAND = "-43% 0px -43% 0px";

/**
 * Process scrollytelling (motion-v2). The section header pins in a sticky
 * aside (≥lg) with a big Space Grotesk counter of the active step — the same
 * editorial numbering language as the mobile menu — while the steps column
 * scrolls past. An SVG rail draws in sync with scroll (spring-smoothed
 * pathLength), dots fill as steps are passed, and the step crossing the
 * viewport-center band takes the ink while the others dim.
 *
 * SSR rules (same contract as HeroSection):
 *   - `activeIndex` starts at -1 → the prerendered HTML ships every step at
 *     full opacity and every dot "upcoming"; scroll state never serializes
 *     into the static HTML.
 *   - Step activation uses framer's onViewportEnter/onViewportLeave event
 *     callbacks — not a useInView + useEffect echo, which would trip
 *     `react-hooks/set-state-in-effect` (see useHideOnScroll).
 *   - Dimming is a CSS class via data-state, NEVER a framer inline style: an
 *     inline opacity would permanently override the class (the same
 *     inline-vs-stylesheet conflict that killed the card-hover lift).
 *   - Reduced motion: rail fully drawn, dots filled, no dimming, counter
 *     swaps instantly.
 */
export default function ProcessSection({ locale }: ProcessSectionProps) {
  const reduceMotion = useReducedMotionSafe();
  const content = getProcessContent(locale);

  // -1 = neutral (pre-scroll / prerender): nothing dimmed, nothing filled.
  const [activeIndex, setActiveIndex] = useState(-1);
  const inBand = useRef<Set<number>>(new Set());

  // A step reports entering/leaving the activation band; the active step is
  // the furthest one currently inside it. An empty band (fast scroll between
  // tall steps, or the section leaving the viewport) keeps the last active
  // step instead of flickering back to neutral.
  const handleBandChange = useCallback((index: number, entered: boolean) => {
    const band = inBand.current;
    if (entered) {
      band.add(index);
    } else {
      band.delete(index);
    }
    if (band.size > 0) {
      setActiveIndex(Math.max(...band));
    }
  }, []);

  // Rail draw: the line tip roughly tracks the activation band while the
  // steps column moves through the viewport. Spring-smoothed so the tip
  // glides instead of ticking with the scroll wheel.
  const trackRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.78", "end 0.42"],
  });
  const drawn = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  const shownNumber = content.steps[Math.max(activeIndex, 0)].number;
  const totalLabel = String(content.steps.length).padStart(2, "0");

  return (
    <Section id="process">
      <Container>
        <div className="process-scrolly">
          <div className="process-scrolly__aside">
            <motion.div
              variants={fadeUpVariants}
              {...getInViewReveal(reduceMotion, 0.22)}
            >
              <p className="section-eyebrow mb-3 text-sm uppercase tracking-[0.18em]">
                {content.sectionLabel}
              </p>
              <WordReveal
                as="h2"
                className="text-3xl md:text-4xl"
                text={content.title}
              />
              <p className="mt-4 text-base text-(--app-muted)">
                {content.subtitle}
              </p>

              <div className="process-scrolly__counter" aria-hidden="true">
                <span className="process-scrolly__counter-live">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={shownNumber}
                      initial={{ y: "0.9em", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-0.9em", opacity: 0 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.45,
                        ease: easeOutQuart,
                      }}
                    >
                      {shownNumber}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="process-scrolly__counter-total">
                  / {totalLabel}
                </span>
              </div>
            </motion.div>
          </div>

          <div className="process-track">
            <svg
              className="process-rail"
              viewBox="0 0 2 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <path className="process-rail__base" d="M1 0 L1 100" />
              <motion.path
                className="process-rail__draw"
                d="M1 0 L1 100"
                style={{ pathLength: reduceMotion ? 1 : drawn }}
              />
            </svg>

            <ol ref={trackRef} className="process-steps">
              {content.steps.map((step, index) => (
                <ProcessStepItem
                  key={step.id}
                  step={step}
                  index={index}
                  activeIndex={activeIndex}
                  reduceMotion={reduceMotion}
                  onBandChange={handleBandChange}
                />
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Section>
  );
}

type ProcessStepItemProps = {
  step: ProcessStep;
  index: number;
  activeIndex: number;
  reduceMotion: boolean;
  onBandChange: (index: number, entered: boolean) => void;
};

function ProcessStepItem({
  step,
  index,
  activeIndex,
  reduceMotion,
  onBandChange,
}: ProcessStepItemProps) {
  // Reduced motion reads as the finished state: everything inked, dots done.
  const state = reduceMotion
    ? "idle"
    : activeIndex === -1
      ? "idle"
      : index === activeIndex
        ? "active"
        : "dim";
  const dot = reduceMotion
    ? "done"
    : activeIndex === -1
      ? "upcoming"
      : index < activeIndex
        ? "done"
        : index === activeIndex
          ? "active"
          : "upcoming";

  return (
    <motion.li
      className="process-step"
      data-state={state}
      data-dot={dot}
      viewport={{ margin: ACTIVATION_BAND }}
      onViewportEnter={() => onBandChange(index, true)}
      onViewportLeave={() => onBandChange(index, false)}
    >
      <div className="process-step__body">
        <span
          aria-hidden="true"
          className="process-step__number text-sm font-semibold tracking-[0.2em]"
        >
          {step.number}
        </span>
        <h3 className="mt-3 text-xl leading-snug md:text-2xl">{step.title}</h3>
        <p className="mt-3 max-w-md text-sm text-(--app-muted) md:text-base">
          {step.description}
        </p>
      </div>
    </motion.li>
  );
}
