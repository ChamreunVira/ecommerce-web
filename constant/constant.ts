export enum OrderStatus {
    PENDING_PAYMENT = "PENDING_PAYMENT",
    PENDING = "PENDING",
    PROCESSING = "PRESESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
    CASH_0N_DELIVERY = "CASH_0N_DELIVERY",
    KHQR_BAKONG = "KHQR_BAKONG"
}

export enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    EXPIRED = "EXPIRED",
    FAILED = "FAILED"
}

export enum Currency {
    KM = "KM",
    EN = "EN"
}