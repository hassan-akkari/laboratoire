import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  githubProfileSchema,
  portfolioContentSchema,
  type GithubProfile,
  type PortfolioContent,
} from "../content/portfolioContent";
import type { Locale } from "../i18n/locale";

const contentFilesByLocale: Record<Locale, string> = {
  en: "data/portfolio-content.json",
  it: "data/portfolio-content.it.json",
  fr: "data/portfolio-content.fr.json",
};

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.BASE_URL }),
  endpoints: (builder) => ({
    getPortfolioContent: builder.query<PortfolioContent, Locale>({
      query: (locale) => contentFilesByLocale[locale],
      transformResponse: (response: unknown) =>
        portfolioContentSchema.parse(response),
    }),
    getGithubProfile: builder.query<GithubProfile, string>({
      query: (username) => ({ url: `https://api.github.com/users/${username}` }),
      transformResponse: (response: unknown) =>
        githubProfileSchema.parse(response),
    }),
  }),
});

export const { useGetPortfolioContentQuery, useGetGithubProfileQuery } =
  contentApi;
