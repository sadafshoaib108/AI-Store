export type AdminOrderStatus = string;
export type AdminPaymentStatus = string;

export type AdminCustomer = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
};

export type AdminProductSummary = {
  id: string;
  name: string;
  imageUrl: string | null;
  category: string | null;
};

export type AdminOrderItem = {
  id: string;
  productId: string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: AdminProductSummary | null;
};

export type AdminOrder = {
  id: string;
  customerId: string | null;
  status: AdminOrderStatus;
  subtotal: number;
  shipping: number;
  total: number;
  paymentStatus: AdminPaymentStatus;
  createdAt: string;
  customer: AdminCustomer | null;
  items: AdminOrderItem[];
};

export type OrdersResult =
  | { orders: AdminOrder[]; error?: never }
  | { orders?: never; error: string };

export type OrderResult =
  | { order: AdminOrder; error?: never }
  | { order?: never; error: string }
  | { order: null; error?: never };

export function formatCurrency(value: number) {
  return `PKR ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatStatus(value: string) {
  if (!value) {
    return "Unavailable";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getStatusClasses(value: string) {
  switch (value.toLowerCase()) {
    case "completed":
    case "paid":
      return "bg-emerald-500/10 text-emerald-400";
    case "processing":
      return "bg-indigo-500/10 text-indigo-400";
    case "cancelled":
    case "failed":
      return "bg-red-500/10 text-red-400";
    case "pending":
      return "bg-amber-500/10 text-amber-400";
    default:
      return "bg-slate-700/40 text-slate-400";
  }
}
