"use client";
import Link from "next/link";
import { ChevronRight, Home, CreditCard, CheckCircle2, Clock, XCircle, DollarSign } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { paymentService } from "@/services/payment-service";
import { Payment } from "@/types/payment";
import { Table, Thead, THeading, TBody, TCell } from "@/components/Table";
import { BadgeWithDot } from "@/components/base/badges/badges";

const statusMap: Record<Payment["status"], { color: "success" | "warning" | "error" | "gray"; label: string }> = {
  PAID: { color: "success", label: "Paid" },
  PENDING: { color: "warning", label: "Pending" },
  FAILED: { color: "error", label: "Failed" },
  EXPIRED: { color: "gray", label: "Expired" },
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
    } catch (err: any) {
      toast.error("Failed to fetch payments. Please try again later.");
      console.log("Failed to fetch payments: ", err.message);
    }
  };

  useEffect(() => {
    handleFetchPayments();
    return () => new AbortController().abort();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-tertiary">
        <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors">
          <Home size={14} />
        </Link>
        <ChevronRight size={14} className="text-quaternary" />
        <span className="font-medium text-primary">Payments</span>
      </nav>

      <div>
        <h1 className="text-2xl font-semibold text-primary flex items-center gap-2">
          <CreditCard className="text-brand-secondary" size={24} /> Payment Transactions
        </h1>
        <p className="mt-1 text-sm text-tertiary">Monitor all transaction records, statuses, and payment methods.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<DollarSign className="text-indigo-500" />} accent="bg-indigo-50" label="Total Collected" value={`$${totalRevenue.toFixed(0)}`} trend={+5} />
        <StatsCard icon={<CheckCircle2 className="text-emerald-500" />} accent="bg-emerald-50" label="Completed" value={completed} trend={+4} />
        <StatsCard icon={<Clock className="text-amber-500" />} accent="bg-amber-50" label="Pending" value={pending} trend={0} />
        <StatsCard icon={<XCircle className="text-rose-500" />} accent="bg-rose-50" label="Failed" value={failed} trend={-1} />
      </div>

      <Table>
        <Thead>
          <THeading>Payment ID</THeading>
          <THeading>Order</THeading>
          <THeading>Customer</THeading>
          <THeading>Method</THeading>
          <THeading className="text-right">Amount</THeading>
          <THeading>Status</THeading>
          <THeading>Date</THeading>
        </Thead>
        <TBody>
          {payments.map(p => {
            const st = statusMap[p.status] ?? statusMap.PENDING;
            return (
              <tr key={p.paymentId} className="hover:bg-secondary transition-colors">
                <TCell className="font-mono text-xs font-semibold text-primary">{"PAY-" + p.paymentId.toString().padStart(4, '0')}</TCell>
                <TCell className="font-semibold text-primary font-mono">{p.orderCode}</TCell>
                <TCell className="text-primary">{p.customer}</TCell>
                <TCell className="text-tertiary">{p.method}</TCell>
                <TCell className="text-right font-semibold text-primary font-mono">${p.amount.toFixed(2)}</TCell>
                <TCell>
                  <BadgeWithDot type="pill-color" color={st.color} size="sm">
                    {st.label}
                  </BadgeWithDot>
                </TCell>
                <TCell className="text-tertiary">{p.updatedAt}</TCell>
              </tr>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
}

