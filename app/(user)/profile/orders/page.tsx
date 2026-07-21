"use client";

import React, { useEffect, useState } from "react";
import { orderService } from "@/services/order-service";
import { Order } from "@/types/order";
import { Package, Eye, ArrowLeft, Clock, CheckCircle2, XCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Loading from "@/components/Loading";

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "PENDING":
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-sm font-medium">
          <Clock size={14} /> Pending
        </span>
      );
    case "PROCESSING":
    case "SHIPPED":
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
          <Package size={14} /> {status === 'SHIPPED' ? 'Shipped' : 'Processing'}
        </span>
      );
    case "DELIVERED":
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium">
          <CheckCircle2 size={14} /> Delivered
        </span>
      );
    case "CANCELLED":
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-sm font-medium">
          <XCircle size={14} /> Cancelled
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-sm font-medium">
          {status}
        </span>
      );
  }
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getAll();
        if (res?.success && res?.data) {
          setOrders(res.data);
        } else {
          setError(res?.message || "Failed to load orders");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong fetching orders.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/profile"
            className="p-2 rounded-full hover:bg-slate-200 transition-colors bg-slate-200/60 text-slate-600"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              My Orders
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              View and manage your recent purchases
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium">
            {error}
          </div>
        )}

        {!loading && orders.length === 0 && !error ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No orders found</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
              Looks like you haven't made any purchases yet. Start shopping to see your orders here.
            </p>
            <Link
              href="/products"
              className="inline-flex py-2 px-6 rounded-lg text-sm font-semibold text-white bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition transform hover:-translate-y-0.5"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between border-b border-slate-100 bg-slate-50/50">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                       Order <span className="font-bold text-slate-900">{order.orderCode}</span>
                    </p>
                    <p className="text-xs text-slate-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {order.orderItems?.reduce((acc, item) => acc + item.quantity, 0) || 0} items
                      </p>
                      <p className="text-sm font-bold text-indigo-600 mt-0.5">
                         ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/profile/orders/${order.orderId}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus:ring-4 focus:ring-slate-100 transition whitespace-nowrap"
                  >
                    <Eye size={16} /> View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
