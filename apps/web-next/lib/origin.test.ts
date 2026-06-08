import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  isAllowedAdminOrigin,
  isAllowedPublicOrigin,
  requireAdminOrigin,
  withCors,
} from "./origin";

const PUBLIC = "https://itshassan.it,http://localhost:5173";
const ADMIN = "https://admin.itshassan.it,http://localhost:3001";

describe("origin allowlists", () => {
  const original = {
    pub: process.env.PUBLIC_ALLOWED_ORIGINS,
    adm: process.env.ADMIN_ALLOWED_ORIGINS,
    vercelEnv: process.env.VERCEL_ENV,
    vercelUrl: process.env.VERCEL_URL,
  };

  beforeEach(() => {
    process.env.PUBLIC_ALLOWED_ORIGINS = PUBLIC;
    process.env.ADMIN_ALLOWED_ORIGINS = ADMIN;
    delete process.env.VERCEL_ENV;
    delete process.env.VERCEL_URL;
  });

  afterEach(() => {
    if (original.pub === undefined) delete process.env.PUBLIC_ALLOWED_ORIGINS;
    else process.env.PUBLIC_ALLOWED_ORIGINS = original.pub;
    if (original.adm === undefined) delete process.env.ADMIN_ALLOWED_ORIGINS;
    else process.env.ADMIN_ALLOWED_ORIGINS = original.adm;
    if (original.vercelEnv === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = original.vercelEnv;
    if (original.vercelUrl === undefined) delete process.env.VERCEL_URL;
    else process.env.VERCEL_URL = original.vercelUrl;
  });

  it("accepts allowed public origins", () => {
    expect(isAllowedPublicOrigin("https://itshassan.it")).toBe(true);
    expect(isAllowedPublicOrigin("http://localhost:5173")).toBe(true);
  });

  it("rejects unknown / null / empty public origins", () => {
    expect(isAllowedPublicOrigin("https://evil.com")).toBe(false);
    expect(isAllowedPublicOrigin(null)).toBe(false);
    expect(isAllowedPublicOrigin("")).toBe(false);
  });

  it("isolates public and admin allowlists", () => {
    expect(isAllowedAdminOrigin("https://itshassan.it")).toBe(false);
    expect(isAllowedPublicOrigin("https://admin.itshassan.it")).toBe(false);
  });

  it("accepts allowed admin origins", () => {
    expect(isAllowedAdminOrigin("https://admin.itshassan.it")).toBe(true);
    expect(isAllowedAdminOrigin("http://localhost:3001")).toBe(true);
  });

  it("accepts the generated Vercel deployment URL outside production", () => {
    process.env.VERCEL_ENV = "preview";
    process.env.VERCEL_URL = "web-next-preview.vercel.app";

    expect(isAllowedPublicOrigin("https://web-next-preview.vercel.app")).toBe(true);
    expect(isAllowedAdminOrigin("https://web-next-preview.vercel.app")).toBe(true);
  });

  it("does not implicitly accept the Vercel deployment URL in production", () => {
    process.env.VERCEL_ENV = "production";
    process.env.VERCEL_URL = "web-next-prod.vercel.app";

    expect(isAllowedPublicOrigin("https://web-next-prod.vercel.app")).toBe(false);
    expect(isAllowedAdminOrigin("https://web-next-prod.vercel.app")).toBe(false);
  });

  it("withCors sets ACAO + Vary on allowed origins, omits on disallowed", () => {
    const ok = withCors(new Response("body"), "https://itshassan.it", "public");
    expect(ok.headers.get("Access-Control-Allow-Origin")).toBe("https://itshassan.it");
    expect(ok.headers.get("Vary")).toBe("Origin");

    const denied = withCors(new Response("body"), "https://evil.com", "public");
    expect(denied.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it("requireAdminOrigin returns 403 for foreign origins, null for allowed", () => {
    const allowedReq = new Request("https://admin.itshassan.it/x", {
      headers: { origin: "https://admin.itshassan.it" },
    });
    expect(requireAdminOrigin(allowedReq)).toBeNull();

    const deniedReq = new Request("https://admin.itshassan.it/x", {
      headers: { origin: "https://evil.com" },
    });
    const res = requireAdminOrigin(deniedReq);
    expect(res?.status).toBe(403);
  });
});
