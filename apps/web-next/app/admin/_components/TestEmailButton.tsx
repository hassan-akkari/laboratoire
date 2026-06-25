"use client";

import { useState } from "react";
import { AppButton } from "@laboratoire/ui";

export function TestEmailButton() {
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "ok"; recipient: string }
    | { kind: "err"; message: string }
  >({ kind: "idle" });

  async function handleClick() {
    setState({ kind: "loading" });
    const res = await fetch("/api/admin/test-email", { method: "POST" });
    const body = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      recipient?: string;
      error?: string;
    };
    if (res.ok && body.ok) {
      setState({ kind: "ok", recipient: body.recipient ?? "configured address" });
    } else {
      setState({ kind: "err", message: body.error ?? `Request failed (${res.status})` });
    }
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {/* `isDisabled` (not native `disabled`); `bordered` -> v3 secondary. */}
      <AppButton
        variant="bordered"
        type="button"
        onClick={handleClick}
        isDisabled={state.kind === "loading"}
      >
        {state.kind === "loading" ? "Sending…" : "Send test email"}
      </AppButton>
      {state.kind === "ok" ? (
        <div className="notice ok">Test email sent to <strong>{state.recipient}</strong>.</div>
      ) : null}
      {state.kind === "err" ? <div className="notice err">{state.message}</div> : null}
    </div>
  );
}
