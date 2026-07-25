"use client";
import Link from "next/link";
import { ChevronRight, Home, Truck, Package, CheckCircle2, Clock, Plus } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { useEffect, useState } from "react";
import { shipmentService } from "@/services/shipment-service";
import { Shipment } from "@/types/shipment";
import { Table, Thead, THeading, TBody, TCell } from "@/components/Table";
import ShipmentModal from "@/components/ShipmentModal";
import { BadgeWithDot } from "@/components/base/badges/badges";

const statusMap: Record<Shipment["status"], { color: "blue" | "indigo" | "error" | "success" | "warning"; label: string }> = {
  PENDING: { color: "blue", label: "Pending" },
  IN_TRANSMIT: { color: "indigo", label: "In Transit" },
  CANCELLED: { color: "error", label: "Cancelled" },
  DELIVERED: { color: "success", label: "Delivered" },
  DELAYED: { color: "warning", label: "Delayed" },
};

export default function ShippingPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const inTransit = shipments?.filter(s => s.status === "IN_TRANSMIT").length ?? 0;
  const delivered = shipments?.filter(s => s.status === "DELIVERED").length ?? 0;
  const dispatched = shipments?.filter(s => s.status === "PENDING").length ?? 0;
  const delayed = shipments?.filter(s => s.status === "DELAYED").length ?? 0;

  const handleFetchShipments = async () => {
    try {
      const response = await shipmentService.getAll();
      if (response.success) {
        setShipments(response.data);
      }
    } catch (e: any) {
      console.log("Error fetching shipments: ", e.message);
    }
  };

  useEffect(() => {
    handleFetchShipments();
    return () => new AbortController().abort();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-tertiary">
        <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors"><Home size={14} /></Link>
        <ChevronRight size={14} className="text-quaternary" />
        <span className="font-medium text-primary">Shipping</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <Truck className="text-brand-secondary" size={24} /> Shipment Tracking
          </h1>
          <p className="mt-1 text-sm text-tertiary">View all active shipments, carriers, and delivery statuses.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-brand-primary_hover"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<Package className="text-indigo-500" />} accent="bg-indigo-50" label="Dispatched" value={dispatched} trend={+2} />
        <StatsCard icon={<Truck className="text-indigo-500" />} accent="bg-indigo-50" label="In Transit" value={inTransit} trend={0} />
        <StatsCard icon={<CheckCircle2 className="text-emerald-500" />} accent="bg-emerald-50" label="Delivered" value={delivered} trend={+5} />
        <StatsCard icon={<Clock className="text-rose-500" />} accent="bg-rose-50" label="Delayed" value={delayed} trend={-1} />
      </div>

      <Table>
        <Thead>
          <THeading>Shipment ID</THeading>
          <THeading>Order</THeading>
          <THeading>Customer</THeading>
          <THeading>Carrier</THeading>
          <THeading>Tracking No.</THeading>
          <THeading>Destination</THeading>
          <THeading>Est. Delivery</THeading>
          <THeading>Status</THeading>
        </Thead>
        <TBody>
          {shipments?.map(s => {
            const st = statusMap[s.status] ?? statusMap.PENDING;
            return (
              <tr key={s.id} className="hover:bg-secondary transition-colors">
                <TCell className="font-mono text-xs font-semibold text-primary">{s.code}</TCell>
                <TCell className="font-semibold text-primary font-mono">{s.orderCode}</TCell>
                <TCell className="text-primary">{s.customer}</TCell>
                <TCell className="text-tertiary">{s.carrier}</TCell>
                <TCell className="font-mono text-xs text-tertiary">{s.trackingNumber}</TCell>
                <TCell className="text-tertiary">{s.destination}</TCell>
                <TCell className="text-tertiary">{s.estimatedDelivery}</TCell>
                <TCell>
                  <BadgeWithDot type="pill-color" color={st.color} size="sm">
                    {st.label}
                  </BadgeWithDot>
                </TCell>
              </tr>
            );
          })}
        </TBody>
      </Table>

      {isModalOpen && (<ShipmentModal handleCloseAction={() => setIsModalOpen(!isModalOpen)} onCreateSuccessAction={() => { }} />)}

    </div>
  );
}

