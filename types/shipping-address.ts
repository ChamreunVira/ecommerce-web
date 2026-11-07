export interface ShippingAddress {
  addressId: number;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  province: string;
  country: string;
  default: boolean;
  latitude?: number | null;
  longitude?: number | null;
}

export type ShippingAddressRequest = {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  province: string;
  country: string;
  note?: string;
  isDefault?: boolean;
  latitude?: number | null;
  longitude?: number | null;
};
