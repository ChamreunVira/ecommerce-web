import { OrderStatus, PaymentMethod } from "@/constant/constant";

export interface OrderSummary {
    orderId: number;
    orderCode: string;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    totalItems: number;
    primaryImage: string;
    createdAt: string;
}