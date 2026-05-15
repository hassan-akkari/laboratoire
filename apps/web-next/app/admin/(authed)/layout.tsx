import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdminSession } from "@/lib/adminSession";
import { LogoutButton } from "../_components/LogoutButton";

export default async function AdminAuthedLayout({ children }: { children: ReactNode }) {
  await requireAdminSession();
  return (
    <div className="admin-shell">
      <nav className="admin-topbar">
        <div className="admin-topbar__links">
          <Link href="/admin">Leads</Link>
          <Link href="/admin/site-config">Site config</Link>
        </div>
        <LogoutButton />
      </nav>
      {children}
    </div>
  );
}
