import axios, {
    AxiosError,
    InternalAxiosRequestConfig
} from "axios";

const BASE_URL = "http://localhost:8080/api/v1";

export const setAccessToken = (token: string) => {
    localStorage.setItem("accessToken", token);
};

export const getAccessToken = (): string | null => {
    return localStorage.getItem("accessToken");
};

export const clearAccessToken = () => {
    localStorage.removeItem("accessToken");
};

export const http = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
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
    (error) => Promise.reject(error)
);

// Silent refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (token: string | null) => {
    failedQueue.forEach((promise) => {
        promise.resolve(token);
    });

    failedQueue = [];
};

http.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        // Access token expired
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    failedQueue.push({
                        resolve
                    });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return http(originalRequest);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;admin/product

            try {
                const response = await axios.get(
                    `${BASE_URL}/refresh`,
                    {
                        withCredentials: true
                    }
                );

                const newAccessToken = response.data.accessToken;

                setAccessToken(newAccessToken);

                processQueue(newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return http(originalRequest);
            } catch (refreshError) {
                clearAccessToken();

                window.location.href = "/login";

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);