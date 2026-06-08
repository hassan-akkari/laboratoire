import { useEffect, useState } from "react";
import {
  fetchPublicSiteConfig,
  PUBLIC_SITE_CONFIG_FALLBACK,
  type PublicSiteConfig,
} from "./siteConfig";

export type SiteContactOverrides = {
  phoneDigits: string | undefined;
  email: string | undefined;
};

const adminBaseUrl = (import.meta.env.VITE_ADMIN_API_BASE as string | undefined)?.replace(
  /\/$/,
  "",
);

export function useSiteConfig(): PublicSiteConfig {
  const [config, setConfig] = useState<PublicSiteConfig>(PUBLIC_SITE_CONFIG_FALLBACK);

  useEffect(() => {
    if (!adminBaseUrl) return;
    let cancelled = false;
    fetchPublicSiteConfig(adminBaseUrl).then((value) => {
      if (!cancelled) setConfig(value);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return config;
}

export function useSiteContactOverrides(): SiteContactOverrides {
  const config = useSiteConfig();
  return {
    phoneDigits: config.phone ? config.phone.replace(/\D/g, "") : undefined,
    email: config.contactEmail || undefined,
  };
}
