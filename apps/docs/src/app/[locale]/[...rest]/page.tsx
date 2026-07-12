import { notFound } from "next/navigation";

/**
 * Catch-all for unknown paths under a valid locale — delegates to the
 * [locale]/not-found.tsx boundary with a real 404 status (the SPA used to
 * client-redirect unknown routes to "/").
 */
export default function CatchAllRoute() {
  notFound();
}
