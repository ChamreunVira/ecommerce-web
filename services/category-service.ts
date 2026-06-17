import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { Category } from "@/types/category";

export type CategoryTrend = Pick<Category, "id" | "name"> & { revenue: number };

class CategoryService {
  private endPoint = "/categories";

  async getAll(): Promise<ApiResponse<Category[]>> {
    const response = await http.get(this.endPoint);
    return response.data;
  }

  async getByTrend(): Promise<ApiResponse<CategoryTrend[]>> {
    const response = await http.get(`${this.endPoint}/trend`);
    return response.data;
  }

  async create(
    category: Omit<Category, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<Category>> {
    const response = await http.post(this.endPoint, category);
    return response.data;
  }

  async update(
    id: number,
    category: Omit<Category, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<Category>> {
    const response = await http.put(`${this.endPoint}/${id}`, category);
    return response.data;
  }

  async delete(id: number): Promise<ApiResponse<null>> {
    const response = await http.delete(`${this.endPoint}/${id}`);
    return response.data;
  }
}

export const categoryService = new CategoryService();
