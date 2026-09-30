import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { StoreSetting, StoreSettingRequest } from "@/types/setting";

class SettingService {
  private readonly endpoint = "/settings";

  async get(): Promise<ApiResponse<StoreSetting>> {
    const response = await http.get<ApiResponse<StoreSetting>>(this.endpoint);
    return response.data;
  }

  async update(settings: StoreSettingRequest): Promise<ApiResponse<StoreSetting>> {
    const response = await http.put<ApiResponse<StoreSetting>>(`${this.endpoint}/1`, settings);
    return response.data;
  }
}

export const settingService = new SettingService();
