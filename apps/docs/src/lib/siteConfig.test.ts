import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  PUBLIC_SITE_CONFIG_FALLBACK,
  SITE_CONFIG_CACHE_KEY,
  SITE_CONFIG_CACHE_TTL_MS,
  fetchPublicSiteConfig,
} from "./siteConfig";

const fetchMock = vi.fn();

type FakeLocalStorage = Storage & { _store: Map<string, string> };

function makeFakeLocalStorage(): FakeLocalStorage {
  const store = new Map<string, string>();
  return {
    _store: store,
    get length() {
      return store.size;
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
  };
}

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("localStorage", makeFakeLocalStorage());
  fetchMock.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchPublicSiteConfig", () => {
  it("returns the fetched value and caches it in localStorage", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ phone: "+39 1", contactEmail: "a@b.com" }),
        { status: 200 },
      ),
    );
    const value = await fetchPublicSiteConfig("http://admin.test");
    expect(value).toEqual({ phone: "+39 1", contactEmail: "a@b.com" });
    const cached = localStorage.getItem(SITE_CONFIG_CACHE_KEY);
    expect(cached).not.toBeNull();
    const parsed = JSON.parse(cached!);
    expect(parsed.value).toEqual({ phone: "+39 1", contactEmail: "a@b.com" });
    expect(typeof parsed.fetchedAt).toBe("number");
  });

  it("serves from localStorage when the cache entry is fresh", async () => {
    localStorage.setItem(
      SITE_CONFIG_CACHE_KEY,
      JSON.stringify({
        value: { phone: "+1 cached", contactEmail: "cached@x.com" },
        fetchedAt: Date.now() - 60_000,
      }),
    );
    const value = await fetchPublicSiteConfig("http://admin.test");
    expect(value).toEqual({ phone: "+1 cached", contactEmail: "cached@x.com" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refetches when the cache entry is older than TTL", async () => {
    localStorage.setItem(
      SITE_CONFIG_CACHE_KEY,
      JSON.stringify({
        value: { phone: "+1 stale", contactEmail: "stale@x.com" },
        fetchedAt: Date.now() - (SITE_CONFIG_CACHE_TTL_MS + 1000),
      }),
    );
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ phone: "+1 fresh", contactEmail: "fresh@x.com" }),
        { status: 200 },
      ),
    );
    const value = await fetchPublicSiteConfig("http://admin.test");
    expect(value).toEqual({ phone: "+1 fresh", contactEmail: "fresh@x.com" });
    expect(fetchMock).toHaveBeenCalled();
  });

  it("returns the hard-coded fallback when fetch rejects", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network down"));
    const value = await fetchPublicSiteConfig("http://admin.test");
    expect(value).toEqual(PUBLIC_SITE_CONFIG_FALLBACK);
  });

  it("returns the hard-coded fallback when fetch returns non-2xx", async () => {
    fetchMock.mockResolvedValueOnce(new Response("oops", { status: 503 }));
    const value = await fetchPublicSiteConfig("http://admin.test");
    expect(value).toEqual(PUBLIC_SITE_CONFIG_FALLBACK);
  });

  it("returns the hard-coded fallback when the JSON shape is wrong", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ phone: 42 }), { status: 200 }),
    );
    const value = await fetchPublicSiteConfig("http://admin.test");
    expect(value).toEqual(PUBLIC_SITE_CONFIG_FALLBACK);
  });
});
