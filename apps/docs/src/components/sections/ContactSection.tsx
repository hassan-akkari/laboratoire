import type { ReactNode } from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";
import { AppButton } from "@laboratoire/ui";
import Container from "../layout/Container";
import Section from "../layout/Section";
import ContactForm from "./ContactForm";
import type { ProfileContact } from "../../content/portfolioContent";
import type { Messages } from "../../i18n/messages";
import {
  fadeUpVariants,
  getInViewReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type ContactSectionProps = {
  contact: ProfileContact;
  labels: Messages["contact"];
};

type SocialLink = {
  href: string;
  label: string;
  icon: ReactNode;
};

export default function ContactSection({
  contact,
  labels,
}: ContactSectionProps) {
  const reduceMotion = Boolean(useReducedMotion());

  const socialLinks: SocialLink[] = [
    {
      href: contact.github,
      label: labels.github,
      icon: <FaGithub />,
    },
    {
      href: contact.linkedin,
      label: labels.linkedin,
      icon: <FaLinkedin />,
    },
  ];

  if (contact.instagram) {
    socialLinks.push({
      href: contact.instagram,
      label: "Instagram",
      icon: <FaInstagram />,
    });
  }

  if (contact.facebook) {
    socialLinks.push({
      href: contact.facebook,
      label: "Facebook",
      icon: <FaFacebook />,
    });
  }

  return (
    <Section id="contact">
      <Container>
        <motion.div
          className="row"
          variants={staggerChildrenVariants}
          {...getInViewReveal(reduceMotion, 0.15)}
        >
          <motion.div className="contact-left" variants={fadeUpVariants}>
            <h2 className="sub-title">{labels.title}</h2>
            <p>
              <FaEnvelope /> {contact.email}
            </p>
            <p className="contact-note">{labels.note}</p>
            <div className="social-icons">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.icon}
                </a>
              ))}
            </div>
            <div className="contact-cta">
              <AppButton as="a" href={`mailto:${contact.email}`}>
                {labels.emailMe}
              </AppButton>
              {contact.bookCall ? (
                <AppButton
                  as="a"
                  href={contact.bookCall}
                  target="_blank"
                  rel="noreferrer"
                  variant="flat"
                >
                  {labels.bookCall}
                </AppButton>
              ) : null}
            </div>
          </motion.div>

          <motion.div className="contact-right" variants={fadeUpVariants}>
            <ContactForm labels={labels} />
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
