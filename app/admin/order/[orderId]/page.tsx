"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  ChevronRight,
  Home,
  MapPin,
  Package,
  Phone,
  User2,
  FileText,
  Tag,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import { orderService } from "@/services/order-service";
import { Order } from "@/types/order";
import { OrderStatus } from "@/constant/constant";

const BASE_IMG = process.env.NEXT_PUBLIC_BASE_URL_IMG;

const STATUS_MAP: Record<
  string,
  { dot: string; pill: string; label: string }
> = {
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
  const s = STATUS_MAP[status] ?? STATUS_MAP.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${s.pill}`}
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

export default function AdminOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await orderService.getById(Number(orderId));
        if (res.success) {
          setOrder(res.data);
          setSelectedStatus(res.data.status);
        } else {
          toast.error("Failed to load order.");
        }
      } catch {
        toast.error("An error occurred while loading the order.");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const handleStatusUpdate = async () => {
    if (!order || selectedStatus === order.status) return;
    try {
      setStatusUpdating(true);
      const res = await orderService.updateStatus(
        order.orderId,
        selectedStatus as OrderStatus,
      );
      if (res.success) {
        setOrder(res.data);
        setSelectedStatus(res.data.status);
        toast.success("Order status updated successfully.");
      } else {
        toast.error("Failed to update status.");
      }
    } catch {
      toast.error("An error occurred while updating the status.");
    } finally {
      setStatusUpdating(false);
    }
  };

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
          <p className="text-sm">Loading order…</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-slate-500">
        <Package size={48} className="text-slate-300" />
        <p className="text-lg font-semibold">Order not found</p>
        <button
          onClick={() => router.back()}
          className="text-sm text-orange-500 hover:underline"
        >
          ← Go back
        </button>
      </div>
    );
  }

  const hasStatusChanged = selectedStatus !== order.status;

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
        <Link
          href="/admin/order"
          className="hover:text-slate-800 transition-colors"
        >
          Orders
        </Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium text-slate-700">
          #{order.orderCode || order.orderId}
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">
            Order #{order.orderCode || order.orderId}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Placed on {formatDate(order.createdAt)}
            {order.updatedAt && order.updatedAt !== order.createdAt && (
              <span className="ml-2 text-slate-400">
                · Updated {formatDate(order.updatedAt)}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft size={15} />
          Back
        </button>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Left column ── */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Order Items */}
          <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                Order Items
              </h2>
              <p className="text-xs text-slate-400">
                {order.orderItems?.length ?? 0} item
                {(order.orderItems?.length ?? 0) !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {order.orderItems?.map((item, i) => {
                const imgSrc = item.imageUrl
                  ? `${BASE_IMG}/${item.imageUrl}`
                  : null;
                const lineTotal =
                  item.subtotal ?? item.finalPrice * item.quantity;
                return (
                  <div key={i} className="flex items-center gap-4 px-6 py-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                      {imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={item.productName}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-300">
                          IMG
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {item.productName}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        ${Number(item.finalPrice).toFixed(2)} × {item.quantity}
                        {item.discountRate > 0 && (
                          <span className="ml-1.5 rounded bg-rose-50 px-1 py-0.5 text-[10px] font-medium text-rose-600 ring-1 ring-rose-100">
                            -{item.discountRate}%
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">
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
          </section>

          {/* Shipping Info */}
          <section className="rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                Shipping Information
              </h2>
            </div>
            <div className="px-6 py-5">
              {order.shippingAddress ? (
                <div className="space-y-3">
                  <Row icon={<User2 size={15} className="text-slate-400" />}>
                    <span className="font-medium text-slate-800">
                      {order.shippingAddress.fullName}
                    </span>
                  </Row>
                  <Row icon={<Phone size={15} className="text-slate-400" />}>
                    {order.shippingAddress.phone}
                  </Row>
                  <Row icon={<MapPin size={15} className="text-slate-400" />}>
                    {[
                      order.shippingAddress.addressLine,
                      order.shippingAddress.city,
                      order.shippingAddress.province,
                      order.shippingAddress.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </Row>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No shipping address provided.
                </p>
              )}
            </div>
            {order.note && (
              <div className="border-t border-slate-100 px-6 py-4">
                <Row icon={<FileText size={15} className="text-slate-400" />}>
                  <span className="text-slate-600">{order.note}</span>
                </Row>
              </div>
            )}
          </section>
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-6">
          {/* Status Management */}
          <section className="rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                Order Status
              </h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium text-slate-500">
                  Current status
                </p>
                <StatusBadge status={order.status} />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  Update status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  <option value={OrderStatus.PENDING_PAYMENT}>
                    Pending Payment
                  </option>
                  <option value={OrderStatus.PENDING}>Pending</option>
                  <option value={OrderStatus.PROCESSING}>Processing</option>
                  <option value={OrderStatus.SHIPPED}>Shipped</option>
                  <option value={OrderStatus.DELIVERED}>Delivered</option>
                  <option value={OrderStatus.CANCELLED}>Cancelled</option>
                  <option value={OrderStatus.REFUNDED}>Refunded</option>
                </select>
              </div>

              <button
                onClick={handleStatusUpdate}
                disabled={!hasStatusChanged || statusUpdating}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {statusUpdating ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <CheckCircle2 size={15} />
                )}
                {statusUpdating ? "Saving…" : "Save Status"}
              </button>

              {order.trackingNumber && (
                <div className="rounded-lg bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-500">Tracking Number</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {order.trackingNumber}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Payment Summary */}
          <section className="rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800">
                  Payment Summary
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                  <Tag size={10} />
                  {String(order.paymentMethod ?? "").replaceAll("_", " ")}
                </span>
              </div>
            </div>
            <div className="space-y-3 px-6 py-5 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800">
                  ${Number(order.subtotal ?? 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-medium text-slate-800">
                  ${Number(order.shippingFee ?? 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-bold text-slate-900">
                <span>Total</span>
                <span className="text-orange-600">
                  ${Number(order.totalAmount ?? 0).toFixed(2)}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Row({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-sm text-slate-600">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  );
}
