import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";
import Container from "../layout/Container";
import Section from "../layout/Section";
import type { Locale } from "../../i18n/locale";
import { getFaqsContent } from "../../data/faqs";
import { whatsappLink } from "../../data/site";
import { useSiteContactOverrides } from "../../lib/useSiteConfig";
import {
  fadeUpVariants,
  getInViewReveal,
  staggerChildrenVariants,
} from "../ui/motionPresets";

type FAQSectionProps = {
  locale: Locale;
};

export default function FAQSection({ locale }: FAQSectionProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const content = getFaqsContent(locale);
  const { phoneDigits } = useSiteContactOverrides();
  const [openId, setOpenId] = useState<string | null>(
    content.faqs[0]?.id ?? null,
  );

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <Section id="faq">
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
        </motion.div>

        <motion.ul
          className="mt-10 space-y-3"
          variants={staggerChildrenVariants}
          {...getInViewReveal(reduceMotion, 0.08)}
        >
          {content.faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <motion.li
                key={faq.id}
                variants={fadeUpVariants}
                className="rounded-2xl border border-(--app-border) bg-(--app-card)"
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="flex w-full items-start justify-between gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${faq.id}`}
                >
                  <span className="text-base font-medium md:text-lg">
                    {faq.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-(--app-muted)"
                  >
                    {isOpen ? <FaMinus /> : <FaPlus />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={`faq-${faq.id}`}
                      initial={
                        reduceMotion ? false : { height: 0, opacity: 0 }
                      }
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
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

        <motion.p
          className="mt-10 text-center text-sm text-(--app-muted)"
          variants={fadeUpVariants}
          {...getInViewReveal(reduceMotion, 0.4)}
        >
          {content.outro.prefix}
          <a
            href={whatsappLink(locale, content.whatsappMessage, phoneDigits)}
            target="_blank"
            rel="noreferrer"
            className="text-(--app-fg) underline-offset-4 hover:underline"
          >
            {content.outro.linkLabel}
          </a>
          {content.outro.suffix}
        </motion.p>
      </Container>
    </Section>
  );
}
