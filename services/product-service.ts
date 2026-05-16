import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { Product } from "@/types/product";

class ProductService {
    private endPoint = "/products";

    getAll(): Promise<ApiResponse<Product>> {
        return http.get(this.endPoint);
    }
}

export const productService = new ProductService();