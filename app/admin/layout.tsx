import AdminNavbar from "@/components/AdminNavbar";
import Sidbar, { SidebarItem } from "@/components/Sidbar";
import { Compass, LayoutDashboard, List, ShoppingBag } from "lucide-react";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidbar>
        <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active path="/admin/dashboard"/>
        <SidebarItem icon={<ShoppingBag />} label="Products" active={false} path="/admin/product"/>
        <SidebarItem icon={<List />} label="Category" active={false} path="/admin/category"/>
        <SidebarItem icon={<Compass />} label="Orders" active={false} path="/admin/order"/>
      </Sidbar>
      <main className="flex-1">
        <AdminNavbar />
        <div className="relative h-full overflow-x-hidden">{children}</div>
      </main>
    </div>
  );
}
