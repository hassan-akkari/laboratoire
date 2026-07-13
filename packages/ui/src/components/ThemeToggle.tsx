import { useSyncExternalStore } from "react";
import { Switch } from "@heroui/react";
import { MoonIcon, SunIcon } from "../icons/ThemeIcons";
import { useTheme } from "../hooks/useTheme";

const emptySubscribe = () => () => {};

/**
 * False on the server AND during client hydration, true right after — the
 * useSyncExternalStore idiom for hydration detection (no setState-in-effect).
 */
function useIsHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // Hydration gate for SSR consumers (docs): the server always renders the
  // dark default, but a light-theme client's FIRST render reads localStorage
  // and would disagree (mismatched isSelected/icon/aria-label). Render the
  // server-consistent dark state until hydrated, then snap to the real theme —
  // the page itself is already correct pre-paint via the inline theme script,
  // only this control corrects one tick later. No-op for SPA consumers.
  const hydrated = useIsHydrated();

  const isDark = (hydrated ? theme : "dark") === "dark";
  const label = isDark ? "Dark mode" : "Light mode";

  return (
    <Switch
      className="nav-theme-toggle"
      classNames={{
        label: "nav-theme-toggle__label",
        wrapper: "nav-theme-toggle__track",
        thumb: "nav-theme-toggle__thumb",
      }}
      color="secondary"
      isSelected={isDark}
      size="lg"
      aria-label={label}
      onValueChange={() => toggleTheme()}
      thumbIcon={({
        isSelected,
        className,
      }: {
        isSelected: boolean;
        className?: string;
      }) =>
        isSelected ? (
          <MoonIcon className={className} />
        ) : (
          <SunIcon className={className} />
        )
      }
    />
  );
}
