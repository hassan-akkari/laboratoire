import { describe, expect, it } from "vitest";
import {
  PROFESSIONAL_CASE_STUDY_SLUGS,
  caseStudyPath,
  getProfessionalCaseStudies,
  getProfessionalCaseStudy,
  getProfessionalCaseStudyCards,
  getProfessionalCaseStudyLabels,
  getProfessionalCaseStudyTitles,
  isProfessionalCaseStudySlug,
  type ProfessionalCaseStudy,
  type ProfessionalCaseStudySlug,
} from "./professionalCaseStudies";
import { LOCALES } from "../i18n/locale";
import en from "../content/data/portfolio-content.en.json";
import it_ from "../content/data/portfolio-content.it.json";
import fr from "../content/data/portfolio-content.fr.json";
import de from "../content/data/portfolio-content.de.json";

const cvContent = { en, it: it_, fr, de } as const;

const SLUGS = [...PROFESSIONAL_CASE_STUDY_SLUGS];

function allText(study: ProfessionalCaseStudy): string {
  return JSON.stringify(study);
}

/** "1,764,861" / "1.764.861" / "1 764 861" / "1'764'861" → "1764861". */
function ungroupDigits(text: string): string {
  // Any single non-word separator between digit groups: . , ' space, NBSP, NNBSP.
  return text.replace(/(\d)[^\w\n](?=\d{3}(?!\d))/g, "$1");
}

function metricDigits(study: ProfessionalCaseStudy): string[] {
  return study.metrics.map((metric) =>
    [metric.before, metric.after, metric.value]
      .filter((value): value is string => value !== undefined)
      .map((value) => ungroupDigits(value).replace(/\D/g, ""))
      .join("|"),
  );
}

/**
 * Figures that must survive every translation, per study, in ungrouped form.
 * Taken from the evidence the pages are allowed to cite; a missing one means
 * a locale dropped or mistyped a number.
 */
const MUST_CONTAIN: Record<ProfessionalCaseStudySlug, string[]> = {
  "http-client-concurrency": ["12", "40", "443", "453", "10", "401"],
  "incremental-react-migration": [
    "10",
    "112",
    "108",
    "42",
    "65",
    "16",
    "27",
    "1764861",
    "63249",
    "317",
  ],
  "bff-modularization": ["5657", "81", "128", "133", "19", "18", "42", "20", "40", "307", "92", "91", "93"],
};

/**
 * Anonymization and claims discipline: employer, product, colleague and
 * internal identifiers never appear, nor the percentages the evidence notes
 * flag as misleading (entry-chunk / single-file reductions sold as totals).
 */
const FORBIDDEN: RegExp[] = [
  /sibylla/i,
  /x-functions-key/i,
  /AddPortalBff/,
  /BffEndpointExtensions/,
  /\b(Federico|Alessandro|Francesco)\b/,
  /\bCEO\b/,
  /[A-Z]:\\/,
  /96[.,]42/,
  /98[.,]57/,
  /72[.,]7\s?%/,
];

describe("professional case studies — registry", () => {
  it.each(LOCALES)("lists the same three studies, in order, in %s", (locale) => {
    expect(getProfessionalCaseStudies(locale).map((s) => s.slug)).toEqual(SLUGS);
  });

  it("resolves known slugs and rejects unknown ones", () => {
    expect(isProfessionalCaseStudySlug("bff-modularization")).toBe(true);
    expect(isProfessionalCaseStudySlug("nope")).toBe(false);
    expect(getProfessionalCaseStudy("en", "nope")).toBeUndefined();
    expect(getProfessionalCaseStudy("en", "bff-modularization")?.slug).toBe("bff-modularization");
    expect(caseStudyPath("http-client-concurrency")).toBe("/case-studies/http-client-concurrency");
  });

  it.each(LOCALES)("card projection in %s keeps the long text off the client", (locale) => {
    const cards = getProfessionalCaseStudyCards(locale);
    expect(cards).toHaveLength(SLUGS.length);
    for (const card of cards) {
      expect(Object.keys(card).sort()).toEqual(
        ["eyebrow", "highlights", "slug", "stack", "teaser", "title"].sort(),
      );
    }
  });

  it.each(LOCALES)("title lookup in %s covers every slug", (locale) => {
    const titles = getProfessionalCaseStudyTitles(locale);
    for (const slug of SLUGS) expect(titles[slug]).toBeTruthy();
  });

  it.each(LOCALES)("labels in %s are all filled", (locale) => {
    for (const [key, value] of Object.entries(getProfessionalCaseStudyLabels(locale))) {
      expect(value, key).toMatch(/\S/);
    }
  });
});

