"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotionSafe } from "../../lib/useReducedMotionSafe";
import {
  AppButton,
  AppNavbar,
  AppNavbarBrand,
  AppNavbarContent,
  AppNavbarItem,
  ThemeToggle,
} from "@laboratoire/ui";
import { FaWhatsapp, FaRegEnvelope } from "react-icons/fa";
import Container from "../layout/Container";
import Section from "../layout/Section";
import LocaleSwitcher from "../ui/LocaleSwitcher";
import WordReveal from "../ui/WordReveal";
import DrawnCheck from "../ui/DrawnCheck";
import type { Locale } from "../../i18n/locale";
import { localePath } from "../../i18n/routing";
import type { Messages } from "../../i18n/messages";
import { getAuditContent } from "../../data/auditContent";
import { useSiteContactOverrides } from "../../lib/useSiteConfig";
import {
  fadeUpVariants,
  getInViewReveal,
  getMountReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type AuditPageProps = {
  locale: Locale;
  labels: Messages;
};

const SCAN_BADGES = [
  { tone: "ok", style: { top: "17%", right: "6%" } },
  { tone: "warn", style: { top: "38%", left: "5%" } },
  { tone: "ok", style: { top: "60%", right: "11%" } },
  { tone: "warn", style: { bottom: "9%", left: "16%" } },
] as const;

/**
 * Decorative "site under audit" vignette: a CSS-only skeleton browser frame
 * swept top-to-bottom by a scan line while ✓/! badges pop onto the layout —
 * the audit told visually, no fake numbers claimed. Hidden below lg; fully
 * static under reduced motion (badges visible, no sweep).
 */
function AuditScanFrame({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="audit-scan" aria-hidden="true">
      <div className="audit-scan__chrome">
        <span />
        <span />
        <span />
      </div>
      <div className="audit-scan__body">
        <div className="audit-scan__row audit-scan__row--nav" />
        <div className="audit-scan__row audit-scan__row--hero" />
        <div className="audit-scan__cols">
          <div className="audit-scan__row audit-scan__row--card" />
          <div className="audit-scan__row audit-scan__row--card" />
        </div>
        <div className="audit-scan__row audit-scan__row--text" />
        <div className="audit-scan__row audit-scan__row--text audit-scan__row--short" />

        {SCAN_BADGES.map((badge, index) =>
          reduceMotion ? (
            <span
              key={index}
              className="audit-scan__badge"
              data-tone={badge.tone}
              style={badge.style}
            >
              {badge.tone === "ok" ? "✓" : "!"}
            </span>
          ) : (
            <motion.span
              key={index}
              className="audit-scan__badge"
              data-tone={badge.tone}
              style={badge.style}
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.9 + index * 0.55,
                type: "spring",
                stiffness: 320,
                damping: 17,
              }}
            >
              {badge.tone === "ok" ? "✓" : "!"}
            </motion.span>
          ),
        )}

        {reduceMotion ? null : (
          <span className="audit-scan__sweep">
            <motion.span
              className="audit-scan__sweep-bar"
              initial={{ y: "-100%" }}
              animate={{ y: "100%" }}
              transition={{
                duration: 3.6,
                ease: "linear",
                repeat: Infinity,
                repeatDelay: 1.4,
              }}
            />
          </span>
        )}
      </div>
    </div>
  );
}

