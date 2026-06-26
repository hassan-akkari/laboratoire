import { redirect } from "next/navigation";

/**
 * Apex redirect — ADMIN is the primary surface of this app.
 *
 * Hitting `/` sends the visitor straight to `/admin`. The proxy gates `/admin`
 * (see `proxy.ts`), so an unauthenticated visitor is then bounced to
 * `/admin/login`. The parked booking demo lives under the `(booking-demo)`
 * route group and is reachable at its own URLs (`/browse`, `/experiences/*`,
 * `/cart`, `/checkout`, …) — a route group cannot own `/`, which is why the
 * apex entry point is this explicit server-side redirect.
 */
export default function RootPage(): never {
  redirect("/admin");
}
