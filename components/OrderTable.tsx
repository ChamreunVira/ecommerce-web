import React from "react";
import Table, { Column } from "./Table";
import { Edit, Trash } from "lucide-react";
import { Order } from "@/types/order";
import Image from "next/image";

type OrderTableType = {
  order: Order[];
  handleDelete: (id: number) => void;
}

const OrderTable: React.FC<OrderTableType> = ({ order, handleDelete }) => {
  const columns: Column<Order>[] = [
    {
      header: "#",
      key: "orderId",
      className: "w-16",
      cellClassName: "font-semibold text-slate-800",
    },
    {
      header: "Image",
      key: "image",
      className: "w-28",
      render: (_, item) => {
        const firstItem = item.orderItems?.[0];
        const image = firstItem?.imageUrl;

        if (!image) {
          return (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
              No img
            </div>
          );
        }

        const imageSrc = image.startsWith("http") ? image : `http://localhost:8080/api/v1/uploads/${image}`;
        return (
          <Image
            src={imageSrc}
            alt={firstItem.productName || "Product"}
            width={48}
            height={48}
            className="h-12 w-12 rounded-lg object-cover"
            unoptimized
          />
        );
      },
    },
    {
      header: "Order code",
      key: "orderCode",
      render: (value) => <span className="font-semibold text-slate-900">{String(value)}</span>,
    },
    {
      header: "Status",
      key: "status",
      render: (value) => <OrderStatusBadge status={String(value)} />,
    },
    {
      header: "Payment",
      key: "paymentMethod",
      render: (value) => <span className="text-sm text-slate-600">{String(value).replaceAll("_", " ")}</span>,
    },
    {
      header: "Items",
      key: "orderItems",
      render: (_, item) => <span className="font-medium text-slate-700">{item.orderItems?.length || 0}</span>,
    },
    {
      header: "Total",
      key: "totalAmount",
      render: (value) => <span className="font-semibold text-emerald-600">${Number(value).toFixed(2)}</span>,
    },
    {
      header: "Created",
      key: "createdAt",
      render: (value) => formatDate(value),
    },
    {
      header: "Actions",
      key: "actions",
      className: "w-28 text-right",
      cellClassName: "text-right",
      render: (_, item) => (
        <div className="flex items-center justify-end gap-2">
          <button className="rounded-full p-2 text-amber-600 transition hover:bg-amber-50" aria-label="Edit order">
            <Edit size={17} />
          </button>
          <button
            onClick={() => handleDelete(item.orderId)}
            className="rounded-full p-2 text-rose-600 transition hover:bg-rose-50"
            aria-label="Delete order"
          >
            <Trash size={17} />
          </button>
        </div>
      ),
    }
  ];

  return <Table data={order} columns={columns} />;
}

export default OrderTable;

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING_PAYMENT: "bg-amber-50 text-amber-700 ring-amber-100",
    PENDING: "bg-amber-50 text-amber-700 ring-amber-100",
    PROCESSING: "bg-sky-50 text-sky-700 ring-sky-100",
    PRESESSING: "bg-sky-50 text-sky-700 ring-sky-100",
    SHIPPED: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    DELIVERED: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    CANCELLED: "bg-rose-50 text-rose-700 ring-rose-100",
    REFUNDED: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[status] || styles.PENDING}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}

function formatDate(value: unknown) {
  if (!value) return <span className="text-slate-400">-</span>;
  return <span className="text-sm text-slate-500">{new Date(value as string).toLocaleDateString()}</span>;
}
