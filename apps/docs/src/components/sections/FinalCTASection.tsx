"use client";

import { motion } from "framer-motion";
import { useReducedMotionSafe } from "../../lib/useReducedMotionSafe";
import { AppButton } from "@laboratoire/ui";
import { FaWhatsapp, FaArrowRight, FaRegEnvelope } from "react-icons/fa";
import CalBookButton from "../ui/CalBookButton";
import MagneticWrap from "../ui/MagneticWrap";
import Container from "../layout/Container";
import Section from "../layout/Section";
import WordReveal from "../ui/WordReveal";
import type { Locale } from "../../i18n/locale";
import { localePath } from "../../i18n/routing";
import { getFinalCtaContent } from "../../data/finalCtaContent";
import { SITE, whatsappPrefilledMessages } from "../../data/site";
import { useSiteContactOverrides } from "../../lib/useSiteConfig";
import {
  fadeUpVariants,
  getInViewReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type FinalCTASectionProps = {
  locale: Locale;
};

export default function FinalCTASection({ locale }: FinalCTASectionProps) {
  const reduceMotion = useReducedMotionSafe();
  const content = getFinalCtaContent(locale);
  const { phoneDigits, email } = useSiteContactOverrides();

  const effectivePhone = phoneDigits ?? SITE.whatsappNumber;
  const effectiveEmail = email ?? SITE.email;

  const whatsappHref = `https://wa.me/${effectivePhone}?text=${encodeURIComponent(
    whatsappPrefilledMessages[locale],
  )}`;
  const emailHref = `mailto:${effectiveEmail}?subject=${encodeURIComponent(
    locale === "it"
      ? "Richiesta info"
      : locale === "fr"
        ? "Demande d'info"
        : locale === "de"
          ? "Info-Anfrage"
          : "Quick question",
  )}&body=${encodeURIComponent(
    locale === "it"
      ? "Ciao Hassan, "
      : locale === "fr"
        ? "Bonjour Hassan, "
        : locale === "de"
          ? "Hallo Hassan, "
          : "Hi Hassan, ",
  )}`;

  return (
    <Section id="cta">
      <Container>
        <motion.div
          className="overflow-hidden rounded-3xl border border-(--app-border) bg-(--app-card) p-8 md:p-14"
          variants={staggerChildrenVariants}
          {...getInViewReveal(reduceMotion, 0.2)}
        >
          <WordReveal
            as="h2"
            className="text-3xl md:text-5xl md:max-w-3xl"
            text={content.title}
          />
          <motion.p
            variants={fadeUpVariants}
            className="mt-5 max-w-2xl text-base text-(--app-muted) md:text-lg"
          >
            {content.subtitle}
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            className="mt-8 flex flex-wrap gap-3"
          >
            <MagneticWrap>
              <AppButton
                as="a"
                href={localePath(locale, content.auditHref)}
                size="lg"
                className="cta-primary"
                endContent={<FaArrowRight aria-hidden="true" />}
              >
                {content.auditLabel}
              </AppButton>
            </MagneticWrap>
            <CalBookButton label={content.calLabel} />
            <AppButton
              as="a"
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              size="lg"
              variant="bordered"
              className="cta-secondary"
              startContent={<FaWhatsapp aria-hidden="true" />}
            >
              {content.whatsappLabel}
            </AppButton>
            <AppButton
              as="a"
              href={emailHref}
              size="lg"
              variant="flat"
              startContent={<FaRegEnvelope aria-hidden="true" />}
            >
              {content.emailLabel}
            </AppButton>
          </motion.div>

          <motion.p
            variants={fadeUpVariants}
            className="mt-6 text-xs text-(--app-muted)"
          >
            {content.footnote}
          </motion.p>
        </motion.div>
      </Container>
    </Section>
  );
}
