"use client";

import { Package, Pencil, Trash2 } from "lucide-react";
import type { AdminProduct } from "@/components/admin/product-types";

type ProductTableProps = {
  products: AdminProduct[];
  onEdit: (product: AdminProduct) => void;
  onDelete: (product: AdminProduct) => void;
};

function formatPrice(price: number) {
  return `PKR ${price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function ProductImage({ product }: { product: AdminProduct }) {
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-800">
      <Package
        aria-hidden="true"
        className="absolute inset-0 m-auto h-6 w-6 text-slate-600"
      />
      <img
        src={product.imageUrl}
        alt=""
        loading="lazy"
        className="relative h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}

function ProductActions({
  product,
  onEdit,
  onDelete,
}: {
  product: AdminProduct;
  onEdit: (product: AdminProduct) => void;
  onDelete: (product: AdminProduct) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => onEdit(product)}
        aria-label={`Edit ${product.name}`}
        title={`Edit ${product.name}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400"
      >
        <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(product)}
        aria-label={`Delete ${product.name}`}
        title={`Delete ${product.name}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-400"
      >
        <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div>
      <div className="hidden overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 md:block">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const statusClasses =
                product.status === "Active"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-slate-700/40 text-slate-400";

              return (
                <tr
                  key={product.id}
                  className="border-t border-slate-800/70 last:border-0"
                >
                  <td className="px-4 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <ProductImage product={product} />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {product.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {product.category} · {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300">
                    {formatPrice(product.price)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300">
                    {product.stock}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <ProductActions
                      product={product}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {products.map((product) => {
          const statusClasses =
            product.status === "Active"
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-slate-700/40 text-slate-400";

          return (
            <div
              key={product.id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-4"
            >
              <div className="flex items-start gap-3">
                <ProductImage product={product} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{product.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {product.category}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses}`}
                >
                  {product.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-5 text-slate-400">
                {product.description}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-800/60 p-3">
                  <p className="text-xs text-slate-500">Price</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/60 p-3">
                  <p className="text-xs text-slate-500">Stock</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {product.stock}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-400"
                >
                  <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(product)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
