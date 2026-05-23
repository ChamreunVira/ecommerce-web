import React from 'react'
import Table, { Column} from './Table';
import { User } from '@/types/user';
import { Edit, Trash } from 'lucide-react';
import { Order } from '@/types/order';

type OrderTableType = {
    order: Order[];
    handleDelete: (id: number) => void;
}

const OrderTable: React.FC<OrderTableType> = ({order, handleDelete}) => {
    const columns: Column<Order & {actions: string}>[] = [
    {
      header: "#",
      key: "orderId",
      className: "w-16",
    },
    {
        header: "OrderCode",
        key: "orderCode"
    },
    {
        header: "OrderStatus",
        key: "orderStatus"
    },
    {
        header: "PaymentMethod",
        key: "paymentMethod"
    },
    {
        header: "Subtotal",
        key: "subtotal"
    },
    {
        header: "TotalAmount",
        key: "totalAmount"
    },
    {
        header: "UpdatedAt",
        key: "updatedAt"
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