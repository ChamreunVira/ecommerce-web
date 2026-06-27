import React from "react";
import Table, { Column } from "./Table";
import { Order } from "@/types/order";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

type OrderTableType = {
  order: Order[];
  handleDelete: (id: number) => void;
};

const BASE_IMG = process.env.NEXT_PUBLIC_BASE_URL_IMG;

const OrderTable: React.FC<OrderTableType> = ({ order }) => {
  const columns: Column<Order>[] = [
    {
      header: "Product",
      key: "orderItems",
      render: (_, item) => {
        const first = item.orderItems?.[0];
        const imgSrc = first?.imageUrl ? `${BASE_IMG}/${first.imageUrl}` : null;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt=""
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                  IMG
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="max-w-40 truncate text-sm font-semibold text-slate-800">
                {first?.productName ?? "—"}
              </p>
              <p className="text-xs text-slate-400">
                {item.orderItems?.length ?? 0} item
                {(item.orderItems?.length ?? 0) !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Customer",
      key: "shippingAddress",
      render: (_, item) => {
        const name = item.shippingAddress?.fullName ?? "—";
        const initials = name
          .split(" ")
          .slice(0, 2)
          .map((w: string) => w[0])
          .join("")
          .toUpperCase();
        return (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">
                {name}
              </p>
              <p className="text-xs text-slate-400">
                {item.shippingAddress?.phone ?? ""}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Order ID",
      key: "orderCode",
      render: (_, item) => (
        <div>
          <p className="text-sm font-semibold text-slate-700">
            #{item.orderCode}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            {formatDate(item.createdAt)}
          </p>
        </div>
      ),
    },
    {
      header: "Amount",
      key: "totalAmount",
      render: (_, item) => (
        <div>
          <p className="text-sm font-semibold text-slate-900">
            ${Number(item.totalAmount).toFixed(2)}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            {String(item.paymentMethod ?? "").replaceAll("_", " ")}
          </p>
        </div>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (value) => <OrderStatusBadge status={String(value)} />,
    },
    {
      header: "Action",
      key: "actions",
      className: "w-32 text-right",
      cellClassName: "text-right",
      render: (_, item) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/order/${item.orderId}`}
            className="rounded-md px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            Details
          </Link>
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <MoreHorizontal size={15} />
          </button>
        </div>
      ),
    },
  ];

  return <Table data={order} columns={columns} rowKey="orderId" />;
};

export default OrderTable;


function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { dot: string; pill: string; label: string }> = {
    PENDING_PAYMENT: {
      dot: "bg-amber-400",
      pill: "bg-amber-50  text-amber-700  ring-amber-200",
      label: "Pending Payment",
    },
    PENDING: {
      dot: "bg-amber-400",
      pill: "bg-amber-50  text-amber-700  ring-amber-200",
      label: "Pending",
    },
    PROCESSING: {
      dot: "bg-sky-400",
      pill: "bg-sky-50    text-sky-700    ring-sky-200",
      label: "Processing",
    },
    PRESESSING: {
      dot: "bg-sky-400",
      pill: "bg-sky-50    text-sky-700    ring-sky-200",
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
      pill: "bg-rose-50   text-rose-700   ring-rose-200",
      label: "Cancelled",
    },
    REFUNDED: {
      dot: "bg-slate-400",
      pill: "bg-slate-100 text-slate-600  ring-slate-200",
      label: "Refunded",
    },
  };

  const style = map[status] ?? map.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${style.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
