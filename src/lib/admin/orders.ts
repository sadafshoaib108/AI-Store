import { createServiceClient } from "@/lib/supabase/service";

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

type OrderRow = {
  id: string;
  customer_id: string | null;
  status: string;
  subtotal: number | string;
  shipping: number | string;
  total: number | string;
  payment_status: string;
  created_at: string;
};

type CustomerRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
};

type ProductRow = {
  id: string;
  name: string;
  image_url: string | null;
  category: string | null;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number | string;
  subtotal: number | string;
};

function toNumber(value: number | string | null | undefined) {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function getOrders(): Promise<OrdersResult> {
  let supabase;
  try {
    supabase = createServiceClient();
  } catch {
    return { error: "Unable to load orders." };
  }

  const [ordersResult, customersResult, itemsResult, productsResult] =
    await Promise.all([
      supabase
        .from("orders")
        .select("id, customer_id, status, subtotal, shipping, total, payment_status, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("customers")
        .select("id, full_name, email, phone, address, city, country"),
      supabase
        .from("order_items")
        .select("id, order_id, product_id, product_name, quantity, unit_price, subtotal"),
      supabase.from("products").select("id, name, image_url, category"),
    ]);

  if (
    ordersResult.error ||
    customersResult.error ||
    itemsResult.error ||
    productsResult.error
  ) {
    return { error: "Unable to load orders." };
  }

  const customersById = new Map(
    (customersResult.data ?? []).map((customer) => [customer.id, customer]),
  );
  const productsById = new Map(
    (productsResult.data ?? []).map((product) => [product.id, product]),
  );
  const itemsByOrderId = new Map<string, OrderItemRow[]>();

  for (const item of itemsResult.data ?? []) {
    const items = itemsByOrderId.get(item.order_id) ?? [];
    items.push(item);
    itemsByOrderId.set(item.order_id, items);
  }

  const orders = (ordersResult.data ?? []).map((order) => {
    const customerRow = order.customer_id
      ? customersById.get(order.customer_id)
      : null;
    const items = (itemsByOrderId.get(order.id) ?? []).map((item) => {
      const productRow = item.product_id
        ? productsById.get(item.product_id)
        : null;

      return {
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        unitPrice: toNumber(item.unit_price),
        subtotal: toNumber(item.subtotal),
        product: productRow
          ? {
              id: productRow.id,
              name: productRow.name,
              imageUrl: productRow.image_url,
              category: productRow.category,
            }
          : null,
      };
    });

    return {
      id: order.id,
      customerId: order.customer_id,
      status: order.status,
      subtotal: toNumber(order.subtotal),
      shipping: toNumber(order.shipping),
      total: toNumber(order.total),
      paymentStatus: order.payment_status,
      createdAt: order.created_at,
      customer: customerRow
        ? {
            id: customerRow.id,
            fullName: customerRow.full_name,
            email: customerRow.email,
            phone: customerRow.phone,
            address: customerRow.address,
            city: customerRow.city,
            country: customerRow.country,
          }
        : null,
      items,
    };
  });

  return { orders };
}

export async function getOrder(id: string): Promise<OrderResult> {
  if (!isUuid(id)) {
    return { order: null };
  }

  let supabase;
  try {
    supabase = createServiceClient();
  } catch {
    return { error: "Unable to load order." };
  }

  const orderResult = await supabase
    .from("orders")
    .select("id, customer_id, status, subtotal, shipping, total, payment_status, created_at")
    .eq("id", id)
    .maybeSingle();

  if (orderResult.error) {
    return { error: "Unable to load order." };
  }

  if (!orderResult.data) {
    return { order: null };
  }

  const order = orderResult.data;
  const [customersResult, itemsResult, productsResult] = await Promise.all([
    supabase
      .from("customers")
      .select("id, full_name, email, phone, address, city, country")
      .eq("id", order.customer_id ?? "")
      .maybeSingle(),
    supabase
      .from("order_items")
      .select("id, order_id, product_id, product_name, quantity, unit_price, subtotal")
      .eq("order_id", id),
    supabase.from("products").select("id, name, image_url, category"),
  ]);

  if (customersResult.error || itemsResult.error || productsResult.error) {
    return { error: "Unable to load order." };
  }

  const customerRow = customersResult.data as CustomerRow | null;
  const productsById = new Map(
    (productsResult.data ?? []).map((product) => [product.id, product]),
  );
  const items = (itemsResult.data ?? []).map((item) => {
    const productRow = item.product_id
      ? productsById.get(item.product_id)
      : null;

    return {
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      quantity: item.quantity,
      unitPrice: toNumber(item.unit_price),
      subtotal: toNumber(item.subtotal),
      product: productRow
        ? {
            id: productRow.id,
            name: productRow.name,
            imageUrl: productRow.image_url,
            category: productRow.category,
          }
        : null,
    };
  });

  return {
    order: {
      id: order.id,
      customerId: order.customer_id,
      status: order.status,
      subtotal: toNumber(order.subtotal),
      shipping: toNumber(order.shipping),
      total: toNumber(order.total),
      paymentStatus: order.payment_status,
      createdAt: order.created_at,
      customer: customerRow
        ? {
            id: customerRow.id,
            fullName: customerRow.full_name,
            email: customerRow.email,
            phone: customerRow.phone,
            address: customerRow.address,
            city: customerRow.city,
            country: customerRow.country,
          }
        : null,
      items,
    },
  };
}
