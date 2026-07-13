export { default as ThemeToggle } from "./components/ThemeToggle";
export { MoonIcon, SunIcon } from "./icons/ThemeIcons";
export { useTheme } from "./hooks/useTheme";
export { THEME_KEY, resolveThemeMode } from "./hooks/themeUtils";
export type { ThemeMode } from "./hooks/themeUtils";

// ---------------------------------------------------------------------------
// HeroUI wrappers — the PUBLIC, standardized component API.
//
// CONVENTION: every consumer-facing component is an `App*` HeroUI wrapper. tw-ui
// primitives are NOT part of the public barrel where a HeroUI equivalent exists
// (see the tw-ui retirement note at the bottom of this file).
// ---------------------------------------------------------------------------

// Form controls
export { AppButton } from "./components/heroui/AppButton";
export type { AppButtonProps } from "./components/heroui/AppButton";
export { AppInput } from "./components/heroui/AppInput";
export type { AppInputProps } from "./components/heroui/AppInput";
export { AppTextarea } from "./components/heroui/AppTextarea";
export type { AppTextareaProps } from "./components/heroui/AppTextarea";

// Archetype 1 — simple passthrough
export { AppChip } from "./components/heroui/AppChip";
export type { AppChipProps } from "./components/heroui/AppChip";

// Archetype 2 — static compound (slots also attached as AppCard.Header/Body/Footer)
export {
  AppCard,
  AppCardHeader,
  AppCardBody,
  AppCardFooter,
} from "./components/heroui/AppCard";
export type {
  AppCardProps,
  AppCardHeaderProps,
  AppCardBodyProps,
  AppCardFooterProps,
} from "./components/heroui/AppCard";

// Archetype 3 — collection (children also attached as AppSelect.Item/Section)
export {
  AppSelect,
  AppSelectItem,
  AppSelectSection,
} from "./components/heroui/AppSelect";
export type {
  AppSelectProps,
  AppSelectItemProps,
  AppSelectSectionProps,
} from "./components/heroui/AppSelect";

// Archetype 4 — stateful/disclosure (slots also attached as AppModal.Content/...)
export {
  AppModal,
  AppModalContent,
  AppModalHeader,
  AppModalBody,
  AppModalFooter,
  useAppDisclosure,
} from "./components/heroui/AppModal";
export type {
  AppModalProps,
  AppModalContentProps,
  AppModalHeaderProps,
  AppModalBodyProps,
  AppModalFooterProps,
} from "./components/heroui/AppModal";

// Archetype 5 — heavy collection-compound (also AppTable.Header/Column/Body/Row/Cell)
export {
  AppTable,
  AppTableHeader,
  AppTableColumn,
  AppTableBody,
  AppTableRow,
  AppTableCell,
} from "./components/heroui/AppTable";
export type {
  AppTableProps,
  AppTableHeaderProps,
  AppTableColumnProps,
  AppTableBodyProps,
  AppTableRowProps,
  AppTableCellProps,
} from "./components/heroui/AppTable";

// ---------------------------------------------------------------------------
// Full wrapper inventory (Phase 2b) — same archetype conventions as above.
// ---------------------------------------------------------------------------

// Form controls
export { AppCheckbox } from "./components/heroui/AppCheckbox";
export type { AppCheckboxProps } from "./components/heroui/AppCheckbox";
export { AppSwitch } from "./components/heroui/AppSwitch";
export type { AppSwitchProps } from "./components/heroui/AppSwitch";
// RadioGroup is a static compound (AppRadioGroup.Radio); AppRadio also named.
export { AppRadioGroup, AppRadio } from "./components/heroui/AppRadioGroup";
export type {
  AppRadioGroupProps,
  AppRadioProps,
} from "./components/heroui/AppRadioGroup";

// Display / feedback
export { AppAlert } from "./components/heroui/AppAlert";
export type { AppAlertProps } from "./components/heroui/AppAlert";
// Avatar is a static compound (AppAvatar.Group); AppAvatarGroup also named.
export { AppAvatar, AppAvatarGroup } from "./components/heroui/AppAvatar";
export type {
  AppAvatarProps,
  AppAvatarGroupProps,
} from "./components/heroui/AppAvatar";
export { AppDivider } from "./components/heroui/AppDivider";
export type { AppDividerProps } from "./components/heroui/AppDivider";
export { AppSpinner } from "./components/heroui/AppSpinner";
export type { AppSpinnerProps } from "./components/heroui/AppSpinner";
export { AppLink } from "./components/heroui/AppLink";
export type { AppLinkProps } from "./components/heroui/AppLink";

