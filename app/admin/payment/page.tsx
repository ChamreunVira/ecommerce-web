"use client";
import Link from "next/link";
import { ChevronRight, Home, CreditCard, CheckCircle2, Clock, XCircle, DollarSign } from "lucide-react";
import StatsCard from "@/components/StatsCard";

type Payment = {
  id: string;
  orderCode: string;
  customer: string;
  amount: number;
  method: string;
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  date: string;
};

const mockPayments: Payment[] = [
  { id: "PAY-9001", orderCode: "ORD-10041", customer: "Virak Chamreun", amount: 149.99, method: "KHQR", status: "Completed", date: "2026-07-03" },
  { id: "PAY-9002", orderCode: "ORD-10040", customer: "Socheata Lim", amount: 59.50, method: "Credit Card", status: "Completed", date: "2026-07-03" },
  { id: "PAY-9003", orderCode: "ORD-10039", customer: "Dara Pich", amount: 220.00, method: "COD", status: "Pending", date: "2026-07-02" },
  { id: "PAY-9004", orderCode: "ORD-10038", customer: "Bopha Keo", amount: 88.75, method: "Credit Card", status: "Failed", date: "2026-07-02" },
  { id: "PAY-9005", orderCode: "ORD-10037", customer: "Rathana Mao", amount: 310.00, method: "KHQR", status: "Completed", date: "2026-07-01" },
  { id: "PAY-9006", orderCode: "ORD-10036", customer: "Kunthea Chhun", amount: 45.20, method: "COD", status: "Refunded", date: "2026-06-30" },
  { id: "PAY-9007", orderCode: "ORD-10035", customer: "Piseth Nhem", amount: 175.00, method: "Credit Card", status: "Completed", date: "2026-06-30" },
];

const statusStyle: Record<Payment["status"], string> = {
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Failed: "bg-rose-50 text-rose-700 ring-rose-200",
  Refunded: "bg-slate-100 text-slate-600 ring-slate-200",
};

export default function PaymentPage() {
  const totalRevenue = mockPayments.filter(p => p.status === "Completed").reduce((a, p) => a + p.amount, 0);
  const pending = mockPayments.filter(p => p.status === "Pending").length;
  const failed = mockPayments.filter(p => p.status === "Failed").length;
  const completed = mockPayments.filter(p => p.status === "Completed").length;

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-slate-800 transition-colors"><Home size={14} /></Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium text-slate-700">Payments</span>
      </nav>

      <div>
        <h1 className="text-2xl font-semibold text-slate-950 flex items-center gap-2">
          <CreditCard className="text-orange-500" size={24} /> Payment Transactions
        </h1>
        <p className="mt-1 text-sm text-slate-500">Monitor all transaction records, statuses, and payment methods.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<DollarSign className="text-orange-500" />} accent="bg-orange-50" label="Total Collected" value={`$${totalRevenue.toFixed(0)}`} trend={+5} />
        <StatsCard icon={<CheckCircle2 className="text-emerald-500" />} accent="bg-emerald-50" label="Completed" value={completed} trend={+4} />
        <StatsCard icon={<Clock className="text-amber-500" />} accent="bg-amber-50" label="Pending" value={pending} trend={0} />
        <StatsCard icon={<XCircle className="text-rose-500" />} accent="bg-rose-50" label="Failed" value={failed} trend={-1} />
      </div>

      <div className="rounded-lg bg-white shadow-sm ring-1 ring-slate-200 overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Payment ID</th>
              <th className="px-5 py-4 font-semibold">Order</th>
              <th className="px-5 py-4 font-semibold">Customer</th>
              <th className="px-5 py-4 font-semibold">Method</th>
              <th className="px-5 py-4 font-semibold text-right">Amount</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockPayments.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4 font-mono text-xs text-slate-500">{p.id}</td>
                <td className="px-5 py-4 font-semibold text-slate-800">{p.orderCode}</td>
                <td className="px-5 py-4 text-slate-700">{p.customer}</td>
                <td className="px-5 py-4 text-slate-500">{p.method}</td>
                <td className="px-5 py-4 text-right font-bold text-slate-900">${p.amount.toFixed(2)}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyle[p.status]}`}>{p.status}</span>
                </td>
                <td className="px-5 py-4 text-slate-500">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
