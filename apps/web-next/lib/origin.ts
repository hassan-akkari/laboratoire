function parseList(env: string | undefined): Set<string> {
  if (!env) return new Set();
  return new Set(
    env
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

function getVercelPreviewOrigin(): string | null {
  if (process.env.VERCEL_ENV === "production") return null;

  const url = process.env.VERCEL_URL?.trim();
  if (!url) return null;

  const host = url.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  return host ? `https://${host}` : null;
}

function isAllowedOrigin(origin: string | null, env: string | undefined): boolean {
  if (!origin) return false;
  if (parseList(env).has(origin)) return true;
  return origin === getVercelPreviewOrigin();
}

export function isAllowedPublicOrigin(origin: string | null): boolean {
  return isAllowedOrigin(origin, process.env.PUBLIC_ALLOWED_ORIGINS);
}

export function isAllowedAdminOrigin(origin: string | null): boolean {
  return isAllowedOrigin(origin, process.env.ADMIN_ALLOWED_ORIGINS);
}

export function withCors(
  response: Response,
  origin: string | null,
  kind: "public" | "admin",
): Response {
  const allowed =
    kind === "public" ? isAllowedPublicOrigin(origin) : isAllowedAdminOrigin(origin);
  if (allowed && origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  }
  return response;
}

export function requireAdminOrigin(request: Request): Response | null {
  const origin = request.headers.get("origin");
  if (!isAllowedAdminOrigin(origin)) {
    return new Response("Forbidden", { status: 403 });
  }
  return null;
}
