"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "../../lib/useReducedMotionSafe";
import Container from "../layout/Container";
import Section from "../layout/Section";
import TiltCard from "../ui/TiltCard";
import WordReveal from "../ui/WordReveal";
import type { Locale } from "../../i18n/locale";
import { localePath } from "../../i18n/routing";
import {
  getCaseStudiesContent,
  type CaseStudiesContent,
  type CaseStudy,
} from "../../data/caseStudies";
import {
  caseStudyPath,
  type ProfessionalCaseStudyCard,
  type ProfessionalCaseStudyLabels,
} from "../../data/professionalCaseStudies";
import BookableShowcase from "./BookableShowcase";
import {
  fadeUpVariants,
  getInViewReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type CaseStudiesSectionProps = {
  locale: Locale;
  /** Card projection of the professional studies — the full text stays on the server. */
  professional: ProfessionalCaseStudyCard[];
  professionalLabels: ProfessionalCaseStudyLabels;
};

const LABEL_CLASS = "text-xs uppercase tracking-[0.18em] text-(--app-muted)";

/**
 * Home #case-studies, in three groups so a hiring manager never mistakes one
 * for the other: (1) the personal flagship, mine end to end with demo and
 * source; (2) the three anonymized professional case studies, each linking to
 * its detail page; (3) the remaining professional cards without a deep dive.
 * Heading order is h2 (section) → h3 (group) → h4 (card); the field labels
 * inside a card are plain text, not headings.
 */
export default function CaseStudiesSection({
  locale,
  professional,
  professionalLabels,
}: CaseStudiesSectionProps) {
  const reduceMotion = useReducedMotionSafe();
  const content = getCaseStudiesContent(locale);
  const personal = content.caseStudies.filter((study) => study.kind === "personal");
  const otherProfessional = content.caseStudies.filter(
    (study) => study.kind === "professional",
  );

  return (
    <Section id="case-studies">
      <Container>
        <motion.div
          variants={fadeUpVariants}
          {...getInViewReveal(reduceMotion, 0.22)}
          className="max-w-2xl"
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
        </motion.div>

        <motion.div
          className="mt-12"
          variants={staggerChildrenVariants}
          {...getInViewReveal(reduceMotion, 0.08)}
        >
          <motion.h3
            variants={fadeUpVariants}
            className="section-eyebrow text-sm uppercase tracking-[0.18em]"
          >
            {professionalLabels.groupPersonal}
          </motion.h3>
          <div className="mt-5 space-y-6">
            {personal.map((study) => (
              <motion.article key={study.id} variants={fadeUpVariants}>
                <ProjectCard study={study} labels={content.labels} />
              </motion.article>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-16"
          variants={staggerChildrenVariants}
          {...getInViewReveal(reduceMotion, 0.08)}
        >
          <motion.div variants={fadeUpVariants} className="max-w-2xl">
            <h3 className="section-eyebrow text-sm uppercase tracking-[0.18em]">
              {professionalLabels.groupProfessional}
            </h3>
            <p className="mt-3 text-sm text-(--app-muted)">
              {professionalLabels.groupProfessionalIntro}
            </p>
          </motion.div>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {professional.map((card) => (
              <motion.article
                key={card.slug}
                variants={fadeUpVariants}
                className="flex"
              >
                <ProfessionalCard
                  card={card}
                  locale={locale}
                  labels={professionalLabels}
                />
              </motion.article>
            ))}
          </div>
        </motion.div>

        {otherProfessional.length > 0 ? (
          <motion.div
            className="mt-16"
            variants={staggerChildrenVariants}
            {...getInViewReveal(reduceMotion, 0.08)}
          >
            <motion.h3
              variants={fadeUpVariants}
              className="section-eyebrow text-sm uppercase tracking-[0.18em]"
            >
              {professionalLabels.groupOther}
            </motion.h3>
            <div className="mt-5 space-y-6">
              {otherProfessional.map((study) => (
                <motion.article key={study.id} variants={fadeUpVariants}>
                  <ProjectCard study={study} labels={content.labels} />
                </motion.article>
              ))}
            </div>
          </motion.div>
        ) : null}
      </Container>
    </Section>
  );
}

/** Compact card for one professional case study; the story lives on its page. */
function ProfessionalCard({
  card,
  locale,
  labels,
}: {
  card: ProfessionalCaseStudyCard;
  locale: Locale;
  labels: ProfessionalCaseStudyLabels;
}) {
  return (
    <TiltCard className="card-hover flex flex-1 flex-col rounded-2xl border border-(--app-border) bg-(--app-card) p-6">
      <p className={LABEL_CLASS}>{card.eyebrow}</p>
      <h4 className="mt-3 text-xl leading-snug">{card.title}</h4>
      <p className="mt-3 text-sm text-(--app-muted)">{card.teaser}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {card.highlights.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-(--accent-ink)" aria-hidden="true">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-(--app-muted)">
        <strong className="text-(--app-fg)">{labels.stack}:</strong>{" "}
        {card.stack.join(" · ")}
      </p>
      <div className="mt-auto pt-5">
        <Link
          href={localePath(locale, caseStudyPath(card.slug))}
          className="cta-secondary inline-flex items-center gap-2 rounded-full border border-(--app-border) px-4 py-2 text-sm font-semibold"
        >
          {labels.readMore}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </TiltCard>
  );
}

/** Full card (problem / what I did / result, optional showcase and links). */
function ProjectCard({
  study,
  labels,
}: {
  study: CaseStudy;
  labels: CaseStudiesContent["labels"];
}) {
  return (
    // Tilt lives on an inner wrapper: the article carries the reveal variants
    // (framer transform), the TiltCard carries the pointer rotation — nested
    // transforms compose cleanly.
    <TiltCard className="card-hover rounded-2xl border border-(--app-border) bg-(--app-card) p-7">
      <header>
        <h4 className="text-2xl">{study.title}</h4>
        <p className="mt-2 text-sm text-(--app-muted)">{study.context}</p>
      </header>

      {study.variants && study.variants.length > 1 ? (
        <div className="mt-5 overflow-hidden rounded-xl border border-(--app-border)">
          <BookableShowcase
            variants={study.variants}
            resolveSrc={(image) => `/${image.replace(/^\//, "")}`}
            title={study.title}
          />
        </div>
      ) : null}

      <div className="mt-5 grid gap-6 md:grid-cols-3">
        <div>
          <p className={LABEL_CLASS}>{labels.problem}</p>
          <p className="mt-2 text-sm">{study.problem}</p>
        </div>
        <div>
          <p className={LABEL_CLASS}>{labels.solution}</p>
          <ul className="mt-2 space-y-2 text-sm">
            {study.solution.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-(--accent-ink)" aria-hidden="true">
                  →
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={LABEL_CLASS}>{labels.result}</p>
          <ul className="mt-2 space-y-2 text-sm">
            {study.result.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-(--accent-ink)" aria-hidden="true">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-(--app-border) pt-4 text-xs text-(--app-muted)">
        <span>
          <strong className="text-(--app-fg)">{labels.stack}:</strong>{" "}
          {study.stack.join(" · ")}
        </span>
        <span className="italic">
          {labels.proves}: {study.proves}
        </span>
      </div>

      {study.limits && study.limits.length > 0 ? (
        <div className="mt-5">
          <p className={LABEL_CLASS}>{labels.limits}</p>
          <ul className="mt-2 grid gap-2 text-sm text-(--app-muted) md:grid-cols-2">
            {study.limits.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true">–</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {study.liveUrl || study.repoUrl ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {study.liveUrl ? (
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary inline-flex items-center gap-2 rounded-full border border-(--app-accent) bg-(--app-accent) px-4 py-2 text-sm font-semibold text-white"
            >
              {labels.viewLive}
              <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          {study.repoUrl ? (
            <a
              href={study.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-secondary inline-flex items-center gap-2 rounded-full border border-(--app-border) px-4 py-2 text-sm font-semibold"
            >
              {labels.viewCode}
              <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      ) : null}
    </TiltCard>
  );
}
