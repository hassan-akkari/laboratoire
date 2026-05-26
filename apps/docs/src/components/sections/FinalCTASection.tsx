import { motion, useReducedMotion } from "framer-motion";
import { AppButton } from "@laboratoire/ui";
import { FaWhatsapp, FaArrowRight, FaRegEnvelope } from "react-icons/fa";
import Container from "../layout/Container";
import Section from "../layout/Section";
import type { Locale } from "../../i18n/locale";
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
  const reduceMotion = Boolean(useReducedMotion());
  const content = getFinalCtaContent(locale);
  const { phoneDigits, email } = useSiteContactOverrides();

  const effectivePhone = phoneDigits ?? SITE.whatsappNumber;
  const effectiveEmail = email ?? SITE.email;

  const whatsappHref = `https://wa.me/${effectivePhone}?text=${encodeURIComponent(
    whatsappPrefilledMessages[locale],
  )}`;
  const emailHref = `mailto:${effectiveEmail}?subject=${encodeURIComponent(
    locale === "it" ? "Richiesta info" : locale === "fr" ? "Demande d'info" : "Quick question",
  )}&body=${encodeURIComponent(
    locale === "it" ? "Ciao Hassan, " : locale === "fr" ? "Bonjour Hassan, " : "Hi Hassan, ",
  )}`;

  return (
    <Section id="cta">
      <Container>
        <motion.div
          className="overflow-hidden rounded-3xl border border-(--app-border) bg-(--app-card) p-8 md:p-14"
          variants={staggerChildrenVariants}
          {...getInViewReveal(reduceMotion, 0.2)}
        >
          <motion.h2
            variants={fadeUpVariants}
            className="text-3xl md:text-5xl md:max-w-3xl"
          >
            {content.title}
          </motion.h2>
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
            <AppButton
              as="a"
              href={content.auditHref}
              size="lg"
              endContent={<FaArrowRight aria-hidden="true" />}
            >
              {content.auditLabel}
            </AppButton>
            <AppButton
              as="a"
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              size="lg"
              variant="bordered"
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
