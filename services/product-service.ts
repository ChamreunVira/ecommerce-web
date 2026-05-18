import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { Product } from "@/types/product";

class ProductService {
    private endPoint = "/products";

    async getAll(): Promise<ApiResponse<Product[]>> {
        const response = await http.get<ApiResponse<Product[]>>(this.endPoint);
        return response.data;
    }

}

export const productService = new ProductService();