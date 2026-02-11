import { AppButton } from "@laboratoire/ui";
import { motion, useReducedMotion } from "framer-motion";
import Container from "../components/layout/Container";
import type { PortfolioContent } from "../content/portfolioContent";
import type { Locale } from "../i18n/locale";
import type { Messages } from "../i18n/messages";
import LocaleSwitcher from "../components/ui/LocaleSwitcher";
import {
  fadeUpVariants,
  getMountReveal,
  staggerChildrenVariants,
} from "../components/ui/motionPresets";

type CvPageProps = {
  baseUrl: string;
  content: PortfolioContent;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  labels: Messages;
};

export default function CvPage({
  baseUrl,
  content,
  locale,
  onLocaleChange,
  labels,
}: CvPageProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const handlePrint = () => window.print();
  const resumeHref = `${baseUrl}${content.contact.resumePath}`;

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
          <LocaleSwitcher
            locale={locale}
            onChange={onLocaleChange}
            labels={labels.locale}
          />
          <div className="cv-actions">
            <AppButton as="a" href={baseUrl} variant="bordered">
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
            <h1>{content.profile.name}</h1>
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
            <ul>
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
