"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/hooks/use-cart";
import { RefreshCw } from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  is_active: boolean;
};

type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  is_active: boolean;
};

const categoryColorMap: Record<string, { color: string; icon: string }> = {
  Clothing: { color: "bg-indigo-100 text-indigo-700", icon: "👕" },
  Electronics: { color: "bg-violet-100 text-violet-700", icon: "🎧" },
  "Home & Office": { color: "bg-blue-100 text-blue-700", icon: "💡" },
  Accessories: { color: "bg-cyan-100 text-cyan-700", icon: "👛" },
  Bags: { color: "bg-emerald-100 text-emerald-700", icon: "🎒" },
  "Home & Lifestyle": { color: "bg-amber-100 text-amber-700", icon: "🧴" },
};

const fallbackColor = "bg-slate-100 text-slate-700";
const fallbackIcon = "📦";

function getCategoryStyle(category: string | null) {
  if (!category) return { color: fallbackColor, icon: fallbackIcon };
  return categoryColorMap[category] || { color: fallbackColor, icon: fallbackIcon };
}

function ProductSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="h-32 w-full animate-pulse bg-slate-100" />
      <div className="flex flex-1 flex-col p-5 space-y-3">
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
        <div className="mt-auto pt-4 space-y-3">
          <div className="h-5 w-24 animate-pulse rounded bg-slate-100" />
          <div className="flex gap-2">
            <div className="h-9 flex-1 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { addToCart, cartCount } = useCart();
  const supabase = createClient();

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("id, name, description, price, category, image_url, is_active")
        .eq("is_active", true)
        .order("name");

      if (fetchError) {
        throw fetchError;
      }

      const rows = (data as ProductRow[] | null) || [];
      setProducts(
        rows.map((row) => ({
          id: row.id,
          name: row.name,
          description: row.description || "",
          price: Number(row.price) || 0,
          category: row.category || "",
          image_url: row.image_url,
          is_active: row.is_active,
        })),
      );
    } catch {
      setError(true);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 py-20 text-white md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.1),transparent_50%)]"></div>
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Explore Our Products
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              Discover products designed to support smarter business operations
              and digital growth.
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Digital Products</h2>
            <p className="mt-2 text-sm text-slate-500">
              Premium digital products crafted for modern businesses.
            </p>
          </div>

          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <RefreshCw size={28} className="text-red-500" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                Unable to load products right now.
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Please check your connection and try again.
              </p>
              <button
                type="button"
                onClick={loadProducts}
                className="mt-6 inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
                📦
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No products available right now.
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Check back later for new digital products.
              </p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const { color, icon } = getCategoryStyle(product.category);
                return (
                  <div
                    key={product.id}
                    className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    {product.image_url ? (
                      <div className="relative h-32 w-full bg-slate-100">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div
                        className={`flex h-32 w-full items-center justify-center text-4xl ${color}`}
                      >
                        {icon}
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-semibold text-slate-900">
                          {product.name}
                        </h3>
                        <span className="whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {product.category}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-auto pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-indigo-600">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              addToCart({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                color,
                                icon,
                              })
                            }
                            className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                          >
                            Add to Cart
                          </button>
                          <button
                            type="button"
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="text-lg font-bold text-indigo-600">AI Store</span>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} AI Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
