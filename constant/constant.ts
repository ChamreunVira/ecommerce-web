export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  KHQR_BAKONG = 'KHQR_BAKONG',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  REFUNDED = 'REFUNDED',
}

export enum ShipmentStatus {
  PENDING = 'PENDING',
  IN_TRANSMIT = 'IN_TRANSMIT',
  DELAYED = 'DELAYED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum Currency {
  KM = 'KHR',
  EN = 'USD',
}

export enum AuditModule {
  PRODUCT = 'PRODUCT',
  ORDER = 'ORDER',
  CATEGORY = 'CATEGORY',
  USER = 'USER',
  CUSTOMER = 'CUSTOMER',
  INVENTORY = 'INVENTORY',
  SETTING = 'SETTING',
  SYSTEM = 'SYSTEM',
}

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
