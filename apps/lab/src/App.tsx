import { useState, type ReactNode } from "react";
import { useDisclosure } from "@heroui/react";
import {
  ThemeToggle,
  AppButton,
  AppInput,
  AppTextarea,
  AppSelect,
  AppSelectItem,
  AppCheckbox,
  AppSwitch,
  AppRadioGroup,
  AppRadio,
  AppCard,
  AppCardHeader,
  AppCardBody,
  AppCardFooter,
  AppChip,
  AppAlert,
  AppAvatar,
  AppAvatarGroup,
  AppDivider,
  AppSpinner,
  AppLink,
  AppTooltip,
  AppModal,
  AppModalContent,
  AppModalHeader,
  AppModalBody,
  AppModalFooter,
  AppDropdown,
  AppDropdownTrigger,
  AppDropdownMenu,
  AppDropdownItem,
  AppAccordion,
  AppAccordionItem,
  AppTabs,
  AppTab,
  AppTable,
  AppTableHeader,
  AppTableColumn,
  AppTableBody,
  AppTableRow,
  AppTableCell,
  AppPagination,
} from "@laboratoire/ui";

/* A labelled showcase block: a heading + a wrapped row of live component states. */
function Demo({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ display: "grid", gap: 12 }}>
      <h3
        style={{
          margin: 0,
          fontSize: 13,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--app-muted)",
        }}
      >
        {title}
      </h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "center",
        }}
      >
        {children}
      </div>
    </section>
  );
}

/* A top-level category: a big heading + its demos in a column. */
function Category({ name, children }: { name: string; children: ReactNode }) {
  return (
    <section style={{ display: "grid", gap: 24 }}>
      <h2 style={{ margin: 0, fontSize: 22 }}>{name}</h2>
      <div style={{ display: "grid", gap: 28 }}>{children}</div>
    </section>
  );
}

const SELECT_ITEMS = [
  { key: "card", label: "Card" },
  { key: "wallet", label: "Wallet" },
  { key: "transfer", label: "Bank transfer" },
];

