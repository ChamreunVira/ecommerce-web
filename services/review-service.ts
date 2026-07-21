import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { Review } from "@/types/review";

interface ReviewRequest {
    productId: number;
    rating: number;
    comment: string;
}

class ReviewService {
    
    private endPoint = "/review";

    async getAll(): Promise<ApiResponse<Review[]>> {
        const response = await http.get(this.endPoint);
        return response.data;
    }

    async create(req: ReviewRequest): Promise<ApiResponse<Review>> {
        const response = await http.post<ApiResponse<Review>>(this.endPoint, req);
        return response.data;
    }

}

export const reviewService = new ReviewService();