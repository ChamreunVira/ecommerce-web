"use client";
import Link from "next/link";
import { ChevronRight, Home, Truck, Package, CheckCircle2, Clock } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { useEffect, useState } from "react";
import { shipmentService } from "@/services/shipment-service";
import { Shipment } from "@/types/shipment";
import { Table, Thead, THeading, TBody, TCell } from "@/components/Table";

const statusStyle: Record<Shipment["status"], string> = {
  PENDING: "bg-sky-50 text-sky-700 ring-sky-200",
  IN_TRANSIT: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  CANCELLED: "bg-rose-50 text-rose-700 ring-rose-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  DELAYED: "bg-rose-50 text-rose-700 ring-rose-200",
};

export default function ShippingPage() {
  const [shipments , setShipments] = useState<Shipment[]>([]);
  const inTransit = shipments?.filter(s => s.status === "IN_TRANSIT").length ?? 0;
  const delivered = shipments?.filter(s => s.status === "DELIVERED").length ?? 0;
  const dispatched = shipments?.filter(s => s.status === "PENDING").length ?? 0;
  const delayed = shipments?.filter(s => s.status === "DELAYED").length ?? 0;

  const handleFetchShipments = async () => {
    try {
      const response = await shipmentService.getAll();
      if(response.success) {
        setShipments(response.data);
      }
    }catch(e: any) {
      console.log("Error fetching shipments: ", e.message);
    }
  }

  useEffect(() => {
    handleFetchShipments();
    return () => new AbortController().abort();
  } , []);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-slate-800 transition-colors"><Home size={14} /></Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="font-medium text-slate-700">Shipping</span>
      </nav>

      <div>
        <h1 className="text-2xl font-semibold text-slate-950 flex items-center gap-2">
          <Truck className="text-indigo-500" size={24} /> Shipment Tracking
        </h1>
        <p className="mt-1 text-sm text-slate-500">View all active shipments, carriers, and delivery statuses.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<Package className="text-indigo-500" />} accent="bg-indigo-50" label="Dispatched" value={dispatched} trend={+2} />
        <StatsCard icon={<Truck className="text-indigo-500" />} accent="bg-indigo-50" label="In Transit" value={inTransit} trend={0} />
        <StatsCard icon={<CheckCircle2 className="text-emerald-500" />} accent="bg-emerald-50" label="Delivered" value={delivered} trend={+5} />
        <StatsCard icon={<Clock className="text-rose-500" />} accent="bg-rose-50" label="Delayed" value={delayed} trend={-1} />
      </div>

      <div className="rounded-lg bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <Table>
          <Thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <THeading className="px-5 py-4 font-semibold">Shipment ID</THeading>
            <THeading className="px-5 py-4 font-semibold">Order</THeading>
            <THeading className="px-5 py-4 font-semibold">Customer</THeading>
            <THeading className="px-5 py-4 font-semibold">Carrier</THeading>
            <THeading className="px-5 py-4 font-semibold">Tracking No.</THeading>
            <THeading className="px-5 py-4 font-semibold">Destination</THeading>
            <THeading className="px-5 py-4 font-semibold">Est. Delivery</THeading>
            <THeading className="px-5 py-4 font-semibold">Status</THeading>
          </Thead>
          <TBody className="divide-y divide-slate-100">
            {shipments?.map(s => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <TCell className="px-5 py-4 font-mono text-xs text-slate-500">{s.code}</TCell>
                <TCell className="px-5 py-4 font-semibold text-slate-800">{s.orderCode}</TCell>
                <TCell className="px-5 py-4 text-slate-700">{s.customer}</TCell>
                <TCell className="px-5 py-4 text-slate-600">{s.carrier}</TCell>
                <TCell className="px-5 py-4 font-mono text-xs text-slate-500">{s.trackingNumber}</TCell>
                <TCell className="px-5 py-4 text-slate-600">{s.destination}</TCell>
                <TCell className="px-5 py-4 text-slate-500">{s.estimatedDelivery}</TCell>
                <TCell className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyle[s.status]}`}>{s.status}</span>
                </TCell>
              </tr>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
