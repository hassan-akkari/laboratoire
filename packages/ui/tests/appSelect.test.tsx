import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { Selection } from "@heroui/react";
import { AppSelect, AppSelectItem } from "../src/components/heroui/AppSelect";

/**
 * Variant C regression net for the v3 field-slice migration of AppSelect — the
 * hardest wrapper. It absorbs the v2 Set-based surface (`selectedKeys: Selection`,
 * `onSelectionChange: (Selection) => void`, `selectionMode`, `items`, collection
 * children) and translates it onto the v3 compound Select (Trigger/Value/
 * Indicator/Popover + inner ListBox) whose native selection is `value`/`onChange`.
 *
 * These tests MIRROR the 7 AppSelect stories (Default/Controlled/Multiple/
 * AriaLabelOnly/Disabled/Invalid/Empty) and assert each shape SERVER-RENDERS
 * without throwing — the stories stay AS-IS as the visual spec; this is the
 * machine-checkable regression net. `renderToStaticMarkup` renders the closed
 * Select (trigger + label + selected value); the popover/listbox open in the
 * browser (covered by the stories), so item-level assertions target the trigger's
 * reflected value, not the popover contents.
 */

const EXPERIENCES = [
  { key: "hike", label: "Sunrise hike" },
  { key: "dive", label: "Reef dive" },
  { key: "cook", label: "Pasta workshop" },
  { key: "wine", label: "Vineyard tour" },
];

function items() {
  return EXPERIENCES.map((e) => (
    <AppSelectItem key={e.key}>{e.label}</AppSelectItem>
  ));
}

describe("AppSelect (v3 field-slice)", () => {
  it("renders the visible label (Default / uncontrolled)", () => {
    const markup = renderToStaticMarkup(
      <AppSelect label="Experience" placeholder="Pick an experience">
        {items()}
      </AppSelect>,
    );
    expect(markup).toContain("Experience");
  });

  it("reflects a controlled single selection in the trigger value", () => {
    const selected: Selection = new Set(["dive"]);
    const markup = renderToStaticMarkup(
      <AppSelect
        label="Experience"
        selectedKeys={selected}
        onSelectionChange={() => {}}
      >
        {items()}
      </AppSelect>,
    );
    // The chosen option's label surfaces in the closed trigger.
    expect(markup).toContain("Reef dive");
  });

  it("does not fire onSelectionChange during a pure render", () => {
    const onSelectionChange = vi.fn();
    renderToStaticMarkup(
      <AppSelect
        label="Experience"
        selectedKeys={new Set(["hike"])}
        onSelectionChange={onSelectionChange}
      >
        {items()}
      </AppSelect>,
    );
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("renders multiple-selection mode (Multiple story shape)", () => {
    expect(() =>
      renderToStaticMarkup(
        <AppSelect label="Add-ons" selectionMode="multiple">
          {items()}
        </AppSelect>,
      ),
    ).not.toThrow();
  });

  it("reflects a controlled multiple selection", () => {
    const selected: Selection = new Set(["hike", "wine"]);
    const markup = renderToStaticMarkup(
      <AppSelect
        label="Add-ons"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={() => {}}
      >
        {items()}
      </AppSelect>,
    );
    // Both chosen labels surface in the closed multi-select trigger.
    expect(markup).toContain("Sunrise hike");
    expect(markup).toContain("Vineyard tour");
  });

  it("renders the aria-label-only path (label hidden)", () => {
    const markup = renderToStaticMarkup(
      <AppSelect aria-label="Experience" placeholder="Select">
        {items()}
      </AppSelect>,
    );
    expect(markup).toContain('aria-label="Experience"');
  });

  it("renders the disabled path", () => {
    expect(() =>
      renderToStaticMarkup(
        <AppSelect label="Experience" isDisabled>
          {items()}
        </AppSelect>,
      ),
    ).not.toThrow();
  });

  it("shows the error message when invalid + required (Invalid story shape)", () => {
    const markup = renderToStaticMarkup(
      <AppSelect
        label="Experience"
        isInvalid
        errorMessage="Please choose an experience"
        isRequired
      >
        {items()}
      </AppSelect>,
    );
    expect(markup).toContain("Please choose an experience");
  });

  it("renders the empty-collection edge with the dynamic items API", () => {
    expect(() =>
      renderToStaticMarkup(
        <AppSelect label="Sold out" items={[]}>
          {() => <AppSelectItem>unused</AppSelectItem>}
        </AppSelect>,
      ),
    ).not.toThrow();
  });
});
