import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Receipt } from "lucide-react";
import { getOrder } from "@/lib/admin/orders";
import {
  formatCurrency,
  formatDate,
  formatStatus,
  getStatusClasses,
  type OrderResult,
} from "@/lib/admin/order-types";

function OrderSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading order" aria-busy="true">
      <div className="h-8 w-1/3 animate-pulse rounded-xl bg-slate-800" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-48 animate-pulse rounded-2xl border border-slate-800 bg-slate-900 lg:col-span-2" />
        <div className="h-48 animate-pulse rounded-2xl border border-slate-800 bg-slate-900" />
      </div>
      <div className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-slate-900" />
    </div>
  );
}

async function OrderDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result: OrderResult = await getOrder(id);

  const isError = !("order" in result);
  const order = isError ? null : result.order;
  const error = isError ? result.error : null;

  if (isError || !order) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white md:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
          <div className="w-full rounded-2xl border border-dashed border-slate-800 bg-slate-900 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/70 text-slate-500">
              <Receipt aria-hidden="true" className="h-6 w-6" />
            </div>
            <h1 className="mt-5 text-xl font-semibold text-white">
              {error ? "Unable to load order" : "Order not found"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {error ?? `We could not find an order with the ID ${id}.`}
            </p>
            <Link
              href="/admin/orders"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back to Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const customer = order.customer;
  const shippingAddress = [
    customer?.address,
    customer?.city,
    customer?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back to Orders
            </Link>
            <p className="mt-4 text-sm font-medium text-indigo-400">
              AI Revenue Recovery
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${getStatusClasses(
                  order.status,
                )}`}
              >
                {formatStatus(order.status)}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Review the customer, products, and payment information for this order.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
            <p className="text-sm text-slate-400">Order ID</p>
            <p className="mt-1 break-all text-sm font-semibold text-white">
              {order.id}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                <Receipt aria-hidden="true" className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Customer</h2>
                <p className="text-sm text-slate-500">
                  Contact and shipping information
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Customer Name
                </p>
                <p className="mt-1 text-sm text-slate-200">
                  {customer?.fullName ?? "Customer unavailable"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Customer Email
                </p>
                <p className="mt-1 text-sm text-slate-200">
                  {customer?.email ?? "Email unavailable"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Customer Phone
                </p>
                <p className="mt-1 text-sm text-slate-200">
                  {customer?.phone ?? "Phone unavailable"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Order Date
                </p>
                <p className="mt-1 text-sm text-slate-200">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Shipping Address
                </p>
                <p className="mt-1 text-sm text-slate-200">
                  {shippingAddress || "Address unavailable"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                <Receipt aria-hidden="true" className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Order Summary</h2>
                <p className="text-sm text-slate-500">Payment and totals</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500">Payment Status</span>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${getStatusClasses(
                    order.paymentStatus,
                  )}`}
                >
                  {formatStatus(order.paymentStatus)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500">Order Status</span>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${getStatusClasses(
                    order.status,
                  )}`}
                >
                  {formatStatus(order.status)}
                </span>
              </div>
              <div className="border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-400">Subtotal</span>
                  <span className="text-sm font-medium text-white">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-400">Shipping</span>
                  <span className="text-sm font-medium text-white">
                    {formatCurrency(order.shipping)}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-800 pt-4">
                  <span className="text-base font-semibold text-white">Total</span>
                  <span className="text-base font-bold text-white">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Order Items</h2>
            <p className="mt-1 text-sm text-slate-500">
              Products included in this order
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Quantity</th>
                  <th className="px-4 py-3 font-medium">Unit Price</th>
                  <th className="px-4 py-3 text-right font-medium">Item Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-800/70 last:border-0"
                  >
                    <td className="px-4 py-4">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {item.productName}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {item.product?.category ?? "General"}
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300">
                      {item.quantity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium text-white">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <Suspense fallback={<OrderSkeleton />}>
          <OrderDetailsContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}
