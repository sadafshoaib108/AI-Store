import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { OrderSearch } from "@/components/admin/order-search";
import { createServiceClient } from "@/lib/supabase/service";
import { getOrders } from "@/lib/admin/orders";
import { formatCurrency, formatDate } from "@/lib/admin/order-types";
import { Receipt } from "lucide-react";

type CustomerStat = {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string | null;
};

type CustomersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function CustomerSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading customers" aria-busy="true">
      <div className="h-8 w-1/4 animate-pulse rounded-xl bg-slate-800" />
      <div className="grid gap-6 lg:grid-cols-4">
        {[0, 1, 2, 3].map((card) => (
          <div
            key={card}
            className="h-20 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
          />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-2xl border border-slate-800 bg-slate-900" />
    </div>
  );
}

function normalizeParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function buildCustomersUrl(searchQuery: string): string {
  const params = new URLSearchParams();
  const normalizedSearch = searchQuery.trim();
  if (normalizedSearch) params.set("search", normalizedSearch);
  const queryString = params.toString();
  return `/admin/customers${queryString ? `?${queryString}` : ""}`;
}

async function CustomersContent({
  searchParams,
}: {
  searchParams: CustomersPageProps["searchParams"];
}) {
  const params = await searchParams;
  const searchQuery = normalizeParam(params.search);

  let ordersResult = await getOrders();
  if ("error" in ordersResult) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-indigo-400">AI Revenue Recovery</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">Customers</h1>
              <p className="mt-2 text-sm text-slate-400">
                Review customer details and purchase history.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
              <p className="text-sm text-slate-400">Total Customers</p>
              <p className="mt-1 text-2xl font-bold text-white">0</p>
            </div>
          </div>
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 px-6 text-center">
              <div className="rounded-xl bg-slate-800/70 p-3 text-red-400">
                <Receipt aria-hidden="true" className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-white">
                Unable to load customers
              </h2>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {ordersResult.error}
              </p>
              <Link
                href="/admin/customers"
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
              >
                Retry
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const orders = ordersResult.orders;

  let customers: CustomerStat[] = [];
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("customers")
      .select("id, full_name, email, phone, address, city, country")
      .order("full_name", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    customers = (data ?? []).map((customer) => {
      const customerOrders = orders.filter(
        (order) => order.customerId === customer.id
      );
      const totalSpent = customerOrders.reduce(
        (sum, order) => sum + order.total,
        0
      );
      const lastOrderDate =
        customerOrders.length > 0
          ? customerOrders
              .map((order) => new Date(order.createdAt).getTime())
              .reduce((max, timestamp) => Math.max(max, timestamp), 0)
          : null;

      return {
        ...customer,
        orderCount: customerOrders.length,
        totalSpent,
        lastOrderDate: lastOrderDate ? new Date(lastOrderDate).toISOString() : null,
      };
    });
  } catch {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-indigo-400">AI Revenue Recovery</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">Customers</h1>
              <p className="mt-2 text-sm text-slate-400">
                Review customer details and purchase history.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
              <p className="text-sm text-slate-400">Total Customers</p>
              <p className="mt-1 text-2xl font-bold text-white">0</p>
            </div>
          </div>
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 px-6 text-center">
              <div className="rounded-xl bg-slate-800/70 p-3 text-red-400">
                <Receipt aria-hidden="true" className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-white">
                Unable to load customers
              </h2>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Could not load customer data from the database.
              </p>
              <Link
                href="/admin/customers"
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
              >
                Retry
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const query = searchQuery.trim().toLowerCase();
  const filteredCustomers = customers.filter((customer) => {
    const name = customer.full_name?.toLowerCase() ?? "";
    const email = customer.email.toLowerCase();
    return (
      !query || name.includes(query) || email.includes(query)
    );
  });

  const hasActiveFilters = searchQuery.trim() !== "";

  async function updateSearch(value: string) {
    "use server";
    redirect(buildCustomersUrl(value));
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-indigo-400">AI Revenue Recovery</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Customers</h1>
            <p className="mt-2 text-sm text-slate-400">
              Review customer details and purchase history.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
            <p className="text-sm text-slate-400">Total Customers</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {customers.length}
            </p>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <OrderSearch value={searchQuery} onChange={updateSearch} />
              <p className="mt-2 text-xs text-slate-500">
                {query
                  ? `Showing ${filteredCustomers.length} of ${customers.length} customers`
                  : `Showing all ${customers.length} customers`}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          {filteredCustomers.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 text-right font-medium">Orders</th>
                    <th className="px-4 py-3 text-right font-medium">Total Spent</th>
                    <th className="px-4 py-3 font-medium">Last Order Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-t border-slate-800/70 last:border-0"
                    >
                      <td className="px-4 py-4">
                        <p className="truncate font-medium text-white">
                          {customer.full_name ?? "Customer unavailable"}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {customer.id}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-300">
                        <p className="truncate">{customer.email}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300">
                        {customer.phone ?? "Not provided"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium text-white">
                        {customer.orderCount}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium text-white">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300">
                        {customer.lastOrderDate
                          ? formatDate(customer.lastOrderDate)
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 px-6 text-center">
              <div className="rounded-xl bg-slate-800/70 p-3 text-slate-500">
                <Receipt aria-hidden="true" className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-white">
                {query ? "No customers found" : "No customers yet"}
              </h2>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {query
                  ? "Try a different search term."
                  : "Customer records will appear here as customers complete checkout."}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => updateSearch("")}
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

export default function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <Suspense fallback={<CustomerSkeleton />}>
          <CustomersContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
