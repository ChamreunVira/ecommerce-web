export enum OrderStatus {
    PENDING_PAYMENT = "PENDING_PAYMENT",
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
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
    KM = "KHR",
    EN = "USD"
}

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];