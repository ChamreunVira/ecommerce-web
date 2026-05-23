import { Currency, PaymentStatus } from "@/constant/constant";

export interface PaymentSummary {
    paymentId: number;
    paymentStatus: PaymentStatus;
    transactionId: string;
    currentcy: Currency;
    paidAt: string
}