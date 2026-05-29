"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { logout } from "@/lib/client-api";

export function BoardHeader() {
  const router = useRouter();
  const pathname = usePathname();

  async function onLogout() {
    await logout();
    router.push("/login");
    router.refresh();
  }

  const link = (href: string, label: string) => (
    <Link
      href={href}
      className={`text-sm font-medium ${pathname === href ? "text-ink" : "text-muted hover:text-ink"}`}
    >
      {label}
    </Link>
  );

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-ink">SmartnSales</span>
          <nav className="flex gap-4">
            {link("/board", "Board")}
            {link("/dashboard", "Dashboard")}
          </nav>
        </div>
        <Button variant="ghost" onClick={onLogout}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
