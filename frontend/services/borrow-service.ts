import axiosInstance from '@/lib/axios-instance';
import { Borrow, BorrowPayload, PaginatedResponse } from '@/types';
import { BORROW_ROUTES } from '@/common/end-points';

export const borrowService = {
  async list(page = 1): Promise<PaginatedResponse<Borrow>> {
    const { data } = await axiosInstance.get<PaginatedResponse<Borrow>>(BORROW_ROUTES.LIST, {
      params: { page },
    });
    return data;
  },

  async borrow(payload: BorrowPayload): Promise<Borrow> {
    const { data } = await axiosInstance.post<Borrow>(BORROW_ROUTES.BORROW, payload);
    return data;
  },

  async returnItem(borrowId: number): Promise<Borrow> {
    const { data } = await axiosInstance.post<Borrow>(BORROW_ROUTES.RETURN(borrowId));
    return data;
  },
};
