import { http, HttpResponse } from "msw";

export const handlers = [
  http.get(
    "/api/ping",
    () => HttpResponse.json({ ok: true }) // sempre JSON
  ),
];
