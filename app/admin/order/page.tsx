"use client";
import StatsCard from "@/components/StatsCard";
import { useAppContext } from "@/context/AppContext";
import { orderService } from "@/services/order-service";
import { Order } from "@/types/order";
import { ChevronRight, Clock, Home, PackageMinusIcon, RefreshCw, Search, ShoppingBag, Truck, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Table, TableCard } from "@/components/application/table/table";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Avatar } from "@/components/base/avatar/avatar";
import { PrintInvoiceButton } from "@/components/PrintInvoiceButton";

const BASE_IMG = process.env.NEXT_PUBLIC_BASE_URL_IMG;
const PAGE_SIZE = 10;

const statusColorMap: Record<string, { color: "warning" | "indigo" | "success" | "error" | "gray" | "blue"; label: string }> = {
  PENDING_PAYMENT: { color: "warning", label: "Pending Payment" },
  PENDING: { color: "warning", label: "Pending" },
  PROCESSING: { color: "blue", label: "Processing" },
  PRESESSING: { color: "blue", label: "Processing" },
  SHIPPED: { color: "indigo", label: "Shipped" },
  DELIVERED: { color: "success", label: "Delivered" },
  CANCELLED: { color: "error", label: "Cancelled" },
  REFUNDED: { color: "gray", label: "Refunded" },
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const OrderAdminPage = () => {
  const { sessionReady } = useAppContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleFetchOrder = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getAll();
      if (response.success) setOrders(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionReady) return;
    handleFetchOrder();
  }, [sessionReady]);

  const filtered = orders.filter((o) => {
    const matchQuery = !query || o.orderCode.toLowerCase().includes(query.toLowerCase());
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchQuery && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-tertiary">
        <Link href="/admin/dashboard" className="flex items-center gap-1 transition-colors hover:text-primary"><Home size={14} /></Link>
        <ChevronRight size={14} className="text-quaternary" />
        <span className="font-medium text-primary">Orders</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Orders</h1>
          <p className="mt-1 text-sm text-tertiary">Track and manage all customer orders.</p>
        </div>
        <button onClick={handleFetchOrder} className="inline-flex items-center justify-center gap-2 rounded-lg border border-secondary bg-primary px-4 py-2.5 text-sm font-semibold text-secondary shadow-xs transition hover:bg-secondary hover:text-primary">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<ShoppingBag className="text-indigo-500" />} accent="bg-indigo-50" label="Total Orders" value={orders.length} trend={+1} />
        <StatsCard icon={<Clock className="text-amber-500" />} accent="bg-amber-50" label="Pending" value={orders.filter((o) => o.status === "PENDING").length} trend={+3} />
        <StatsCard icon={<Truck className="text-sky-500" />} accent="bg-sky-50" label="Delivered" value={orders.filter((o) => o.status === "DELIVERED").length} trend={+10} />
        <StatsCard icon={<PackageMinusIcon className="text-rose-500" />} accent="bg-rose-50" label="Cancelled" value={orders.filter((o) => o.status === "CANCELLED").length} trend={-1} />
      </div>

      <TableCard.Root>
        {/* Search + filter */}
        <div className="flex flex-col gap-3 border-b border-secondary bg-primary px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div className="relative max-w-xs">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" />
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search order code…"
              className="h-9 w-full rounded-lg border border-secondary bg-primary pl-8 pr-3 text-sm font-medium text-primary outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="h-9 rounded-lg border border-secondary bg-primary px-3 text-sm font-medium text-secondary outline-none"
          >
            <option value="">All Statuses</option>
            {Object.entries(statusColorMap).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        <Table aria-label="Orders table">
          <Table.Header>
            <Table.Head id="product" label="Product" isRowHeader />
            <Table.Head id="customer" label="Customer" allowsSorting />
            <Table.Head id="orderId" label="Order ID" allowsSorting />
            <Table.Head id="amount" label="Amount" allowsSorting />
            <Table.Head id="status" label="Status" allowsSorting />
            <Table.Head id="actions" />
          </Table.Header>

          <Table.Body items={isLoading ? [] : paginated}>
            {(item) => {
              const first = item.orderItems?.[0];
              const imgSrc = first?.imageUrl ? `${BASE_IMG}/${first.imageUrl}` : null;
              const customerName = item.shippingAddress?.fullName ?? "—";
              const st = statusColorMap[item.status] ?? { color: "gray" as const, label: item.status };
              return (
                <Table.Row id={item.orderId}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <div className="size-10 shrink-0 overflow-hidden rounded-lg border border-secondary bg-tertiary">
                        {imgSrc ? <Image src={imgSrc} alt="" width={40} height={40} className="h-full w-full object-cover" unoptimized /> : <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-quaternary">IMG</div>}
                      </div>
                      <div className="min-w-0">
                        <p className="max-w-40 truncate text-sm font-semibold text-primary">{first?.productName ?? "—"}</p>
                        <p className="text-xs text-tertiary">{item.orderItems?.length ?? 0} item{(item.orderItems?.length ?? 0) !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2.5">
                      <Avatar size="sm" alt={customerName} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-primary">{customerName}</p>
                        <p className="text-xs text-tertiary">{item.shippingAddress?.phone ?? ""}</p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <p className="font-mono text-sm font-semibold text-primary">#{item.orderCode}</p>
                    <p className="mt-0.5 text-xs text-tertiary">{formatDate(item.createdAt)}</p>
                  </Table.Cell>
                  <Table.Cell>
                    <p className="font-mono text-sm font-semibold text-primary">${Number(item.totalAmount).toFixed(2)}</p>
                    <p className="mt-0.5 text-xs capitalize text-tertiary">{String(item.paymentMethod ?? "").replaceAll("_", " ").toLowerCase()}</p>
                  </Table.Cell>
                  <Table.Cell>
                    <BadgeWithDot type="pill-color" color={st.color} size="sm">{st.label}</BadgeWithDot>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/order/${item.orderId}`} className="rounded-lg border border-secondary bg-primary px-3 py-1.5 text-xs font-semibold text-secondary shadow-xs transition hover:bg-secondary hover:text-primary">
                        Details
                      </Link>
                      <PrintInvoiceButton order={item} />
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            }}
          </Table.Body>
        </Table>

        {!isLoading && paginated.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary bg-secondary text-tertiary"><ShoppingBag size={20} /></div>
            <p className="text-sm font-semibold text-primary">No orders found</p>
            <p className="text-xs text-tertiary">Try adjusting your search or filters.</p>
          </div>
        )}
        {isLoading && <div className="px-6 py-12 text-center text-sm text-tertiary">Loading orders…</div>}

        <div className="flex items-center justify-between border-t border-secondary bg-primary px-4 py-3 md:px-6">
          <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="inline-flex items-center gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-semibold text-secondary shadow-xs transition hover:bg-secondary hover:text-primary disabled:opacity-40">
            <ArrowLeft className="size-4" /> Previous
          </button>
          <span className="text-xs text-tertiary">Page <span className="font-semibold text-primary">{currentPage}</span> of <span className="font-semibold text-primary">{totalPages}</span> · <span className="font-semibold text-primary">{filtered.length}</span> orders</span>
          <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="inline-flex items-center gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-semibold text-secondary shadow-xs transition hover:bg-secondary hover:text-primary disabled:opacity-40">
            Next <ArrowRight className="size-4" />
          </button>
        </div>
      </TableCard.Root>
    </div>
  );
};

export default OrderAdminPage;
