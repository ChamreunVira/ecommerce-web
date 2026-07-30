"use client";
import Sidbar, { SidebarGroup, SidebarItem } from "@/components/Sidbar";
import HasPermission from "@/components/HasPermission";
import {
  LayoutDashboard, ClipboardList, Package, Settings,
  ShoppingCart, Tags, Users, Warehouse, CreditCard, Truck,
  RotateCcw, Tag, BarChart2, Star, ShieldCheck, TrendingUp
} from "lucide-react";
import { usePathname } from "next/navigation";
import "@/styles/globals.css";
import "@/styles/theme.css";
import "@/styles/typography.css";
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

        {/* Sales / Orders */}
        <HasPermission name="ORDER_READ">
          <SidebarItem
            icon={<ShoppingCart size={18} />}
            label="Orders"
            active={is("/admin/order")}
            path="/admin/order"
          />
        </HasPermission>

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
          <HasPermission name="PRODUCT_READ">
            <SidebarItem
              icon={<Package size={18} />}
              label="Products"
              active={is("/admin/product")}
              path="/admin/product"
            />
          </HasPermission>

          <HasPermission name="CATEGORY_READ">
            <SidebarItem
              icon={<Tags size={18} />}
              label="Categories"
              active={is("/admin/category")}
              path="/admin/category"
            />
          </HasPermission>

          <HasPermission name="INVENTORY_READ">
            <SidebarItem
              icon={<Warehouse size={18} />}
              label="Inventory"
              active={is("/admin/inventory")}
              path="/admin/inventory"
            />
          </HasPermission>
        </SidebarGroup>

        {/* Customers / Users */}
        <HasPermission name="USER_READ">
          <SidebarItem
            icon={<Users size={18} />}
            label="Customers"
            active={is("/admin/user")}
            path="/admin/user"
          />
        </HasPermission>

        {/* Roles & Permissions */}
        <HasPermission name="ROLE_READ">
          <SidebarItem
            icon={<ShieldCheck size={18} />}
            label="Roles & Permissions"
            active={is("/admin/roles")}
            path="/admin/roles"
          />
        </HasPermission>

        {/* Finance */}
        <HasPermission name="PAYMENT_READ">
          <SidebarItem
            icon={<CreditCard size={18} />}
            label="Payments"
            active={is("/admin/payment")}
            path="/admin/payment"
          />
        </HasPermission>

        {/* Logistics */}
        <SidebarGroup
          label="Logistics"
          icon={<Truck size={18} />}
          defaultOpen={[
            "/admin/shipping",
            "/admin/returns",
          ].includes(pathName)}
        >
          <HasPermission name="SHIPPING_READ">
            <SidebarItem
              icon={<Truck size={18} />}
              label="Shipping"
              active={is("/admin/shipping")}
              path="/admin/shipping"
            />
          </HasPermission>

          <HasPermission name="ORDER_READ">
            <SidebarItem
              icon={<RotateCcw size={18} />}
              label="Returns"
              active={is("/admin/returns")}
              path="/admin/returns"
            />
          </HasPermission>
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
          <HasPermission name="PROMOTION_READ">
            <SidebarItem
              icon={<Tag size={18} />}
              label="Promotions"
              active={is("/admin/promotions")}
              path="/admin/promotions"
            />
          </HasPermission>

          <HasPermission name="REPORT_READ">
            <SidebarItem
              icon={<BarChart2 size={18} />}
              label="Reports"
              active={is("/admin/reports")}
              path="/admin/reports"
            />
          </HasPermission>

          <HasPermission name="REVIEW_READ">
            <SidebarItem
              icon={<Star size={18} />}
              label="Reviews"
              active={is("/admin/reviews")}
              path="/admin/reviews"
            />
          </HasPermission>
        </SidebarGroup>

        {/* Audit Log */}
        <HasPermission name="AUDIT_READ">
          <SidebarItem
            icon={<ClipboardList size={18} />}
            label="Audit Log"
            active={is("/admin/audit-log")}
            path="/admin/audit-log"
          />
        </HasPermission>
      </Sidbar>

      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
