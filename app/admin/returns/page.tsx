"use client";
import Link from "next/link";
import { ChevronRight, Home, RotateCcw, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { Table, Thead, THeading, TBody, TCell } from "@/components/Table";
import { BadgeWithDot } from "@/components/base/badges/badges";

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

const statusMap: Record<Return["status"], { color: "warning" | "blue" | "error" | "success"; label: string }> = {
  Pending: { color: "warning", label: "Pending" },
  Approved: { color: "blue", label: "Approved" },
  Rejected: { color: "error", label: "Rejected" },
  Refunded: { color: "success", label: "Refunded" },
};

export default function ReturnsPage() {
  const pending = mockReturns.filter(r => r.status === "Pending").length;
  const approved = mockReturns.filter(r => r.status === "Approved").length;
  const refunded = mockReturns.filter(r => r.status === "Refunded").length;
  const rejected = mockReturns.filter(r => r.status === "Rejected").length;

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-tertiary">
        <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors"><Home size={14} /></Link>
        <ChevronRight size={14} className="text-quaternary" />
        <span className="font-medium text-primary">Returns & Refunds</span>
      </nav>

      <div>
        <h1 className="text-2xl font-semibold text-primary flex items-center gap-2">
          <RotateCcw className="text-brand-secondary" size={24} /> Returns & Refunds
        </h1>
        <p className="mt-1 text-sm text-tertiary">Manage return requests and issue refunds to customers.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<AlertCircle className="text-amber-500" />} accent="bg-amber-50" label="Pending" value={pending} trend={0} />
        <StatsCard icon={<CheckCircle2 className="text-sky-500" />} accent="bg-sky-50" label="Approved" value={approved} trend={+1} />
        <StatsCard icon={<CheckCircle2 className="text-emerald-500" />} accent="bg-emerald-50" label="Refunded" value={refunded} trend={+1} />
        <StatsCard icon={<XCircle className="text-rose-500" />} accent="bg-rose-50" label="Rejected" value={rejected} trend={0} />
      </div>

      <Table>
        <Thead>
          <THeading>Return ID</THeading>
          <THeading>Order</THeading>
          <THeading>Customer</THeading>
          <THeading>Product</THeading>
          <THeading>Reason</THeading>
          <THeading className="text-right">Amount</THeading>
          <THeading>Status</THeading>
          <THeading>Date</THeading>
        </Thead>
        <TBody>
          {mockReturns.map(r => {
            const st = statusMap[r.status] ?? statusMap.Pending;
            return (
              <tr key={r.id} className="hover:bg-secondary transition-colors">
                <TCell className="font-mono text-xs font-semibold text-primary">{r.id}</TCell>
                <TCell className="font-semibold text-primary font-mono">{r.orderCode}</TCell>
                <TCell className="text-primary">{r.customer}</TCell>
                <TCell className="text-secondary max-w-[180px] truncate">{r.product}</TCell>
                <TCell className="text-tertiary italic text-xs max-w-[180px] truncate">{r.reason}</TCell>
                <TCell className="text-right font-semibold text-primary font-mono">${r.amount.toFixed(2)}</TCell>
                <TCell>
                  <BadgeWithDot type="pill-color" color={st.color} size="sm">
                    {st.label}
                  </BadgeWithDot>
                </TCell>
                <TCell className="text-tertiary">{r.requestedAt}</TCell>
              </tr>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
}

