import httpClient from "./httpClient";

export const login = async (payload) => {
  const response = await httpClient.post("/api/auth/login", payload);
  return response.data;
};

export const register = async (payload) => {
  const response = await httpClient.post("/api/auth/register", payload);
  return response.data;
};

export const getMe = async () => {
  const response = await httpClient.get("/api/auth/me");
  return response.data;
};
