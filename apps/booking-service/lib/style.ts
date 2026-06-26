import "server-only";
import { cookies } from "next/headers";
import { DEFAULT_STYLE, parseStyle, STYLE_COOKIE } from "./style-shared";

// Server-side source of truth for the active design variant. The pure,
// isomorphic constants/types live in `./style-shared` (importable from client
// code); this module adds the server-only cookie reader and re-exports the
// shared API so existing server callers can keep `@/lib/style` as one import.

export {
  type StyleVariant,
  STYLE_COOKIE,
  DEFAULT_STYLE,
  STYLE_VARIANTS,
  STYLE_LABELS,
  parseStyle,
} from "./style-shared";

/**
 * Read the active design variant from the request cookie. Validates the stored
 * value against the enum and falls back to {@link DEFAULT_STYLE} for anything
 * missing or tampered. Server-only — pages call this to pick which variant
 * component to render.
 */
export async function getStyle() {
  const store = await cookies();
  return parseStyle(store.get(STYLE_COOKIE)?.value) ?? DEFAULT_STYLE;
}
