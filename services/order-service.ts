import { OrderStatus } from "@/constant/constant";
import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { Order } from "@/types/order";
import { OrderSummary } from "@/types/order-summary";


type OrderRequest = {
    shippingAddressId: number;
    paymentMethod: string;
    note: string;
}

class OrderService {
    private endPoint = "/orders";

    async getAllSummary(status: OrderStatus): Promise<ApiResponse<OrderSummary[]>> {
        const response = await http.get(`${this.endPoint}`, {
            params: {
                "status": status
            }
        });
        return response.data;
    }

    async getAll(): Promise<ApiResponse<Order[]>> {
      const response = await http.get<ApiResponse<Order[]>>(`${this.endPoint}/`);
      return response.data;
    }


    async getById(orderId: number): Promise<ApiResponse<Order>> {
        const response = await http.get(`${this.endPoint}/${orderId}`);
        return response.data;
    }

    async create(req: OrderRequest): Promise<ApiResponse<Order>> {
        const response = await http.post(this.endPoint , req);
        return response.data;
    }

    async updateStatus(orderId: number, status: OrderStatus): Promise<ApiResponse<Order>> {
        const response = await http.put(`${this.endPoint}/${orderId}/status`, {
            status,
        });
        return response.data;
    }

}

export const orderService = new OrderService();