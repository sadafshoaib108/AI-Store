import {
  formatCurrency,
  formatDate,
  formatStatus,
  getStatusClasses,
  type AdminOrder,
} from "@/lib/admin/order-types";

type OrderStatusBadgeProps = {
  value: string;
  label?: string;
};

export function OrderStatusBadge({
  value,
  label,
}: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${getStatusClasses(
        value,
      )}`}
    >
      {label ?? formatStatus(value)}
    </span>
  );
}

type OrderTableProps = {
  orders: AdminOrder[];
};

function OrderProduct({ order }: { order: AdminOrder }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-medium text-white">#{order.id.slice(0, 8).toUpperCase()}</p>
      <p className="mt-0.5 truncate text-xs text-slate-500">{order.id}</p>
    </div>
  );
}

function CustomerCell({ order }: { order: AdminOrder }) {
  const customerName = order.customer?.fullName ?? "Customer unavailable";
  const customerEmail = order.customer?.email ?? "No email available";

  return (
    <div className="min-w-0">
      <p className="truncate font-medium text-white">{customerName}</p>
      <p className="mt-0.5 truncate text-xs text-slate-500">{customerEmail}</p>
    </div>
  );
}

function MobileOrderCard({ order }: { order: AdminOrder }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-white">#{order.id.slice(0, 8).toUpperCase()}</p>
          <p className="mt-0.5 truncate text-xs text-slate-500">{order.id}</p>
        </div>
        <OrderStatusBadge value={order.status} />
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Customer</span>
          <span className="truncate text-right text-slate-200">
            {order.customer?.fullName ?? "Unavailable"}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Date</span>
          <span className="text-slate-200">{formatDate(order.createdAt)}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Items</span>
          <span className="text-slate-200">{itemCount}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Total</span>
          <span className="font-medium text-white">{formatCurrency(order.total)}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Payment</span>
          <OrderStatusBadge value={order.paymentStatus} />
        </div>
      </div>

      <a
        href={`/admin/orders/${order.id}`}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 transition hover:text-indigo-300"
      >
        View Details
      </a>
    </div>
  );
}

export function OrderTable({ orders }: OrderTableProps) {
  return (
    <div>
      <div className="hidden overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 lg:block">
        <table className="w-full min-w-[1100px] text-left">
          <thead>
            <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Payment Status</th>
              <th className="px-4 py-3 font-medium">Order Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const itemCount = order.items.reduce(
                (sum, item) => sum + item.quantity,
                0,
              );

              return (
                <tr
                  key={order.id}
                  className="border-t border-slate-800/70 last:border-0"
                >
                  <td className="px-4 py-4">
                    <OrderProduct order={order} />
                  </td>
                  <td className="px-4 py-4">
                    <CustomerCell order={order} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300">
                    {itemCount}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-white">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-4">
                    <OrderStatusBadge value={order.paymentStatus} />
                  </td>
                  <td className="px-4 py-4">
                    <OrderStatusBadge value={order.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right">
                    <a
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400"
                    >
                      View
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 lg:hidden">
        {orders.map((order) => (
          <MobileOrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
