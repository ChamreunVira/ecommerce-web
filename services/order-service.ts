import { OrderStatus } from "@/constant/constant";
import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { Order } from "@/types/order";

type OrderRequest = {
    shippingAddressId: number;
    paymentMethod: string;
    note: string;
}

class OrderService {
    private endPoint = "/orders";

    async getAll(): Promise<ApiResponse<Order[]>> {
        const response = await http.get(this.endPoint, {
            params: {
                "status": OrderStatus.PENDING_PAYMENT
            }
        });
        return response.data;
    }

    async create(req: OrderRequest): Promise<ApiResponse<Order>> {
        const response = await http.post(this.endPoint , req);
        return response.data;
    }

    async getById(orderId: number | string): Promise<ApiResponse<Order>> {
        const response = await http.get(`${this.endPoint}/${orderId}`);
        return response.data;
    }

}

export const orderService = new OrderService();