import { http } from '@/lib/axios';
import { ApiResponse } from '@/types/api-response';
import { Payment } from '@/types/payment';
import { PaymentStatus } from '@/constant/constant';

export type PaymentStatusResponse = Omit<Payment, 'paymentId' | 'qrString' | 'deeplink'>;

class PaymentService {
  private endPoint: string = '/payment';

  async getAll(): Promise<ApiResponse<Payment[]>> {
    const response = await http.get(this.endPoint);
    return response.data;
  }

  async create(orderId: number): Promise<ApiResponse<Payment>> {
    const response = await http.post(`${this.endPoint}/khqr/generate`, {
      orderId,
    });
    return response.data;
  }

  async checkStatus(transactionId: string): Promise<ApiResponse<PaymentStatusResponse>> {
    const response = await http.get(`${this.endPoint}/khqr/${transactionId}/status`);
    return response.data;
  }

  async updateStatus(paymentId: number, status: PaymentStatus): Promise<ApiResponse<Payment>> {
    const response = await http.put(`${this.endPoint}/${paymentId}/status`, { status });
    return response.data;
  }
}

export const paymentService = new PaymentService();
