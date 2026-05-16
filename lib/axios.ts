import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1";

export const http = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

axios.interceptors.response.use(
    (response) => response.data, (error) => new Promise(error)
);