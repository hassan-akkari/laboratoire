"use client";

import { Textarea as HeroTextarea, type TextAreaProps } from "@heroui/react";

export type AppTextareaProps = TextAreaProps;

export function AppTextarea({
  color = "primary",
  radius = "sm",
  variant = "bordered",
  labelPlacement = "inside",
  fullWidth = true,
  ...props
}: AppTextareaProps) {
  return (
    <HeroTextarea
      color={color}
      radius={radius}
      variant={variant}
      labelPlacement={labelPlacement}
      fullWidth={fullWidth}
      {...props}
    />
  );
}
