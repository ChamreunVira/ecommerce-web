"use client";
import Link from "next/link";
import { ChevronRight, Home, Warehouse, PackageX, TrendingDown, Package } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { StockItem } from "@/types/stock-item";
import { useEffect, useState } from "react";
import { inventoryService } from "@/services/inventory-service";
import { Table, Thead, THeading, TBody, TCell } from "@/components/Table";
import { BadgeWithDot } from "@/components/base/badges/badges";

const statusMap: Record<StockItem["status"], { color: "success" | "warning" | "error"; label: string }> = {
  IN_STOCK: { color: "success", label: "In Stock" },
  LOW_STOCK: { color: "warning", label: "Low Stock" },
  OUT_OF_STOCK: { color: "error", label: "Out of Stock" },
};

export default function InventoryPage() {
  const [inventories, setInventories] = useState<StockItem[]>([]);
  const total = inventories.length;
  const inStock = inventories.filter(i => i.status === "IN_STOCK").length;
  const lowStock = inventories.filter(i => i.status === "LOW_STOCK").length;
  const outOfStock = inventories.filter(i => i.status === "OUT_OF_STOCK").length;

  const handleFetchInventories = async () => {
    try {
      const response = await inventoryService.getAll();
      if (response.success) {
        setInventories(response.data);
      }
    } catch (e: any) {
      console.log("Error fetching inventories: ", e.message);
    }
  };

  useEffect(() => {
    handleFetchInventories();
    return () => new AbortController().abort();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-tertiary">
        <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors">
          <Home size={14} />
        </Link>
        <ChevronRight size={14} className="text-quaternary" />
        <span className="font-medium text-primary">Inventory</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <Warehouse className="text-brand-secondary" size={24} /> Inventory Management
          </h1>
          <p className="mt-1 text-sm text-tertiary">Track stock levels, reserve units, and manage reorder points.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<Package className="text-indigo-500" />} accent="bg-indigo-50" label="Total SKUs" value={total} trend={0} />
        <StatsCard icon={<Package className="text-emerald-500" />} accent="bg-emerald-50" label="In Stock" value={inStock} trend={+1} />
        <StatsCard icon={<TrendingDown className="text-amber-500" />} accent="bg-amber-50" label="Low Stock" value={lowStock} trend={-1} />
        <StatsCard icon={<PackageX className="text-rose-500" />} accent="bg-rose-50" label="Out of Stock" value={outOfStock} trend={-2} />
      </div>

      <Table>
        <Thead>
          <THeading>SKU</THeading>
          <THeading>Product</THeading>
          <THeading>Category</THeading>
          <THeading className="text-center">Qty</THeading>
          <THeading className="text-center">Reorder At</THeading>
          <THeading>Status</THeading>
        </Thead>
        <TBody>
          {inventories.map(item => {
            const st = statusMap[item.status] ?? statusMap.IN_STOCK;
            return (
              <tr key={item.id} className="hover:bg-secondary transition-colors">
                <TCell className="font-mono text-xs font-semibold text-primary">{"INV-" + item.id.toString().padStart(4, "0")}</TCell>
                <TCell className="font-semibold text-primary">{item.name}</TCell>
                <TCell className="text-tertiary">{item.category}</TCell>
                <TCell className="text-center font-bold text-primary font-mono">{item.qty}</TCell>
                <TCell className="text-center text-tertiary font-mono">{item.reorderPoint}</TCell>
                <TCell>
                  <BadgeWithDot type="pill-color" color={st.color} size="sm">
                    {st.label}
                  </BadgeWithDot>
                </TCell>
              </tr>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
}

