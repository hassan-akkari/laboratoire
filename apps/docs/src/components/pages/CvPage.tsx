"use client";

import { AppButton } from "@laboratoire/ui";
import { motion, useReducedMotion } from "framer-motion";
import Container from "../layout/Container";
import type { PortfolioContent } from "../../content/portfolioContent";
import type { Locale } from "../../i18n/locale";
import { localePath } from "../../i18n/routing";
import type { Messages } from "../../i18n/messages";
import LocaleSwitcher from "../ui/LocaleSwitcher";
import {
  fadeUpVariants,
  getMountReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type CvPageProps = {
  content: PortfolioContent;
  locale: Locale;
  labels: Messages;
};

export default function CvPage({ content, locale, labels }: CvPageProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const handlePrint = () => window.print();
  const resumeHref = content.contact.resumePath;

  return (
    <main id="cv-page">
      <Container className="cv-container">
        <motion.section
          className="cv-intro"
          variants={fadeUpVariants}
          {...getMountReveal(reduceMotion)}
        >
          <h1>{labels.cv.title}</h1>
          <p>{labels.cv.subtitle}</p>
        </motion.section>

        <motion.header
          className="cv-topbar cv-no-print"
          variants={fadeUpVariants}
          {...getMountReveal(reduceMotion)}
        >
          <LocaleSwitcher locale={locale} labels={labels.locale} />
          <div className="cv-actions">
            <AppButton as="a" href={localePath(locale)} variant="bordered">
              {labels.cv.backToSite}
            </AppButton>
            <AppButton type="button" onClick={handlePrint}>
              {labels.cv.print}
            </AppButton>
            <AppButton as="a" href={resumeHref} target="_blank" rel="noreferrer">
              {labels.cv.downloadOriginal}
            </AppButton>
          </div>
        </motion.header>

        <motion.article
          className="cv-paper"
          variants={staggerChildrenVariants}
          {...getMountReveal(reduceMotion)}
        >
          <header className="cv-header">
            <h2>{content.profile.name}</h2>
            <p className="cv-role">{content.profile.role}</p>
            <p>{content.profile.focus}</p>
            <p>{content.profile.location}</p>
          </header>

          <motion.section className="cv-section" variants={fadeUpVariants}>
            <h2>{labels.cv.summary}</h2>
            {content.profile.about.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>
              <strong>{labels.about.now}:</strong> {content.profile.now}
            </p>
            <p>
              <strong>{labels.about.philosophy}:</strong> {content.profile.philosophy}
            </p>
          </motion.section>

          <motion.section className="cv-section" variants={fadeUpVariants}>
            <h2>{labels.cv.impact}</h2>
            <ul className="cv-impact-list">
              {content.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.section>

          <motion.section className="cv-section" variants={fadeUpVariants}>
            <h2>{labels.cv.stack}</h2>
            <p>
              <strong>{labels.about.daily}:</strong> {content.stack.daily.join(" / ")}
            </p>
            <p>
              <strong>{labels.about.comfortable}:</strong> {content.stack.comfortable.join(" / ")}
            </p>
            <p>
              <strong>{labels.about.exploring}:</strong> {content.stack.exploring.join(" / ")}
            </p>
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

          <motion.section className="cv-section" variants={fadeUpVariants}>
            <h2>{labels.cv.experience}</h2>
            {content.experience.map((item) => (
              <article key={`${item.company}-${item.start}`} className="cv-block">
                <h3>{item.role}</h3>
                <p className="cv-meta">
                  {item.company} / {item.location} / {item.start} - {item.end}
                </p>
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </motion.section>

          <motion.section className="cv-section" variants={fadeUpVariants}>
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

          <motion.section className="cv-section" variants={fadeUpVariants}>
            <h2>{labels.cv.general}</h2>
            {content.general.map((item) => (
              <p key={item.title}>
                <strong>{item.title}:</strong> {item.items.join(" / ")}
              </p>
            ))}
          </motion.section>

          <motion.section className="cv-section" variants={fadeUpVariants}>
            <h2>{labels.cv.contact}</h2>
            <p>{content.contact.email}</p>
            <p>{content.contact.linkedin}</p>
            <p>{content.contact.github}</p>
          </motion.section>
        </motion.article>
      </Container>
    </main>
  );
}
