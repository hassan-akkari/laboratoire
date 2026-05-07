import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { AppButton, ThemeToggle } from "@laboratoire/ui";
import {
  FaWhatsapp,
  FaRegEnvelope,
  FaPlus,
  FaMinus,
  FaCheck,
} from "react-icons/fa";
import Container from "../components/layout/Container";
import Section from "../components/layout/Section";
import LocaleSwitcher from "../components/ui/LocaleSwitcher";
import type { Locale } from "../i18n/locale";
import type { Messages } from "../i18n/messages";
import { getAuditContent } from "../data/auditContent";
import {
  fadeUpVariants,
  getInViewReveal,
  getMountReveal,
  staggerChildrenVariants,
} from "../components/ui/motionPresets";

type AuditPageProps = {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  labels: Messages;
};

export default function AuditPage({
  locale,
  onLocaleChange,
  labels,
}: AuditPageProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const content = getAuditContent(locale);
  const [openFaqId, setOpenFaqId] = useState<string | null>(
    content.faq.items[0]?.id ?? null,
  );

  useEffect(() => {
    const previousTitle = document.title;
    document.title = content.seoTitle;
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    const previousDescription = meta?.getAttribute("content") ?? null;
    meta?.setAttribute("content", content.seoDescription);

    return () => {
      document.title = previousTitle;
      if (previousDescription !== null) {
        meta?.setAttribute("content", previousDescription);
      }
    };
  }, [content.seoTitle, content.seoDescription]);

  const toggleFaq = (id: string) => {
    setOpenFaqId((current) => (current === id ? null : id));
  };

  return (
    <main id="audit-page">
      <div id="header">
        <Container>
          <motion.nav
            variants={fadeUpVariants}
            {...getMountReveal(reduceMotion)}
          >
            <Link to="/" aria-label="Home">
              <img className="logo" src="favicon.png" alt="Laboratoire logo" />
            </Link>
            <ul id="sidemenu">
              <li>
                <Link to="/">{content.backToHome}</Link>
              </li>
            </ul>
            <div className="nav-actions">
              <ThemeToggle />
              <LocaleSwitcher
                locale={locale}
                onChange={onLocaleChange}
                labels={labels.locale}
                className="nav-locale-switcher"
              />
            </div>
          </motion.nav>
        </Container>
      </div>

      <Section id="audit-hero" className="relative">
        <Container>
          <motion.div
            variants={staggerChildrenVariants}
            {...getMountReveal(reduceMotion)}
            className="max-w-3xl"
          >
            <motion.p
              variants={fadeUpVariants}
              className="mb-4 inline-block rounded-full border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--app-muted)]"
            >
              {content.badge}
            </motion.p>
            <motion.h1
              variants={fadeUpVariants}
              className="text-4xl leading-[1.08] sm:text-5xl md:text-6xl"
            >
              {content.hero.title}
            </motion.h1>
            <motion.p
              variants={fadeUpVariants}
              className="mt-6 max-w-2xl text-lg text-[var(--app-muted)]"
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
                startContent={<FaWhatsapp aria-hidden="true" />}
              >
                {content.hero.primaryCtaLabel}
              </AppButton>
              <AppButton
                as="a"
                href={content.hero.secondaryCtaHref}
                size="lg"
                variant="bordered"
                startContent={<FaRegEnvelope aria-hidden="true" />}
              >
                {content.hero.secondaryCtaLabel}
              </AppButton>
            </motion.div>

            <motion.ul
              variants={fadeUpVariants}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--app-muted)]"
            >
              {content.hero.guarantee.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </motion.ul>
          </motion.div>
        </Container>
      </Section>

      <Section id="audit-checkpoints">
        <Container>
          <motion.div
            variants={fadeUpVariants}
            {...getInViewReveal(reduceMotion, 0.22)}
            className="max-w-2xl"
          >
            <p className="mb-3 text-sm uppercase tracking-[0.18em] text-[var(--app-muted)]">
              {content.checkpoints.label}
            </p>
            <h2 className="text-3xl md:text-4xl">{content.checkpoints.title}</h2>
          </motion.div>

          <motion.ol
            className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerChildrenVariants}
            {...getInViewReveal(reduceMotion, 0.1)}
          >
            {content.checkpoints.items.map((item, index) => (
              <motion.li
                key={item.id}
                variants={fadeUpVariants}
                className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6"
              >
                <span
                  aria-hidden="true"
                  className="text-sm font-semibold tracking-[0.2em] text-[var(--app-accent)]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg leading-snug">{item.title}</h3>
                <p className="mt-3 text-sm text-[var(--app-muted)]">
                  {item.description}
                </p>
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
            className="overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-card)] p-8 md:p-12"
          >
            <motion.p
              variants={fadeUpVariants}
              className="mb-3 text-sm uppercase tracking-[0.18em] text-[var(--app-muted)]"
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
              {content.deliverable.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <FaCheck
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-[var(--app-accent)]"
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
            <p className="mb-3 text-sm uppercase tracking-[0.18em] text-[var(--app-muted)]">
              {content.process.label}
            </p>
            <h2 className="text-3xl md:text-4xl">{content.process.title}</h2>
          </motion.div>

          <motion.ol
            className="mt-12 grid gap-5 md:grid-cols-3"
            variants={staggerChildrenVariants}
            {...getInViewReveal(reduceMotion, 0.1)}
          >
            {content.process.steps.map((step) => (
              <motion.li
                key={step.id}
                variants={fadeUpVariants}
                className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6"
              >
                <span
                  aria-hidden="true"
                  className="text-sm font-semibold tracking-[0.2em] text-[var(--app-accent)]"
                >
                  {step.number}
                </span>
                <h3 className="mt-3 text-lg leading-snug">{step.title}</h3>
                <p className="mt-3 text-sm text-[var(--app-muted)]">
                  {step.description}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </Container>
      </Section>

      <Section id="audit-faq">
        <Container>
          <motion.div
            variants={fadeUpVariants}
            {...getInViewReveal(reduceMotion, 0.22)}
            className="max-w-2xl"
          >
            <p className="mb-3 text-sm uppercase tracking-[0.18em] text-[var(--app-muted)]">
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
                  className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)]"
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
                      className="mt-1 shrink-0 text-[var(--app-muted)]"
                    >
                      {isOpen ? <FaMinus /> : <FaPlus />}
                    </span>
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
                        <p className="px-5 pb-5 text-sm text-[var(--app-muted)] md:text-base">
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
            className="overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-card)] p-8 md:p-14"
            variants={staggerChildrenVariants}
            {...getInViewReveal(reduceMotion, 0.2)}
          >
            <motion.h2
              variants={fadeUpVariants}
              className="text-3xl md:text-5xl md:max-w-3xl"
            >
              {content.finalCta.title}
            </motion.h2>
            <motion.p
              variants={fadeUpVariants}
              className="mt-5 max-w-2xl text-base text-[var(--app-muted)] md:text-lg"
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
                startContent={<FaWhatsapp aria-hidden="true" />}
              >
                {content.finalCta.primaryLabel}
              </AppButton>
              <AppButton
                as="a"
                href={content.finalCta.secondaryHref}
                size="lg"
                variant="bordered"
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
