import Container from "../layout/Container";
import Section from "../layout/Section";
import { AppButton } from "@laboratoire/ui";
import type { PortfolioProject } from "../../content/portfolioContent";
import type { Messages } from "../../i18n/messages";
import { motion, useReducedMotion } from "framer-motion";
import {
  fadeUpVariants,
  getInViewReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type PortfolioSectionProps = {
  baseUrl: string;
  projects: PortfolioProject[];
  labels: Messages["portfolio"];
};

function isExternalLink(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function PortfolioSection({
  baseUrl,
  projects,
  labels,
}: PortfolioSectionProps) {
  const reduceMotion = Boolean(useReducedMotion());

  const resolveHref = (href: string) => {
    if (href.startsWith("#") || href.startsWith("mailto:") || isExternalLink(href)) {
      return href;
    }
    return `${baseUrl}${href.replace(/^\//, "")}`;
  };

  return (
    <Section id="portfolio">
      <Container>
        <motion.div
          className="section-heading"
          variants={fadeUpVariants}
          {...getInViewReveal(reduceMotion, 0.26)}
        >
          <h1 className="sub-title">{labels.title}</h1>
          <p className="section-subtitle">{labels.subtitle}</p>
        </motion.div>

        <motion.div
          className="projects-grid"
          variants={staggerChildrenVariants}
          {...getInViewReveal(reduceMotion, 0.12)}
        >
          {projects.map((project) => (
            <motion.article
              key={project.id}
              className="project-card"
              variants={fadeUpVariants}
              whileHover={reduceMotion ? undefined : { y: -6 }}
            >
              <img
                src={`${baseUrl}${project.image}`}
                alt={`${project.title} preview`}
                className="project-image"
              />
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <p className="project-stack">{project.stack.join(" / ")}</p>
                <ul className="project-impact-list">
                  {project.impact.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <div className="project-links">
                  {project.links.map((link) => (
                    <AppButton
                      key={`${project.id}-${link.label}`}
                      as="a"
                      href={resolveHref(link.href)}
                      variant={link.kind === "live" ? "solid" : "bordered"}
                      target={isExternalLink(link.href) ? "_blank" : undefined}
                      rel={isExternalLink(link.href) ? "noreferrer" : undefined}
                      size="sm"
                    >
                      {link.label}
                    </AppButton>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
