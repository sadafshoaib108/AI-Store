"use client";

import { useState } from "react";
import { ShoppingCart, Menu, X, Home, Package, LogIn } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Products", href: "#products", icon: Package },
  { name: "Cart", href: "/store/cart", icon: ShoppingCart },
];

export default function StoreNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/store" className="text-xl font-bold text-indigo-600">
            AI Store
          </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600"
              >
                <Icon size={16} />
                {link.name}
                {link.name === "Cart" && cartCount > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 md:inline-flex"
          >
            <LogIn size={16} />
            Login
          </Link>
          <Link
            href="/admin/dashboard"
            className="hidden items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 md:inline-flex"
          >
            Dashboard
          </Link>
          <button
            type="button"
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-slate-100">
          <div className="container mx-auto flex flex-col gap-2 px-4 py-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={16} />
                  {link.name}
                  {link.name === "Cart" && cartCount > 0 && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              );
            })}
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm font-medium text-indigo-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LogIn size={16} />
              Login
            </Link>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-indigo-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
