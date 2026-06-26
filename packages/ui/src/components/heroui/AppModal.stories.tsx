import type { Meta, StoryObj } from "@storybook/react";
import { AppModal, AppModalBody, AppModalFooter, AppModalHeader } from "./AppModal";
import { AppModalContent } from "./AppModal";
import { useAppDisclosure } from "./AppModal";
import { AppButton } from "./AppButton";

/**
 * Variant C story: a disclosure-driven trigger (so the dialog is reachable in
 * docs), plus size/placement/backdrop variants and the no-visible-header case
 * with `aria-label`. HeroUI provides focus-trap, `role="dialog"`, `aria-modal`
 * and Esc-close, so a11y stays clean as long as the dialog has an accessible
 * name (header text or `aria-label`).
 */
const meta = {
  title: "HeroUI/AppModal",
  component: AppModal,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "full"],
    },
    radius: { control: "inline-radio", options: ["none", "sm", "md", "lg"] },
    placement: {
      control: "select",
      options: ["auto", "center", "top", "bottom"],
    },
    backdrop: {
      control: "inline-radio",
      options: ["transparent", "opaque", "blur"],
    },
    isDismissable: { control: "boolean" },
  },
  // `AppModal` requires `children`; every story below supplies its own subtree
  // via `render`, but Storybook's strict `StoryObj` still needs the required
  // prop satisfied at the `meta` level — this default fills that contract.
  args: {
    children: (
      <AppModalContent>
        <AppModalBody>Modal content</AppModalBody>
      </AppModalContent>
    ),
  },
} satisfies Meta<typeof AppModal>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Canonical usage: `useAppDisclosure` drives open state; render-prop `onClose`. */
export const Default: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const disclosure = useAppDisclosure();
    return (
      <>
        <AppButton onPress={disclosure.onOpen}>Open modal</AppButton>
        <AppModal
          {...args}
          isOpen={disclosure.isOpen}
          onOpenChange={disclosure.onOpenChange}
        >
          <AppModalContent>
            {(onClose) => (
              <>
                <AppModalHeader>Confirm booking</AppModalHeader>
                <AppModalBody>
                  <p style={{ margin: 0 }}>
                    You are about to reserve the Sunrise Hike for 2 guests.
                  </p>
                </AppModalBody>
                <AppModalFooter>
                  <AppButton variant="light" onPress={onClose}>
                    Cancel
                  </AppButton>
                  <AppButton onPress={onClose}>Confirm</AppButton>
                </AppModalFooter>
              </>
            )}
          </AppModalContent>
        </AppModal>
      </>
    );
  },
};

/** Dot-namespaced static members, larger size, blurred backdrop. */
export const DotFormBlurred: Story = {
  args: { size: "lg", backdrop: "blur" },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const disclosure = useAppDisclosure();
    return (
      <>
        <AppButton onPress={disclosure.onOpen}>Open (blurred)</AppButton>
        <AppModal
          {...args}
          isOpen={disclosure.isOpen}
          onOpenChange={disclosure.onOpenChange}
        >
          <AppModal.Content>
            {(onClose) => (
              <>
                <AppModal.Header>Details</AppModal.Header>
                <AppModal.Body>
                  <p style={{ margin: 0 }}>Written with AppModal.Body etc.</p>
                </AppModal.Body>
                <AppModal.Footer>
                  <AppButton onPress={onClose}>Done</AppButton>
                </AppModal.Footer>
              </>
            )}
          </AppModal.Content>
        </AppModal>
      </>
    );
  },
};

/** No visible header — accessible name comes from `aria-label`. */
export const NoHeaderAriaLabel: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const disclosure = useAppDisclosure();
    return (
      <>
        <AppButton onPress={disclosure.onOpen}>Open (aria-label)</AppButton>
        <AppModal
          {...args}
          aria-label="Quick note"
          isOpen={disclosure.isOpen}
          onOpenChange={disclosure.onOpenChange}
        >
          <AppModalContent>
            {(onClose) => (
              <AppModalBody>
                <p style={{ margin: "16px 0" }}>
                  A header-less dialog still names itself via aria-label.
                </p>
                <AppButton onPress={onClose}>Close</AppButton>
              </AppModalBody>
            )}
          </AppModalContent>
        </AppModal>
      </>
    );
  },
};

/** Static (always-open) preview so the dialog body is visible in autodocs. */
export const StaticOpen: Story = {
  args: { isOpen: true },
  render: (args) => (
    <AppModal {...args}>
      <AppModalContent>
        {() => (
          <>
            <AppModalHeader>Always open</AppModalHeader>
            <AppModalBody>
              <p style={{ margin: 0 }}>
                Rendered open for the docs snapshot (no trigger needed).
              </p>
            </AppModalBody>
          </>
        )}
      </AppModalContent>
    </AppModal>
  ),
};
