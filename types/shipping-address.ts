export interface ShippingAddress {
    id: number
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    province: string;
    country: string;
    default: boolean;
}