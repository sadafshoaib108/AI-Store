import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { OrderFilters } from "@/components/admin/order-filters";
import { OrderSearch } from "@/components/admin/order-search";
import { OrderTable } from "@/components/admin/order-table";
import { getOrders } from "@/lib/admin/orders";
import { type AdminOrder, type OrdersResult } from "@/lib/admin/order-types";
import { Receipt } from "lucide-react";

type OrderFilter = "all" | "pending" | "processing" | "completed" | "cancelled";
type OrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function normalizeParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normalizeFilter(value: string | string[] | undefined): OrderFilter {
  const raw = normalizeParam(value).toLowerCase();
  if (raw === "pending" || raw === "processing" || raw === "completed" || raw === "cancelled") {
    return raw as OrderFilter;
  }
  return "all";
}

function buildOrdersUrl(searchQuery: string, activeFilter: OrderFilter): string {
  const params = new URLSearchParams();
  const normalizedSearch = searchQuery.trim();
  if (normalizedSearch) params.set("search", normalizedSearch);
  if (activeFilter !== "all") params.set("status", activeFilter);
  const queryString = params.toString();
  return `/admin/orders${queryString ? `?${queryString}` : ""}`;
}

function OrderSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading orders" aria-busy="true">
      {[0, 1, 2, 3].map((row) => (
        <div
          key={row}
          className="h-16 animate-pulse rounded-xl border border-slate-800 bg-slate-900"
        />
      ))}
    </div>
  );
}

async function OrdersContent({ searchParams }: { searchParams: OrdersPageProps["searchParams"] }) {
  const params = await searchParams;
  const searchQuery = normalizeParam(params.search);
  const activeFilter = normalizeFilter(params.status);

  const result = await getOrders();
  const hasOrders = "orders" in result;
  const orders = hasOrders ? result.orders ?? [] : [];
  const error = hasOrders ? null : result.error;

  const filteredOrders = error
    ? []
    : orders.filter((order) => {
        const matchesFilter = activeFilter === "all" || order.status.toLowerCase() === activeFilter;
        const customerName = order.customer?.fullName.toLowerCase() ?? "";
        const customerEmail = order.customer?.email.toLowerCase() ?? "";
        const query = searchQuery.trim().toLowerCase();
        return (
          matchesFilter &&
          (!query || order.id.toLowerCase().includes(query) || customerName.includes(query) || customerEmail.includes(query))
        );
      });

  const hasActiveFilters = searchQuery.trim() !== "" || activeFilter !== "all";

  async function updateSearch(value: string) {
    "use server";
    redirect(buildOrdersUrl(value, activeFilter));
  }

  async function updateFilter(value: OrderFilter) {
    "use server";
    redirect(buildOrdersUrl(searchQuery, value));
  }

  async function clearFilters() {
    "use server";
    redirect("/admin/orders");
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-indigo-400">AI Revenue Recovery</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Orders</h1>
            <p className="mt-2 text-sm text-slate-400">Review customer purchases, payment status, and fulfillment.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
            <p className="text-sm text-slate-400">Total Orders</p>
            <p className="mt-1 text-2xl font-bold text-white">{orders.length}</p>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <OrderSearch value={searchQuery} onChange={updateSearch} />
              <p className="mt-2 text-xs text-slate-500">
                {error ? "Unable to load orders" : `Showing ${filteredOrders.length} of ${orders.length} orders`}
              </p>
            </div>
            <OrderFilters value={activeFilter} onChange={updateFilter} />
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          {error ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 px-6 text-center">
              <div className="rounded-xl bg-slate-800/70 p-3 text-red-400">
                <Receipt aria-hidden="true" className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-white">Unable to load orders</h2>
              <p className="mt-1 max-w-sm text-sm text-slate-500">{error}</p>
              <Link
                href="/admin/orders"
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
              >
                Retry
              </Link>
            </div>
          ) : filteredOrders.length > 0 ? (
            <OrderTable orders={filteredOrders} />
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 px-6 text-center">
              <div className="rounded-xl bg-slate-800/70 p-3 text-slate-500">
                <Receipt aria-hidden="true" className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-white">
                {orders.length === 0 ? "No orders yet" : "No orders found"}
              </h2>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {orders.length === 0
                  ? "Orders will appear here as customers complete checkout."
                  : "Try a different search or filter to find what you need."}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function OrdersPage({ searchParams }: OrdersPageProps) {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <Suspense fallback={<OrderSkeleton />}>
          <OrdersContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
