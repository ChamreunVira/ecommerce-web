'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronRight, Home, CreditCard, CheckCircle2, Clock, XCircle, DollarSign, Loader2 } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { toast } from 'react-toastify';
import { paymentService } from '@/services/payment-service';
import { Payment } from '@/types/payment';
import { PaymentStatus } from '@/constant/constant';
import { Table, TableCard } from '@/components/application/table/table';

const statusMap: Record<Payment['status'], { color: 'success' | 'warning' | 'error' | 'gray'; label: string }> = {
  PAID: { color: 'success', label: 'Paid' },
  UNPAID: { color: 'gray', label: 'Unpaid' },
  PENDING: { color: 'warning', label: 'Pending' },
  PROCESSING: { color: 'warning', label: 'Processing' },
  FAILED: { color: 'error', label: 'Failed' },
  EXPIRED: { color: 'gray', label: 'Expired' },
  PARTIALLY_REFUNDED: { color: 'warning', label: 'Partially refunded' },
  REFUNDED: { color: 'gray', label: 'Refunded' },
};

export default function PaymentPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [updatingPaymentId, setUpdatingPaymentId] = useState<number | null>(null);
  const totalRevenue = payments.filter((p) => p.status === 'PAID').reduce((a, p) => a + p.amount, 0);
  const pending = payments.filter((p) => p.status === 'PENDING').length;
  const failed = payments.filter((p) => p.status === 'FAILED').length;
  const completed = payments.filter((p) => p.status === 'PAID').length;

  const handleFetchPayments = async () => {
    try {
      const response = await paymentService.getAll();
      if (response.success) {
        setPayments(response.data);
      }
    } catch (err: any) {
      toast.error('Failed to fetch payments. Please try again later.');
      console.log('Failed to fetch payments: ', err.message);
    }
  };

  useEffect(() => {
    handleFetchPayments();
    return () => new AbortController().abort();
  }, []);

  const handleStatusChange = async (payment: Payment, status: PaymentStatus) => {
    if (payment.status === status) return;

    setUpdatingPaymentId(payment.paymentId);
    setPayments((current) =>
      current.map((item) => (item.paymentId === payment.paymentId ? { ...item, status } : item)),
    );

    try {
      const response = await paymentService.updateStatus(payment.paymentId, status);
      if (response.success) {
        setPayments((current) => current.map((item) => (item.paymentId === payment.paymentId ? response.data : item)));
        toast.success('Payment status updated successfully.');
      } else {
        throw new Error('Payment status update failed');
      }
    } catch (err: any) {
      setPayments((current) => current.map((item) => (item.paymentId === payment.paymentId ? payment : item)));
      toast.error(err?.response?.data?.message || 'Failed to update payment status.');
    } finally {
      setUpdatingPaymentId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-tertiary">
        <Link href="/admin/dashboard" className="flex items-center gap-1 transition-colors hover:text-primary">
          <Home size={14} />
        </Link>
        <ChevronRight size={14} className="text-quaternary" />
        <span className="font-medium text-primary">Payments</span>
      </nav>

      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-primary">
          <CreditCard className="text-brand-secondary" size={24} /> Payment Transactions
        </h1>
        <p className="mt-1 text-sm text-tertiary">Monitor all transaction records, statuses, and payment methods.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard
          icon={<DollarSign className="text-indigo-500" />}
          accent="bg-indigo-50"
          label="Total Collected"
          value={`$${totalRevenue.toFixed(0)}`}
          trend={+5}
        />
        <StatsCard
          icon={<CheckCircle2 className="text-emerald-500" />}
          accent="bg-emerald-50"
          label="Completed"
          value={completed}
          trend={+4}
        />
        <StatsCard
          icon={<Clock className="text-amber-500" />}
          accent="bg-amber-50"
          label="Pending"
          value={pending}
          trend={0}
        />
        <StatsCard
          icon={<XCircle className="text-rose-500" />}
          accent="bg-rose-50"
          label="Failed"
          value={failed}
          trend={-1}
        />
      </div>

      <TableCard.Root>
        <Table aria-label="Payments table">
          <Table.Header>
            <Table.Head id="id" label="Payment ID" isRowHeader allowsSorting />
            <Table.Head id="order" label="Order" allowsSorting />
            <Table.Head id="customer" label="Customer" allowsSorting />
            <Table.Head id="method" label="Method" />
            <Table.Head id="amount" label="Amount" allowsSorting />
            <Table.Head id="status" label="Status" />
            <Table.Head id="date" label="Date" allowsSorting />
          </Table.Header>

          <Table.Body items={payments}>
            {(p) => {
              const st = statusMap[p.status] ?? statusMap.PENDING;
              return (
                <Table.Row id={p.paymentId}>
                  <Table.Cell className="font-mono text-xs font-semibold text-primary">
                    {'PAY-' + p.paymentId.toString().padStart(4, '0')}
                  </Table.Cell>
                  <Table.Cell className="font-mono font-semibold text-primary">{p.orderCode}</Table.Cell>
                  <Table.Cell className="text-primary">{p.customer}</Table.Cell>
                  <Table.Cell className="text-tertiary">{p.method}</Table.Cell>
                  <Table.Cell className="font-mono font-semibold text-primary">${p.amount.toFixed(2)}</Table.Cell>
                  <Table.Cell>
                    <div className="relative inline-flex items-center">
                      <select
                        value={p.status}
                        onChange={(event) => handleStatusChange(p, event.target.value as PaymentStatus)}
                        disabled={updatingPaymentId === p.paymentId}
                        aria-label={`Update status for payment ${p.paymentId}`}
                        className={`rounded-md border border-secondary bg-primary py-1.5 pl-2 pr-7 text-xs font-semibold outline-none transition focus:border-indigo-500 disabled:cursor-wait disabled:opacity-60 ${
                          st.color === 'success'
                            ? 'text-emerald-700'
                            : st.color === 'error'
                              ? 'text-rose-700'
                              : st.color === 'warning'
                                ? 'text-amber-700'
                                : 'text-slate-600'
                        }`}
                      >
                        {Object.values(PaymentStatus).map((status) => (
                          <option key={status} value={status}>
                            {status.replaceAll('_', ' ')}
                          </option>
                        ))}
                      </select>
                      {updatingPaymentId === p.paymentId && (
                        <Loader2
                          size={13}
                          className="pointer-events-none absolute right-2 animate-spin text-tertiary"
                        />
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-tertiary">{p.updatedAt}</Table.Cell>
                </Table.Row>
              );
            }}
          </Table.Body>
        </Table>

        {payments.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary bg-secondary text-tertiary">
              <CreditCard className="size-5" />
            </div>
            <p className="text-sm font-semibold text-primary">No payment transactions</p>
            <p className="text-xs text-tertiary">Transactions will appear here automatically.</p>
          </div>
        )}

        <div className="flex items-center border-t border-secondary bg-primary px-6 py-3.5">
          <span className="text-xs text-tertiary">
            Showing <span className="font-semibold text-primary">{payments.length}</span>{' '}
            {payments.length !== 1 ? 'payments' : 'payment'}
          </span>
        </div>
      </TableCard.Root>
    </div>
  );
}
