import axiosInstance from '@/lib/axios-instance';
import { PaginatedResponse, User, UserPayload } from '@/types';

export const userService = {
  async list(page = 1): Promise<PaginatedResponse<User>> {
    const { data } = await axiosInstance.get<PaginatedResponse<User>>('/users', { params: { page } });
    return data;
  },

  async create(payload: UserPayload): Promise<User> {
    const { data } = await axiosInstance.post<User>('/users', payload);
    return data;
  },

  async update(id: number, payload: Partial<UserPayload>): Promise<User> {
    const { data } = await axiosInstance.put<User>(`/users/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await axiosInstance.delete(`/users/${id}`);
  },
};
