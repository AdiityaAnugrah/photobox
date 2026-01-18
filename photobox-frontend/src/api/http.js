import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export const http = axios.create({
    baseURL: API_BASE,
    timeout: 20000,
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem("admin_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
