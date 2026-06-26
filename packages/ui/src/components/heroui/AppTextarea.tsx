"use client";

/**
 * AppTextarea — FIELD-SLICE v3 MIGRATION (multiline text field archetype).
 *
 * Sibling of AppInput: same v3 field model (`TextField` wrapper + a primitive +
 * `<Label>`/`<FieldError>` children), but the primitive is the v3 `TextArea`
 * (capital A) instead of `Input`. See AppInput.tsx for the full migration notes;
 * the deltas SPECIFIC to the textarea are:
 *
 *   - v3 `TextArea` has NO `minRows` / `maxRows` / auto-grow. Height is the native
 *     `rows` attribute (default 3). `ContactForm` passes `minRows={6}`, so this
 *     wrapper PRESERVES the `minRows` prop and maps it to `rows={minRows ?? 3}`
 *     (the prop is NOT dropped — ContactForm relies on it and the gate checks
 *     ContactForm compiles unchanged).
 *   - `value`/`onChange` (EVENT-style) ride on the `<TextArea>` primitive so
 *     ContactForm's `onChange={(event) => updateField("message", ...)}` keeps its
 *     exact signature; validation/label state lives on `TextField`.
 *   - `radius` -> inline `borderRadius` (default sm = 8px); `color`/`size`/
 *     `labelPlacement` are accepted but NO-OP; `variant` maps to v3 primary|secondary.
 */

import { type ReactNode, type Ref } from "react";
import {
  TextField as HeroV3TextField,
  TextArea as HeroV3TextArea,
  Label as HeroV3Label,
  FieldError as HeroV3FieldError,
} from "@heroui-v3/react";
import { withV3Theme } from "../../theme/v3/warmThemeV3";

/** v3 field visual variants (the only style axis the v3 field root exposes). */
export type AppTextareaVariant = "primary" | "secondary";

/** v2-era `variant` strings docs/stories may still pass. */
type V2TextareaVariant = "flat" | "bordered" | "faded" | "underlined";

/** v2-era semantic `color` strings (no v3 field axis — accepted, no-op). */
type V2TextareaColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

type V3Size = "sm" | "md" | "lg";

/** v2 `radius` -> inline border-radius PIXEL values (default sm = 8px). */
const RADIUS_PX = {
  none: "0px",
  sm: "8px",
  md: "12px",
  lg: "14px",
  full: "9999px",
} as const;

/**
 * PUBLIC, PRESERVED prop surface. Superset of every prop the docs (ContactForm)
 * and stories pass to AppTextarea today, including the load-bearing `minRows`.
 */
export interface AppTextareaProps {
  /** Visible label — rendered as a `<Label>` child in v3. */
  label?: ReactNode;
  placeholder?: string;
  name?: string;
  id?: string;
  /** Controlled value — lives on the `<TextArea>` primitive (native semantics). */
  value?: string;
  defaultValue?: string;
  /** EVENT-style change handler (matches v2 + ContactForm). */
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  /**
   * v2 auto-grow lower bound. v3 has NO auto-grow; PRESERVED and mapped to the
   * native `rows` attribute (`rows={minRows ?? rows ?? 3}`). ContactForm passes
   * `minRows={6}`, so this prop MUST stay accepted.
   */
  minRows?: number;
  /** v2 auto-grow upper bound — accepted but NO-OP (v3 has no auto-grow). */
  maxRows?: number;
  /** Native textarea `rows` — used when `minRows` is not provided. */
  rows?: number;
  isInvalid?: boolean;
  errorMessage?: ReactNode;
  isRequired?: boolean;
  required?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  fullWidth?: boolean;
  /** v2 visual axes — accepted for call-site compatibility. */
  variant?: V2TextareaVariant | AppTextareaVariant;
  /** v2 `color` — accepted but NO-OP (no v3 field color axis). */
  color?: V2TextareaColor;
  /** v2 `radius` — mapped to inline border-radius (default sm = 8px). */
  radius?: keyof typeof RADIUS_PX;
  /** v2 `size` — accepted but NO-OP (no v3 field size axis). */
  size?: V3Size;
  /** v2 `labelPlacement` — accepted but NO-OP (v3 always renders label above). */
  labelPlacement?: "inside" | "outside" | "outside-left";
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  ref?: Ref<HTMLTextAreaElement>;
}

/** Map the v2 `variant` vocabulary onto a v3 field variant. */
function toV3Variant(variant: AppTextareaProps["variant"]): AppTextareaVariant {
  if (variant === "secondary" || variant === "faded") return "secondary";
  return "primary";
}

export function AppTextarea({
  label,
  placeholder,
  name,
  id,
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  minRows,
  rows,
  isInvalid,
  errorMessage,
  isRequired,
  required,
  isDisabled,
  isReadOnly,
  fullWidth = true,
  variant,
  // NOTE: `maxRows` (no v3 auto-grow) and `color`/`size`/`labelPlacement` (no v3
  // field axis) are part of the public interface for call-site compatibility but
  // are intentionally NOT destructured — they are silently dropped (no `...rest`
  // spread forwards them onward). Keeps the no-op absorption lint-clean.
  radius = "sm",
  className,
  style,
  ref,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: AppTextareaProps) {
  const v3Variant = toV3Variant(variant);
  // v3 has no minRows/auto-grow; honor the v2 prop by mapping it to native rows.
  const resolvedRows = minRows ?? rows ?? 3;

  return (
    <HeroV3TextField
      isInvalid={isInvalid}
      isRequired={isRequired ?? required}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      fullWidth={fullWidth}
      variant={v3Variant}
      className={withV3Theme(className)}
      aria-label={label ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {label ? <HeroV3Label>{label}</HeroV3Label> : null}
      <HeroV3TextArea
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        name={name}
        id={id}
        placeholder={placeholder}
        rows={resolvedRows}
        variant={v3Variant}
        fullWidth={fullWidth}
        aria-describedby={ariaDescribedBy}
        // Inline radius beats the v3 field recipe's baked radius (see RADIUS_PX).
        style={{ borderRadius: RADIUS_PX[radius], ...style }}
      />
      {isInvalid && errorMessage ? (
        <HeroV3FieldError>{errorMessage}</HeroV3FieldError>
      ) : null}
    </HeroV3TextField>
  );
}
