"use client";

import { useState, type ReactNode } from "react";
import { AppButton } from "@laboratoire/ui";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "../../lib/useReducedMotionSafe";
import Container from "../layout/Container";
import type { PortfolioContent } from "../../content/portfolioContent";
import type { Locale } from "../../i18n/locale";
import { localePath } from "../../i18n/routing";
import type { Messages } from "../../i18n/messages";
import LocaleSwitcher from "../ui/LocaleSwitcher";
import WordReveal from "../ui/WordReveal";
import { LOCALES } from "../../i18n/locale";
import {
  easeOutQuart,
  fadeUpVariants,
  getMountReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type CvPageProps = {
  content: PortfolioContent;
  locale: Locale;
  labels: Messages;
};

/**
 * Vertical hairline along the experience/education blocks that draws in on
 * first scroll-in (micro echo of the home process rail). Static under
 * reduced motion; in print it renders fully drawn via the print override.
 */
function TimelineRail({ reduceMotion }: { reduceMotion: boolean }) {
  if (reduceMotion) {
    return <span className="cv-timeline__rail" aria-hidden="true" />;
  }
  return (
    <motion.span
      className="cv-timeline__rail"
      aria-hidden="true"
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true, amount: 0.1, margin: "200% 0px -10% 0px" }}
      transition={{ duration: 1.1, ease: easeOutQuart }}
    />
  );
}

/**
 * Screen-only progressive disclosure: the web CV is the scannable trailer,
 * the full prose stays one tap away. In PRINT the body is always visible
 * (the paper document keeps every word) and the toggle disappears — which
 * is why this is a controlled div and not <details> (a closed <details>
 * cannot be reliably forced open from print CSS).
 */
function CvDisclosure({
  labels,
  children,
}: {
  labels: Messages["cv"];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cv-more">
      <button
        type="button"
        className="cv-more__toggle cv-no-print"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="faq-icon" data-open={open || undefined} aria-hidden="true" />
        {open ? labels.showLess : labels.readMore}
      </button>
      <div className="cv-more__body" hidden={!open}>
        {children}
      </div>
    </div>
  );
}

/**
 * Impact highlights ship as "Title\nBefore: …\nAfter: …\nResult: …" strings
 * (locale-translated labels). Split on lines and render label/text rows —
 * the strongest content on the page finally reads as data, not as a lump.
 * Lines without a leading label print as plain rows (defensive).
 */
function ResultCard({ text }: { text: string }) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const [title, ...rows] = lines;
  return (
    <li className="cv-result">
      <h3>{title}</h3>
      {rows.map((row) => {
        const match = row.match(/^([^:]{2,28}):\s*(.+)$/);
        return match ? (
          <p key={row} className="cv-result__row">
            <span className="cv-result__label">{match[1]}</span>
            <span>{match[2]}</span>
          </p>
        ) : (
          <p key={row} className="cv-result__row cv-result__row--plain">
            {row}
          </p>
        );
      })}
    </li>
  );
}

