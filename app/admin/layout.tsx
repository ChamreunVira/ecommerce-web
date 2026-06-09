"use client";
import AdminNavbar from "@/components/AdminNavbar";
import Sidbar, { SidebarItem } from "@/components/Sidbar";
import { Box, Compass, LayoutDashboard, List, Settings, ShoppingBag, ShoppingCart, User, Users } from "lucide-react";
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
          icon={<Users />}
          label="Customer"
          active={isActive("/admin/user")}
          path="/admin/user"
        />
        <SidebarItem
          icon={<Box />}
          label="Products"
          active={isActive("/admin/product")}
          path="/admin/product"
        />
        <SidebarItem
          icon={<List />}
          label="Categories"
          active={isActive("/admin/category")}
          path="/admin/category"
        />
        <SidebarItem
          icon={<ShoppingCart />}
          label="Orders"
          active={isActive("/admin/order")}
          path="/admin/order"
        />
        <hr className="text-slate-300"/>
        <SidebarItem
          icon={<Settings />}
          label="Settings"
          active={isActive("/admin/setting")}
          path="/admin/setting"
        />
      </Sidbar>
      <main className="flex-1 flex flex-col bg-white">
        <AdminNavbar />
        <div className="flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
      </main>
    </div>
  );
}
