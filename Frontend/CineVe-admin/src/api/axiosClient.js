import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json"
  }
});

axiosClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("cineve_admin_access_token") ||
    localStorage.getItem("cineve_access_token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("cineve_admin_access_token");
      localStorage.removeItem("cineve_access_token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export const unwrap = (response) => response.data?.result ?? response.data?.data ?? response.data ?? {};

export const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Có lỗi xảy ra, vui lòng thử lại";

export default axiosClient;
