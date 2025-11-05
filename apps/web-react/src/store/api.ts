import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://example.com/api" }), // TODO: cambia quando avrai il backend
  endpoints: (b) => ({
    ping: b.query<{ ok: boolean }, void>({ query: () => "ping" }),
  }),
});

export const { usePingQuery } = api;