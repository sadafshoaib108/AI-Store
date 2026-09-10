"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navigation = [
  { name: "Overview", href: "/admin/dashboard" },
  { name: "Revenue Insights", href: "/admin/revenue" },
  { name: "Recovery", href: "/admin/recovery" },
  { name: "Customers", href: "/admin/customers" },
  { name: "Transactions", href: "/admin/transactions" },
  { name: "Reports", href: "/admin/reports" },
  { name: "Settings", href: "/admin/settings" },
  { name: "Store", href: "/store" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-zinc-950 text-white">
        <div className="border-b border-zinc-800 px-6 py-5">
          <h1 className="text-lg font-semibold">AI Revenue Recovery</h1>
          <p className="mt-1 text-xs text-zinc-400">Admin Dashboard</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-zinc-800 p-4">
          <div className="mb-3">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-zinc-500">Revenue Manager</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="text-xs text-zinc-400 hover:text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-64 min-h-screen flex-1">{children}</main>
    </div>
  );
}