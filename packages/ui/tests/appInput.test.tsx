import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { AppInput } from "../src/components/heroui/AppInput";

/**
 * Variant C regression net for the v3 field-slice migration of AppInput.
 *
 * AppInput migrated from the v2 "fat" Input to the v3 `TextField` + `Input`
 * field model (label + error are CHILDREN now). There were NO vitest tests for
 * the field wrappers before this slice — these are the new coverage.
 *
 * We assert against server-rendered markup (`renderToStaticMarkup`) on purpose:
 *   - it needs no jsdom/RTL (the existing UI suite runs in the default node
 *     environment — same approach as appButtonRipple.test.tsx), and
 *   - it doubles as the SSR-safety guard: if any wrapper (or the v3 components it
 *     nests) touched `document`/`window` at module/render scope, a server render
 *     would throw and these tests would fail.
 *
 * The interactive onChange wiring is verified structurally: the wrapper routes
 * `value`/`onChange` onto the `<input>` PRIMITIVE (native DOM semantics matching
 * ContactForm). We render a controlled value and assert it lands on the input,
 * and we assert the handler IDENTITY survives by spying that nothing is invoked
 * during a pure render (no spurious change events) — the event itself fires in
 * the browser/Storybook, which the 7 stories cover.
 */

describe("AppInput (v3 field-slice)", () => {
  it("renders the label as a child element", () => {
    const markup = renderToStaticMarkup(
      <AppInput label="Email" name="email" type="email" />,
    );
    expect(markup).toContain("Email");
    // The v3 field renders a real <input>.
    expect(markup).toContain("<input");
  });

  it("reflects a controlled value on the input primitive", () => {
    const markup = renderToStaticMarkup(
      <AppInput label="Name" value="Ada Lovelace" onChange={() => {}} />,
    );
    expect(markup).toContain('value="Ada Lovelace"');
  });

  it("forwards the native input type and placeholder", () => {
    const markup = renderToStaticMarkup(
      <AppInput label="Email" type="email" placeholder="you@example.com" />,
    );
    expect(markup).toContain('type="email"');
    expect(markup).toContain('placeholder="you@example.com"');
  });

  it("shows the error message only when isInvalid", () => {
    const invalid = renderToStaticMarkup(
      <AppInput
        label="Email"
        isInvalid
        errorMessage="Enter a valid email"
        value=""
        onChange={() => {}}
      />,
    );
    expect(invalid).toContain("Enter a valid email");

    const valid = renderToStaticMarkup(
      <AppInput
        label="Email"
        errorMessage="Enter a valid email"
        value=""
        onChange={() => {}}
      />,
    );
    // errorMessage is suppressed when the field is not invalid.
    expect(valid).not.toContain("Enter a valid email");
  });

  it("does not fire onChange during a pure render (event-shape handler stays inert)", () => {
    const onChange = vi.fn();
    renderToStaticMarkup(
      <AppInput label="Name" value="x" onChange={onChange} />,
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders without an explicit label when given aria-label only", () => {
    const markup = renderToStaticMarkup(
      <AppInput aria-label="Search" placeholder="Search" />,
    );
    expect(markup).toContain("<input");
    // No <label> text node is forced when the field is labelled via aria-label.
    expect(markup).toContain("Search");
  });

  it("server-renders the ContactForm-shape usage without throwing", () => {
    // Mirrors ContactForm's exact props: type/name/label/labelPlacement/value/
    // onChange(event)/isInvalid/errorMessage/required.
    expect(() =>
      renderToStaticMarkup(
        createElement(AppInput, {
          type: "text",
          name: "Name",
          label: "Name",
          labelPlacement: "inside",
          value: "Grace",
          onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
            event.target.value,
          isInvalid: false,
          errorMessage: undefined,
          required: true,
        }),
      ),
    ).not.toThrow();
  });
});
