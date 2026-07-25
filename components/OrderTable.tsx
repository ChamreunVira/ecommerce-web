"use client";

import React from "react";
import Table, { Column } from "./Table";
import { Order } from "@/types/order";
import Image from "next/image";
import Link from "next/link";
import { PrintInvoiceButton } from "./PrintInvoiceButton";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Avatar } from "@/components/base/avatar/avatar";

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
            <div className="size-10 shrink-0 overflow-hidden rounded-lg border border-secondary bg-tertiary">
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
                <div className="flex h-full w-full items-center justify-center text-[10px] text-quaternary font-medium">
                  IMG
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="max-w-40 truncate text-sm font-semibold text-primary">
                {first?.productName ?? "—"}
              </p>
              <p className="text-xs text-tertiary">
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
        return (
          <div className="flex items-center gap-2.5">
            <Avatar size="sm" alt={name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-primary">
                {name}
              </p>
              <p className="text-xs text-tertiary">
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
          <p className="text-sm font-semibold text-primary font-mono">
            #{item.orderCode}
          </p>
          <p className="mt-0.5 text-xs text-tertiary">
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
          <p className="text-sm font-semibold text-primary font-mono">
            ${Number(item.totalAmount).toFixed(2)}
          </p>
          <p className="mt-0.5 text-xs text-tertiary capitalize">
            {String(item.paymentMethod ?? "").replaceAll("_", " ").toLowerCase()}
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
      className: "w-36 text-right",
      cellClassName: "text-right",
      render: (_, item) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/order/${item.orderId}`}
            className="rounded-lg border border-secondary bg-primary px-3 py-1.5 text-xs font-semibold text-secondary shadow-xs transition hover:bg-secondary hover:text-primary"
          >
            Details
          </Link>
          <PrintInvoiceButton order={item} />
        </div>
      ),
    },
  ];

  return <Table data={order} columns={columns} rowKey="orderId" />;
};

export default OrderTable;

function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: "warning" | "indigo" | "success" | "error" | "gray" | "blue"; label: string }> = {
    PENDING_PAYMENT: { color: "warning", label: "Pending Payment" },
    PENDING: { color: "warning", label: "Pending" },
    PROCESSING: { color: "blue", label: "Processing" },
    PRESESSING: { color: "blue", label: "Processing" },
    SHIPPED: { color: "indigo", label: "Shipped" },
    DELIVERED: { color: "success", label: "Delivered" },
    CANCELLED: { color: "error", label: "Cancelled" },
    REFUNDED: { color: "gray", label: "Refunded" },
  };

  const style = map[status] ?? map.PENDING;

  return (
    <BadgeWithDot type="pill-color" color={style.color} size="sm">
      {style.label}
    </BadgeWithDot>
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

