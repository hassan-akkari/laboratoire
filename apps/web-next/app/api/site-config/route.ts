import type { NextRequest } from "next/server";
import { getSiteConfig } from "@/lib/admin/siteConfig";
import { isAllowedPublicOrigin, withCors } from "@/lib/origin";

export const runtime = "nodejs";

export async function OPTIONS(request: NextRequest | Request): Promise<Response> {
  const origin = request.headers.get("origin");
  if (!isAllowedPublicOrigin(origin)) {
    return new Response("Forbidden", { status: 403 });
  }
  return withCors(new Response(null, { status: 204 }), origin, "public");
}

export async function GET(request: NextRequest | Request): Promise<Response> {
  const origin = request.headers.get("origin");
  if (!isAllowedPublicOrigin(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const config = await getSiteConfig();
    if (!config) {
      return withCors(
        Response.json({ error: "Site config not seeded" }, { status: 503 }),
        origin,
        "public",
      );
    }
    const publicShape = {
      phone: config.phone,
      contactEmail: config.contactEmail,
    };
    const response = Response.json(publicShape);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=600",
    );
    return withCors(response, origin, "public");
  } catch {
    return withCors(
      Response.json({ error: "Site config unavailable" }, { status: 503 }),
      origin,
      "public",
    );
  }
}
