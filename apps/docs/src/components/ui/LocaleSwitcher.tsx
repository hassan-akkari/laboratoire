import type { Locale } from "../../i18n/locale";
import type { Messages } from "../../i18n/messages";

type LocaleSwitcherProps = {
  locale: Locale;
  onChange: (locale: Locale) => void;
  labels: Messages["locale"];
  className?: string;
};

const localeOrder: Locale[] = ["en", "it", "fr"];

export default function LocaleSwitcher({
  locale,
  onChange,
  labels,
  className = "",
}: LocaleSwitcherProps) {
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
          onClick={() => onChange(item)}
          aria-pressed={locale === item}
        >
          {labels[item]}
        </button>
      ))}
    </div>
  );
}
