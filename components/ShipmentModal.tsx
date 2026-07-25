import React, { ChangeEvent, useState } from 'react'
import AdminModal from './AdminModal';
import { ShipmentStatus } from '@/constant/constant';
import { shipmentService } from '@/services/shipment-service';
import { CheckIcon } from 'lucide-react';

type ShipmentModalType = {
    onCreateSuccessAction: () => void;
    handleCloseAction: () => void;
}

export interface CreateShipment {
    status: ShipmentStatus;
    destination: string;
    trackingNumber: string;
    estimatedDelivery: string;
    carrier: string;
}

const ShipmentModal: React.FC<ShipmentModalType> = ({ handleCloseAction, onCreateSuccessAction }) => {
    const [shipmentData, setShipmentData] = useState<CreateShipment>({
        status: ShipmentStatus.IN_TRANSMIT,
        destination: "",
        trackingNumber: "",
        estimatedDelivery: "",
        carrier: ""
    });
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const handleSumit = async () => {
        try {
            const response = await shipmentService.create(shipmentData);
            if (response.success) {
                onCreateSuccessAction();
            }
        } catch (e: any) {
            console.log("Failed to create Shipment", e);
        }
    }

    const handleShipmentFieldChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setShipmentData((prev) => ({ ...prev, [name]: value }));
    }


    return (
        <AdminModal
            title="Create shipment"
            description="Add a status, carrier, or estemated account."
            onClose={handleCloseAction}
            maxWidth="max-w-xl"
            footer={
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleCloseAction}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Cancel
                    </button>
                    <button
                        form="create-user-form"
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <CheckIcon size={16} />
                        {isSaving ? "Creating..." : "Create user"}
                    </button>
                </div>
            }
        >
            <form id="create-user-form" onSubmit={handleSumit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-slate-700" htmlFor="fullName">
                        Distination
                    </label>
                    <input
                        id="destination"
                        type="text"
                        onChange={handleShipmentFieldChange}
                        placeholder="Preveng"
                        name="destination"
                        value={shipmentData.destination}
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700" htmlFor="fullName">
                        Tracking Number
                    </label>
                    <input
                        id="trackingNumber"
                        type="text"
                        onChange={handleShipmentFieldChange}
                        placeholder="PV-0001"
                        name="trackingNumber"
                        value={shipmentData.trackingNumber}
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700" htmlFor="status">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={shipmentData.status}
                        onChange={handleShipmentFieldChange}
                        className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        required
                    >
                        <option defaultValue={ShipmentStatus.IN_TRANSMIT}>In Transmit</option>
                        <option value={ShipmentStatus.PENDING}>Pending</option>
                        <option value={ShipmentStatus.DELAYED}>Delayed</option>
                        <option value={ShipmentStatus.CANCELLED}>Canceled</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700" htmlFor="fullName">
                        Estimated Devivery
                    </label>
                    <input
                        id="estimatedDelivery"
                        type="datetime-local"
                        onChange={handleShipmentFieldChange}
                        name="estimatedDelivery"
                        value={shipmentData.estimatedDelivery}
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700" htmlFor="fullName">
                        Carrier
                    </label>
                    <input
                        id="carrier"
                        type="text"
                        onChange={handleShipmentFieldChange}
                        name="carrier"
                        value={shipmentData.carrier}
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        required
                    />
                </div>


            </form>
        </AdminModal>
    )
}

export default ShipmentModal