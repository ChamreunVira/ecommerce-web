import { Currency, PaymentStatus } from "@/constant/constant";

export interface Payment {
    paymentId: number;
    transactionId: string;
    orderId: number;
    amount: number;
    currency: Currency;
    qrString: string;
    deeplink: string;
    expiresAt: string;
    status: PaymentStatus
}