import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AboutSection from "./components/sections/AboutSection";
import ContactSection from "./components/sections/ContactSection";
import HighlightsSection from "./components/sections/HighlightsSection";
import PortfolioSection from "./components/sections/PortfolioSection";
import SiteHeader from "./components/layout/SiteHeader";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  fallbackPortfolioContent,
  type GithubProfile,
} from "./content/portfolioContent";
import {
  useGetGithubProfileQuery,
  useGetPortfolioContentQuery,
} from "./state/api";
import CvPage from "./pages/CvPage";
import { LOCALE_STORAGE_KEY, resolveLocale, type Locale } from "./i18n/locale";
import { messages } from "./i18n/messages";
import { routeTransitionVariants } from "./components/ui/motionPresets";

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
  }, [locale]);

  const labels = useMemo(() => messages[locale], [locale]);

  const fallbackByLocale = useMemo(() => {
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

  const {
    data: remoteContent,
    error: portfolioError,
    isFetching: isRefreshingPortfolio,
  } = useGetPortfolioContentQuery(locale);

  const content = remoteContent ?? fallbackByLocale;
  const githubUsername = content.profile.githubUsername?.trim();

  const {
    data: githubProfile,
    error: githubError,
    isFetching: isRefreshingGithub,
  } = useGetGithubProfileQuery(githubUsername ? githubUsername : skipToken);

  const hasRemoteError = Boolean(portfolioError);
  const hasGithubError = Boolean(githubError);
  const loadedGithub: GithubProfile | null = githubProfile ?? null;

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
                  profile={content.profile}
                  contact={content.contact}
                  baseUrl={base}
                  locale={locale}
                  onLocaleChange={setLocale}
                  labels={labels}
                />
                <AboutSection
                  baseUrl={base}
                  content={content}
                  githubProfile={loadedGithub}
                  isFallbackData={hasRemoteError}
                  isRefreshing={isRefreshingPortfolio || isRefreshingGithub}
                  hasGithubError={hasGithubError}
                  labels={labels}
                />
                <HighlightsSection highlights={content.highlights} labels={labels.highlights} />
                <PortfolioSection
                  baseUrl={base}
                  projects={content.projects}
                  labels={labels.portfolio}
                />
                <ContactSection
                  baseUrl={base}
                  contact={content.contact}
                  labels={labels.contact}
                />
              </>
            }
          />
          <Route
            path="/cv"
            element={
              <CvPage
                baseUrl={base}
                content={content}
                locale={locale}
                onLocaleChange={setLocale}
                labels={labels}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
