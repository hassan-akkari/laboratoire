"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const nextPath = search.get("next") ?? "/admin";
  const safeNext = nextPath.startsWith("/admin") ? nextPath : "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push(safeNext);
      router.refresh();
      return;
    }
    setLoading(false);
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    setError(body.error ?? `Login failed (${res.status})`);
  }

  return (
    <div className="stage-center">
      <section
        className="card"
        style={{ maxWidth: 440, width: "100%", padding: 28 }}
      >
        <p className="admin-brand">Cammino <span>· Admin</span></p>
        <h1 style={{ margin: 0, fontSize: "clamp(26px, 3.5vw, 32px)" }}>Admin sign in</h1>
      <p style={{ margin: "8px 0 18px", color: "var(--app-muted)" }}>
        Restricted to itshassan.it administrators.
      </p>

      {error ? <div className="notice err">{error}</div> : null}

      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <label className="form-label">
          Email
          <input
            className="field"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="form-label">
          Password
          <input
            className="field"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="button" type="submit" disabled={loading || !email || !password}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      </section>
    </div>
  );
}