// Overlay / disclosure
export { AppTooltip } from "./components/heroui/AppTooltip";
export type { AppTooltipProps } from "./components/heroui/AppTooltip";
// Dropdown compound (AppDropdown.Trigger/.Menu/.Item/.Section).
export {
  AppDropdown,
  AppDropdownTrigger,
  AppDropdownMenu,
  AppDropdownItem,
  AppDropdownSection,
} from "./components/heroui/AppDropdown";
export type {
  AppDropdownProps,
  AppDropdownTriggerProps,
  AppDropdownMenuProps,
  AppDropdownItemProps,
  AppDropdownSectionProps,
} from "./components/heroui/AppDropdown";
// Accordion compound (AppAccordion.Item).
export { AppAccordion, AppAccordionItem } from "./components/heroui/AppAccordion";
export type {
  AppAccordionProps,
  AppAccordionItemProps,
} from "./components/heroui/AppAccordion";

// Navigation
// Navbar compound (AppNavbar.Brand/.Content/.Item/.MenuToggle/.Menu/.MenuItem).
export {
  AppNavbar,
  AppNavbarBrand,
  AppNavbarContent,
  AppNavbarItem,
  AppNavbarMenuToggle,
  AppNavbarMenu,
  AppNavbarMenuItem,
} from "./components/heroui/AppNavbar";
export type {
  AppNavbarProps,
  AppNavbarBrandProps,
  AppNavbarContentProps,
  AppNavbarItemProps,
  AppNavbarMenuToggleProps,
  AppNavbarMenuProps,
  AppNavbarMenuItemProps,
} from "./components/heroui/AppNavbar";
// Tabs compound (AppTabs.Tab).
export { AppTabs, AppTab } from "./components/heroui/AppTabs";
export type { AppTabsProps, AppTabProps } from "./components/heroui/AppTabs";
export { AppPagination } from "./components/heroui/AppPagination";
export type { AppPaginationProps } from "./components/heroui/AppPagination";

// Router-agnostic provider (Phase 1 foundation).
export { UiProvider } from "./components/UiProvider";
export type { UiProviderProps } from "./components/UiProvider";

// Canonical WARM theme — single source of truth for both apps.
// Note: `ThemeMode` is intentionally NOT re-exported here; the canonical
// `ThemeMode` ships from `./hooks/themeUtils` (same `"light" | "dark"` union).
export {
  heroColorTokens,
  appTokens,
  THEME_MODES,
  heroColorsFor,
  appCssVarsFor,
  renderAppVarsBlock,
  renderThemeCss,
} from "./theme/tokens";
export type { HeroColorSet, AppTokenName } from "./theme/tokens";

// ---------------------------------------------------------------------------
// HeroUI v3 WARM THEME FOUNDATION (incremental v2 -> v3 migration).
//
// NEW module — does NOT touch the v2 `tokens.ts` single-source. The v3-migrated
// wrappers (AppButton, AppCard, and the 20 to come) consume these to scope the
// warm-palette v3 CSS variables. Values are derived from `tokens.ts` in oklch;
// see `./theme/v3/warmThemeV3.css` for the mapping + extension pattern.
// ---------------------------------------------------------------------------
export {
  HEROUI_V3_THEME_CLASS,
  V3_TOKEN_MAP,
  withV3Theme,
} from "./theme/v3/warmThemeV3";
export type { V3ThemedVar } from "./theme/v3/warmThemeV3";
export type { AppButtonVariant } from "./components/heroui/AppButton";
export type { AppCardVariant } from "./components/heroui/AppCard";
// Field-slice v3 visual variants (the v3 `primary | secondary` field axis).
export type { AppInputVariant } from "./components/heroui/AppInput";
export type { AppTextareaVariant } from "./components/heroui/AppTextarea";
export type { AppSelectVariant } from "./components/heroui/AppSelect";

// ---------------------------------------------------------------------------
// tw-ui RETIREMENT (Phase 2 public-API standardization).
//
// The tw-ui `Input`, `InputGroup`, and `Textarea` primitives previously exported
// here are now REDUNDANT with the HeroUI wrappers `AppInput` / `AppTextarea` and
// have been removed from the public barrel. No app imported them from
// `@laboratoire/ui` (docs/web-react use `AppInput`/`AppTextarea`), so this is a
// safe public-API cut. The tw-ui SOURCE files remain in
// `src/components/tw-ui/` (not deleted — out of Phase 2 scope) and stay usable
// internally; only the public surface is standardized on the `App*` wrappers.
//
// RULE for the remaining inventory fan-out: a tw-ui primitive may be exported
// from this barrel ONLY where HeroUI has no equivalent. Where HeroUI has one,
// the `App*` wrapper is the single public component.
// ---------------------------------------------------------------------------

// NOTE: `heroTheme` (the heroui() plugin object) is intentionally NOT re-exported
// from the runtime barrel. It pulls in `@heroui/theme` at value level and is only
// ever consumed at CSS-build time via the Tailwind `@plugin` directive pointing
// at `src/theme/heroTheme.ts` directly. Keeping it out of the barrel keeps the
// library's runtime dependency surface free of `@heroui/theme`.
