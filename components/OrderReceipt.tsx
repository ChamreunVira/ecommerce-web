import React, { forwardRef } from 'react';
import { Order } from '@/types/order';

interface Props {
  order: Order;
}

export const OrderReceipt = forwardRef<HTMLDivElement, Props>(({ order }, ref) => {
  return (
    <div ref={ref} className="p-10 bg-white text-slate-900 mx-auto max-w-[800px] font-sans">
      <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">INVOICE</h1>
          <p className="mt-2 text-sm text-slate-500">#{order.orderCode}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-orange-600">vSt4reKH</h2>
          <p className="text-sm text-slate-500 mt-1">167st, BSL Toulkork Phnom Penh</p>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-900">Billed To:</h3>
          <div className="mt-2 text-sm text-slate-600">
            <p className="font-semibold">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.addressLine}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.province} {order.shippingAddress?.country}</p>
            <p className="mt-1 text-slate-500">{order.shippingAddress?.phone}</p>
          </div>
        </div>
        <div className="text-right">
          <h3 className="text-sm font-medium text-slate-900">Payment Details:</h3>
          <div className="mt-2 text-sm text-slate-600">
            <p><span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><span className="font-semibold">Status:</span> {order.status}</p>
            <p><span className="font-semibold">Method:</span> {order.paymentMethod}</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <table className="w-full text-left text-sm text-slate-600 border-collapse">
          <thead>
            <tr className="border-b border-slate-200 uppercase text-xs font-semibold text-slate-900">
              <th className="py-3 px-2">Item</th>
              <th className="py-3 px-2 text-center">Qty</th>
              <th className="py-3 px-2 text-right">Price</th>
              <th className="py-3 px-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.orderItems?.map(item => (
              <tr key={item.orderItemId || item.productId}>
                <td className="py-4 px-2 font-medium text-slate-900">{item.productName}</td>
                <td className="py-4 px-2 text-center">{item.quantity}</td>
                <td className="py-4 px-2 text-right">${item.finalPrice?.toFixed(2) ?? item.unitPrice?.toFixed(2)}</td>
                <td className="py-4 px-2 text-right font-semibold">${item.subtotal?.toFixed(2) ?? (item.finalPrice * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 flex justify-end">
        <div className="w-64 text-sm text-slate-600">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span>Subtotal</span>
            <span>${order.subtotal?.toFixed(2) ?? 0}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span>Shipping</span>
            <span>${order.shippingFee?.toFixed(2) ?? 0}</span>
          </div>
          <div className="flex justify-between py-3 text-lg font-bold text-slate-900">
            <span>Total</span>
            <span>${order.totalAmount?.toFixed(2) ?? 0}</span>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center text-xs text-slate-400">
        <p>Thank you for shopping with us!</p>
      </div>
    </div>
  );
});

OrderReceipt.displayName = 'OrderReceipt';