export default function AuditPage({ locale, labels }: AuditPageProps) {
  const reduceMotion = useReducedMotionSafe();
  const { phoneDigits, email } = useSiteContactOverrides();
  const content = getAuditContent(locale, phoneDigits, email);
  const [openFaqId, setOpenFaqId] = useState<string | null>(
    content.faq.items[0]?.id ?? null,
  );

  const toggleFaq = (id: string) => {
    setOpenFaqId((current) => (current === id ? null : id));
  };

  return (
    <main id="audit-page">
      {/* Same AppNavbar shell as the home SiteHeader (`.site-nav` styling),
          minus the burger: /audit only needs brand + back-link + toggles. The
          locale switcher stays visible at every width here. */}
      <AppNavbar
        position="sticky"
        maxWidth="full"
        aria-label={content.backToHome}
        className="site-nav hero-enter"
      >
        <AppNavbarContent justify="start">
          <AppNavbarBrand>
            <Link href={localePath(locale)} className="site-nav__brand">
              itshassan<span className="site-nav__brand-tld">.it</span>
            </Link>
          </AppNavbarBrand>
        </AppNavbarContent>
        <AppNavbarContent justify="end" className="site-nav__actions">
          <AppNavbarItem className="site-nav__back">
            <Link href={localePath(locale)} className="site-nav__link">
              {content.backToHome}
            </Link>
          </AppNavbarItem>
          <AppNavbarItem>
            <ThemeToggle />
          </AppNavbarItem>
          <AppNavbarItem>
            <LocaleSwitcher locale={locale} labels={labels.locale} />
          </AppNavbarItem>
        </AppNavbarContent>
      </AppNavbar>

      <Section id="audit-hero" className="relative">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
          <motion.div
            variants={staggerChildrenVariants}
            {...getMountReveal(reduceMotion)}
            className="max-w-3xl"
          >
            <motion.p
              variants={fadeUpVariants}
              className="mb-4 inline-block rounded-full border border-(--app-border) bg-(--app-card) px-3 py-1 text-xs uppercase tracking-[0.18em] text-(--app-muted)"
            >
              {content.badge}
            </motion.p>
            <WordReveal
              as="h1"
              text={content.hero.title}
              className="text-4xl leading-[1.08] sm:text-5xl md:text-6xl"
            />
            <motion.p
              variants={fadeUpVariants}
              className="mt-6 max-w-2xl text-lg text-(--app-muted)"
            >
              {content.hero.subtitle}
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              className="mt-8 flex flex-wrap gap-3"
            >
              <AppButton
                as="a"
                href={content.hero.primaryCtaHref}
                target="_blank"
                rel="noreferrer"
                size="lg"
                className="cta-primary"
                startContent={<FaWhatsapp aria-hidden="true" />}
              >
                {content.hero.primaryCtaLabel}
              </AppButton>
              <AppButton
                as="a"
                href={content.hero.secondaryCtaHref}
                size="lg"
                variant="bordered"
                className="cta-secondary"
                startContent={<FaRegEnvelope aria-hidden="true" />}
              >
                {content.hero.secondaryCtaLabel}
              </AppButton>
            </motion.div>

            <motion.ul
              variants={fadeUpVariants}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-(--app-muted)"
            >
              {content.hero.guarantee.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </motion.ul>
          </motion.div>

          <div className="hidden lg:block">
            <AuditScanFrame reduceMotion={reduceMotion} />
          </div>
          </div>
        </Container>
      </Section>

      <Section id="audit-checkpoints">
        <Container>
          <motion.div
            variants={fadeUpVariants}
            {...getInViewReveal(reduceMotion, 0.22)}
            className="max-w-2xl"
          >
            <p className="section-eyebrow mb-3 text-sm uppercase tracking-[0.18em]">
              {content.checkpoints.label}
            </p>
            <h2 className="text-3xl md:text-4xl">
              {content.checkpoints.title}
            </h2>
          </motion.div>

          <motion.ol
            className="audit-checklist mt-12"
            variants={staggerChildrenVariants}
            {...getInViewReveal(reduceMotion, 0.06)}
          >
            {content.checkpoints.items.map((item, index) => (
              <motion.li
                key={item.id}
                variants={fadeUpVariants}
                className="audit-checklist__row"
                data-index={String(index + 1).padStart(2, "0")}
              >
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <DrawnCheck className="audit-checklist__check" delay={0.25} />
              </motion.li>
            ))}
          </motion.ol>
        </Container>
      </Section>

      <Section id="audit-deliverable">
        <Container>
          <motion.div
            variants={staggerChildrenVariants}
            {...getInViewReveal(reduceMotion, 0.2)}
            className="overflow-hidden rounded-3xl border border-(--app-border) bg-(--app-card) p-8 md:p-12"
          >
            <motion.p
              variants={fadeUpVariants}
              className="section-eyebrow mb-3 text-sm uppercase tracking-[0.18em]"
            >
              {content.deliverable.label}
            </motion.p>
            <motion.h2
              variants={fadeUpVariants}
              className="text-3xl md:text-4xl"
            >
              {content.deliverable.title}
            </motion.h2>
            <motion.ul
              variants={fadeUpVariants}
              className="mt-8 grid gap-4 md:grid-cols-2"
            >
              {content.deliverable.items.map((item, index) => (
                <li key={item} className="flex gap-3">
                  <DrawnCheck
                    className="mt-0.5 h-4.75 w-4.75 shrink-0 text-(--accent-ink)"
                    delay={index * 0.07}
                  />
                  <span className="text-base">{item}</span>
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </Container>
      </Section>

      <Section id="audit-process">
        <Container>
          <motion.div
            variants={fadeUpVariants}
            {...getInViewReveal(reduceMotion, 0.22)}
            className="max-w-2xl"
          >
            <p className="section-eyebrow mb-3 text-sm uppercase tracking-[0.18em]">
              {content.process.label}
            </p>
            <h2 className="text-3xl md:text-4xl">{content.process.title}</h2>
          </motion.div>

          <div className="audit-rail-wrap mt-14">
            {reduceMotion ? (
              <span className="audit-rail-line" aria-hidden="true" />
            ) : (
              <motion.span
                className="audit-rail-line"
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.4, margin: "200% 0px -10% 0px" }}
                transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
              />
            )}
            <motion.ol
              className="audit-rail"
              variants={staggerChildrenVariants}
              {...getInViewReveal(reduceMotion, 0.15)}
            >
              {content.process.steps.map((step) => (
                <motion.li
                  key={step.id}
                  variants={fadeUpVariants}
                  className="audit-rail__step"
                >
                  <span className="audit-rail__dot" aria-hidden="true" />
                  <span className="audit-rail__num" aria-hidden="true">
                    {step.number}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </Container>
      </Section>

      <Section id="audit-faq">
        <Container>
          <motion.div
            variants={fadeUpVariants}
            {...getInViewReveal(reduceMotion, 0.22)}
            className="max-w-2xl"
          >
            <p className="section-eyebrow mb-3 text-sm uppercase tracking-[0.18em]">
              {content.faq.label}
            </p>
            <h2 className="text-3xl md:text-4xl">{content.faq.title}</h2>
          </motion.div>

          <motion.ul
            className="mt-10 space-y-3"
            variants={staggerChildrenVariants}
            {...getInViewReveal(reduceMotion, 0.08)}
          >
            {content.faq.items.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <motion.li
                  key={faq.id}
                  variants={fadeUpVariants}
                  className="card-hover rounded-2xl border border-(--app-border) bg-(--app-card)"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-start justify-between gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                    aria-controls={`audit-faq-${faq.id}`}
                  >
                    <span className="text-base font-medium md:text-lg">
                      {faq.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className="faq-icon mt-1 shrink-0"
                      data-open={isOpen || undefined}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        id={`audit-faq-${faq.id}`}
                        initial={
                          reduceMotion ? false : { height: 0, opacity: 0 }
                        }
                        animate={{ height: "auto", opacity: 1 }}
                        exit={
                          reduceMotion ? undefined : { height: 0, opacity: 0 }
                        }
                        transition={{ duration: 0.24 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-(--app-muted) md:text-base">
                          {faq.answer}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </motion.ul>
        </Container>
      </Section>

      <Section id="audit-cta">
        <Container>
          <motion.div
            className="overflow-hidden rounded-3xl border border-(--app-border) bg-(--app-card) p-8 md:p-14"
            variants={staggerChildrenVariants}
            {...getInViewReveal(reduceMotion, 0.2)}
          >
            <WordReveal
              as="h2"
              text={content.finalCta.title}
              className="text-3xl md:text-5xl md:max-w-3xl"
            />
            <motion.p
              variants={fadeUpVariants}
              className="mt-5 max-w-2xl text-base text-(--app-muted) md:text-lg"
            >
              {content.finalCta.subtitle}
            </motion.p>
            <motion.div
              variants={fadeUpVariants}
              className="mt-8 flex flex-wrap gap-3"
            >
              <AppButton
                as="a"
                href={content.finalCta.primaryHref}
                target="_blank"
                rel="noreferrer"
                size="lg"
                className="cta-primary"
                startContent={<FaWhatsapp aria-hidden="true" />}
              >
                {content.finalCta.primaryLabel}
              </AppButton>
              <AppButton
                as="a"
                href={content.finalCta.secondaryHref}
                size="lg"
                variant="bordered"
                className="cta-secondary"
                startContent={<FaRegEnvelope aria-hidden="true" />}
              >
                {content.finalCta.secondaryLabel}
              </AppButton>
            </motion.div>
          </motion.div>
        </Container>
      </Section>
    </main>
  );
}
