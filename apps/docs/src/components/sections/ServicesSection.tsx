import { motion, useReducedMotion } from "framer-motion";
import { AppButton } from "@laboratoire/ui";
import { FaCheck, FaTimes } from "react-icons/fa";
import Container from "../layout/Container";
import Section from "../layout/Section";
import type { Locale } from "../../i18n/locale";
import { getServicesContent } from "../../data/services";
import { useSiteContactOverrides } from "../../lib/useSiteConfig";
import {
  fadeUpVariants,
  getInViewReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type ServicesSectionProps = {
  locale: Locale;
};

export default function ServicesSection({ locale }: ServicesSectionProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const { phoneDigits, email } = useSiteContactOverrides();
  const content = getServicesContent(locale, phoneDigits, email);

  return (
    <Section id="services">
      <Container>
        <motion.div
          variants={fadeUpVariants}
          {...getInViewReveal(reduceMotion, 0.22)}
          className="max-w-2xl"
        >
          <p className="mb-3 text-sm uppercase tracking-[0.18em] text-(--app-muted)">
            {content.sectionLabel}
          </p>
          <h2 className="text-3xl md:text-4xl">{content.title}</h2>
          <p className="mt-4 text-base text-(--app-muted)">
            {content.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 md:grid-cols-2"
          variants={staggerChildrenVariants}
          {...getInViewReveal(reduceMotion, 0.08)}
        >
          {content.services.map((service) => (
            <motion.article
              key={service.id}
              variants={fadeUpVariants}
              className="relative flex flex-col rounded-2xl border border-(--app-border) bg-(--app-card) p-7"
            >
              {service.badge ? (
                <span className="absolute -top-3 left-7 rounded-full bg-(--app-accent) px-3 py-1 text-xs uppercase tracking-wider text-white">
                  {service.badge}
                </span>
              ) : null}

              <div>
                <h3 className="text-2xl">{service.name}</h3>
                <p className="mt-2 text-base text-(--app-fg)">
                  {service.tagline}
                </p>
              </div>

              <p className="mt-4 text-sm text-(--app-muted)">
                {service.forWho}
              </p>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <span>
                  <strong>{service.priceLabel}</strong>
                </span>
                <span className="text-(--app-muted)">
                  {service.timeline}
                </span>
              </div>

              <ul className="mt-5 space-y-2 text-sm">
                {service.includes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <FaCheck
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-(--app-accent)"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <ul className="mt-3 space-y-2 text-sm text-(--app-muted)">
                {service.excludes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <FaTimes aria-hidden="true" className="mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <AppButton
                  as="a"
                  href={service.ctaHref}
                  target="_blank"
                  rel="noreferrer"
                  size="md"
                >
                  {service.ctaLabel}
                </AppButton>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.p
          className="mt-10 text-center text-sm text-(--app-muted)"
          variants={fadeUpVariants}
          {...getInViewReveal(reduceMotion, 0.4)}
        >
          <a
            href={content.secondaryCta.href}
            className="underline-offset-4 hover:underline hover:text-(--app-fg)"
          >
            {content.secondaryCta.label}
          </a>
        </motion.p>
      </Container>
    </Section>
  );
}
