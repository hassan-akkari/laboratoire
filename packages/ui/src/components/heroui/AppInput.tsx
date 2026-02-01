import { Input as HeroInput, type InputProps } from "@heroui/react";

export type AppInputProps = InputProps;

export function AppInput({
  color = "primary",
  radius = "lg",
  variant = "bordered",
  labelPlacement = "inside",
  fullWidth = true,
  ...props
}: AppInputProps) {
  return (
    <HeroInput
      color={color}
      radius={radius}
      variant={variant}
      labelPlacement={labelPlacement}
      fullWidth={fullWidth}
      {...props}
    />
  );
}
