import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { Category } from "@/types/category";

class CategoryService {
    private endPoint = "/categories";

    async getAll(): Promise<ApiResponse<Category[]>> {
        const response = await http.get(this.endPoint);
        return response.data;
    }
}

export const categoryService = new CategoryService();