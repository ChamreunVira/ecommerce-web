import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { StockItem } from "@/types/stock-item";

class InventoryService {
    private endPoint: string = "/inventory";

    async getAll(): Promise<ApiResponse<StockItem[]>> {
        const response = await http.get<ApiResponse<StockItem[]>>(this.endPoint);
        return response.data;
    }

}

export const inventoryService = new InventoryService();