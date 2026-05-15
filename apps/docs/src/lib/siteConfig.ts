export type PublicSiteConfig = {
  phone: string;
  contactEmail: string;
};

export const PUBLIC_SITE_CONFIG_FALLBACK: PublicSiteConfig = {
  phone: "",
  contactEmail: "hassan.akkari01@gmail.com",
};

export const SITE_CONFIG_CACHE_KEY = "itshassan.siteConfig.v1";
export const SITE_CONFIG_CACHE_TTL_MS = 5 * 60 * 1000;

type CacheEntry = {
  value: PublicSiteConfig;
  fetchedAt: number;
};

function readCache(): PublicSiteConfig | null {
  try {
    const raw = globalThis.localStorage?.getItem(SITE_CONFIG_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CacheEntry>;
    if (
      !parsed ||
      typeof parsed.fetchedAt !== "number" ||
      !parsed.value ||
      typeof parsed.value.phone !== "string" ||
      typeof parsed.value.contactEmail !== "string"
    ) {
      return null;
    }
    if (Date.now() - parsed.fetchedAt > SITE_CONFIG_CACHE_TTL_MS) return null;
    return parsed.value;
  } catch {
    return null;
  }
}

function writeCache(value: PublicSiteConfig) {
  try {
    const entry: CacheEntry = { value, fetchedAt: Date.now() };
    globalThis.localStorage?.setItem(SITE_CONFIG_CACHE_KEY, JSON.stringify(entry));
  } catch {
    /* localStorage may be unavailable (SSR, private mode); ignore. */
  }
}

function isValidShape(json: unknown): json is PublicSiteConfig {
  if (!json || typeof json !== "object") return false;
  const obj = json as Record<string, unknown>;
  return typeof obj.phone === "string" && typeof obj.contactEmail === "string";
}

export async function fetchPublicSiteConfig(
  adminBaseUrl: string,
): Promise<PublicSiteConfig> {
  const cached = readCache();
  if (cached) return cached;

  try {
    const response = await fetch(`${adminBaseUrl}/api/site-config`, {
      headers: { accept: "application/json" },
    });
    if (!response.ok) return PUBLIC_SITE_CONFIG_FALLBACK;
    const json = (await response.json()) as unknown;
    if (!isValidShape(json)) return PUBLIC_SITE_CONFIG_FALLBACK;
    writeCache(json);
    return json;
  } catch {
    return PUBLIC_SITE_CONFIG_FALLBACK;
  }
}
