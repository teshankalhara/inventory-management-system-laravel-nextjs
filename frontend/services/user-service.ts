import axiosInstance from '@/lib/axios-instance';
import { PaginatedResponse, User, UserPayload } from '@/types';
import { USER_ROUTES } from '@/common/end-points';

export const userService = {
  async list(page = 1): Promise<PaginatedResponse<User>> {
    const { data } = await axiosInstance.get<PaginatedResponse<User>>(USER_ROUTES.LIST, { params: { page } });
    return data;
  },

  async create(payload: UserPayload): Promise<User> {
    const { data } = await axiosInstance.post<User>(USER_ROUTES.CREATE, payload);
    return data;
  },

  async update(id: number, payload: Partial<UserPayload>): Promise<User> {
    const { data } = await axiosInstance.put<User>(USER_ROUTES.UPDATE(id), payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await axiosInstance.delete(USER_ROUTES.DELETE(id));
  },
};
