import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { ShippingAddress } from "@/types/shipping-address";

class ShippingAddressService {
    private endpoint: string = "/addresses";

    async getAll(): Promise<ApiResponse<ShippingAddress[]>> {
        const response = await http.get(this.endpoint);
        return response.data;
    }

    async getById(id: number): Promise<ApiResponse<ShippingAddress>> {
        const response = await http.get(`${this.endpoint}/${id}`);
        return response.data;
    }

    async create(req: Partial<ShippingAddress>): Promise<ApiResponse<ShippingAddress>> {
        const response = await http.post(`${this.endpoint}` , req);
        return response.data;
    }

    async update(id: number, req: Partial<ShippingAddress>): Promise<ApiResponse<ShippingAddress>> {
        const response = await http.put(`${this.endpoint}/${id}` , req);
        return response.data;
    }

    async delete(id: number): Promise<ApiResponse<void>> {
        const response = await http.delete(`${this.endpoint}/${id}`);
        return response.data;
    }

    async toggleStatus(id: number): Promise<ApiResponse<ShippingAddress>> {
        const response = await http.put(`/is-default/${id}`);
        return response.data;
    }
}


export const shippingAddressService = new ShippingAddressService();