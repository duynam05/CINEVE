import axios from "axios";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json"
  }
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("cineve_access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("cineve_access_token");
      localStorage.removeItem("cineve_refresh_token");
      localStorage.removeItem("cineve_user");
    }

    return Promise.reject(error);
  }
);

export const unwrap = (response) => response.data?.result ?? response.data;

export default httpClient;
