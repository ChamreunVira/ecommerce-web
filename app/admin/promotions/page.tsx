"use client";
import Link from "next/link";
import { ChevronRight, Home, Tag, TicketCheck, Percent, Clock, CheckCircle2 } from "lucide-react";
import StatsCard from "@/components/StatsCard";

type Promotion = {
  id: string;
  code: string;
  type: "Percentage" | "Fixed" | "Free Shipping";
  value: number;
  minOrder: number;
  used: number;
  limit: number;
  status: "Active" | "Expired" | "Scheduled";
  expiry: string;
};

const mockPromotions: Promotion[] = [
  { id: "PRO-001", code: "SUMMER20", type: "Percentage", value: 20, minOrder: 50, used: 142, limit: 500, status: "Active", expiry: "2026-08-31" },
  { id: "PRO-002", code: "FLAT10", type: "Fixed", value: 10, minOrder: 30, used: 89, limit: 200, status: "Active", expiry: "2026-07-15" },
  { id: "PRO-003", code: "FREESHIP", type: "Free Shipping", value: 0, minOrder: 20, used: 305, limit: 1000, status: "Active", expiry: "2026-12-31" },
  { id: "PRO-004", code: "FLASH50", type: "Percentage", value: 50, minOrder: 100, used: 500, limit: 500, status: "Expired", expiry: "2026-06-01" },
  { id: "PRO-005", code: "NEWUSER15", type: "Percentage", value: 15, minOrder: 0, used: 0, limit: 300, status: "Scheduled", expiry: "2026-08-01" },
  { id: "PRO-006", code: "WELCOME5", type: "Fixed", value: 5, minOrder: 10, used: 211, limit: 999, status: "Active", expiry: "2026-09-30" },
];

const statusStyle: Record<Promotion["status"], string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Expired: "bg-rose-50 text-rose-700 ring-rose-200",
  Scheduled: "bg-sky-50 text-sky-700 ring-sky-200",
};

export default function PromotionsPage() {
  const active = mockPromotions.filter(p => p.status === "Active").length;
  const expired = mockPromotions.filter(p => p.status === "Expired").length;
  const scheduled = mockPromotions.filter(p => p.status === "Scheduled").length;
  const totalUses = mockPromotions.reduce((sum, p) => sum + p.used, 0);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-slate-800 transition-colors"><Home size={14} /></Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium text-slate-700">Promotions</span>
      </nav>

      <div>
        <h1 className="text-2xl font-semibold text-slate-950 flex items-center gap-2">
          <Tag className="text-orange-500" size={24} /> Promotions & Coupons
        </h1>
        <p className="mt-1 text-sm text-slate-500">Create and manage discount codes, promotional offers, and flash sales.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<TicketCheck className="text-orange-500" />} accent="bg-orange-50" label="Total Uses" value={totalUses} trend={+12} />
        <StatsCard icon={<CheckCircle2 className="text-emerald-500" />} accent="bg-emerald-50" label="Active" value={active} trend={0} />
        <StatsCard icon={<Clock className="text-sky-500" />} accent="bg-sky-50" label="Scheduled" value={scheduled} trend={0} />
        <StatsCard icon={<Percent className="text-rose-500" />} accent="bg-rose-50" label="Expired" value={expired} trend={0} />
      </div>

      <div className="rounded-lg bg-white shadow-sm ring-1 ring-slate-200 overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Code</th>
              <th className="px-5 py-4 font-semibold">Type</th>
              <th className="px-5 py-4 font-semibold text-center">Value</th>
              <th className="px-5 py-4 font-semibold text-center">Min. Order</th>
              <th className="px-5 py-4 font-semibold text-center">Used / Limit</th>
              <th className="px-5 py-4 font-semibold">Expiry</th>
              <th className="px-5 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockPromotions.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4">
                  <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs">{p.code}</span>
                </td>
                <td className="px-5 py-4 text-slate-600">{p.type}</td>
                <td className="px-5 py-4 text-center font-semibold text-slate-900">
                  {p.type === "Percentage" ? `${p.value}%` : p.type === "Fixed" ? `$${p.value}` : "Free"}
                </td>
                <td className="px-5 py-4 text-center text-slate-500">${p.minOrder}</td>
                <td className="px-5 py-4 text-center">
                  <div className="text-sm text-slate-700">{p.used} / {p.limit}</div>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${Math.min((p.used/p.limit)*100, 100)}%` }} />
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-500">{p.expiry}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyle[p.status]}`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
