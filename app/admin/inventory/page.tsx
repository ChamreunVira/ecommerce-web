"use client";
import Link from "next/link";
import { ChevronRight, Home, Warehouse, AlertTriangle, PackageX, TrendingDown, Package } from "lucide-react";
import StatsCard from "@/components/StatsCard";

type StockItem = {
  id: number;
  sku: string;
  name: string;
  category: string;
  qty: number;
  reserved: number;
  reorderPoint: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
};

const mockInventory: StockItem[] = [
  { id: 1, sku: "SKU-001", name: "Wireless Headphones Pro", category: "Electronics", qty: 142, reserved: 12, reorderPoint: 20, status: "In Stock" },
  { id: 2, sku: "SKU-002", name: "Running Shoes X500", category: "Footwear", qty: 3, reserved: 1, reorderPoint: 10, status: "Low Stock" },
  { id: 3, sku: "SKU-003", name: "Slim Fit Jeans", category: "Clothing", qty: 0, reserved: 0, reorderPoint: 15, status: "Out of Stock" },
  { id: 4, sku: "SKU-004", name: "Mechanical Keyboard RGB", category: "Electronics", qty: 58, reserved: 5, reorderPoint: 10, status: "In Stock" },
  { id: 5, sku: "SKU-005", name: "Yoga Mat Pro", category: "Sports", qty: 4, reserved: 2, reorderPoint: 10, status: "Low Stock" },
  { id: 6, sku: "SKU-006", name: "leather Wallet Slim", category: "Accessories", qty: 0, reserved: 0, reorderPoint: 5, status: "Out of Stock" },
  { id: 7, sku: "SKU-007", name: "USB-C Hub 7-in-1", category: "Electronics", qty: 89, reserved: 14, reorderPoint: 20, status: "In Stock" },
  { id: 8, sku: "SKU-008", name: "Cotton Polo Shirt", category: "Clothing", qty: 2, reserved: 0, reorderPoint: 15, status: "Low Stock" },
];

const statusStyle: Record<StockItem["status"], string> = {
  "In Stock": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Low Stock": "bg-amber-50 text-amber-700 ring-amber-200",
  "Out of Stock": "bg-rose-50 text-rose-700 ring-rose-200",
};

export default function InventoryPage() {
  const total = mockInventory.length;
  const inStock = mockInventory.filter(i => i.status === "In Stock").length;
  const lowStock = mockInventory.filter(i => i.status === "Low Stock").length;
  const outOfStock = mockInventory.filter(i => i.status === "Out of Stock").length;

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-slate-800 transition-colors"><Home size={14} /></Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium text-slate-700">Inventory</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950 flex items-center gap-2">
            <Warehouse className="text-orange-500" size={24} /> Inventory Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">Track stock levels, reserve units, and manage reorder points.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<Package className="text-orange-500" />} accent="bg-orange-50" label="Total SKUs" value={total} trend={0} />
        <StatsCard icon={<Package className="text-emerald-500" />} accent="bg-emerald-50" label="In Stock" value={inStock} trend={+1} />
        <StatsCard icon={<TrendingDown className="text-amber-500" />} accent="bg-amber-50" label="Low Stock" value={lowStock} trend={-1} />
        <StatsCard icon={<PackageX className="text-rose-500" />} accent="bg-rose-50" label="Out of Stock" value={outOfStock} trend={-2} />
      </div>

      <div className="rounded-lg bg-white shadow-sm ring-1 ring-slate-200 overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">SKU</th>
              <th className="px-5 py-4 font-semibold">Product</th>
              <th className="px-5 py-4 font-semibold">Category</th>
              <th className="px-5 py-4 font-semibold text-center">Qty</th>
              <th className="px-5 py-4 font-semibold text-center">Reserved</th>
              <th className="px-5 py-4 font-semibold text-center">Reorder At</th>
              <th className="px-5 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockInventory.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4 font-mono text-xs text-slate-500">{item.sku}</td>
                <td className="px-5 py-4 font-semibold text-slate-900">{item.name}</td>
                <td className="px-5 py-4 text-slate-500">{item.category}</td>
                <td className="px-5 py-4 text-center font-bold text-slate-800">{item.qty}</td>
                <td className="px-5 py-4 text-center text-slate-500">{item.reserved}</td>
                <td className="px-5 py-4 text-center text-slate-500">{item.reorderPoint}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyle[item.status]}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
