"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Home, Warehouse, PackageX, TrendingDown, Package } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { StockItem } from "@/types/stock-item";
import { inventoryService } from "@/services/inventory-service";
import { Table, TableCard } from "@/components/application/table/table";
import { BadgeWithDot } from "@/components/base/badges/badges";

const statusMap: Record<StockItem["status"], { color: "success" | "warning" | "error"; label: string }> = {
  IN_STOCK: { color: "success", label: "In Stock" },
  LOW_STOCK: { color: "warning", label: "Low Stock" },
  OUT_OF_STOCK: { color: "error", label: "Out of Stock" },
};

export default function InventoryPage() {
  const [inventories, setInventories] = useState<StockItem[]>([]);
  const total = inventories.length;
  const inStock = inventories.filter((i) => i.status === "IN_STOCK").length;
  const lowStock = inventories.filter((i) => i.status === "LOW_STOCK").length;
  const outOfStock = inventories.filter((i) => i.status === "OUT_OF_STOCK").length;

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
        <Link href="/admin/dashboard" className="flex items-center gap-1 transition-colors hover:text-primary">
          <Home size={14} />
        </Link>
        <ChevronRight size={14} className="text-quaternary" />
        <span className="font-medium text-primary">Inventory</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-primary">
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

      <TableCard.Root>
        <Table aria-label="Inventory table">
          <Table.Header>
            <Table.Head id="sku" label="SKU" isRowHeader allowsSorting />
            <Table.Head id="product" label="Product" allowsSorting />
            <Table.Head id="category" label="Category" allowsSorting />
            <Table.Head id="qty" label="Qty" allowsSorting />
            <Table.Head id="reorder" label="Reorder At" />
            <Table.Head id="status" label="Status" />
          </Table.Header>

          <Table.Body items={inventories}>
            {(item) => {
              const st = statusMap[item.status] ?? statusMap.IN_STOCK;
              return (
                <Table.Row id={item.id}>
                  <Table.Cell className="font-mono text-xs font-semibold text-primary">
                    {"INV-" + item.id.toString().padStart(4, "0")}
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-primary">{item.name}</Table.Cell>
                  <Table.Cell className="text-tertiary">{item.category}</Table.Cell>
                  <Table.Cell className="font-mono text-sm font-bold text-primary">{item.qty}</Table.Cell>
                  <Table.Cell className="font-mono text-sm text-tertiary">{item.reorderPoint}</Table.Cell>
                  <Table.Cell>
                    <BadgeWithDot type="pill-color" color={st.color} size="sm">
                      {st.label}
                    </BadgeWithDot>
                  </Table.Cell>
                </Table.Row>
              );
            }}
          </Table.Body>
        </Table>

        {inventories.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary bg-secondary text-tertiary">
              <Package className="size-5" />
            </div>
            <p className="text-sm font-semibold text-primary">No inventory records</p>
            <p className="text-xs text-tertiary">Stock items will appear here once created.</p>
          </div>
        )}

        <div className="flex items-center border-t border-secondary bg-primary px-6 py-3.5">
          <span className="text-xs text-tertiary">
            Showing <span className="font-semibold text-primary">{inventories.length}</span> {inventories.length !== 1 ? "items" : "item"}
          </span>
        </div>
      </TableCard.Root>
    </div>
  );
}
