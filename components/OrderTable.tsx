"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Table, TableCard } from "@/components/application/table/table";
import { Order } from "@/types/order";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Avatar } from "@/components/base/avatar/avatar";
import { PrintInvoiceButton } from "./PrintInvoiceButton";

type OrderTableType = {
  order: Order[];
  handleDelete: (id: number) => void;
};

const BASE_IMG = process.env.NEXT_PUBLIC_BASE_URL_IMG;

const OrderTable: React.FC<OrderTableType> = ({ order }) => {
  return (
    <TableCard.Root>
      <Table aria-label="Orders table">
        <Table.Header>
          <Table.Head id="product" label="Product" isRowHeader />
          <Table.Head id="customer" label="Customer" allowsSorting />
          <Table.Head id="orderId" label="Order ID" allowsSorting />
          <Table.Head id="amount" label="Amount" allowsSorting />
          <Table.Head id="status" label="Status" allowsSorting />
          <Table.Head id="actions" />
        </Table.Header>

        <Table.Body items={order}>
          {(item) => {
            const first = item.orderItems?.[0];
            const imgSrc = first?.imageUrl ? `${BASE_IMG}/${first.imageUrl}` : null;
            const customerName = item.shippingAddress?.fullName ?? "—";

            return (
              <Table.Row id={item.orderId}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="size-10 shrink-0 overflow-hidden rounded-lg border border-secondary bg-tertiary">
                      {imgSrc ? (
                        <Image src={imgSrc} alt="" width={40} height={40} className="h-full w-full object-cover" unoptimized />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-quaternary">IMG</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="max-w-40 truncate text-sm font-semibold text-primary">
                        {first?.productName ?? "—"}
                      </p>
                      <p className="text-xs text-tertiary">
                        {item.orderItems?.length ?? 0} item{(item.orderItems?.length ?? 0) !== 1 ? "s" : ""}
                      </p>
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
                  <p className="font-mono text-sm font-semibold text-primary">
                    ${Number(item.totalAmount).toFixed(2)}
                  </p>
                  <p className="mt-0.5 text-xs capitalize text-tertiary">
                    {String(item.paymentMethod ?? "").replaceAll("_", " ").toLowerCase()}
                  </p>
                </Table.Cell>
                <Table.Cell>
                  <OrderStatusBadge status={String(item.status)} />
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/order/${item.orderId}`}
                      className="rounded-lg border border-secondary bg-primary px-3 py-1.5 text-xs font-semibold text-secondary shadow-xs transition hover:bg-secondary hover:text-primary"
                    >
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

      {order.length === 0 && (
        <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary bg-secondary text-tertiary">
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-primary">No orders found</p>
          <p className="text-xs text-tertiary">Try adjusting your search or filters.</p>
        </div>
      )}

      <div className="flex items-center border-t border-secondary bg-primary px-6 py-3.5">
        <span className="text-xs text-tertiary">
          Showing <span className="font-semibold text-primary">{order.length}</span> {order.length !== 1 ? "orders" : "order"}
        </span>
      </div>
    </TableCard.Root>
  );
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

  const style = map[status] ?? { color: "gray" as const, label: status };

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
