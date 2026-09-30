export type Currency = "USD" | "KHR";

export interface StoreSetting {
  id: number;
  name: string;
  supportEmail: string;
  phone: string;
  address: string;
  currency: Currency;
  timeZone: string;
  lowStockAlert: number;
  freeShippingMinimum: number;
  taxRate: number;
  notificationNewOrders: boolean;
  notificationLowStock: boolean;
  notificationWeeklyReport: boolean;
  paymentCod: boolean;
  paymentKhqr: boolean;
  paymentCard: boolean;
}

export type StoreSettingRequest = Omit<StoreSetting, "id">;
