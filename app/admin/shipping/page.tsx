"use client";
import Link from "next/link";
import { ChevronRight, Home, Truck, Package, CheckCircle2, Clock } from "lucide-react";
import StatsCard from "@/components/StatsCard";

type Shipment = {
  id: string;
  orderCode: string;
  customer: string;
  carrier: string;
  trackingNumber: string;
  destination: string;
  status: "Dispatched" | "In Transit" | "Delivered" | "Delayed";
  estimatedDelivery: string;
};

const mockShipments: Shipment[] = [
  { id: "SHP-5001", orderCode: "ORD-10041", customer: "Virak Chamreun", carrier: "J&T Express", trackingNumber: "JT123456789KH", destination: "Phnom Penh", status: "In Transit", estimatedDelivery: "2026-07-05" },
  { id: "SHP-5002", orderCode: "ORD-10040", customer: "Socheata Lim", carrier: "Kerry Express", trackingNumber: "KE987654321KH", destination: "Siem Reap", status: "Delivered", estimatedDelivery: "2026-07-03" },
  { id: "SHP-5003", orderCode: "ORD-10039", customer: "Dara Pich", carrier: "DHL Express", trackingNumber: "DH001122334KH", destination: "Battambang", status: "Dispatched", estimatedDelivery: "2026-07-06" },
  { id: "SHP-5004", orderCode: "ORD-10038", customer: "Bopha Keo", carrier: "J&T Express", trackingNumber: "JT556677889KH", destination: "Kampot", status: "Delayed", estimatedDelivery: "2026-07-05" },
  { id: "SHP-5005", orderCode: "ORD-10037", customer: "Rathana Mao", carrier: "Kerry Express", trackingNumber: "KE112233445KH", destination: "Phnom Penh", status: "Delivered", estimatedDelivery: "2026-07-01" },
  { id: "SHP-5006", orderCode: "ORD-10036", customer: "Kunthea Chhun", carrier: "DHL Express", trackingNumber: "DH998877665KH", destination: "Kandal", status: "In Transit", estimatedDelivery: "2026-07-07" },
];

const statusStyle: Record<Shipment["status"], string> = {
  Dispatched: "bg-sky-50 text-sky-700 ring-sky-200",
  "In Transit": "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Delayed: "bg-rose-50 text-rose-700 ring-rose-200",
};

export default function ShippingPage() {
  const inTransit = mockShipments.filter(s => s.status === "In Transit").length;
  const delivered = mockShipments.filter(s => s.status === "Delivered").length;
  const dispatched = mockShipments.filter(s => s.status === "Dispatched").length;
  const delayed = mockShipments.filter(s => s.status === "Delayed").length;

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-slate-800 transition-colors"><Home size={14} /></Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium text-slate-700">Shipping</span>
      </nav>

      <div>
        <h1 className="text-2xl font-semibold text-slate-950 flex items-center gap-2">
          <Truck className="text-orange-500" size={24} /> Shipment Tracking
        </h1>
        <p className="mt-1 text-sm text-slate-500">View all active shipments, carriers, and delivery statuses.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<Package className="text-orange-500" />} accent="bg-orange-50" label="Dispatched" value={dispatched} trend={+2} />
        <StatsCard icon={<Truck className="text-indigo-500" />} accent="bg-indigo-50" label="In Transit" value={inTransit} trend={0} />
        <StatsCard icon={<CheckCircle2 className="text-emerald-500" />} accent="bg-emerald-50" label="Delivered" value={delivered} trend={+5} />
        <StatsCard icon={<Clock className="text-rose-500" />} accent="bg-rose-50" label="Delayed" value={delayed} trend={-1} />
      </div>

      <div className="rounded-lg bg-white shadow-sm ring-1 ring-slate-200 overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Shipment ID</th>
              <th className="px-5 py-4 font-semibold">Order</th>
              <th className="px-5 py-4 font-semibold">Customer</th>
              <th className="px-5 py-4 font-semibold">Carrier</th>
              <th className="px-5 py-4 font-semibold">Tracking No.</th>
              <th className="px-5 py-4 font-semibold">Destination</th>
              <th className="px-5 py-4 font-semibold">Est. Delivery</th>
              <th className="px-5 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockShipments.map(s => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4 font-mono text-xs text-slate-500">{s.id}</td>
                <td className="px-5 py-4 font-semibold text-slate-800">{s.orderCode}</td>
                <td className="px-5 py-4 text-slate-700">{s.customer}</td>
                <td className="px-5 py-4 text-slate-600">{s.carrier}</td>
                <td className="px-5 py-4 font-mono text-xs text-slate-500">{s.trackingNumber}</td>
                <td className="px-5 py-4 text-slate-600">{s.destination}</td>
                <td className="px-5 py-4 text-slate-500">{s.estimatedDelivery}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyle[s.status]}`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
