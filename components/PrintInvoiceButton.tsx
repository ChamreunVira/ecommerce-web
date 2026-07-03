"use client";
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';
import { Order } from '@/types/order';
import { OrderReceipt } from './OrderReceipt';

export const PrintInvoiceButton = ({ order }: { order: Order }) => {
  const componentRef = useRef(null);
  
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice_${order.orderCode}`,
  });

  return (
    <>
      <button 
        onClick={(e) => { e.preventDefault(); handlePrint(); }}
        className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-orange-100 hover:text-orange-600"
        title="Print Invoice"
      >
        <Printer size={15} />
      </button>
      <div className="hidden">
        <OrderReceipt ref={componentRef} order={order} />
      </div>
    </>
  );
};
