import { beforeAll, describe, expect, it } from "vitest";
import { sealAdminSession, unsealAdminSession } from "./adminSession";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-secret-".padEnd(48, "x");
});

describe("admin session seal/unseal", () => {
  it("round-trips a valid session", async () => {
    const sealed = await sealAdminSession({ userId: "abc-123" });
    expect(typeof sealed).toBe("string");
    expect(sealed.length).toBeGreaterThan(20);

    const data = await unsealAdminSession(sealed);
    expect(data?.userId).toBe("abc-123");
  });

  it("rejects tampered cookies", async () => {
    const sealed = await sealAdminSession({ userId: "abc-123" });
    const tampered = sealed.slice(0, -3) + "XYZ";
    const data = await unsealAdminSession(tampered);
    expect(data).toBeNull();
  });

  it("returns null for null / empty input", async () => {
    expect(await unsealAdminSession(null)).toBeNull();
    expect(await unsealAdminSession("")).toBeNull();
    expect(await unsealAdminSession(undefined)).toBeNull();
  });

  it("throws if secret missing or too short", async () => {
    const original = process.env.ADMIN_SESSION_SECRET;
    process.env.ADMIN_SESSION_SECRET = "tooshort";
    await expect(sealAdminSession({ userId: "x" })).rejects.toThrow(
      /ADMIN_SESSION_SECRET/,
    );
    process.env.ADMIN_SESSION_SECRET = original;
  });
});
