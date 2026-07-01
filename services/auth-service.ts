import { http } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { User } from "@/types/user";
import { tokenManager } from "@/utils/tokenManager";

class AuthService {
    private endPoint = "/auth";

    async signUp(userRequest: Partial<User>): Promise<ApiResponse<User>> {
        const response = await http.post<ApiResponse<User>>(`${this.endPoint}/sign-up`, userRequest);
        if (response.data.data.accessToken) {
            tokenManager.setToken(response.data.data.accessToken);
        }
        return response.data;
    }

    async signIn(authRequest: Partial<User>): Promise<ApiResponse<User>> {
        const response = await http.post<ApiResponse<User>>(`${this.endPoint}/sign-in`, authRequest);
        if (response.data.data.accessToken) {
            tokenManager.setToken(response.data.data.accessToken);
        }
        return response.data;
    }

    async refreshToken(): Promise<ApiResponse<any>> {
        const response = await http.post<ApiResponse<any>>(`${this.endPoint}/refresh`);
        if (response.data.data.accessToken) {
            tokenManager.setToken(response.data.data.accessToken);
        }
        return response.data;
    }


    async me(): Promise<ApiResponse<User>> {
        const response = await http.get<ApiResponse<User>>(`${this.endPoint}/me`);
        return response.data;
    }

    async isAuthenticated(): Promise<boolean> {
        const response = await http.get("/users/is-authenticated");
        return response.data;
    }

    async forgotPassword(req: { email: string }): Promise<ApiResponse<any>> {
        const response = await http.post<ApiResponse<any>>(`${this.endPoint}/forgot-password`, req);
        return response.data;
    }

    async resetPassword(req: { otp: string, newPassword: string }): Promise<ApiResponse<any>> {
        const response = await http.post<ApiResponse<any>>(`${this.endPoint}/reset-password`, req);
        return response.data;
    }

    logout(): void {
        tokenManager.removeToken();
    }
}

export const authService = new AuthService();