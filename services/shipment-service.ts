import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { Shipment } from "@/types/shipment";

class ShipmentService {
    private endpoint: string = "/shipments";

    async getAll(): Promise<ApiResponse<Shipment[]>> {
        const response = await http.get<ApiResponse<Shipment[]>>(this.endpoint);
        return response.data;
    }

}

export const shipmentService = new ShipmentService();