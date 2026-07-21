"use client";

import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { tokenManager } from "@/utils/tokenManager";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const navItems: Array<{ path: string; label: string }> = [
  { path: "/", label: "Home" },
  { path: "/products", label: "Shop" },
  { path: "/about", label: "About Us" },
  { path: "/contact", label: "Contact" },
];

type NavbarType = {
  toggleCart: () => void;
};

const Navbar: React.FC<NavbarType> = ({ toggleCart }) => {
  const { router, user, getTotalCart } = useAppContext();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    tokenManager.removeToken();
    setIsUserMenuOpen(false);
    router.push("/sign-in");
  };

  const cartCount = getTotalCart();

  return (
    <header className="sticky top-0 left-0 z-40 border-b border-slate-200 bg-white">
      <div className="px-6 md:px-16 lg:px-32 flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center rounded-md"
          aria-label="Go to homepage"
        >
          <Image
            className="w-16 object-contain"
            src={assets.brand}
            alt="brand"
          />
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={`${item.path}-${item.label}`}
                href={item.path}
                className={`relative rounded-md px-3 py-2 text-sm font-medium transition ${isActive
                  ? "text-indigo-600"
                  : "text-slate-900 hover:bg-slate-50 hover:text-slate-950"
                  }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-indigo-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right-side actions */}
        <div className="flex items-center gap-1.5">
          {/* Search */}
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            aria-label="Search products"
          >
            <Search size={18} />
          </button>

          {/* Cart */}
          <div className="relative">
            {cartCount > 0 && (
              <div className="pointer-events-none absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 z-10">
                <span className="text-[10px] font-semibold leading-none text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={toggleCart}
              className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
              aria-label="Open shopping cart"
            >
              <ShoppingBag size={18} />
            </button>
          </div>

          {/* User area */}
          {user ? (
            <div ref={userMenuRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition"
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
              >
                <User size={16} className="shrink-0 text-slate-500" />
                <span className="max-w-28 truncate">{user.fullName}</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                  <Link
                    href="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    My Account
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="hidden sm:flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition"
            >
              Sign In
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-950 md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {isMenuOpen && (
        <nav className="border-t border-slate-100 bg-white px-4 pb-4 pt-2 md:hidden">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={`mobile-${item.path}`}>
                  <Link
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition ${isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-900 hover:bg-slate-50 hover:text-slate-950"
                      }`}
                  >
                    {isActive && (
                      <span className="mr-2 h-4 w-0.5 rounded-full bg-indigo-500" />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}

            <li className="mt-2 border-t border-slate-100 pt-2">
              {user?.fullName ? (
                <div className="flex flex-col gap-1">
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <User size={15} className="text-slate-400" />
                    {user?.fullName}
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Sign In
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
