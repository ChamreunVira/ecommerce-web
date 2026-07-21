"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  MapPin,
  Phone,
  User2,
  FileText,
  Package,
} from "lucide-react";

import { orderService } from "@/services/order-service";
import { Order } from "@/types/order";

const BASE_IMG = process.env.NEXT_PUBLIC_BASE_URL_IMG;

const STATUS_MAP: Record<string, { dot: string; pill: string; label: string }> =
  {
    PENDING_PAYMENT: {
      dot: "bg-amber-400",
      pill: "bg-amber-50 text-amber-700 ring-amber-200",
      label: "Pending Payment",
    },
    PENDING: {
      dot: "bg-amber-400",
      pill: "bg-amber-50 text-amber-700 ring-amber-200",
      label: "Pending",
    },
    PRESESSING: {
      dot: "bg-sky-400",
      pill: "bg-sky-50 text-sky-700 ring-sky-200",
      label: "Processing",
    },
    PROCESSING: {
      dot: "bg-sky-400",
      pill: "bg-sky-50 text-sky-700 ring-sky-200",
      label: "Processing",
    },
    SHIPPED: {
      dot: "bg-indigo-400",
      pill: "bg-indigo-50 text-indigo-700 ring-indigo-200",
      label: "Shipped",
    },
    DELIVERED: {
      dot: "bg-emerald-400",
      pill: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      label: "Delivered",
    },
    CANCELLED: {
      dot: "bg-rose-400",
      pill: "bg-rose-50 text-rose-700 ring-rose-200",
      label: "Cancelled",
    },
    REFUNDED: {
      dot: "bg-slate-400",
      pill: "bg-slate-100 text-slate-600 ring-slate-200",
      label: "Refunded",
    },
  };

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP["PENDING"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${s.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ViewOrderPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = params.orderId as string;

  useEffect(() => {
    if (!orderId) return;
    fetchOrderDetails(Number(orderId));
  }, [orderId]);

  const fetchOrderDetails = async (id: number) => {
    try {
      setLoading(true);
      const response = await orderService.getById(id);
      if (response.success) {
        setOrder(response.data);
      } else {
        toast.error("Failed to load order details.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while loading the order.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container py-12 flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" />
          <p className="text-sm">Loading order…</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="app-container py-12 flex flex-col justify-center items-center min-h-[50vh] gap-4">
        <Package size={48} className="text-slate-300" />
        <h2 className="text-xl font-bold text-gray-700">Order not found</h2>
        <button
          onClick={() => router.back()}
          className="text-indigo-500 hover:underline text-sm"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="app-container py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Order Details</h1>
            <p className="text-sm text-slate-500 mt-1">
              Order #{order.orderCode || order.orderId} · Placed on{" "}
              {formatDate(order.createdAt)}
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            <ArrowLeft size={15} />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-base font-semibold text-slate-800">
                  Order Items
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {order.orderItems.map((item, index) => {
                  const imgSrc = item.imageUrl
                    ? `${BASE_IMG}/${item.imageUrl}`
                    : null;
                  const lineTotal =
                    item.subtotal ?? item.finalPrice * item.quantity;
                  return (
                    <div key={index} className="flex items-center gap-4 px-6 py-4">
                      <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0">
                        {imgSrc ? (
                          <Image
                            src={imgSrc}
                            alt={item.productName}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-300">
                            IMG
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          ${Number(item.finalPrice).toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-slate-900">
                          ${Number(lineTotal).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400">
                          Qty {item.quantity}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-semibold text-slate-800 mb-4">
                Shipping Info
              </h2>
              {order.shippingAddress ? (
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <User2 size={15} className="text-slate-400 mt-0.5 shrink-0" />
                    <span className="font-medium text-slate-800">
                      {order.shippingAddress.fullName}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={15} className="text-slate-400 mt-0.5 shrink-0" />
                    <span>{order.shippingAddress.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={15} className="text-slate-400 mt-0.5 shrink-0" />
                    <span>
                      {[
                        order.shippingAddress.addressLine,
                        order.shippingAddress.city,
                        order.shippingAddress.province,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No shipping address provided.
                </p>
              )}
              {order.note && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-3 text-sm text-slate-600">
                  <FileText size={15} className="text-slate-400 mt-0.5 shrink-0" />
                  <span>{order.note}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-semibold text-slate-800 mb-3">
                Order Status
              </h2>
              <StatusBadge status={order.status} />
              {order.trackingNumber && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Tracking Number</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {order.trackingNumber}
                  </p>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-sm text-slate-600">
              <h2 className="text-base font-semibold text-slate-800 mb-4">
                Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">
                    ${Number(order.subtotal ?? 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-slate-800">
                    ${Number(order.shippingFee ?? 0).toFixed(2)}
                  </span>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between text-base font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-indigo-600">
                    ${Number(order.totalAmount ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs flex justify-between items-center">
                <span className="text-slate-500">Payment</span>
                <span className="font-semibold text-slate-700">
                  {String(order.paymentMethod ?? "").replaceAll("_", " ")}
                </span>
              </div>
            </div>

            {/* Back to shop */}
            <Link
              href="/"
              className="block text-center w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              ← Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
