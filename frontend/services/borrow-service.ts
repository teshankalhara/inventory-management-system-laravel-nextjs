import axiosInstance from '@/lib/axios-instance';
import { Borrow, BorrowPayload, PaginatedResponse } from '@/types';

export const borrowService = {
  async list(page = 1): Promise<PaginatedResponse<Borrow>> {
    const { data } = await axiosInstance.get<PaginatedResponse<Borrow>>('/borrow-records', {
      params: { page },
    });
    return data;
  },

  async borrow(payload: BorrowPayload): Promise<Borrow> {
    const { data } = await axiosInstance.post<Borrow>('/borrow', payload);
    return data;
  },

  async returnItem(borrowId: number): Promise<Borrow> {
    const { data } = await axiosInstance.post<Borrow>(`/return/${borrowId}`);
    return data;
  },
};
