import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

type CheckoutItem = {
  id: string;
  quantity: number;
};

type CheckoutPayload = {
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  items: CheckoutItem[];
};

const MAX_ITEMS = 100;
const MAX_FIELD_LENGTH = 256;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function parseCheckoutPayload(body: unknown): CheckoutPayload | null {
  if (
    !isRecord(body) ||
    !isRecord(body.customer) ||
    !Array.isArray(body.items)
  ) {
    return null;
  }

  const customer = body.customer;
  const items = body.items;

  if (
    !isRecord(customer) ||
    !isString(customer.fullName) ||
    !isString(customer.email) ||
    !isString(customer.phone) ||
    !isString(customer.address) ||
    !isString(customer.city) ||
    !isString(customer.country)
  ) {
    return null;
  }

  const normalizedCustomer = {
    fullName: customer.fullName.trim(),
    email: customer.email.trim().toLowerCase(),
    phone: customer.phone.trim(),
    address: customer.address.trim(),
    city: customer.city.trim(),
    country: customer.country.trim(),
  };

  if (
    !normalizedCustomer.fullName ||
    !normalizedCustomer.email ||
    !normalizedCustomer.phone ||
    !normalizedCustomer.address ||
    !normalizedCustomer.city ||
    !normalizedCustomer.country ||
    Object.values(normalizedCustomer).some(
      (value) => value.length > MAX_FIELD_LENGTH,
    ) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedCustomer.email)
  ) {
    return null;
  }

  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) {
    return null;
  }

  const normalizedItems: CheckoutItem[] = [];
  const seenIds = new Set<string>();

  for (const item of items) {
    const id = isString(item.id) ? item.id.toLowerCase() : "";
    if (
      !id ||
      typeof item.quantity !== "number" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > MAX_ITEMS ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) ||
      seenIds.has(id)
    ) {
      return null;
    }

    seenIds.add(id);
    normalizedItems.push({ id, quantity: item.quantity });
  }

  return { customer: normalizedCustomer, items: normalizedItems };
}

function jsonResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse("Invalid checkout information.", 400);
  }

  const payload = parseCheckoutPayload(body);
  if (!payload) {
    return jsonResponse("Invalid checkout information.", 400);
  }

  let supabase;
  try {
    supabase = createServiceClient();
  } catch {
    return jsonResponse("Checkout is unavailable. Please try again.", 503);
  }

  const productIds = payload.items.map((item) => item.id);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, is_active")
    .in("id", productIds);

  if (productsError || !products) {
    return jsonResponse("Unable to verify products. Please try again.", 500);
  }

  const productsById = new Map(products.map((product) => [product.id, product]));
  const unavailableProduct = productIds.some(
    (id) => !productsById.get(id)?.is_active,
  );

  if (unavailableProduct || products.length !== productIds.length) {
    return jsonResponse("One or more products are unavailable.", 400);
  }

  let subtotalInCents = 0;
  const orderItems = [];

  for (const item of payload.items) {
    const product = productsById.get(item.id);
    const unitPrice = Number(product?.price);

    if (!product || !Number.isFinite(unitPrice) || unitPrice < 0) {
      return jsonResponse("Unable to verify products. Please try again.", 500);
    }

    const unitPriceInCents = Math.round(unitPrice * 100);
    const itemSubtotalInCents = unitPriceInCents * item.quantity;
    subtotalInCents += itemSubtotalInCents;

    orderItems.push({
      order_id: null,
      product_id: product.id,
      product_name: product.name,
      quantity: item.quantity,
      unit_price: unitPriceInCents / 100,
      subtotal: itemSubtotalInCents / 100,
    });
  }

  const subtotal = subtotalInCents / 100;
  const { data: existingCustomers, error: customerFetchError } = await supabase
    .from("customers")
    .select("id")
    .eq("email", payload.customer.email)
    .limit(1);

  if (customerFetchError) {
    return jsonResponse("Unable to verify customer information.", 500);
  }

  let customerId = existingCustomers?.[0]?.id ?? null;

  if (!customerId) {
    const { data: newCustomer, error: customerInsertError } = await supabase
      .from("customers")
      .insert({
        full_name: payload.customer.fullName,
        email: payload.customer.email,
        phone: payload.customer.phone,
        address: payload.customer.address,
        city: payload.customer.city,
        country: payload.customer.country,
      })
      .select("id")
      .single();

    if (customerInsertError || !newCustomer) {
      return jsonResponse("Unable to save customer information.", 500);
    }

    customerId = newCustomer.id;
  }

  const { data: newOrder, error: orderInsertError } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      status: "pending",
      subtotal,
      shipping: 0,
      total: subtotal,
      payment_status: "pending",
    })
    .select("id")
    .single();

  if (orderInsertError || !newOrder) {
    return jsonResponse("Unable to place your order. Please try again.", 500);
  }

  const itemsWithOrder = orderItems.map((item) => ({
    ...item,
    order_id: newOrder.id,
  }));

  const { error: itemsInsertError } = await supabase
    .from("order_items")
    .insert(itemsWithOrder);

  if (itemsInsertError) {
    return jsonResponse("Unable to save order items. Please try again.", 500);
  }

  return NextResponse.json({ orderId: newOrder.id }, { status: 201 });
}
