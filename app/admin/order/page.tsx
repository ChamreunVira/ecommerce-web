"use client";
import Loading from "@/components/Loading";
import OrderTable from "@/components/OrderTable";
import SearchInput from "@/components/SearchInput";
import { OrderStatus } from "@/constant/constant";
import { useAppContext } from "@/context/AppContext";
import { orderService } from "@/services/order-service";
import { Order } from "@/types/order";
import { ChevronRight, Home, RefreshCw, ShoppingBag } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const OrderAdminPage = () => {
  const { sessionReady } = useAppContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("");

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

  const handleSearchByName = (name: string) => {
    const q = name.toLowerCase();
    setFilteredOrders(
      name.trim()
        ? orders.filter((o) => o.orderCode.toLowerCase().includes(q))
        : [],
    );
  };

  const handleFilterByStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusFilter(value);
    setFilteredOrders(value ? orders.filter((o) => o.status === value) : []);
  };

  useEffect(() => {
    if (!sessionReady) return;
    handleFetchOrder();
  }, [sessionReady]);

  const displayed =
    filteredOrders.length > 0 || statusFilter ? filteredOrders : orders;

  const statCards = [
    { label: "Total Orders", value: orders.length, color: "text-slate-900" },
    {
      label: "Pending",
      value: orders.filter((o) => o.status === "PENDING").length,
      color: "text-amber-600",
    },
    {
      label: "Delivered",
      value: orders.filter((o) => o.status === "DELIVERED").length,
      color: "text-emerald-600",
    },
    {
      label: "Cancelled",
      value: orders.filter((o) => o.status === "CANCELLED").length,
      color: "text-rose-600",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-1 hover:text-slate-800 transition-colors"
        >
          <Home size={14} />
        </Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium text-slate-700">Orders List</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Orders List</h1>
          <p className="mt-1 text-sm text-slate-500">
            Here you can find all of your Orders
          </p>
        </div>
        <button
          onClick={handleFetchOrder}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {s.label}
            </p>
            <p className={`mt-2 text-3xl font-bold ${s.color}`}>
              {s.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchInput onInputChange={handleSearchByName} />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <select
            value={statusFilter}
            onChange={handleFilterByStatus}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-500"
          >
            <option value="">All Status</option>
            <option value={OrderStatus.PENDING}>Pending</option>
            <option value={OrderStatus.PENDING_PAYMENT}>Pending Payment</option>
            <option value={OrderStatus.DELIVERED}>Delivered</option>
            <option value={OrderStatus.SHIPPED}>Shipped</option>
            <option value={OrderStatus.CANCELLED}>Cancelled</option>
            <option value={OrderStatus.REFUNDED}>Refunded</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <Loading />
      ) : (
        <OrderTable order={displayed} handleDelete={() => {}} />
      )}
    </div>
  );
};

export default OrderAdminPage;
