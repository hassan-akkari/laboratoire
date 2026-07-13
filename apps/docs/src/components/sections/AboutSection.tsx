"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "../../lib/useReducedMotionSafe";
import { AppButton } from "@laboratoire/ui";
import {
  type GithubProfile,
  type PortfolioContent,
} from "../../content/portfolioContent";
import type { Messages } from "../../i18n/messages";
import Container from "../layout/Container";
import Section from "../layout/Section";
import {
  fadeUpVariants,
  getInViewReveal,
  softFadeVariants,
  staggerChildrenVariants,
  tabSwitchVariants,
} from "../ui/motionPresets";

type AboutSectionProps = {
  content: PortfolioContent;
  githubProfile: GithubProfile | null;
  isFallbackData: boolean;
  isRefreshing: boolean;
  hasGithubError: boolean;
  labels: Messages;
};

type AboutTab = "stack" | "experience" | "education" | "general";

export default function AboutSection({
  content,
  githubProfile,
  isFallbackData,
  isRefreshing,
  hasGithubError,
  labels,
}: AboutSectionProps) {
  const [activeTab, setActiveTab] = useState<AboutTab>("stack");
  const reduceMotion = useReducedMotionSafe();
  const pillTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 520, damping: 40, mass: 0.68 };

  const tabLabels: Record<AboutTab, string> = {
    stack: labels.about.techStack,
    experience: labels.about.experience,
    education: labels.about.education,
    general: labels.about.general,
  };

  const githubMeta = useMemo(() => {
    if (!githubProfile) return null;

    const lastUpdate = new Date(githubProfile.updated_at).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

    return `Updated ${lastUpdate}`;
  }, [githubProfile]);

  const hasStructuredAbout = content.profile.about.length >= 5;
  const aboutStory = hasStructuredAbout ? content.profile.about[0] : null;
  const aboutWorkBullets = hasStructuredAbout
    ? content.profile.about.slice(1, content.profile.about.length - 1)
    : [];
  const aboutDisclosure = hasStructuredAbout ? content.profile.about.at(-1) : null;

  const renderTab = () => {
    switch (activeTab) {
      case "stack":
        return (
          <div className="stack-grid">
            <article className="stack-card">
              <h3>{labels.about.daily}</h3>
              <p>{content.stack.daily.join(" / ")}</p>
            </article>
            <article className="stack-card">
              <h3>{labels.about.comfortable}</h3>
              <p>{content.stack.comfortable.join(" / ")}</p>
            </article>
            <article className="stack-card">
              <h3>{labels.about.exploring}</h3>
              <p>{content.stack.exploring.join(" / ")}</p>
            </article>
          </div>
        );
      case "experience":
        return (
          <div className="detail-list">
            {content.experience.map((item) => (
              <article key={`${item.company}-${item.start}`} className="detail-card">
                <h3>{item.role}</h3>
                <p className="detail-meta">
                  {item.company} / {item.location} / {item.start} - {item.end}
                </p>
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        );
      case "education":
        return (
          <div className="detail-list">
            {content.education.map((item) => (
              <article key={`${item.school}-${item.start}`} className="detail-card">
                <h3>{item.qualification}</h3>
                <p className="detail-meta">
                  {item.school} / {item.location} / {item.start} - {item.end}
                </p>
                {item.focus ? <p>{item.focus}</p> : null}
              </article>
            ))}
          </div>
        );
      case "general":
        return (
          <div className="general-grid">
            {content.general.map((item) => (
              <article key={item.title} className="stack-card">
                <h3>{item.title}</h3>
                <p>{item.items.join(" / ")}</p>
              </article>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Section id="about">
      <Container>
        <motion.div
          className="row about-layout"
          variants={staggerChildrenVariants}
          {...getInViewReveal(reduceMotion, 0.16)}
        >
          <motion.div className="about-col-1" variants={fadeUpVariants}>
            <motion.img
              src="/image/mePNG.png"
              alt="Hassan portrait"
              whileHover={reduceMotion ? undefined : { y: -3, scale: 1.015 }}
              transition={{ duration: 0.26 }}
            />
            <motion.aside className="micro-card" variants={softFadeVariants}>
              <h3>{content.profile.role}</h3>
              <p>{content.profile.focus}</p>
              <p>{content.profile.location}</p>
              <p className="micro-proof">{content.profile.metric}</p>
              {githubMeta ? <p className="micro-github">{githubMeta}</p> : null}
              {hasGithubError ? (
                <p className="micro-warning">
                  {labels.system.githubUnavailable}
                </p>
              ) : null}
              {isFallbackData ? (
                <p className="micro-warning">
                  {labels.system.fallbackData}
                </p>
              ) : null}
              {isRefreshing ? (
                <p className="micro-refresh">{labels.system.refreshing}</p>
              ) : null}
            </motion.aside>
          </motion.div>
          <motion.div className="about-col-2" variants={fadeUpVariants}>
            <h2 className="sub-title">{labels.about.title}</h2>
            <div className="about-copy">
              {hasStructuredAbout && aboutStory ? (
                <>
                  <p>{aboutStory}</p>
                  <h3 className="about-copy-title">{labels.about.howIWork}</h3>
                  <ul className="about-work-list">
                    {aboutWorkBullets.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  {aboutDisclosure ? (
                    <p className="about-disclosure">{aboutDisclosure}</p>
                  ) : null}
                </>
              ) : (
                content.profile.about.map((line) => (
                  <p key={line}>{line}</p>
                ))
              )}
            </div>
            <div className="about-cta">
              <AppButton as="a" href={`mailto:${content.contact.email}`}>
                {labels.contact.emailMe}
              </AppButton>
              <AppButton
                as="a"
                href={content.contact.github}
                variant="bordered"
                target="_blank"
                rel="noreferrer"
              >
                {labels.contact.github}
              </AppButton>
              <AppButton
                as="a"
                href={content.contact.linkedin}
                variant="bordered"
                target="_blank"
                rel="noreferrer"
              >
                {labels.contact.linkedin}
              </AppButton>
            </div>

            <div className="tab-title" role="tablist" aria-label={labels.about.title}>
              {(Object.keys(tabLabels) as AboutTab[]).map((tab) => (
                <motion.button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  aria-controls={tab}
                  className={`tab-links ${activeTab === tab ? "active-link" : ""}`}
                  onClick={() => setActiveTab(tab)}
                  layout
                >
                  {activeTab === tab ? (
                    <motion.span
                      layoutId="about-tab-pill"
                      className="tab-links__indicator"
                      transition={pillTransition}
                    />
                  ) : null}
                  <span className="tab-links__label">{tabLabels[tab]}</span>
                </motion.button>
              ))}
            </div>

            <div className="tab-contents active-tab" id={activeTab} aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeTab}
                  variants={tabSwitchVariants}
                  initial={reduceMotion ? false : "hidden"}
                  animate="visible"
                  exit={reduceMotion ? "visible" : "exit"}
                >
                  {renderTab()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
