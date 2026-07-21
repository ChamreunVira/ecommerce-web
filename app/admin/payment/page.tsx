"use client";
import Link from "next/link";
import { ChevronRight, Home, CreditCard, CheckCircle2, Clock, XCircle, DollarSign } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { PaymentStatus } from "@/constant/constant";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { paymentService } from "@/services/payment-service";
import { Payment } from "@/types/payment";
import { Table, Thead, THeading, TBody, TCell } from "@/components/Table";

const statusStyle: Record<Payment["status"], string> = {
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  FAILED: "bg-rose-50 text-rose-700 ring-rose-200",
  EXPIRED: "bg-slate-100 text-slate-600 ring-slate-200",
};

export default function PaymentPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const totalRevenue = payments.filter(p => p.status === "PAID").reduce((a, p) => a + p.amount, 0);
  const pending = payments.filter(p => p.status === "PENDING").length;
  const failed = payments.filter(p => p.status === "FAILED").length;
  const completed = payments.filter(p => p.status === "PAID").length;

  const handleFetchPayments = async () => {
    try {
      const response = await paymentService.getAll();
      if (response.success) {
        setPayments(response.data);
      }
    }catch(err: any) {
      toast.error("Failed to fetch payments. Please try again later.");
      console.log("Failed to fetch payments: ", err.message);
    }
  }

  useEffect(() => {
    handleFetchPayments();
    return () => new AbortController().abort();
  } , []); 

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-slate-800 transition-colors"><Home size={14} /></Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium text-slate-700">Payments</span>
      </nav>

      <div>
        <h1 className="text-2xl font-semibold text-slate-950 flex items-center gap-2">
          <CreditCard className="text-indigo-500" size={24} /> Payment Transactions
        </h1>
        <p className="mt-1 text-sm text-slate-500">Monitor all transaction records, statuses, and payment methods.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<DollarSign className="text-indigo-500" />} accent="bg-indigo-50" label="Total Collected" value={`$${totalRevenue.toFixed(0)}`} trend={+5} />
        <StatsCard icon={<CheckCircle2 className="text-emerald-500" />} accent="bg-emerald-50" label="Completed" value={completed} trend={+4} />
        <StatsCard icon={<Clock className="text-amber-500" />} accent="bg-amber-50" label="Pending" value={pending} trend={0} />
        <StatsCard icon={<XCircle className="text-rose-500" />} accent="bg-rose-50" label="Failed" value={failed} trend={-1} />
      </div>

      <div className="rounded-md bg-white ring-slate-200 overflow-hidden">
        <Table>
          <Thead className="bg-slate-50 text-xs text-slate-500">
            <THeading className="px-5 py-4 font-semibold">Payment ID</THeading>
            <THeading className="px-5 py-4 font-semibold">Order</THeading>
            <THeading className="px-5 py-4 font-semibold">Customer</THeading>
            <THeading className="px-5 py-4 font-semibold">Method</THeading>
            <THeading className="px-5 py-4 font-semibold text-right">Amount</THeading>
            <THeading className="px-5 py-4 font-semibold">Status</THeading>
            <THeading className="px-5 py-4 font-semibold">Date</THeading>
          </Thead>
          <TBody className="divide-y divide-slate-100">
            {payments.map(p => (
              <tr key={p.paymentId} className="hover:bg-slate-50/50 transition-colors">
                <TCell className="px-5 py-4 font-mono text-xs text-slate-500">{"PAY-" + p.paymentId.toString().padStart(4, '0')}</TCell>
                <TCell className="px-5 py-4 font-semibold text-slate-800">{p.orderCode}</TCell>
                <TCell className="px-5 py-4 text-slate-700">{p.customer}</TCell>
                <TCell className="px-5 py-4 text-slate-500">{p.method}</TCell>
                <TCell className="px-5 py-4 text-right font-bold text-slate-900">${p.amount.toFixed(2)}</TCell>
                <TCell className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyle[p.status]}`}>{p.status}</span>
                </TCell>
                <TCell className="px-5 py-4 text-slate-500">{p.updatedAt}</TCell>
              </tr>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