export default function CvPage({ content, locale, labels }: CvPageProps) {
  const reduceMotion = useReducedMotionSafe();
  const handlePrint = () => window.print();
  const resumeHref = content.contact.resumePath;
  // "07/2026" from CV-XXX-07-2026.pdf — the dossier edition line stays in
  // sync with whatever PDF series is currently shipped.
  const edition = resumeHref.match(/(\d{2})-(\d{4})\.pdf$/);
  const dossierMeta = [
    labels.cv.title,
    edition ? `${edition[1]}/${edition[2]}` : null,
    LOCALES.join(" — "),
  ]
    .filter(Boolean)
    .join(" · ");
  const [lead, ...aboutRest] = content.profile.about;
  const stackGroups = [
    { key: "daily", label: labels.about.daily, items: content.stack.daily },
    {
      key: "comfortable",
      label: labels.about.comfortable,
      items: content.stack.comfortable,
    },
    {
      key: "exploring",
      label: labels.about.exploring,
      items: content.stack.exploring,
    },
  ];

  return (
    <main id="cv-page">
      <Container className="cv-container">
        <section className="cv-intro">
          <WordReveal as="h1" text={labels.cv.title} />
          <motion.p variants={fadeUpVariants} {...getMountReveal(reduceMotion)}>
            {labels.cv.subtitle}
          </motion.p>
          <motion.p
            className="cv-dossier-meta"
            variants={fadeUpVariants}
            {...getMountReveal(reduceMotion)}
          >
            {dossierMeta}
          </motion.p>
        </section>

        <motion.header
          className="cv-topbar cv-no-print"
          variants={fadeUpVariants}
          {...getMountReveal(reduceMotion)}
        >
          <LocaleSwitcher locale={locale} labels={labels.locale} />
          <div className="cv-actions">
            <AppButton as="a" href={localePath(locale)} variant="bordered" className="cta-secondary">
              {labels.cv.backToSite}
            </AppButton>
            <AppButton type="button" onClick={handlePrint} className="cta-primary">
              {labels.cv.print}
            </AppButton>
            <AppButton as="a" href={resumeHref} target="_blank" rel="noreferrer" className="cta-primary">
              {labels.cv.downloadOriginal}
            </AppButton>
          </div>
        </motion.header>

        <div className="cv-layout">
          {/* Sticky identity rail: who/where/contacts/stack/languages stay
              on screen while the story column scrolls. */}
          <motion.aside
            className="cv-paper cv-side"
            variants={fadeUpVariants}
            {...getMountReveal(reduceMotion)}
          >
            <header className="cv-header">
              <h2>{content.profile.name}</h2>
              <p className="cv-role">{content.profile.role}</p>
              <p>{content.profile.focus}</p>
              <p>{content.profile.location}</p>
            </header>

            <div className="cv-side__group">
              <p className="cv-side__label">{labels.cv.contact}</p>
              <p>{content.contact.email}</p>
              <p>{content.contact.linkedin}</p>
              <p>{content.contact.github}</p>
            </div>

            <div className="cv-side__group">
              <p className="cv-side__label">{labels.cv.stack}</p>
              {stackGroups.map((group) => (
                <div key={group.key} className="cv-stack-group">
                  <p className="cv-stack-label">{group.label}</p>
                  <ul className="cv-chips" data-category={group.key}>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="cv-side__group">
              <p className="cv-side__label">{labels.cv.general}</p>
              {content.general.map((item) => (
                <p key={item.title}>
                  <strong>{item.title}:</strong> {item.items.join(" / ")}
                </p>
              ))}
            </div>
          </motion.aside>

          <motion.article
            className="cv-paper cv-main"
            variants={staggerChildrenVariants}
            {...getMountReveal(reduceMotion)}
          >
            <motion.section className="cv-section" variants={fadeUpVariants}>
              <h2>{labels.cv.summary}</h2>
              <p className="cv-lead">{lead}</p>
              <p>
                <strong>{labels.about.now}:</strong> {content.profile.now}
              </p>
              {aboutRest.length > 0 ? (
                <CvDisclosure labels={labels.cv}>
                  {aboutRest.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <p>
                    <strong>{labels.about.philosophy}:</strong>{" "}
                    {content.profile.philosophy}
                  </p>
                </CvDisclosure>
              ) : (
                <p>
                  <strong>{labels.about.philosophy}:</strong>{" "}
                  {content.profile.philosophy}
                </p>
              )}
            </motion.section>

            <motion.section className="cv-section" variants={fadeUpVariants}>
              <h2>{labels.cv.impact}</h2>
              <ul className="cv-results">
                {content.highlights.map((item) => (
                  <ResultCard key={item} text={item} />
                ))}
              </ul>
            </motion.section>

            {content.cvProjects && content.cvProjects.length > 0 ? (
              <motion.section className="cv-section" variants={fadeUpVariants}>
                <h2>{labels.cv.projects}</h2>
                {content.cvProjects.map((project) => (
                  <article key={project.name} className="cv-block">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <p className="cv-meta">{project.stack.join(" / ")}</p>
                    {project.liveUrl || project.repoUrl ? (
                      <p className="cv-project-links">
                        {project.liveUrl ? (
                          <a href={project.liveUrl} target="_blank" rel="noreferrer">
                            {project.liveUrl.replace(/^https?:\/\//, "")}
                          </a>
                        ) : null}
                        {project.repoUrl ? (
                          <a href={project.repoUrl} target="_blank" rel="noreferrer">
                            {project.repoUrl.replace(/^https?:\/\//, "")}
                          </a>
                        ) : null}
                      </p>
                    ) : null}
                  </article>
                ))}
              </motion.section>
            ) : null}

            <motion.section
              className="cv-section cv-timeline"
              variants={fadeUpVariants}
            >
              <TimelineRail reduceMotion={reduceMotion} />
              <h2>{labels.cv.experience}</h2>
              {content.experience.map((item) => (
                <article key={`${item.company}-${item.start}`} className="cv-block">
                  <h3>{item.role}</h3>
                  <p className="cv-meta">
                    {item.company} / {item.location} / {item.start} - {item.end}
                  </p>
                  <ul>
                    {item.bullets.slice(0, 2).map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  {item.bullets.length > 2 ? (
                    <CvDisclosure labels={labels.cv}>
                      <ul>
                        {item.bullets.slice(2).map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </CvDisclosure>
                  ) : null}
                </article>
              ))}
            </motion.section>

            <motion.section
              className="cv-section cv-timeline"
              variants={fadeUpVariants}
            >
              <TimelineRail reduceMotion={reduceMotion} />
              <h2>{labels.cv.education}</h2>
              {content.education.map((item) => (
                <article key={`${item.school}-${item.start}`} className="cv-block">
                  <h3>{item.qualification}</h3>
                  <p className="cv-meta">
                    {item.school} / {item.location} / {item.start} - {item.end}
                  </p>
                  {item.focus ? <p>{item.focus}</p> : null}
                </article>
              ))}
            </motion.section>
          </motion.article>
        </div>
      </Container>
    </main>
  );
}
