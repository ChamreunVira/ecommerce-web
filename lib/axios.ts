import { ApiResponse } from "@/types/api-response";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:8080/api/v1";

let accessToken: string | null = null;

export const getAccessToken = () => {
  return accessToken;
};

export const setAccessToken = (newToken: string | null) => {
  accessToken = newToken;
};

export const clearAccessToken = () => {
  accessToken = null;
};

export const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add access token to request
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

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
      _retry?: boolean;
    };

    // skip silent refresh
    const requestUrl = originalRequest?.url ?? "";
    const isAuthRequest = requestUrl.includes("/auth/sign-in") || requestUrl.includes("/auth/sign-up") || requestUrl.includes("/auth/refresh");

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;
      try {
        const response = await axios.get<ApiResponse<{ accessToken: string }>>(
          BASE_URL + "/auth/refresh",
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          },
        );

        if (response.status === 200) {
          const { accessToken } = response.data.data;
          setAccessToken(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return http(originalRequest);
        }
      } catch (refreshError) {
        setAccessToken(null);
        const authPages = ["/sign-in", "/sign-up"];
        if (typeof window !== "undefined" && !authPages.some((p) => window.location.pathname.startsWith(p))) {
          window.location.href = "/sign-in";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
