import { describe, expect, it } from "vitest";
import {
  BOOKABLE_LIVE_URL,
  BOOKABLE_REPO_URL,
  caseStudiesContent,
} from "./caseStudies";
import { LOCALES } from "../i18n/locale";
import en from "../content/data/portfolio-content.en.json";
import it_ from "../content/data/portfolio-content.it.json";
import fr from "../content/data/portfolio-content.fr.json";
import de from "../content/data/portfolio-content.de.json";

const cvContent = { en, it: it_, fr, de } as const;

describe("Bookable as the flagship project", () => {
  it.each(LOCALES)("is the first case study in %s with demo, code and limits", (locale) => {
    const studies = caseStudiesContent[locale].caseStudies;
    const first = studies[0];

    expect(first.id).toBe("booking-checkout");
    expect(first.liveUrl).toBe(BOOKABLE_LIVE_URL);
    expect(first.repoUrl).toBe(BOOKABLE_REPO_URL);
    expect(first.limits?.length).toBeGreaterThanOrEqual(3);
    expect(first.variants?.map((v) => v.label)).toEqual(["Editorial", "Warm", "Bold"]);
  });

  it.each(LOCALES)("keeps the same three case studies in %s", (locale) => {
    const ids = caseStudiesContent[locale].caseStudies.map((s) => s.id);
    expect(ids).toEqual(["booking-checkout", "hospitality-ecommerce", "bootstrap-tailwind"]);
  });

  it.each(LOCALES)("marks Bookable as the personal project and the rest as professional in %s", (locale) => {
    const kinds = caseStudiesContent[locale].caseStudies.map((s) => [s.id, s.kind]);
    expect(kinds).toEqual([
      ["booking-checkout", "personal"],
      ["hospitality-ecommerce", "professional"],
      ["bootstrap-tailwind", "professional"],
    ]);
  });

  it("points the code link at the booking-service folder of the public repo", () => {
    expect(BOOKABLE_REPO_URL).toMatch(
      /^https:\/\/github\.com\/hassan-akkari\/laboratoire\/tree\/main\/apps\/booking-service$/,
    );
  });

  it.each(LOCALES)("CV projects in %s link Bookable to demo + source and the monorepo to its repo", (locale) => {
    const projects = cvContent[locale].cvProjects;
    expect(projects[0].name).toMatch(/^Bookable/);
    expect(projects[0].liveUrl).toBe(BOOKABLE_LIVE_URL);
    expect(projects[0].repoUrl).toBe(BOOKABLE_REPO_URL);
    expect(projects[1].repoUrl).toBe("https://github.com/hassan-akkari/laboratoire");
  });
});
