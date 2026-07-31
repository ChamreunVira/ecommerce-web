import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { Banner } from "@/types/banner";

type BannerPayload = Omit<Banner, "id" | "imageUrl" | "createdAt" | "updatedAt"> & { image: any };

class BannerService {
  private endpoint = "/banners";

  /** All banners (admin) */
  async getAll(): Promise<ApiResponse<Banner[]>> {
    const response = await http.get(this.endpoint);
    return response.data;
  }

  /** Active banners only (public storefront) */
  async getAllActive(): Promise<ApiResponse<Banner[]>> {
    const response = await http.get(`${this.endpoint}/active`);
    return response.data;
  }

  async create(payload: BannerPayload): Promise<ApiResponse<Banner>> {
    const response = await http.post(this.endpoint, payload);
    return response.data;
  }

  async update(id: number, payload: BannerPayload): Promise<ApiResponse<Banner>> {
    const response = await http.put(`${this.endpoint}/${id}`, payload);
    return response.data;
  }

  async toggleActive(id: number): Promise<ApiResponse<Banner>> {
    const response = await http.put(`${this.endpoint}/${id}/toggle`);
    return response.data;
  }

  async delete(id: number): Promise<ApiResponse<null>> {
    const response = await http.delete(`${this.endpoint}/${id}`);
    return response.data;
  }
}

export const bannerService = new BannerService();
