import { ShipmentStatus } from "@/constant/constant";

export interface Shipment {
    id: number;
    code: string;
    orderCode: string;
    customer: string;
    status: ShipmentStatus;
    destination: string;
    trackingNumber: string;
    estimatedDelivery: string;
    carrier: string;
}