describe("professional case studies — content shape", () => {
  for (const locale of LOCALES) {
    for (const slug of SLUGS) {
      it(`${slug} (${locale}) has every section filled and a teaser shorter than the lead`, () => {
        const study = getProfessionalCaseStudy(locale, slug);
        expect(study).toBeDefined();
        if (!study) return;
        expect(study.title).toMatch(/\S/);
        expect(study.eyebrow).toMatch(/\S/);
        expect(study.period).toMatch(/2026/);
        expect(study.teaser.length).toBeLessThan(study.summary.length);
        expect(study.highlights.length).toBeGreaterThanOrEqual(2);
        expect(study.highlights.length).toBeLessThanOrEqual(3);
        expect(study.stack.length).toBeGreaterThanOrEqual(3);
        expect(study.context.length).toBeGreaterThanOrEqual(1);
        expect(study.contribution.length).toBeGreaterThanOrEqual(3);
        expect(study.decisions.length).toBeGreaterThanOrEqual(3);
        expect(study.difficulty.length).toBeGreaterThanOrEqual(1);
        expect(study.results.length).toBeGreaterThanOrEqual(3);
        expect(study.metrics.length).toBeGreaterThanOrEqual(3);
        expect(study.limits.length).toBeGreaterThanOrEqual(3);
        expect(study.proves).toMatch(/\S/);
        expect(study.team).toMatch(/\S/);
        expect(study.seoDescription.length).toBeGreaterThan(60);
        for (const metric of study.metrics) {
          const isPair = metric.before !== undefined && metric.after !== undefined;
          expect(isPair || metric.value !== undefined, metric.label).toBe(true);
        }
      });
    }
  }
});

describe("professional case studies — numbers and claims discipline", () => {
  for (const slug of SLUGS) {
    it(`${slug}: metric figures are identical across locales`, () => {
      const reference = metricDigits(getProfessionalCaseStudy("en", slug)!);
      for (const locale of LOCALES) {
        expect(metricDigits(getProfessionalCaseStudy(locale, slug)!), locale).toEqual(reference);
      }
    });

    it.each(LOCALES)(`${slug}: key figures are present in %s`, (locale) => {
      const text = ungroupDigits(allText(getProfessionalCaseStudy(locale, slug)!));
      for (const figure of MUST_CONTAIN[slug]) {
        expect(text, figure).toMatch(new RegExp(`(^|\\D)${figure}(\\D|$)`));
      }
    });

    it.each(LOCALES)(`${slug}: no employer, colleague or misleading percentage in %s`, (locale) => {
      const text = allText(getProfessionalCaseStudy(locale, slug)!);
      for (const pattern of FORBIDDEN) {
        expect(text, String(pattern)).not.toMatch(pattern);
      }
    });
  }

  it("Swiss German: no ß anywhere in the de content", () => {
    const text = getProfessionalCaseStudies("de").map(allText).join("\n");
    expect(text).not.toMatch(/ß/);
    expect(JSON.stringify(getProfessionalCaseStudyLabels("de"))).not.toMatch(/ß/);
  });
});

describe("professional case studies — CV linkage", () => {
  it.each(LOCALES)("exactly one experience entry in %s points at all three studies", (locale) => {
    const withLinks = cvContent[locale].experience.filter(
      (item) => "caseStudySlugs" in item && Array.isArray(item.caseStudySlugs),
    );
    expect(withLinks).toHaveLength(1);
    expect(withLinks[0].caseStudySlugs).toEqual(SLUGS);
  });
});
