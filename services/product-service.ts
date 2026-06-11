import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { Product } from "@/types/product";
import { User } from "@/types/user";
import axios from "axios";

class ProductService {
    private endPoint = "/products";

    async getAll(): Promise<ApiResponse<Product[]>> {
        const response = await http.get<ApiResponse<Product[]>>(this.endPoint);
        return response.data;
    }

    async getById(id: number): Promise<ApiResponse<Product>> {
        const response = await http.get<ApiResponse<Product>>(`${this.endPoint}/${id}`);
        return response.data;
    }

    async create(request: FormData): Promise<ApiResponse<Product>> {
        const response = await http.post<ApiResponse<Product>>(this.endPoint, request, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        return response.data;
    }

    async update(productId: number, req: Partial<Product>): Promise<ApiResponse<Product>> {
        const response = await http.put(`${this.endPoint}/${productId}`, req, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }

    async filterPrice(minPrice: number, maxPrice: number): Promise<ApiResponse<Product[]>> {
        const response = await http.get(`${this.endPoint}/?minPrice=${minPrice}&maxPrice=${maxPrice}`);
        return response.data;
    }

    async delete(id: number): Promise<ApiResponse<null>> {
        const response = await http.delete<ApiResponse<null>>(`${this.endPoint}/${id}`);
        return response.data;
    }

}

export const productService = new ProductService();