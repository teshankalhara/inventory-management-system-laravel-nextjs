import axiosInstance from '@/lib/axios-instance';
import { saveAuth, clearAuth } from '@/lib/auth';
import { AuthResponse, LoginPayload, User } from '@/types';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<AuthResponse>('/login', payload);
    saveAuth(data.token, data.user);
    return data;
  },

  async logout(): Promise<void> {
    await axiosInstance.post('/logout').catch(() => {});
    clearAuth();
  },

  async me(): Promise<User> {
    const { data } = await axiosInstance.get<User>('/me');
    return data;
  },
};
