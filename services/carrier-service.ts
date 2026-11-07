import { http } from '@/lib/axios';
import { ApiResponse } from '@/types/api-response';
import { Carrier } from '@/types/carrier';

class CarrierService {
  async getAll(): Promise<ApiResponse<Carrier[]>> {
    const response = await http.get<ApiResponse<Carrier[]>>('/carriers');
    return response.data;
  }
}

export const carrierService = new CarrierService();
