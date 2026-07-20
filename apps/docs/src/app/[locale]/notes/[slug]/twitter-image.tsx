/**
 * Twitter card for note pages — same per-note card as the Open Graph one.
 * Without this file, notes inherit [locale]/twitter-image.tsx (the generic
 * brand card) because X prefers twitter:image over og:image when both exist.
 */
export { default, alt, size, contentType } from "./opengraph-image";

// Route-segment config must be a literal in THIS file (Next can't statically
// parse a re-exported `dynamic`). Same value as opengraph-image.tsx.
export const dynamic = "force-static";
