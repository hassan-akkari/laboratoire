function parseList(env: string | undefined): Set<string> {
  if (!env) return new Set();
  return new Set(
    env
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

export function isAllowedPublicOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return parseList(process.env.PUBLIC_ALLOWED_ORIGINS).has(origin);
}

export function isAllowedAdminOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return parseList(process.env.ADMIN_ALLOWED_ORIGINS).has(origin);
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
