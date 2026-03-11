import { Cupboard, CupboardPayload } from '@/types';
import axiosInstance from '@/lib/axios-instance';
import { CUPBOARD_ROUTES } from '@/common/end-points';

export const cupboardService = {
  async list(): Promise<Cupboard[]> {
    const { data } = await axiosInstance.get<Cupboard[]>(CUPBOARD_ROUTES.LIST);
    return data;
  },

  async create(payload: CupboardPayload): Promise<Cupboard> {
    const { data } = await axiosInstance.post<Cupboard>(CUPBOARD_ROUTES.CREATE, payload);
    return data;
  },

  async update(id: number, payload: CupboardPayload): Promise<Cupboard> {
    const { data } = await axiosInstance.put<Cupboard>(CUPBOARD_ROUTES.UPDATE(id), payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await axiosInstance.delete(CUPBOARD_ROUTES.DELETE(id));
  },
};
