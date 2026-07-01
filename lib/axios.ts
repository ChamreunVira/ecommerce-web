import { tokenManager } from "@/utils/tokenManager";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:8081/api/v1";

export const http = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getToken();
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          BASE_URL + "/auth/refresh",
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          },
        );

        console.log("Response fron refresg token is: ", response.data);

        const { accessToken } = response.data.data;
        console.log("The access token is: ", accessToken)

        tokenManager.setToken(accessToken);

        // Retry original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return http(originalRequest);
      } catch (refreshError: any) {
        tokenManager.removeToken();

        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/sign-in") &&
          !window.location.pathname.startsWith("/sign-up")
        ) {
          window.location.href = "/sign-in";
        }

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
