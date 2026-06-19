"use client";

import { Button as HeroButton, type ButtonProps } from "@heroui/react";

export type AppButtonProps = ButtonProps;

export function AppButton({
  color = "primary",
  radius = "sm",
  variant = "solid",
  ...props
}: AppButtonProps) {
  return (
    <HeroButton color={color} radius={radius} variant={variant} {...props} />
  );
}
