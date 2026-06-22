import { authApi } from "./clientApi";

export const login = async (payload) => {
  return authApi.login(payload);
};

export const register = async (payload) => {
  return authApi.register(payload);
};

export const getMe = async () => {
  return authApi.me();
};
