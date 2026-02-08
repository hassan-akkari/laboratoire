export const SESSION_COOKIE_NAME = "web_next_session";
export const SESSION_COOKIE_VALUE = "active";

export function sanitizeNextPath(nextPath?: string) {
  if (!nextPath) {
    return "/checkout";
  }

  const normalized = nextPath.trim().replace(/[\r\n]/g, "");

  if (!normalized.startsWith("/") || normalized.startsWith("//")) {
    return "/checkout";
  }

  return normalized;
}
