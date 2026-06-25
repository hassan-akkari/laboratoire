"use client";

/**
 * AppInput — FIELD-SLICE v3 MIGRATION (text field archetype).
 *
 * Now consumes HeroUI **v3** (`@heroui-v3/react`) alongside the still-v2 rest of
 * the inventory (coexistence via pnpm aliases — see `packages/ui/package.json`).
 *
 * THE v3 API BREAK (this is structural, not a prop rename)
 * --------------------------------------------------------
 * v2 shipped a single "fat" `Input` that owned label + error + value. v3 SPLITS
 * that into a FIELD WRAPPER (`TextField`, owns validation/label state) plus a bare
 * `<input>` PRIMITIVE (`Input`). Label and error are now CHILDREN, not props. The
 * field roots accept ONLY `variant: "primary" | "secondary"` + `fullWidth` — there
 * is NO `color`, NO `size`, NO `radius`, NO `labelPlacement`. Those v2 props are
 * ABSORBED by this wrapper (accepted for call-site compatibility, then no-op'd or
 * mapped) so the public surface the apps already pass keeps working byte-for-byte.
 *
 * WHERE value/onChange LIVE (the load-bearing decision)
 * -----------------------------------------------------
 * `ContactForm` (the deployed docs consumer) passes a CONTROLLED `value` plus an
 * EVENT-style `onChange={(event) => updateField("name", event.target.value)}`.
 * v3 has TWO onChange shapes: `TextField.onChange` = `(value: string)` and the
 * `<Input>` primitive's own `onChange` = a DOM `ChangeEvent`. To preserve
 * ContactForm's exact handler signature we route `value`/`onChange` onto the
 * `<Input>` PRIMITIVE (native DOM semantics, identical to v2) and keep ONLY the
 * validation/label state (`isInvalid`/`isRequired`/`isDisabled`) on `TextField`.
 *
 * v3 Input/TextField deltas handled here:
 *   - `label` (v2 prop)        -> rendered as a `<Label>` child.
 *   - `errorMessage`+`isInvalid` -> rendered as a `<FieldError>` child when invalid.
 *   - `required` (HTML attr) and `isRequired` -> folded to TextField `isRequired`.
 *   - `radius` (v2)            -> inline `borderRadius` on the `<Input>` (default
 *     sm = 8px), mirroring AppButton/AppCard — v3 field CSS bakes a larger radius
 *     UNLAYERED, so inline style is the only reliable override.
 *   - `color` / `size` / `labelPlacement` (v2) -> ACCEPTED but NO-OP (no v3 axis).
 *   - `variant` (v2 bordered/flat/...) -> mapped to v3 `primary | secondary`.
 *
 * Styling foundation: warm v3 CSS vars in `../../theme/v3/warmThemeV3.css`; the
 * root scopes itself with `withV3Theme()` so the field is themed correctly even
 * when rendered outside an explicit wrapper element.
 */

import { type ReactNode, type Ref } from "react";
import {
  TextField as HeroV3TextField,
  Input as HeroV3Input,
  Label as HeroV3Label,
  FieldError as HeroV3FieldError,
} from "@heroui-v3/react";
import { withV3Theme } from "../../theme/v3/warmThemeV3";

/** v3 field visual variants (the only style axis the v3 field root exposes). */
export type AppInputVariant = "primary" | "secondary";

/** v2-era `variant` strings docs/stories may still pass. */
type V2InputVariant = "flat" | "bordered" | "faded" | "underlined";

/** v2-era semantic `color` strings (no v3 field axis — accepted, no-op). */
type V2InputColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

type V3Size = "sm" | "md" | "lg";

/**
 * v2 `radius` -> inline border-radius PIXEL values (default sm = 8px). Same fix
 * shape as AppButton/AppCard: the v3 field recipe bakes its radius UNLAYERED, so
 * an inline style is the only reliable override across every consumer.
 */
