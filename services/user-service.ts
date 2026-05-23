import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { User } from "@/types/user";

class UserService {

    private endPoint = "/users";

    async getAll(): Promise<ApiResponse<User[]>> {
        const response = await http.get<ApiResponse<User[]>>(this.endPoint);
        return response.data;
    }

    async getById(id: number): Promise<ApiResponse<User>> {
        const response = await http.get<ApiResponse<User>>(`${this.endPoint}/${id}`);
        return response.data;
    }

    async delete(id: number): Promise<ApiResponse<null>> {
        const response = await http.delete<ApiResponse<null>>(`${this.endPoint}/${id}`);
        return response.data;
    }
}

export const userService = new UserService();