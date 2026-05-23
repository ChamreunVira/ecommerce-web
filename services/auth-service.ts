import { http, setAccessToken, clearAccessToken } from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { User } from "@/types/user";

class AuthService {
    private endPoint = "/auth";

    async signUp(userRequest: Partial<User>): Promise<ApiResponse<User>> {
        const response = await http.post<ApiResponse<User>>(`${this.endPoint}/sign-up`, userRequest);
        if (response.data.data.accessToken) {
            setAccessToken(response.data.data.accessToken);
        }
        return response.data;
    }

    async signIn(authRequest: Partial<User>): Promise<ApiResponse<User>> {
        const response = await http.post<ApiResponse<User>>(`${this.endPoint}/sign-in`, authRequest);
        if (response.data.data.accessToken) {
            setAccessToken(response.data.data.accessToken);
        }
        return response.data;
    }

    async refreshToken(): Promise<ApiResponse<any>> {
        const response = await http.post<ApiResponse<any>>(`${this.endPoint}/refresh`);
        if (response.data.data.accessToken) {
            setAccessToken(response.data.data.accessToken);
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

    logout(): void {
        clearAccessToken();
    }
}

export const authService = new AuthService();