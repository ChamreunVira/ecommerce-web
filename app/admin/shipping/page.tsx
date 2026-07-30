"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Home, Truck, Package, CheckCircle2, Clock, Plus } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { shipmentService } from "@/services/shipment-service";
import { Shipment } from "@/types/shipment";
import { Table, TableCard } from "@/components/application/table/table";
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

  const inTransit = shipments?.filter((s) => s.status === "IN_TRANSMIT").length ?? 0;
  const delivered = shipments?.filter((s) => s.status === "DELIVERED").length ?? 0;
  const dispatched = shipments?.filter((s) => s.status === "PENDING").length ?? 0;
  const delayed = shipments?.filter((s) => s.status === "DELAYED").length ?? 0;

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
        <Link href="/admin/dashboard" className="flex items-center gap-1 transition-colors hover:text-primary">
          <Home size={14} />
        </Link>
        <ChevronRight size={14} className="text-quaternary" />
        <span className="font-medium text-primary">Shipping</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-primary">
            <Truck className="text-brand-secondary" size={24} /> Shipment Tracking
          </h1>
          <p className="mt-1 text-sm text-tertiary">View all active shipments, carriers, and delivery statuses.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-brand-primary_hover"
        >
          <Plus size={16} />
          New Shipment
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<Package className="text-indigo-500" />} accent="bg-indigo-50" label="Dispatched" value={dispatched} trend={+2} />
        <StatsCard icon={<Truck className="text-indigo-500" />} accent="bg-indigo-50" label="In Transit" value={inTransit} trend={0} />
        <StatsCard icon={<CheckCircle2 className="text-emerald-500" />} accent="bg-emerald-50" label="Delivered" value={delivered} trend={+5} />
        <StatsCard icon={<Clock className="text-rose-500" />} accent="bg-rose-50" label="Delayed" value={delayed} trend={-1} />
      </div>

      <TableCard.Root>
        <Table aria-label="Shipments table">
          <Table.Header>
            <Table.Head id="code" label="Shipment ID" isRowHeader allowsSorting />
            <Table.Head id="order" label="Order" allowsSorting />
            <Table.Head id="customer" label="Customer" allowsSorting />
            <Table.Head id="carrier" label="Carrier" />
            <Table.Head id="tracking" label="Tracking No." />
            <Table.Head id="destination" label="Destination" />
            <Table.Head id="estDelivery" label="Est. Delivery" allowsSorting />
            <Table.Head id="status" label="Status" />
          </Table.Header>

          <Table.Body items={shipments}>
            {(s) => {
              const st = statusMap[s.status] ?? statusMap.PENDING;
              return (
                <Table.Row id={s.id}>
                  <Table.Cell className="font-mono text-xs font-semibold text-primary">{s.code}</Table.Cell>
                  <Table.Cell className="font-mono font-semibold text-primary">{s.orderCode}</Table.Cell>
                  <Table.Cell className="text-primary">{s.customer}</Table.Cell>
                  <Table.Cell className="text-tertiary">{s.carrier}</Table.Cell>
                  <Table.Cell className="font-mono text-xs text-tertiary">{s.trackingNumber}</Table.Cell>
                  <Table.Cell className="text-tertiary">{s.destination}</Table.Cell>
                  <Table.Cell className="text-tertiary">{s.estimatedDelivery}</Table.Cell>
                  <Table.Cell>
                    <BadgeWithDot type="pill-color" color={st.color} size="sm">
                      {st.label}
                    </BadgeWithDot>
                  </Table.Cell>
                </Table.Row>
              );
            }}
          </Table.Body>
        </Table>

        {shipments.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary bg-secondary text-tertiary">
              <Truck className="size-5" />
            </div>
            <p className="text-sm font-semibold text-primary">No active shipments</p>
            <p className="text-xs text-tertiary">Shipment records will appear here once dispatched.</p>
          </div>
        )}

        <div className="flex items-center border-t border-secondary bg-primary px-6 py-3.5">
          <span className="text-xs text-tertiary">
            Showing <span className="font-semibold text-primary">{shipments.length}</span> {shipments.length !== 1 ? "shipments" : "shipment"}
          </span>
        </div>
      </TableCard.Root>

      {isModalOpen && (<ShipmentModal handleCloseAction={() => setIsModalOpen(!isModalOpen)} onCreateSuccessAction={() => { }} />)}
    </div>
  );
}
