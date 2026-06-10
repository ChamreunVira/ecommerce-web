"use client";

import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { Search, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const navItems: Array<{ path: string, label: string }> = [
    {
        path: "/",
        label: "Home"
    },
    {
        path: "/all-product",
        label: "Shop"
    },
    {
        path: "/",
        label: "About Us"
    },
    {
        path: "/",
        label: "Contact"
    }
]

type NavbarType = {
    handleToggleCartSidebar: () => void;
}

const Navbar: React.FC<NavbarType> = ({ handleToggleCartSidebar }) => {
  const { router, user } = useAppContext();

  return (
    <header className="sticky top-0 left-0 z-40 border-b border-slate-200 bg-white">
      <div className="app-container flex h-16 items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center rounded-md"
          aria-label="Go to homepage"
        >
          <Image className="w-16 object-contain" src={assets.brand} alt="brand" />
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={`${item.path}-${item.label}`}
              href={item.path}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            aria-label="Search products"
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            onClick={handleToggleCartSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-orange-50 hover:text-orange-600"
            aria-label="Open shopping cart"
          >
            <ShoppingBag size={18} />
          </button>
          <div className="hidden items-center gap-2 rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700 sm:flex">
            <User size={16} className="text-slate-500" />
            <span className="max-w-28 truncate">
              {user.fullName || "Account"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar
