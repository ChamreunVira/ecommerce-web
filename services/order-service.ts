import { OrderStatus } from "@/constant/constant";
import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { Order } from "@/types/order";

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

}

export const orderService = new OrderService();