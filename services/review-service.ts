import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { Review } from "@/types/review";

class ReviewService {
    
    private endPoint = "/review";

    async getAll(): Promise<ApiResponse<Review[]>> {
        const response = await http.get(this.endPoint);
        return response.data;
    }

}

export const reviewService = new ReviewService();