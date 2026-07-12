"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AppButton } from "@laboratoire/ui";
import type { RoadmapProject } from "../../content/portfolioContent";
import type { Messages } from "../../i18n/messages";
import Container from "../layout/Container";
import Section from "../layout/Section";
import {
  fadeUpVariants,
  getInViewReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type RoadmapSectionProps = {
  roadmap: RoadmapProject[];
  labels: Messages["roadmap"];
};

export default function RoadmapSection({ roadmap, labels }: RoadmapSectionProps) {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <Section id="roadmap">
      <Container>
        <motion.div
          className="section-heading"
          variants={fadeUpVariants}
          {...getInViewReveal(reduceMotion, 0.24)}
        >
          <h2 className="sub-title">{labels.title}</h2>
          <p className="section-subtitle">{labels.subtitle}</p>
        </motion.div>

        <motion.div
          className="roadmap-grid"
          variants={staggerChildrenVariants}
          {...getInViewReveal(reduceMotion, 0.12)}
        >
          {roadmap.map((item) => (
            <motion.article
              key={item.id}
              className="roadmap-card"
              variants={fadeUpVariants}
              whileHover={reduceMotion ? undefined : { y: -5 }}
            >
              <div className="roadmap-card__top">
                <h3>{item.title}</h3>
                <span className="roadmap-status">{item.status}</span>
              </div>
              <p>{item.summary}</p>
              <p className="roadmap-stack">{item.stack.join(" / ")}</p>
              <p className="roadmap-target">
                <strong>{labels.targetApp}:</strong> {item.targetApp}
              </p>
              <div className="roadmap-lists">
                <div className="roadmap-list-block">
                  <h4>{labels.recruiterSignals}</h4>
                  <ul>
                    {item.recruiterSignals.map((signal) => (
                      <li key={`${item.id}-${signal}`}>{signal}</li>
                    ))}
                  </ul>
                </div>
                <div className="roadmap-list-block">
                  <h4>{labels.mvpScope}</h4>
                  <ul>
                    {item.mvpScope.map((scope) => (
                      <li key={`${item.id}-${scope}`}>{scope}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="roadmap-cta"
          variants={fadeUpVariants}
          {...getInViewReveal(reduceMotion, 0.3)}
        >
          <AppButton as="a" href="#contact" variant="flat">
            {labels.cta}
          </AppButton>
        </motion.div>
      </Container>
    </Section>
  );
}
