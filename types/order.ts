import { OrderStatus, PaymentMethod } from '@/constant/constant';
import { ShippingAddress } from './shipping-address';
import { OrderItem } from './order-item';
import { PaymentSummary } from './payment-sumary';

export interface Order {
  orderId: number;
  orderCode: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingFee: number;
  carrierId?: number | null;
  carrierName?: string | null;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  note: string;
  trackingNumber: string;
  orderItems: OrderItem[];
  paymentSummary: PaymentSummary | null;
  cancelReason?: string | null;
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
  cancelledAt: string;
}

export interface OrderStatusHistory {
  previousStatus: OrderStatus | null;
  newStatus: OrderStatus;
  changedBy: string | null;
  reason: string | null;
  createdAt: string;
}

export type RecentOrder = Pick<Order, 'orderId' | 'orderCode' | 'status' | 'totalAmount'> & {
  fullName: string;
  createdDate: string;
};
