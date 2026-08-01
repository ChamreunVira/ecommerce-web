import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { Promotion } from "@/types/promotion";

export type ValidatePromotionResult = {
    promotion: Promotion | null;
    discountAmount: number;
    freeShipping: boolean;
};

class PromotionService {

    private endPoint: string = "/promotions";

    async getAll(): Promise<ApiResponse<Promotion[]>> {
        const response = await http.get<ApiResponse<Promotion[]>>(this.endPoint);
        return response.data;
    }

    async create(promotion: Omit<Promotion, "id" | "usageCount">): Promise<ApiResponse<Promotion>> {
        const response = await http.post<ApiResponse<Promotion>>(this.endPoint, promotion);
        return response.data;
    }

    async update(id: number, promotion: Omit<Promotion, "id" | "usageCount">): Promise<ApiResponse<Promotion>> {
        const response = await http.put<ApiResponse<Promotion>>(`${this.endPoint}/${id}`, promotion);
        return response.data;
    }

    async delete(id: number): Promise<ApiResponse<null>> {
        const response = await http.delete<ApiResponse<null>>(`${this.endPoint}/${id}`);
        return response.data;
    }

    async validate(code: string, subtotal: number): Promise<ApiResponse<ValidatePromotionResult>> {
        const response = await http.post<ApiResponse<ValidatePromotionResult>>(
            `${this.endPoint}/validate`,
            { code, subtotal }
        );
        return response.data;
    }
}

export const promotionService = new PromotionService();