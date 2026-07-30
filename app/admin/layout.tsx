"use client";
import Sidbar, { SidebarGroup, SidebarItem } from "@/components/Sidbar";
import {
  LayoutDashboard, ClipboardList, Package, Settings,
  ShoppingCart, Tags, Users, Warehouse, CreditCard, Truck,
  RotateCcw, Tag, BarChart2, Star, BookOpen, Briefcase, TrendingUp, Monitor
} from "lucide-react";
import { usePathname } from "next/navigation";
import "@/styles/globals.css"
import "@/styles/theme.css"
import "@/styles/typography.css"
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const is = (path: string) => pathName === path;

  return (
    <div className="flex min-h-screen overflow-hidden bg-white dark:bg-slate-950">
      <Sidbar>
        {/* Overview */}
        <SidebarItem
          icon={<LayoutDashboard size={18} />}
          label="Overview"
          active={is("/admin/dashboard")}
          path="/admin/dashboard"
        />

        {/* Sales */}
        <SidebarItem
          icon={<ShoppingCart size={18} />}
          label="Orders"
          active={is("/admin/order")}
          path="/admin/order"
        />

        {/* Catalog */}
        <SidebarGroup
          label="Catalog"
          icon={<Package size={18} />}
          defaultOpen={[
            "/admin/product",
            "/admin/category",
            "/admin/inventory",
          ].includes(pathName)}
        >
          <SidebarItem
            icon={<Package size={18} />}
            label="Products"
            active={is("/admin/product")}
            path="/admin/product"
          />

          <SidebarItem
            icon={<Tags size={18} />}
            label="Categories"
            active={is("/admin/category")}
            path="/admin/category"
          />

          <SidebarItem
            icon={<Warehouse size={18} />}
            label="Inventory"
            active={is("/admin/inventory")}
            path="/admin/inventory"
          />
        </SidebarGroup>

        {/* Customers */}
        <SidebarItem
          icon={<Users size={18} />}
          label="Customers"
          active={is("/admin/user")}
          path="/admin/user"
        />

        {/* Finance */}
        <SidebarItem
          icon={<CreditCard size={18} />}
          label="Payments"
          active={is("/admin/payment")}
          path="/admin/payment"
        />

        {/* Logistics */}
        <SidebarGroup
          label="Logistics"
          icon={<Truck size={18} />}
          defaultOpen={[
            "/admin/shipping",
            "/admin/returns",
          ].includes(pathName)}
        >
          <SidebarItem
            icon={<Truck size={18} />}
            label="Shipping"
            active={is("/admin/shipping")}
            path="/admin/shipping"
          />

          <SidebarItem
            icon={<RotateCcw size={18} />}
            label="Returns"
            active={is("/admin/returns")}
            path="/admin/returns"
          />
        </SidebarGroup>

        {/* Marketing */}
        <SidebarGroup
          label="Marketing"
          icon={<TrendingUp size={18} />}
          defaultOpen={[
            "/admin/promotions",
            "/admin/reports",
            "/admin/reviews",
          ].includes(pathName)}
        >
          <SidebarItem
            icon={<Tag size={18} />}
            label="Promotions"
            active={is("/admin/promotions")}
            path="/admin/promotions"
          />

          <SidebarItem
            icon={<BarChart2 size={18} />}
            label="Reports"
            active={is("/admin/reports")}
            path="/admin/reports"
          />

          <SidebarItem
            icon={<Star size={18} />}
            label="Reviews"
            active={is("/admin/reviews")}
            path="/admin/reviews"
          />
        </SidebarGroup>

        {/* Audit */}
        <SidebarItem
          icon={<ClipboardList size={18} />}
          label="Audit Log"
          active={is("/admin/audit-log")}
          path="/admin/audit-log"
        />
      </Sidbar>

      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header if needed */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          {/* header content */}
        </header>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
