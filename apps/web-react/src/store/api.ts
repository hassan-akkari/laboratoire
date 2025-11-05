import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (b) => ({
    ping: b.query<{ ok: boolean }, void>({ query: () => "ping" }),
  }),
});

export const { usePingQuery } = api;
