"use client";
import AdminNavbar from "@/components/AdminNavbar";
import Sidbar, { SidebarItem } from "@/components/Sidbar";
import { Compass, LayoutDashboard, List, Settings, ShoppingBag, User } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const isActive = (path: string) => {
    return pathName === path;
  };

  return (
    <div className="flex min-h-screen">
      <Sidbar>
        <SidebarItem
          icon={<LayoutDashboard />}
          label="Dashboard"
          active={isActive("/admin/dashboard")}
          path="/admin/dashboard"
        />
        <SidebarItem
          icon={<User />}
          label="Users"
          active={isActive("/admin/user")}
          path="/admin/user"
        />
        <SidebarItem
          icon={<ShoppingBag />}
          label="Products"
          active={isActive("/admin/product")}
          path="/admin/product"
        />
        <SidebarItem
          icon={<List />}
          label="Category"
          active={isActive("/admin/category")}
          path="/admin/category"
        />
        <SidebarItem
          icon={<Compass />}
          label="Orders"
          active={isActive("/admin/order")}
          path="/admin/order"
        />
        <SidebarItem
          icon={<Settings />}
          label="Settings"
          active={isActive("/admin/setting")}
          path="/admin/setting"
        />
      </Sidbar>
      <main className="flex-1 flex flex-col bg-linear-to-br from-slate-50 via-indigo-50 to-slate-50">
        <AdminNavbar />
        <div className="flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
      </main>
    </div>
  );
}
