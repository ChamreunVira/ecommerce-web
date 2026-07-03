import { Currency, PaymentStatus } from "@/constant/constant";

export interface Payment {
    paymentId: number;
    transactionId: string;
    orderId: number;
    orderCode: string;
    customer: string;
    status: PaymentStatus
    method: string;
    amount: number;
    currency: Currency;
    qrString: string;
    deeplink: string;
    expiresAt: string;
    paidAt: string;
    createdAt: string;
    updatedAt: string;
}