/* Modal lives in its own component so it can hold disclosure state. */
function ModalDemo() {
  const disclosure = useDisclosure();
  return (
    <>
      <AppButton onPress={disclosure.onOpen}>Open modal</AppButton>
      <AppModal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
        <AppModalContent>
          {(onClose) => (
            <>
              <AppModalHeader>Confirm booking</AppModalHeader>
              <AppModalBody>
                <p>Everything live on the shared warm theme.</p>
              </AppModalBody>
              <AppModalFooter>
                <AppButton variant="flat" onPress={onClose}>
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
}

export default function App() {
  const [page, setPage] = useState(1);

  return (
    <div style={{ minHeight: "100%" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px clamp(16px, 4vw, 48px)",
          borderBottom: "1px solid var(--app-border)",
          position: "sticky",
          top: 0,
          background: "var(--app-bg)",
          zIndex: 10,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 20 }}>@laboratoire/ui</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--app-muted)" }}>
            Component playground — every wrapper on the warm theme
          </p>
        </div>
        <ThemeToggle />
      </header>

      <main
        style={{
          display: "grid",
          gap: 48,
          padding: "32px clamp(16px, 4vw, 48px) 80px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <Category name="Form controls">
          <Demo title="Button">
            <AppButton>Primary</AppButton>
            <AppButton variant="bordered">Bordered</AppButton>
            <AppButton variant="flat">Flat</AppButton>
            <AppButton isDisabled>Disabled</AppButton>
            <AppButton as="a" href="#data">
              As anchor
            </AppButton>
          </Demo>

          <Demo title="Input">
            <div style={{ minWidth: 220 }}>
              <AppInput label="Full name" placeholder="Hassan Akkari" />
            </div>
            <div style={{ minWidth: 220 }}>
              <AppInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                isRequired
              />
            </div>
            <div style={{ minWidth: 220 }}>
              <AppInput
                label="Invalid"
                isInvalid
                errorMessage="Required field"
                defaultValue="x"
              />
            </div>
          </Demo>

          <Demo title="Textarea">
            <div style={{ minWidth: 320 }}>
              <AppTextarea label="Notes" placeholder="Anything we should know?" />
            </div>
          </Demo>

          <Demo title="Select">
            <div style={{ minWidth: 220 }}>
              <AppSelect label="Payment method" placeholder="Choose one">
                {SELECT_ITEMS.map((item) => (
                  <AppSelectItem key={item.key}>{item.label}</AppSelectItem>
                ))}
              </AppSelect>
            </div>
          </Demo>

          <Demo title="Checkbox / Switch">
            <AppCheckbox defaultSelected>Accept terms</AppCheckbox>
            <AppCheckbox>Unchecked</AppCheckbox>
            <AppSwitch defaultSelected>Notifications</AppSwitch>
            <AppSwitch>Off</AppSwitch>
          </Demo>

          <Demo title="Radio group">
            <AppRadioGroup label="Plan" defaultValue="pro" orientation="horizontal">
              <AppRadio value="free">Free</AppRadio>
              <AppRadio value="pro">Pro</AppRadio>
              <AppRadio value="team">Team</AppRadio>
            </AppRadioGroup>
          </Demo>
        </Category>

        <Category name="Display & feedback">
          <Demo title="Card">
            <AppCard style={{ maxWidth: 320 }}>
              <AppCardHeader>Card header</AppCardHeader>
              <AppCardBody>
                Body content sits on the warm surface token.
              </AppCardBody>
              <AppCardFooter>
                <AppButton size="sm">Action</AppButton>
              </AppCardFooter>
            </AppCard>
          </Demo>

          <Demo title="Chip">
            <AppChip>Default</AppChip>
            <AppChip color="accent">Accent</AppChip>
            <AppChip color="success">Success</AppChip>
            <AppChip color="warning">Warning</AppChip>
            <AppChip color="danger">Danger</AppChip>
          </Demo>

          <Demo title="Alert">
            <div style={{ display: "grid", gap: 10, width: "100%", maxWidth: 480 }}>
              <AppAlert color="success" title="Saved" description="Changes stored." />
              <AppAlert color="danger" title="Error" description="Something failed." />
            </div>
          </Demo>

          <Demo title="Avatar">
            <AppAvatar name="HA" />
            <AppAvatarGroup max={3}>
              <AppAvatar name="A" />
              <AppAvatar name="B" />
              <AppAvatar name="C" />
              <AppAvatar name="D" />
            </AppAvatarGroup>
          </Demo>

          <Demo title="Divider / Spinner">
            <div style={{ width: 200 }}>
              <span>Above</span>
              <AppDivider />
              <span>Below</span>
            </div>
            <AppSpinner />
          </Demo>

          <Demo title="Tooltip / Link">
            <AppTooltip content="Helpful hint">
              <AppButton variant="flat">Hover me</AppButton>
            </AppTooltip>
            <AppLink href="#data">A themed link</AppLink>
          </Demo>
        </Category>

        <Category name="Overlay & disclosure">
          <Demo title="Modal">
            <ModalDemo />
          </Demo>

          <Demo title="Dropdown">
            <AppDropdown>
              <AppDropdownTrigger>
                <AppButton variant="bordered">Open menu</AppButton>
              </AppDropdownTrigger>
              <AppDropdownMenu aria-label="Actions">
                <AppDropdownItem key="edit">Edit</AppDropdownItem>
                <AppDropdownItem key="copy">Copy</AppDropdownItem>
                <AppDropdownItem key="delete" className="text-danger">
                  Delete
                </AppDropdownItem>
              </AppDropdownMenu>
            </AppDropdown>
          </Demo>

          <Demo title="Accordion">
            <div style={{ width: "100%", maxWidth: 480 }}>
              <AppAccordion>
                <AppAccordionItem key="a" aria-label="First" title="What is this?">
                  A live gallery of the shared component library.
                </AppAccordionItem>
                <AppAccordionItem key="b" aria-label="Second" title="How themed?">
                  One warm theme, one provider, across all apps.
                </AppAccordionItem>
              </AppAccordion>
            </div>
          </Demo>
        </Category>

        <Category name="Navigation">
          <Demo title="Tabs">
            <div style={{ width: "100%", maxWidth: 480 }}>
              <AppTabs aria-label="Sections">
                <AppTab key="overview" title="Overview">
                  Overview panel.
                </AppTab>
                <AppTab key="pricing" title="Pricing">
                  Pricing panel.
                </AppTab>
                <AppTab key="reviews" title="Reviews">
                  Reviews panel.
                </AppTab>
              </AppTabs>
            </div>
          </Demo>

          <Demo title="Pagination">
            <AppPagination total={10} page={page} onChange={setPage} />
          </Demo>
        </Category>

        <Category name="Data">
          <div id="data" />
          <Demo title="Table">
            <div style={{ width: "100%", maxWidth: 640 }}>
              <AppTable aria-label="Bookings">
                <AppTableHeader>
                  <AppTableColumn>EXPERIENCE</AppTableColumn>
                  <AppTableColumn>GUESTS</AppTableColumn>
                  <AppTableColumn>STATUS</AppTableColumn>
                </AppTableHeader>
                <AppTableBody>
                  <AppTableRow key="1">
                    <AppTableCell>Sunset sail</AppTableCell>
                    <AppTableCell>4</AppTableCell>
                    <AppTableCell>
                      <AppChip color="success">confirmed</AppChip>
                    </AppTableCell>
                  </AppTableRow>
                  <AppTableRow key="2">
                    <AppTableCell>City food tour</AppTableCell>
                    <AppTableCell>2</AppTableCell>
                    <AppTableCell>
                      <AppChip color="warning">pending</AppChip>
                    </AppTableCell>
                  </AppTableRow>
                </AppTableBody>
              </AppTable>
            </div>
          </Demo>
        </Category>
      </main>
    </div>
  );
}
