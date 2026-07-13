/**
 * Twitter card image — same brand card as the Open Graph one. Next.js needs
 * the separate twitter-image file convention to emit twitter:image (the old
 * index.html set it explicitly; some scrapers do not fall back to og:image).
 */
export { default, alt, size, contentType } from "./opengraph-image";

// Route-segment config must be a literal in THIS file (Next can't statically
// parse a re-exported `dynamic`). Same value as opengraph-image.tsx.
export const dynamic = "force-static";
