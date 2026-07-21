"use client";
import Link from "next/link";
import { ChevronRight, Home, RotateCcw, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { Table, Thead, THeading, TBody, TCell } from "@/components/Table";

type Return = {
  id: string;
  orderCode: string;
  customer: string;
  product: string;
  reason: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected" | "Refunded";
  requestedAt: string;
};

const mockReturns: Return[] = [
  { id: "RET-201", orderCode: "ORD-10030", customer: "Virak Chamreun", product: "Wireless Headphones Pro", reason: "Defective product on arrival", amount: 149.99, status: "Pending", requestedAt: "2026-07-02" },
  { id: "RET-200", orderCode: "ORD-10025", customer: "Socheata Lim", product: "Running Shoes X500", reason: "Wrong size received", amount: 59.50, status: "Approved", requestedAt: "2026-07-01" },
  { id: "RET-199", orderCode: "ORD-10018", customer: "Bopha Keo", product: "Mechanical Keyboard RGB", reason: "Not as described", amount: 120.00, status: "Refunded", requestedAt: "2026-06-28" },
  { id: "RET-198", orderCode: "ORD-10015", customer: "Dara Pich", product: "Slim Fit Jeans", reason: "Changed my mind", amount: 45.00, status: "Rejected", requestedAt: "2026-06-25" },
  { id: "RET-197", orderCode: "ORD-10010", customer: "Rathana Mao", product: "USB-C Hub 7-in-1", reason: "Stopped working after 1 week", amount: 79.00, status: "Approved", requestedAt: "2026-06-22" },
];

const statusStyle: Record<Return["status"], string> = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Approved: "bg-sky-50 text-sky-700 ring-sky-200",
  Rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  Refunded: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default function ReturnsPage() {
  const pending = mockReturns.filter(r => r.status === "Pending").length;
  const approved = mockReturns.filter(r => r.status === "Approved").length;
  const refunded = mockReturns.filter(r => r.status === "Refunded").length;
  const rejected = mockReturns.filter(r => r.status === "Rejected").length;

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-slate-800 transition-colors"><Home size={14} /></Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium text-slate-700">Returns & Refunds</span>
      </nav>

      <div>
        <h1 className="text-2xl font-semibold text-slate-950 flex items-center gap-2">
          <RotateCcw className="text-indigo-500" size={24} /> Returns & Refunds
        </h1>
        <p className="mt-1 text-sm text-slate-500">Manage return requests and issue refunds to customers.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<AlertCircle className="text-amber-500" />} accent="bg-amber-50" label="Pending" value={pending} trend={0} />
        <StatsCard icon={<CheckCircle2 className="text-sky-500" />} accent="bg-sky-50" label="Approved" value={approved} trend={+1} />
        <StatsCard icon={<CheckCircle2 className="text-emerald-500" />} accent="bg-emerald-50" label="Refunded" value={refunded} trend={+1} />
        <StatsCard icon={<XCircle className="text-rose-500" />} accent="bg-rose-50" label="Rejected" value={rejected} trend={0} />
      </div>

      <div className="rounded-lg bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <Table>
          <Thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <THeading className="px-5 py-4 font-semibold">Return ID</THeading>
            <THeading className="px-5 py-4 font-semibold">Order</THeading>
            <THeading className="px-5 py-4 font-semibold">Customer</THeading>
            <THeading className="px-5 py-4 font-semibold">Product</THeading>
            <THeading className="px-5 py-4 font-semibold">Reason</THeading>
            <THeading className="px-5 py-4 font-semibold text-right">Amount</THeading>
            <THeading className="px-5 py-4 font-semibold">Status</THeading>
            <THeading className="px-5 py-4 font-semibold">Date</THeading>
          </Thead>
          <TBody className="divide-y divide-slate-100">
            {mockReturns.map(r => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                <TCell className="px-5 py-4 font-mono text-xs text-slate-500">{r.id}</TCell>
                <TCell className="px-5 py-4 font-semibold text-slate-800">{r.orderCode}</TCell>
                <TCell className="px-5 py-4 text-slate-700">{r.customer}</TCell>
                <TCell className="px-5 py-4 text-slate-600 max-w-[180px] truncate">{r.product}</TCell>
                <TCell className="px-5 py-4 text-slate-500 italic text-xs max-w-[180px] truncate">{r.reason}</TCell>
                <TCell className="px-5 py-4 text-right font-bold text-slate-900">${r.amount.toFixed(2)}</TCell>
                <TCell className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyle[r.status]}`}>{r.status}</span>
                </TCell>
                <TCell className="px-5 py-4 text-slate-500">{r.requestedAt}</TCell>
              </tr>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
