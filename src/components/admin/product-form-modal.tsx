"use client";

import { useEffect, useState } from "react";
import { Package, X } from "lucide-react";
import type {
  AdminProduct,
  ProductFormState,
  ProductFormValues,
  ProductStatus,
} from "@/components/admin/product-types";

type ProductFormModalProps = {
  open: boolean;
  product: AdminProduct | null;
  onClose: () => void;
  onSave: (values: ProductFormValues) => void;
};

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  status: "Active",
};

function toFormState(product: AdminProduct | null): ProductFormState {
  if (!product) {
    return emptyForm;
  }

  return {
    name: product.name,
    description: product.description,
    price: String(product.price),
    stock: String(product.stock),
    imageUrl: product.imageUrl,
    status: product.status,
  };
}

export function ProductFormModal({
  open,
  product,
  onClose,
  onSave,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<ProductFormState>>({});

  useEffect(() => {
    if (open) {
      setForm(toFormState(product));
      setErrors({});
    }
  }, [open, product]);

  function updateField<K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Partial<ProductFormState> = {};
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!form.name.trim()) {
      nextErrors.name = "Product name is required.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    }

    if (!form.price.trim() || !Number.isFinite(price) || price < 0) {
      nextErrors.price = "Enter a valid price.";
    }

    if (
      !form.stock.trim() ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      nextErrors.stock = "Enter a valid stock quantity.";
    }

    if (form.imageUrl.trim() && !isValidUrl(form.imageUrl.trim())) {
      nextErrors.imageUrl = "Enter a valid image URL.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      stock,
      imageUrl: form.imageUrl.trim(),
      status: form.status as ProductStatus,
    });
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400">
              <Package aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {product ? "Edit Product" : "Add Product"}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {product
                  ? "Update this product&apos;s catalog details."
                  : "Add a new product to your catalog."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product form"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="product-name"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Product Name
              </label>
              <input
                id="product-name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className={`w-full rounded-lg border bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.name ? "border-red-500" : "border-slate-800"
                }`}
                placeholder="Classic Cotton T-Shirt"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="product-description"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Description
              </label>
              <textarea
                id="product-description"
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                rows={3}
                className={`w-full resize-none rounded-lg border bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.description
                    ? "border-red-500"
                    : "border-slate-800"
                }`}
                placeholder="Comfortable premium cotton t-shirt suitable for everyday wear."
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="product-price"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Price
                </label>
                <input
                  id="product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => updateField("price", event.target.value)}
                  className={`w-full rounded-lg border bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.price ? "border-red-500" : "border-slate-800"
                  }`}
                  placeholder="2499"
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-red-400">{errors.price}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="product-stock"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Stock
                </label>
                <input
                  id="product-stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(event) => updateField("stock", event.target.value)}
                  className={`w-full rounded-lg border bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.stock ? "border-red-500" : "border-slate-800"
                  }`}
                  placeholder="50"
                />
                {errors.stock && (
                  <p className="mt-1 text-xs text-red-400">{errors.stock}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="product-image"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Image URL
              </label>
              <input
                id="product-image"
                type="url"
                value={form.imageUrl}
                onChange={(event) =>
                  updateField("imageUrl", event.target.value)
                }
                className={`w-full rounded-lg border bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.imageUrl ? "border-red-500" : "border-slate-800"
                }`}
                placeholder="https://placehold.co/600x400"
              />
              {errors.imageUrl && (
                <p className="mt-1 text-xs text-red-400">{errors.imageUrl}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="product-status"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Status
              </label>
              <select
                id="product-status"
                value={form.status}
                onChange={(event) =>
                  updateField("status", event.target.value as ProductStatus)
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              {product ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}
