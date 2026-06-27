import { OrderStatus, PaymentMethod } from "@/constant/constant";
import { ShippingAddress } from "./shipping-address";
import { defaultOverrides } from "next/dist/server/require-hook";
import { OrderItem } from "./order-item";
import { PaymentSummary } from "./payment-sumary";

export interface Order {
    orderId: number;
    orderCode: string;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    subtotal: number;
    shippingFee: number;
    totalAmount: number;
    shippingAddress: ShippingAddress;
    note: string;
    trackingNumber: string;
    orderItems: OrderItem[];
    paymentSummary: PaymentSummary;
    createdAt: string;
    updatedAt: string;
    cancelledAt: string;
}

export type RecentOrder = Pick<Order, "orderId" | "orderCode" | "status" | "totalAmount"> & { fullName: string, createdDate: string };