import React from 'react'
import Table, { Column } from './Table';
import { User } from '@/types/user';
import { Edit, Trash } from 'lucide-react';
import { Order } from '@/types/order';
import Image from 'next/image';
import { OrderStatus } from '@/constant/constant';

type OrderTableType = {
  order: Order[];
  handleDelete: (id: number) => void;
}

const OrderTable: React.FC<OrderTableType> = ({ order, handleDelete }) => {
  const columns: Column<Order & { actions: string } | any>[] = [
    {
      header: "#",
      key: "orderId",
      className: "w-16",
    },
    {
      header: "Image",
      key: "image",
      className: "w-28",
      render: (value, order) => {

        const image = order.primaryImage;

        if (!image) {
          return (
            <div className="w-15 h-15 bg-gray-100/50 rounded flex items-center justify-center text-[10px] text-gray-400">
              No Image
            </div>
          );
        }

        const imageSrc = "http://localhost:8080/api/v1/uploads/" + image;
        return (
          <Image
            src={imageSrc}
            alt={order.name || "Product"}
            width={60}
            height={60}
            className="rounded object-cover"
            unoptimized
          />
        );
      },
    },
    {
      header: "OrderCode",
      key: "orderCode"
    },
    {
      header: "OrderStatus",
      key: "status",
      render: (value , order: Order) => {
        console.log(order.status , OrderStatus.PENDING_PAYMENT ,order.status === "PENDING_PAYMENT")
        return (
          <div className='text-slate-800'>
            {order.status == "PENDING_PAYMENT" ? <button className='px-2 py-0.5 text-xs bg-amber-200 rounded-sm text-amber-600'>PENDING</button> : ""}
          </div>
        )
      }
    },
    {
      header: "PaymentMethod",
      key: "paymentMethod"
    },
    {
      header: "TotalItems",
      key: "totalItems"
    },
    {
      header: "TotalAmount",
      key: "totalAmount"
    },
    {
      header: "CreatedAt",
      key: "createdAt"
    },
    {
      header: "Actions",
      key: "actions",
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-amber-500 rounded-full hover:bg-amber-100">
            <Edit className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => handleDelete(item.orderId)}
            className="text-rose-500 p-1.5 rounded-full hover:bg-rose-100">
            <Trash className="w-4.5 h-4.5" />
          </button>
        </div>
      ),
    }
  ];

  return <Table data={order} columns={columns} />;
}

export default OrderTable;