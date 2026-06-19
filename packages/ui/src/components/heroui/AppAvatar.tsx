"use client";

import {
  Avatar as HeroAvatar,
  AvatarGroup as HeroAvatarGroup,
  type AvatarProps,
  type AvatarGroupProps,
} from "@heroui/react";

/**
 * AppAvatar — ARCHETYPE 2: STATIC COMPOUND component (same pattern as
 * `AppCard`). HeroUI ships a standalone `Avatar` plus an `AvatarGroup` container
 * that clones/stacks child avatars. We wrap each as a THIN passthrough and ALSO
 * attach the group to the root as a static property, so consumers can write
 * EITHER:
 *
 *   import { AppAvatar, AppAvatarGroup } from "@laboratoire/ui";
 *   <AppAvatarGroup><AppAvatar … /></AppAvatarGroup>
 *
 * OR the dot-namespaced form:
 *
 *   <AppAvatar.Group><AppAvatar … /></AppAvatar.Group>
 *
 * Both resolve to the same component.
 *
 * Defaults: `radius="sm"` matches the rest of the inventory (HeroUI's own
 * Avatar default is `"full"`); overridable per call. `color`/`size` are left to
 * the consumer. The group carries `radius="sm"` too so an un-prop'd group reads
 * consistently with the standalone avatar.
 */
export type AppAvatarProps = AvatarProps;
export type AppAvatarGroupProps = AvatarGroupProps;

export function AppAvatarGroup({ radius = "sm", ...props }: AppAvatarGroupProps) {
  return <HeroAvatarGroup radius={radius} {...props} />;
}

function AppAvatarRoot({ radius = "sm", ...props }: AppAvatarProps) {
  return <HeroAvatar radius={radius} {...props} />;
}

/**
 * Static-property attachment. The EXPLICIT intersection type annotation (rather
 * than relying on `Object.assign`'s inference) keeps the emitted `.d.ts`
 * portable: every member is a named, exported component, so `tsc --declaration`
 * never inlines a non-portable internal HeroUI path (TS2742).
 */
export const AppAvatar: typeof AppAvatarRoot & {
  Group: typeof AppAvatarGroup;
} = Object.assign(AppAvatarRoot, {
  Group: AppAvatarGroup,
});
