"use client";

import { useState } from "react";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    // Hard navigation (not router.push) so the in-memory RSC cache of the
    // prior admin pages is dropped immediately — avoids a flash of stale
    // lead/site-config data if the user hits Back before the cache invalidates.
    window.location.assign("/admin/login");
  }

  return (
    <button className="button button--bordered" type="button" onClick={handleClick} disabled={loading}>
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
