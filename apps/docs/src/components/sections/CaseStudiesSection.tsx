import { motion, useReducedMotion } from "framer-motion";
import Container from "../layout/Container";
import Section from "../layout/Section";
import type { Locale } from "../../i18n/locale";
import { getCaseStudiesContent } from "../../data/caseStudies";
import {
  fadeUpVariants,
  getInViewReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type CaseStudiesSectionProps = {
  locale: Locale;
};

export default function CaseStudiesSection({
  locale,
}: CaseStudiesSectionProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const content = getCaseStudiesContent(locale);

  return (
    <Section id="case-studies">
      <Container>
        <motion.div
          variants={fadeUpVariants}
          {...getInViewReveal(reduceMotion, 0.22)}
          className="max-w-2xl"
        >
          <p className="mb-3 text-sm uppercase tracking-[0.18em] text-[var(--app-muted)]">
            {content.sectionLabel}
          </p>
          <h2 className="text-3xl md:text-4xl">{content.title}</h2>
          <p className="mt-4 text-base text-[var(--app-muted)]">
            {content.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="mt-12 space-y-6"
          variants={staggerChildrenVariants}
          {...getInViewReveal(reduceMotion, 0.08)}
        >
          {content.caseStudies.map((study) => (
            <motion.article
              key={study.id}
              variants={fadeUpVariants}
              className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-7"
            >
              <header>
                <h3 className="text-2xl">{study.title}</h3>
                <p className="mt-2 text-sm text-[var(--app-muted)]">
                  {study.context}
                </p>
              </header>

              <div className="mt-5 grid gap-6 md:grid-cols-3">
                <div>
                  <h4 className="text-xs uppercase tracking-[0.18em] text-[var(--app-muted)]">
                    {content.labels.problem}
                  </h4>
                  <p className="mt-2 text-sm">{study.problem}</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-[0.18em] text-[var(--app-muted)]">
                    {content.labels.solution}
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    {study.solution.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-[var(--app-accent)]">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-[0.18em] text-[var(--app-muted)]">
                    {content.labels.result}
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    {study.result.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-[var(--app-accent)]">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--app-border)] pt-4 text-xs text-[var(--app-muted)]">
                <span>
                  <strong className="text-[var(--app-fg)]">
                    {content.labels.stack}:
                  </strong>{" "}
                  {study.stack.join(" · ")}
                </span>
                <span className="italic">
                  {content.labels.proves}: {study.proves}
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
