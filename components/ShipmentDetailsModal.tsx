'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { Icon, type LatLngExpression } from 'leaflet';
import { MapPin, X } from 'lucide-react';
import type { Shipment } from '@/types/shipment';

const MapContainer = dynamic(() => import('react-leaflet').then((module) => module.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((module) => module.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((module) => module.Marker), { ssr: false });

type ShipmentDetailsModalProps = {
  shipment: Shipment;
  onClose: () => void;
};

const PHNOM_PENH: [number, number] = [11.5564, 104.9282];

export default function ShipmentDetailsModal({ shipment, onClose }: ShipmentDetailsModalProps) {
  const hasCoordinates = shipment.latitude != null && shipment.longitude != null;
  const position: [number, number] = hasCoordinates
    ? [shipment.latitude as number, shipment.longitude as number]
    : PHNOM_PENH;
  const markerIcon = useMemo(
    () =>
      new Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        shadowSize: [41, 41],
      }),
    [],
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shipment-details-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Shipment details</p>
            <h2 id="shipment-details-title" className="mt-1 text-lg font-bold text-slate-800">
              {shipment.code}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close shipment details"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-5 overflow-y-auto p-5 lg:grid-cols-[1fr_1.25fr]">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Info label="Order" value={shipment.orderCode} />
              <Info label="Carrier" value={shipment.carrier || 'Not assigned'} />
              <Info label="Customer" value={shipment.customer} />
              <Info label="Tracking" value={shipment.trackingNumber || 'Not available'} />
              <Info label="Status" value={shipment.status} />
              <Info label="Est. delivery" value={shipment.estimatedDelivery || 'Not scheduled'} />
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-2">
                <MapPin size={17} className="mt-0.5 shrink-0 text-indigo-500" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Delivery destination</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {shipment.destination || 'No destination provided'}
                  </p>
                  {hasCoordinates && (
                    <p className="mt-2 font-mono text-xs text-slate-500">
                      {position[0].toFixed(6)}, {position[1].toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-[300px] overflow-hidden rounded-md border border-slate-200">
            {hasCoordinates ? (
              <MapContainer center={position as LatLngExpression} zoom={15} className="h-[320px] w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position as LatLngExpression} icon={markerIcon} />
              </MapContainer>
            ) : (
              <div className="flex h-[320px] flex-col items-center justify-center bg-slate-50 px-6 text-center">
                <MapPin size={30} className="text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-slate-700">No map location saved</p>
                <p className="mt-1 text-xs text-slate-500">
                  This shipment was created before map coordinates were available.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-100 bg-white p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-medium text-slate-700" title={value}>
        {value}
      </p>
    </div>
  );
}
