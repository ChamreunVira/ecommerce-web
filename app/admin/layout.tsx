"use client";
import AdminNavbar from "@/components/AdminNavbar";
import Sidbar, { SidebarGroup, SidebarItem } from "@/components/Sidbar";
import {
  LayoutDashboard, ClipboardList, Package, Settings,
  ShoppingCart, Tags, Users, Warehouse, CreditCard, Truck,
  RotateCcw, Tag, BarChart2, Star, BookOpen, Briefcase, TrendingUp, Monitor
} from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const is = (path: string) => pathName === path;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidbar>
        {/* Standalone */}
        <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={is("/admin/dashboard")} path="/admin/dashboard" />

        {/* Catalog group */}
        <SidebarGroup
          label="Catalog"
          icon={<BookOpen size={18} />}
          defaultOpen={["/admin/user", "/admin/product", "/admin/inventory", "/admin/category"].includes(pathName)}
        >
          <SidebarItem icon={<Users size={18} />} label="Customers" active={is("/admin/user")} path="/admin/user" />
          <SidebarItem icon={<Package size={18} />} label="Products" active={is("/admin/product")} path="/admin/product" />
          <SidebarItem icon={<Warehouse size={18} />} label="Inventory" active={is("/admin/inventory")} path="/admin/inventory" />
          <SidebarItem icon={<Tags size={18} />} label="Categories" active={is("/admin/category")} path="/admin/category" />
        </SidebarGroup>

        {/* Operations group */}
        <SidebarGroup
          label="Operations"
          icon={<Briefcase size={18} />}
          defaultOpen={["/admin/order", "/admin/payment", "/admin/shipping", "/admin/returns"].includes(pathName)}
        >
          <SidebarItem icon={<ShoppingCart size={18} />} label="Orders" active={is("/admin/order")} path="/admin/order" />
          <SidebarItem icon={<CreditCard size={18} />} label="Payments" active={is("/admin/payment")} path="/admin/payment" />
          <SidebarItem icon={<Truck size={18} />} label="Shipping" active={is("/admin/shipping")} path="/admin/shipping" />
          <SidebarItem icon={<RotateCcw size={18} />} label="Returns" active={is("/admin/returns")} path="/admin/returns" />
        </SidebarGroup>

        {/* Growth group */}
        <SidebarGroup
          label="Growth"
          icon={<TrendingUp size={18} />}
          defaultOpen={["/admin/promotions", "/admin/reports", "/admin/reviews"].includes(pathName)}
        >
          <SidebarItem icon={<Tag size={18} />} label="Promotions" active={is("/admin/promotions")} path="/admin/promotions" />
          <SidebarItem icon={<BarChart2 size={18} />} label="Reports" active={is("/admin/reports")} path="/admin/reports" />
          <SidebarItem icon={<Star size={18} />} label="Reviews" active={is("/admin/reviews")} path="/admin/reviews" />
        </SidebarGroup>

        {/* System */}
        <SidebarGroup
          label="System"
          icon={<Monitor size={18} />}
          defaultOpen={["/admin/audit-log", "/admin/setting"].includes(pathName)}
        >
          <SidebarItem icon={<ClipboardList size={18} />} label="Audit Log" active={is("/admin/audit-log")} path="/admin/audit-log" />
          <SidebarItem icon={<Settings size={18} />} label="Settings" active={is("/admin/setting")} path="/admin/setting" />
        </SidebarGroup>
      </Sidbar>

      <main className="flex min-w-0 flex-1 flex-col bg-slate-50">
        <AdminNavbar />
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-6 py-8 md:px-10 lg:px-12">
          {children}
        </div>
      </main>
    </div>
  );
}
