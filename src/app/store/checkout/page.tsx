"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  CreditCard,
  Lock,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
};

const emptyForm: FormData = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
};

export default function CheckoutPage() {
  const { cart, clearCart, cartCount } = useCart();
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    setSubmitError("");
  }

  function validate() {
    const newErrors: Partial<FormData> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.country.trim()) newErrors.country = "Country is required";
    return newErrors;
  }

  async function handlePlaceOrder() {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            country: form.country.trim(),
          },
          items: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const result = (await response.json()) as {
        orderId?: string;
        error?: string;
      };

      if (!response.ok || !result.orderId) {
        throw new Error(
          result.error ?? "Unable to place your order. Please try again.",
        );
      }

      const orderIdShort = result.orderId.slice(0, 8).toUpperCase();
      setOrderNumber(orderIdShort);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Unable to place your order. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (cartCount === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <ShoppingBag size={28} className="text-slate-400" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Add products to your cart before checking out.
            </p>
            <Link
              href="/store"
              className="mt-6 inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 size={28} className="text-emerald-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Order placed successfully!
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Your demo order has been received.
            </p>
            <p className="mt-1 text-sm font-medium text-indigo-600">
              Order #{orderNumber}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/store"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Continue Shopping
              </Link>
              <Link
                href="/store"
                className="inline-flex items-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Back to Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Complete your order details below.
        </p>

        {submitError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">
                Customer Information
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <User size={16} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 ${
                      errors.fullName
                        ? "border-red-400"
                        : "border-slate-300"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Mail size={16} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 ${
                      errors.email ? "border-red-400" : "border-slate-300"
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 ${
                      errors.phone ? "border-red-400" : "border-slate-300"
                    }`}
                    placeholder="+1 (555) 000-0000"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <MapPin size={16} />
                    Address
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 ${
                      errors.address
                        ? "border-red-400"
                        : "border-slate-300"
                    }`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    City
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 ${
                      errors.city ? "border-red-400" : "border-slate-300"
                    }`}
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Country
                  </label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 ${
                      errors.country
                        ? "border-red-400"
                        : "border-slate-300"
                    }`}
                    placeholder="United States"
                  />
                  {errors.country && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">
                Payment Method
              </h2>
              <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Demo Payment
                  </p>
                  <p className="text-xs text-slate-500">
                    Payment processing will be connected in a future step.
                  </p>
                </div>
                <Lock
                  size={16}
                  className="ml-auto text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">
                Order Summary
              </h2>
              <div className="mt-4 space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Shipping</span>
                  <span className="font-medium text-slate-900">Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    Total
                  </span>
                  <span className="text-lg font-bold text-indigo-600">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? "Placing Order..." : "Place Demo Order"}
                {!submitting && <ArrowRight size={16} className="ml-2" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