const RADIUS_PX = {
  none: "0px",
  sm: "8px",
  md: "12px",
  lg: "14px",
  full: "9999px",
} as const;

/**
 * PUBLIC, PRESERVED prop surface. Superset of every prop the docs (ContactForm)
 * and stories pass to AppInput today. Internal mapping turns this into the v3
 * `TextField` + `Input` field model.
 */
export interface AppInputProps {
  /** Visible label — rendered as a `<Label>` child in v3. */
  label?: ReactNode;
  /** Placeholder forwarded to the `<input>` primitive. */
  placeholder?: string;
  /** Native input type (text/email/password/...). */
  type?: React.HTMLInputTypeAttribute;
  name?: string;
  id?: string;
  /** Controlled value — lives on the `<Input>` primitive (native semantics). */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** EVENT-style change handler (matches v2 + ContactForm). */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /** Validation state — drives the `<FieldError>` render + TextField `isInvalid`. */
  isInvalid?: boolean;
  /** Error text — rendered as a `<FieldError>` child when `isInvalid`. */
  errorMessage?: ReactNode;
  isRequired?: boolean;
  /** HTML `required` attribute — folded into TextField `isRequired`. */
  required?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  fullWidth?: boolean;
  autoComplete?: string;
  /** Native input constraints forwarded to the `<input>` primitive. */
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  /** Range bounds for `type="number"`/`type="date"` (string or number per HTML). */
  min?: number | string;
  max?: number | string;
  /** Step for `type="number"`. */
  step?: number | string;
  /** v2 visual axes — accepted for call-site compatibility. */
  variant?: V2InputVariant | AppInputVariant;
  /** v2 `color` — accepted but NO-OP (no v3 field color axis). */
  color?: V2InputColor;
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
  ref?: Ref<HTMLInputElement>;
}

/** Map the v2 `variant` vocabulary onto a v3 field variant. */
function toV3Variant(variant: AppInputProps["variant"]): AppInputVariant {
  if (variant === "secondary" || variant === "faded") return "secondary";
  // bordered / flat / underlined / primary / undefined -> primary.
  return "primary";
}

export function AppInput({
  label,
  placeholder,
  type = "text",
  name,
  id,
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  isInvalid,
  errorMessage,
  isRequired,
  required,
  isDisabled,
  isReadOnly,
  fullWidth = true,
  autoComplete,
  minLength,
  maxLength,
  pattern,
  min,
  max,
  step,
  variant,
  // NOTE: `color`, `size`, `labelPlacement` are part of the public interface for
  // call-site compatibility but have NO v3 field axis — they are intentionally
  // NOT destructured here, so they are silently dropped (no `...rest` spread
  // forwards them onward). This keeps the no-op absorption lint-clean.
  radius = "sm",
  className,
  style,
  ref,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: AppInputProps) {
  const v3Variant = toV3Variant(variant);

  return (
    <HeroV3TextField
      // Validation/label state lives on the field wrapper.
      isInvalid={isInvalid}
      isRequired={isRequired ?? required}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      fullWidth={fullWidth}
      variant={v3Variant}
      // Uncontrolled initial value lives on the FIELD (react-aria TextField owns
      // the input's value via context) — putting defaultValue on the <Input>
      // primitive collides with that context value ("both value and defaultValue").
      defaultValue={value === undefined ? defaultValue : undefined}
      className={withV3Theme(className)}
      aria-label={label ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {label ? <HeroV3Label>{label}</HeroV3Label> : null}
      <HeroV3Input
        ref={ref}
        // CONTROLLED value/onChange (event) ride the primitive — native DOM
        // semantics, identical to v2 + ContactForm. Uncontrolled defaultValue is
        // handled on the TextField above (react-aria owns the value via context),
        // so the primitive never receives both value and defaultValue.
        {...(value !== undefined ? { value } : {})}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        min={min}
        max={max}
        step={step}
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
