import { motion, useReducedMotion } from "framer-motion";
import { AppButton } from "@laboratoire/ui";
import { FaWhatsapp, FaCalendarAlt, FaRegEnvelope } from "react-icons/fa";
import Container from "../layout/Container";
import Section from "../layout/Section";
import type { Locale } from "../../i18n/locale";
import { getFinalCtaContent } from "../../data/finalCtaContent";
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

  return (
    <Section id="cta">
      <Container>
        <motion.div
          className="overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-card)] p-8 md:p-14"
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
            className="mt-5 max-w-2xl text-base text-[var(--app-muted)] md:text-lg"
          >
            {content.subtitle}
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            className="mt-8 flex flex-wrap gap-3"
          >
            <AppButton
              as="a"
              href={content.whatsappHref}
              target="_blank"
              rel="noreferrer"
              size="lg"
              startContent={<FaWhatsapp aria-hidden="true" />}
            >
              {content.whatsappLabel}
            </AppButton>
            <AppButton
              as="a"
              href={content.callHref}
              size="lg"
              variant="bordered"
              startContent={<FaCalendarAlt aria-hidden="true" />}
            >
              {content.callLabel}
            </AppButton>
            <AppButton
              as="a"
              href={content.emailHref}
              size="lg"
              variant="flat"
              startContent={<FaRegEnvelope aria-hidden="true" />}
            >
              {content.emailLabel}
            </AppButton>
          </motion.div>

          <motion.p
            variants={fadeUpVariants}
            className="mt-6 text-xs text-[var(--app-muted)]"
          >
            {content.footnote}
          </motion.p>
        </motion.div>
      </Container>
    </Section>
  );
}
