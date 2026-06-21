import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AppButton } from "../src/components/heroui/AppButton";

/**
 * Variant C "robust + tested" invariant for the m3-ripple integration.
 *
 * v3 Button ships NO built-in ripple, so AppButton nests the Material-3
 * `m3-ripple` <Ripple> (which renders `div.salty-ripple`/`.salty-ripple-surface`)
 * into BOTH of its render paths — the react-aria <button> AND the styled <a>.
 *
 * We assert against server-rendered markup (`renderToStaticMarkup`) on purpose:
 *   - it needs no jsdom/RTL (the suite runs in the default node environment), and
 *   - it doubles as the SSR-safety guard the angle requires — if the Ripple (or
 *     anything it imports) touched `document`/`window` at module/render scope, a
 *     server render would throw and these tests would fail. They pass, which
 *     proves the wrapper is safe to render in a future web-next RSC/SSR graph.
 *
 * m3-ripple renders its host <div>s on the INITIAL render (before any effect),
 * so the markers appear in static markup. When `disabled`, m3-ripple still emits
 * the host element (it just attaches no listeners and shows no feedback), so we
 * assert on the `disableRipple` opt-out (no node at all) and on the marker count
 * to distinguish "ripple present" from "ripple absent".
 */

const RIPPLE_MARKER = "salty-ripple";

function countRipples(markup: string): number {
  // `salty-ripple` is the outer wrapper class; `salty-ripple-surface` is the
  // inner one. Count the wrapper occurrences (class token boundary) so one
  // <Ripple> == one match regardless of the inner surface element.
  return markup.split('class="salty-ripple"').length - 1;
}

describe("AppButton m3-ripple integration", () => {
  it("nests a Ripple in the default (button) render path", () => {
    const markup = renderToStaticMarkup(<AppButton>Press me</AppButton>);
    expect(markup).toContain(RIPPLE_MARKER);
    expect(countRipples(markup)).toBe(1);
    // The host must be a positioning + clipping context for the absolute overlay.
    expect(markup).toContain("relative");
    expect(markup).toContain("overflow-hidden");
  });

  it("nests a Ripple in the anchor (as=\"a\") render path", () => {
    const markup = renderToStaticMarkup(
      <AppButton as="a" href="https://example.com">
        Open link
      </AppButton>,
    );
    // Anchor path is a real <a>, and it carries its own ripple (design choice:
    // both paths stay visually identical).
    expect(markup).toContain("<a");
    expect(markup).toContain(RIPPLE_MARKER);
    expect(countRipples(markup)).toBe(1);
    expect(markup).toContain("relative");
    expect(markup).toContain("overflow-hidden");
  });

  it("omits the Ripple node entirely when disableRipple is set (both paths)", () => {
    const buttonMarkup = renderToStaticMarkup(
      <AppButton disableRipple>Press me</AppButton>,
    );
    expect(buttonMarkup).not.toContain(RIPPLE_MARKER);

    const anchorMarkup = renderToStaticMarkup(
      <AppButton as="a" href="#" disableRipple>
        Open
      </AppButton>,
    );
    expect(anchorMarkup).not.toContain(RIPPLE_MARKER);
  });

  it("renders without throwing during SSR while loading (pending) — ripple stays mounted but inert", () => {
    // The pending path uses the v3 render-prop; this must server-render cleanly.
    const markup = renderToStaticMarkup(
      <AppButton isLoading>Submitting…</AppButton>,
    );
    expect(markup).toContain(RIPPLE_MARKER);
    expect(countRipples(markup)).toBe(1);
  });

  it("still mounts the Ripple host when isDisabled (gated inert, not removed)", () => {
    const markup = renderToStaticMarkup(
      <AppButton isDisabled>Press me</AppButton>,
    );
    // disableRipple is the only path that removes the node; a disabled button
    // keeps the host (the ripple is simply inert) so layout stays identical.
    expect(markup).toContain(RIPPLE_MARKER);
  });
});
