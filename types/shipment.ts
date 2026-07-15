export interface Shipment {
    id: number;
    code: string;
    orderCode: string;
    customer: string;
    status: "PENDING" | "IN_TRANSIT" | "DELAYED" | "DELIVERED" | "CANCELLED";
    destination: string;
    trackingNumber: string;
    estimatedDelivery: string;
    carrier: string;
}