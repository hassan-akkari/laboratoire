import { Switch } from "@heroui/react";
import { MoonIcon, SunIcon } from "../icons/ThemeIcons";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

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
    >
      {isDark ? "Dark mode" : "Light mode"}
    </Switch>
  );
}
