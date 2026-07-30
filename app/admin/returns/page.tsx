"use client";

import Link from "next/link";
import { ChevronRight, Home, RotateCcw, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { Table, TableCard } from "@/components/application/table/table";
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
  const pending = mockReturns.filter((r) => r.status === "Pending").length;
  const approved = mockReturns.filter((r) => r.status === "Approved").length;
  const refunded = mockReturns.filter((r) => r.status === "Refunded").length;
  const rejected = mockReturns.filter((r) => r.status === "Rejected").length;

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-tertiary">
        <Link href="/admin/dashboard" className="flex items-center gap-1 transition-colors hover:text-primary">
          <Home size={14} />
        </Link>
        <ChevronRight size={14} className="text-quaternary" />
        <span className="font-medium text-primary">Returns & Refunds</span>
      </nav>

      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-primary">
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

      <TableCard.Root>
        <Table aria-label="Returns table">
          <Table.Header>
            <Table.Head id="id" label="Return ID" isRowHeader allowsSorting />
            <Table.Head id="order" label="Order" allowsSorting />
            <Table.Head id="customer" label="Customer" allowsSorting />
            <Table.Head id="product" label="Product" />
            <Table.Head id="reason" label="Reason" />
            <Table.Head id="amount" label="Amount" allowsSorting />
            <Table.Head id="status" label="Status" />
            <Table.Head id="date" label="Date" allowsSorting />
          </Table.Header>

          <Table.Body items={mockReturns}>
            {(r) => {
              const st = statusMap[r.status] ?? statusMap.Pending;
              return (
                <Table.Row id={r.id}>
                  <Table.Cell className="font-mono text-xs font-semibold text-primary">{r.id}</Table.Cell>
                  <Table.Cell className="font-mono font-semibold text-primary">{r.orderCode}</Table.Cell>
                  <Table.Cell className="text-primary">{r.customer}</Table.Cell>
                  <Table.Cell className="max-w-45 truncate text-secondary">{r.product}</Table.Cell>
                  <Table.Cell className="max-w-45 truncate text-xs italic text-tertiary">{r.reason}</Table.Cell>
                  <Table.Cell className="font-mono font-semibold text-primary">${r.amount.toFixed(2)}</Table.Cell>
                  <Table.Cell>
                    <BadgeWithDot type="pill-color" color={st.color} size="sm">
                      {st.label}
                    </BadgeWithDot>
                  </Table.Cell>
                  <Table.Cell className="text-tertiary">{r.requestedAt}</Table.Cell>
                </Table.Row>
              );
            }}
          </Table.Body>
        </Table>

        {mockReturns.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary bg-secondary text-tertiary">
              <RotateCcw className="size-5" />
            </div>
            <p className="text-sm font-semibold text-primary">No return requests</p>
            <p className="text-xs text-tertiary">Customer return requests will appear here.</p>
          </div>
        )}

        <div className="flex items-center border-t border-secondary bg-primary px-6 py-3.5">
          <span className="text-xs text-tertiary">
            Showing <span className="font-semibold text-primary">{mockReturns.length}</span> {mockReturns.length !== 1 ? "returns" : "return"}
          </span>
        </div>
      </TableCard.Root>
    </div>
  );
}
