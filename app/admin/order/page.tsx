"use client";
import Loading from "@/components/Loading";
import OrderTable from "@/components/OrderTable";
import StatsCard from "@/components/StatsCard";
import { useAppContext } from "@/context/AppContext";
import { orderService } from "@/services/order-service";
import { Order } from "@/types/order";
import { ChevronRight, Clock, Home, PackageIcon, PackageMinusIcon, RefreshCw, ShoppingBag, Truck, X } from "lucide-react";
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
    {
      icon: <ShoppingBag className="text-indigo-600" />,
      accent: "bg-indigo-50",
      label: "Total Orders",
      value: orders.length,
      trend: +1,
    },
    {
      icon: <Clock className="text-amber-600" />,
      accent: "bg-amber-50",
      label: "Pending",
      value: orders.filter((o) => o.status === "PENDING").length,
      trend: +3
    },
    {
      icon: <Truck className="text-emerald-600" />,
      accent: "bg-emerald-50",
      label: "Delivered",
      value: orders.filter((o) => o.status === "DELIVERED").length,
      trend: +10
    },
    {
      icon: <PackageMinusIcon className="text-rose-500" />,
      accent: "bg-rose-50",
      label: "Cancelled",
      value: orders.filter((o) => o.status === "CANCELLED").length,
      trend: -1
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
        {statCards.map((stat) => (
          <StatsCard icon={stat.icon} accent={stat.accent} label={stat.label} value={stat.value} trend={stat.trend}/>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <Loading />
      ) : (
        <OrderTable order={displayed} handleDelete={() => { }} />
      )}
    </div>
  );
};

export default OrderAdminPage;
