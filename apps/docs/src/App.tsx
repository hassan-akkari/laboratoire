import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SiteHeader from "./components/layout/SiteHeader";
import HeroSection from "./components/sections/HeroSection";
import ProblemsSection from "./components/sections/ProblemsSection";
import ServicesSection from "./components/sections/ServicesSection";
import TargetClientsSection from "./components/sections/TargetClientsSection";
import ProcessSection from "./components/sections/ProcessSection";
import CaseStudiesSection from "./components/sections/CaseStudiesSection";
import WhyMeSection from "./components/sections/WhyMeSection";
import TechStackSection from "./components/sections/TechStackSection";
import FAQSection from "./components/sections/FAQSection";
import FinalCTASection from "./components/sections/FinalCTASection";
import AuditPage from "./pages/AuditPage";
import CvPage from "./pages/CvPage";
import PrivacyPage from "./pages/PrivacyPage";
import { fallbackPortfolioContent } from "./content/portfolioContent";
import { useGetPortfolioContentQuery } from "./state/api";
import { LOCALE_STORAGE_KEY, resolveLocale, type Locale } from "./i18n/locale";
import { messages } from "./i18n/messages";
import { getSeoContent } from "./data/seoContent";
import { routeTransitionVariants } from "./components/ui/motionPresets";

function setMetaContent(name: string, attribute: "name" | "property", value: string) {
  let element = document.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${name}"]`,
  );
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", value);
}

const base = import.meta.env.BASE_URL;

export default function App() {
  const location = useLocation();
  const reduceMotion = Boolean(useReducedMotion());

  const [locale, setLocale] = useState<Locale>(() => {
    try {
      return resolveLocale(localStorage.getItem(LOCALE_STORAGE_KEY));
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;

    const seo = getSeoContent(locale);
    document.title = seo.title;
    setMetaContent("description", "name", seo.description);
    setMetaContent("og:title", "property", seo.title);
    setMetaContent("og:description", "property", seo.description);
    setMetaContent("twitter:title", "name", seo.title);
    setMetaContent("twitter:description", "name", seo.description);

    const ogLocaleByLocale: Record<Locale, string> = {
      it: "it_IT",
      en: "en_US",
      fr: "fr_FR",
    };
    setMetaContent("og:locale", "property", ogLocaleByLocale[locale]);
  }, [locale]);

  const labels = useMemo(() => messages[locale], [locale]);

  const cvFallbackContent = useMemo(() => {
    if (locale === "it") {
      return {
        ...fallbackPortfolioContent,
        contact: {
          ...fallbackPortfolioContent.contact,
          resumePath: "pdf/CV-ITA-102025.pdf",
        },
      };
    }

    return {
      ...fallbackPortfolioContent,
      contact: {
        ...fallbackPortfolioContent.contact,
        resumePath: "pdf/CV-ENG-102025.pdf",
      },
    };
  }, [locale]);

  const { data: remoteContent } = useGetPortfolioContentQuery(locale);
  const cvContent = remoteContent ?? cvFallbackContent;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={routeTransitionVariants}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        exit={reduceMotion ? "visible" : "exit"}
      >
        <Routes location={location}>
          <Route
            path="/"
            element={
              <>
                <SiteHeader
                  locale={locale}
                  onLocaleChange={setLocale}
                  labels={labels}
                />
                <HeroSection locale={locale} />
                <ProblemsSection locale={locale} />
                <ServicesSection locale={locale} />
                <TargetClientsSection locale={locale} />
                <ProcessSection locale={locale} />
                <CaseStudiesSection locale={locale} />
                <WhyMeSection locale={locale} />
                <TechStackSection locale={locale} />
                <FAQSection locale={locale} />
                <FinalCTASection locale={locale} />
              </>
            }
          />
          <Route
            path="/audit"
            element={
              <AuditPage
                locale={locale}
                onLocaleChange={setLocale}
                labels={labels}
              />
            }
          />
          <Route
            path="/cv"
            element={
              <CvPage
                baseUrl={base}
                content={cvContent}
                locale={locale}
                onLocaleChange={setLocale}
                labels={labels}
              />
            }
          />
          <Route path="/privacy" element={<PrivacyPage labels={labels} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
