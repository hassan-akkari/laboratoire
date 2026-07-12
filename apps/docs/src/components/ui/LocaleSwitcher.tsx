"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "../../i18n/locale";
import { switchLocalePath } from "../../i18n/routing";
import { persistLocaleCookie } from "../../i18n/localeCookie";
import type { Messages } from "../../i18n/messages";

type LocaleSwitcherProps = {
  locale: Locale;
  labels: Messages["locale"];
  className?: string;
};

const localeOrder: Locale[] = ["en", "it", "fr"];

/**
 * Self-navigating now that locale lives in the URL: switching pushes the same
 * page under the new /{locale} prefix and persists the choice in the cookie
 * src/proxy.ts reads when localizing bare URLs.
 */
export default function LocaleSwitcher({
  locale,
  labels,
  className = "",
}: LocaleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    persistLocaleCookie(next);
    router.push(switchLocalePath(pathname ?? `/${locale}`, next));
  };

  const classes = className
    ? `locale-switcher ${className}`
    : "locale-switcher";

  return (
    <div className={classes} role="group" aria-label={labels.label}>
      {localeOrder.map((item) => (
        <button
          key={item}
          type="button"
          className={`locale-switcher__button ${
            locale === item ? "locale-switcher__button--active" : ""
          }`}
          onClick={() => switchTo(item)}
          aria-pressed={locale === item}
          aria-label={labels[item]}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
