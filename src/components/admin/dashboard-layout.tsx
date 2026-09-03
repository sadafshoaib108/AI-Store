"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/revenue", label: "Revenue Insights" },
  { href: "/admin/recovery", label: "Recovery" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/transactions", label: "Transactions" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings", label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900 text-white flex flex-col">
        <div className="p-5 border-b border-zinc-800">
          <h2 className="text-base font-semibold tracking-tight">
            AI Revenue Recovery
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">SaaS Platform</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-medium">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-zinc-400 truncate">Admin</p>
            </div>
            <button
              type="button"
              className="text-xs text-zinc-400 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64">{children}</main>
    </div>
  );
}
