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

export enum ShipmentStatus {
    PENDING = "PENDING",
    IN_TRANSMIT = "IN_TRANSMIT",
    DELAYED = "DELAYED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
}

export enum Currency {
    KM = "KHR",
    EN = "USD"
}

export enum AuditModule {
  PRODUCT = "PRODUCT",
  ORDER = "ORDER",
  CATEGORY = "CATEGORY",
  USER = "USER",
  CUSTOMER = "CUSTOMER",
  INVENTORY = "INVENTORY",
  SETTING = "SETTING",
  SYSTEM = "SYSTEM"
}

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];