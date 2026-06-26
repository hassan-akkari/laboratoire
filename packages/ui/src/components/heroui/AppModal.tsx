"use client";

import {
  Modal as HeroModal,
  ModalContent as HeroModalContent,
  ModalHeader as HeroModalHeader,
  ModalBody as HeroModalBody,
  ModalFooter as HeroModalFooter,
  useDisclosure as heroUseDisclosure,
  type ModalProps,
  type ModalContentProps,
  type ModalHeaderProps,
  type ModalBodyProps,
  type ModalFooterProps,
} from "@heroui/react";

/**
 * AppModal — ARCHETYPE 4: STATEFUL / PORTAL / DISCLOSURE component.
 *
 * COMPOUND + HOOK CONVENTION:
 *  - The portal slots (`ModalContent`/`Header`/`Body`/`Footer`) follow the same
 *    static-member pattern as `AppCard`: thin `App*` passthroughs attached as
 *    `AppModal.Content` / `.Header` / `.Body` / `.Footer`.
 *  - `ModalContent` takes a render-prop child `(onClose) => ReactNode`; we keep
 *    that contract untouched (pure passthrough) so the close handle still flows.
 *  - The disclosure HOOK is re-exported as `useAppDisclosure` — a verbatim
 *    re-export of HeroUI's `useDisclosure`. We surface it from the library so
 *    consumers get the open/close state machine from one import site without
 *    reaching into `@heroui/react` directly. (Re-exported, not wrapped: there is
 *    no sensible default to inject and wrapping a hook would only obscure types.)
 *
 * ACCESSIBILITY: HeroUI wires `role="dialog"`, focus-trap, `aria-modal`, and
 * Esc-to-close automatically. Author SHOULD give the dialog an accessible name —
 * a `ModalHeader` is read as the title; when there is no visible header pass
 * `aria-label` on `AppModal`. Stories cover both.
 *
 * Defaults: `radius="lg"` (dialogs read better with a softer corner than form
 * controls) and `backdrop="opaque"`. Both overridable.
 */
export type AppModalProps = ModalProps;
export type AppModalContentProps = ModalContentProps;
export type AppModalHeaderProps = ModalHeaderProps;
export type AppModalBodyProps = ModalBodyProps;
export type AppModalFooterProps = ModalFooterProps;

export function AppModalContent(props: AppModalContentProps) {
  return <HeroModalContent {...props} />;
}

export function AppModalHeader(props: AppModalHeaderProps) {
  return <HeroModalHeader {...props} />;
}

export function AppModalBody(props: AppModalBodyProps) {
  return <HeroModalBody {...props} />;
}

export function AppModalFooter(props: AppModalFooterProps) {
  return <HeroModalFooter {...props} />;
}

function AppModalRoot({
  radius = "lg",
  backdrop = "opaque",
  ...props
}: AppModalProps) {
  return <HeroModal radius={radius} backdrop={backdrop} {...props} />;
}

/**
 * Disclosure hook, re-exported verbatim. Returns `{ isOpen, onOpen, onClose,
 * onOpenChange, ... }`. Named `useAppDisclosure` so the open/close machine is
 * available from the same package as the component.
 */
export const useAppDisclosure = heroUseDisclosure;

/**
 * Explicit intersection annotation: keeps every static member named/exported in
 * the `.d.ts` and portable for `tsc --declaration` (no TS2742 inlining).
 */
export const AppModal: typeof AppModalRoot & {
  Content: typeof AppModalContent;
  Header: typeof AppModalHeader;
  Body: typeof AppModalBody;
  Footer: typeof AppModalFooter;
} = Object.assign(AppModalRoot, {
  Content: AppModalContent,
  Header: AppModalHeader,
  Body: AppModalBody,
  Footer: AppModalFooter,
});
