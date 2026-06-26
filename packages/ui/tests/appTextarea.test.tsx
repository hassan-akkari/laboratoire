import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AppTextarea } from "../src/components/heroui/AppTextarea";

/**
 * Variant C regression net for the v3 field-slice migration of AppTextarea.
 *
 * AppTextarea migrated to the v3 `TextField` + `TextArea` field model. The
 * load-bearing delta is that v3 `TextArea` has NO `minRows`/auto-grow — the
 * wrapper PRESERVES the v2 `minRows` prop (ContactForm passes `minRows={6}`) and
 * maps it onto the native `rows` attribute. These tests pin that mapping plus the
 * label/error/SSR invariants. Same `renderToStaticMarkup` (no jsdom) approach as
 * the AppInput + AppButton suites.
 */

describe("AppTextarea (v3 field-slice)", () => {
  it("renders a real <textarea> with its label", () => {
    const markup = renderToStaticMarkup(
      <AppTextarea label="Message" name="message" />,
    );
    expect(markup).toContain("<textarea");
    expect(markup).toContain("Message");
  });

  it("maps minRows onto the native rows attribute", () => {
    const markup = renderToStaticMarkup(
      <AppTextarea label="Message" minRows={6} />,
    );
    expect(markup).toContain('rows="6"');
  });

  it("falls back to rows=3 when neither minRows nor rows is given", () => {
    const markup = renderToStaticMarkup(<AppTextarea label="Message" />);
    expect(markup).toContain('rows="3"');
  });

  it("honors an explicit rows when minRows is absent", () => {
    const markup = renderToStaticMarkup(
      <AppTextarea label="Message" rows={10} />,
    );
    expect(markup).toContain('rows="10"');
  });

  it("reflects a controlled value", () => {
    const markup = renderToStaticMarkup(
      <AppTextarea label="Bio" value="Hello there" onChange={() => {}} />,
    );
    expect(markup).toContain("Hello there");
  });

  it("shows the error message only when isInvalid", () => {
    const invalid = renderToStaticMarkup(
      <AppTextarea
        label="Message"
        isInvalid
        errorMessage="Message is too short"
        minRows={6}
      />,
    );
    expect(invalid).toContain("Message is too short");

    const valid = renderToStaticMarkup(
      <AppTextarea
        label="Message"
        errorMessage="Message is too short"
        minRows={6}
      />,
    );
    expect(valid).not.toContain("Message is too short");
  });

  it("server-renders the ContactForm-shape usage (minRows={6}) without throwing", () => {
    expect(() =>
      renderToStaticMarkup(
        <AppTextarea
          name="Message"
          label="Message"
          labelPlacement="inside"
          minRows={6}
          value="hi"
          onChange={(event) => event.target.value}
          isInvalid={false}
          required
        />,
      ),
    ).not.toThrow();
  });
});
