"use client";

import { useMemo, useState } from "react";
import { Package, Plus } from "lucide-react";
import { DeleteProductModal } from "@/components/admin/delete-product-modal";
import { ProductFormModal } from "@/components/admin/product-form-modal";
import { ProductSearch } from "@/components/admin/product-search";
import { ProductTable } from "@/components/admin/product-table";
import type {
  AdminProduct,
  ProductFormValues,
  ProductStatus,
} from "@/components/admin/product-types";

const initialProducts: AdminProduct[] = [
  {
    id: "product-classic-tshirt",
    name: "Classic Cotton T-Shirt",
    description: "Comfortable premium cotton t-shirt for everyday wear.",
    price: 2499,
    stock: 48,
    imageUrl:
      "https://placehold.co/600x400/EEE/31343C?text=Classic+Cotton+T-Shirt",
    status: "Active",
    category: "Clothing",
  },
  {
    id: "product-urban-hoodie",
    name: "Urban Casual Hoodie",
    description: "Soft casual hoodie designed for comfortable everyday use.",
    price: 4499,
    stock: 32,
    imageUrl:
      "https://placehold.co/600x400/EEE/31343C?text=Urban+Casual+Hoodie",
    status: "Active",
    category: "Clothing",
  },
  {
    id: "product-wireless-headphones",
    name: "Wireless Bluetooth Headphones",
    description: "Wireless headphones with clear audio and long battery life.",
    price: 5999,
    stock: 18,
    imageUrl:
      "https://placehold.co/600x400/EEE/31343C?text=Wireless+Bluetooth+Headphones",
    status: "Active",
    category: "Electronics",
  },
  {
    id: "product-led-desk-lamp",
    name: "Smart LED Desk Lamp",
    description: "Adjustable LED desk lamp for work, study, and home offices.",
    price: 3299,
    stock: 0,
    imageUrl:
      "https://placehold.co/600x400/EEE/31343C?text=Smart+LED+Desk+Lamp",
    status: "Inactive",
    category: "Home & Office",
  },
  {
    id: "product-leather-wallet",
    name: "Minimal Leather Wallet",
    description: "Slim everyday wallet with a clean and durable design.",
    price: 1999,
    stock: 64,
    imageUrl:
      "https://placehold.co/600x400/EEE/31343C?text=Minimal+Leather+Wallet",
    status: "Active",
    category: "Accessories",
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] =
    useState<AdminProduct | null>(null);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return products;
    }

    return products.filter((product) =>
      product.name.toLowerCase().includes(query),
    );
  }, [products, searchQuery]);

  function openAddProduct() {
    setEditingProduct(null);
    setIsFormOpen(true);
  }

  function openEditProduct(product: AdminProduct) {
    setEditingProduct(product);
    setIsFormOpen(true);
  }

  function closeProductForm() {
    setIsFormOpen(false);
    setEditingProduct(null);
  }

  function saveProduct(values: ProductFormValues) {
    if (editingProduct) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingProduct.id
            ? { ...product, ...values }
            : product,
        ),
      );
    } else {
      const newProduct: AdminProduct = {
        id: `product-${Date.now()}`,
        ...values,
        category: "General",
      };
      setProducts((current) => [newProduct, ...current]);
    }

    closeProductForm();
  }

  function confirmDeleteProduct() {
    if (!deletingProduct) {
      return;
    }

    setProducts((current) =>
      current.filter((product) => product.id !== deletingProduct.id),
    );
    setDeletingProduct(null);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-indigo-400">
              AI Revenue Recovery
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Products</h1>
            <p className="mt-2 text-sm text-slate-400">
              Manage your catalog, pricing, inventory, and product availability.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddProduct}
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add Product
          </button>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Products</p>
              <p className="mt-1 text-2xl font-bold text-white">
                {products.length}
              </p>
            </div>
            <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
              <Package aria-hidden="true" className="h-5 w-5" />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <ProductSearch
            value={searchQuery}
            onChange={setSearchQuery}
            resultCount={filteredProducts.length}
            totalCount={products.length}
          />
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          {filteredProducts.length > 0 ? (
            <ProductTable
              products={filteredProducts}
              onEdit={openEditProduct}
              onDelete={setDeletingProduct}
            />
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 px-6 text-center">
              <div className="rounded-xl bg-slate-800/70 p-3 text-slate-500">
                <Package aria-hidden="true" className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-white">
                No products found
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Try searching for a different product name.
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-4 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      <ProductFormModal
        open={isFormOpen}
        product={editingProduct}
        onClose={closeProductForm}
        onSave={saveProduct}
      />
      <DeleteProductModal
        open={Boolean(deletingProduct)}
        productName={deletingProduct?.name ?? ""}
        onClose={() => setDeletingProduct(null)}
        onConfirm={confirmDeleteProduct}
      />
    </main>
  );
}
