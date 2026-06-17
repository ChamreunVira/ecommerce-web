"use client";
import Loading from "@/components/Loading";
import OrderTable from "@/components/OrderTable";
import SearchInput from "@/components/SearchInput";
import { OrderStatus, PaymentStatus } from "@/constant/constant";
import { orderService } from "@/services/order-service";
import { Order } from "@/types/order";
import { Download, RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const OrderAdminPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setfilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleFetchOrder = async (status: OrderStatus) => {
    try {
      setIsLoading(true);
      const response = await orderService.getAll(status);
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    toast.info(`Delete endpoint is not connected yet for order ${id}.`);
  };

  const handleSearchByName = (name: string) => {
    const filtered = orders.filter((order) =>
      order.orderCode.toLowerCase().includes(name.toLowerCase()),
    );
    setfilteredOrders(filtered);
  };

  const handleFilterByStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (value === "") {
      handleFetchOrder(value as OrderStatus);
    } else {
      handleFetchOrder(value as OrderStatus);
    }
  };

  useEffect(() => {
    handleFetchOrder(OrderStatus.PENDING);
    return () => new AbortController().abort();
  }, []);

  return (
    <section className="min-h-full">
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-medium text-orange-600">Sales</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">
              Orders
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Track order status, payments, items, and fulfillment progress.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleFetchOrder(OrderStatus.PENDING)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-md bg-white p-4 md:flex-row md:items-center">
          <SearchInput onInputChange={handleSearchByName} />

          <select
            onChange={handleFilterByStatus}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 md:w-56"
          >
            <option value="">All categories</option>
            <option value={OrderStatus.CANCELLED}>
              {OrderStatus.CANCELLED}
            </option>
            <option value={OrderStatus.DELIVERED}>
              {OrderStatus.DELIVERED}
            </option>
            <option value={OrderStatus.PENDING}>{OrderStatus.PENDING}</option>
            <option value={OrderStatus.PENDING_PAYMENT}>
              {OrderStatus.PENDING_PAYMENT}
            </option>
            <option value={OrderStatus.PROCESSING}>
              {OrderStatus.PROCESSING}
            </option>
            <option value={OrderStatus.REFUNDED}>{OrderStatus.REFUNDED}</option>
            <option value={OrderStatus.SHIPPED}>{OrderStatus.SHIPPED}</option>
          </select>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <OrderTable
            order={filteredOrders.length > 0 ? filteredOrders : orders}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </section>
  );
};

export default OrderAdminPage;
