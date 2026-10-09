import Link from "next/link";
import type { ReactNode } from "react";

import "@/styles/case-study.css";

import Container from "../layout/Container";
import Section from "../layout/Section";
import LocaleSwitcher from "../ui/LocaleSwitcher";
import type { Locale } from "../../i18n/locale";
import { localePath } from "../../i18n/routing";
import type { Messages } from "../../i18n/messages";
import {
  caseStudyPath,
  type CaseStudyMetric,
  type ProfessionalCaseStudy,
  type ProfessionalCaseStudyLabels,
} from "../../data/professionalCaseStudies";

type CaseStudyDetailPageProps = {
  locale: Locale;
  labels: Messages;
  t: ProfessionalCaseStudyLabels;
  study: ProfessionalCaseStudy;
  previous?: ProfessionalCaseStudy;
  next?: ProfessionalCaseStudy;
};

/**
 * Detail page of one professional case study. Server component on purpose —
 * like the notes and privacy pages: no hooks, no framer reveal, so every
 * paragraph is in the static HTML, readable by crawlers, with JS disabled and
 * under prefers-reduced-motion. The route template still animates client-side
 * navigations. Structure is fixed across the three studies (context → my
 * part → decisions → the hard part → result + numbers → limits → proof →
 * attribution) so a reader can compare them.
 */

function Block({
  id,
  title,
  className = "",
  children,
}: {
  id: string;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={className ? `cs-block ${className}` : "cs-block"}
      aria-labelledby={id}
    >
      <h2 id={id} className="cs-block__title">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Metric({
  metric,
  t,
}: {
  metric: CaseStudyMetric;
  t: ProfessionalCaseStudyLabels;
}) {
  const isPair = metric.before !== undefined && metric.after !== undefined;
  return (
    <li className="cs-metric">
      <span className="cs-metric__label">{metric.label}</span>
      {isPair ? (
        <span className="cs-metric__pair">
          <span className="cs-metric__cell">
            <small>{t.metricBefore}</small>
            <strong>{metric.before}</strong>
          </span>
          <span className="cs-metric__arrow" aria-hidden="true">
            →
          </span>
          <span className="cs-metric__cell">
            <small>{t.metricAfter}</small>
            <strong>{metric.after}</strong>
          </span>
        </span>
      ) : (
        <strong className="cs-metric__value">{metric.value}</strong>
      )}
      {metric.note ? <span className="cs-metric__note">{metric.note}</span> : null}
    </li>
  );
}

function PagerLink({
  study,
  label,
  locale,
  direction,
}: {
  study: ProfessionalCaseStudy;
  label: string;
  locale: Locale;
  direction: "prev" | "next";
}) {
  return (
    <Link
      href={localePath(locale, caseStudyPath(study.slug))}
      className={`cs-pager__link cs-pager__link--${direction}`}
    >
      <small>{label}</small>
      <span>{study.title}</span>
    </Link>
  );
}

export default function CaseStudyDetailPage({
  locale,
  labels,
  t,
  study,
  previous,
  next,
}: CaseStudyDetailPageProps) {
  const projectsHref = `${localePath(locale)}#case-studies`;

  return (
    <Section id="case-study">
      <Container>
        <article className="cs-page">
          <div className="cs-topbar">
            <p className="cs-back">
              <Link href={projectsHref}>← {t.backToProjects}</Link>
            </p>
            <LocaleSwitcher locale={locale} labels={labels.locale} />
          </div>

          <header className="cs-header">
            <p className="section-eyebrow cs-eyebrow">
              {study.eyebrow} · {study.period}
            </p>
            <h1 className="cs-title">{study.title}</h1>
            <p className="cs-lead">{study.summary}</p>
            <dl className="cs-facts">
              <div>
                <dt>{t.role}</dt>
                <dd>{study.role}</dd>
              </div>
              <div>
                <dt>{t.stack}</dt>
                <dd>
                  <ul className="cs-chips">
                    {study.stack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </header>

          <Block id="cs-glance" title={t.atAGlance}>
            <ul className="cs-glance">
              {study.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Block>

          <Block id="cs-context" title={t.context}>
            {study.context.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Block>

          <Block id="cs-contribution" title={t.contribution}>
            <ul className="cs-list">
              {study.contribution.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Block>

          <Block id="cs-decisions" title={t.decisions}>
            <div className="cs-decisions">
              {study.decisions.map((decision) => (
                <div key={decision.title} className="cs-decision">
                  <h3>{decision.title}</h3>
                  <p>{decision.body}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block id="cs-difficulty" title={t.difficulty}>
            {study.difficulty.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Block>

          <Block id="cs-results" title={t.results}>
            <ul className="cs-list cs-list--check">
              {study.results.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3 className="cs-subtitle">{t.metrics}</h3>
            <ul className="cs-metrics">
              {study.metrics.map((metric) => (
                <Metric key={metric.label} metric={metric} t={t} />
              ))}
            </ul>
          </Block>

          <Block id="cs-limits" title={t.limits} className="cs-block--limits">
            <ul className="cs-list cs-list--dash">
              {study.limits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Block>

          <Block id="cs-proves" title={t.proves}>
            <p className="cs-proves">{study.proves}</p>
          </Block>

          <Block id="cs-team" title={t.team}>
            <p>{study.team}</p>
          </Block>

          <aside className="cs-cv" aria-labelledby="cs-cv-title">
            <h2 id="cs-cv-title">{t.cvTitle}</h2>
            <p>{t.cvBody}</p>
            <Link href={localePath(locale, "/cv")} className="cta-secondary cs-cta">
              {t.cvLink}
              <span aria-hidden="true">→</span>
            </Link>
          </aside>

          {previous || next ? (
            <nav className="cs-pager" aria-label={t.otherStudies}>
              {previous ? (
                <PagerLink
                  study={previous}
                  label={t.previous}
                  locale={locale}
                  direction="prev"
                />
              ) : (
                <span aria-hidden="true" />
              )}
              {next ? (
                <PagerLink study={next} label={t.next} locale={locale} direction="next" />
              ) : (
                <span aria-hidden="true" />
              )}
            </nav>
          ) : null}
        </article>
      </Container>
    </Section>
  );
}
