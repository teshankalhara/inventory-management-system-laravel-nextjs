import axiosInstance from '@/lib/axios-instance';
import { saveAuth, clearAuth } from '@/lib/auth';
import { AuthResponse, LoginPayload, User } from '@/types';
import { AUTH_ROUTES } from '@/common/end-points';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<AuthResponse>(AUTH_ROUTES.LOGIN, payload);
    saveAuth(data.token, data.user);
    return data;
  },

  async logout(): Promise<void> {
    await axiosInstance.post(AUTH_ROUTES.LOGOUT).catch(() => {});
    clearAuth();
  },

  async me(): Promise<User> {
    const { data } = await axiosInstance.get<User>(AUTH_ROUTES.ME);
    return data;
  },
};
