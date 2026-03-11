import { Cupboard, CupboardPayload } from '@/types';
import axiosInstance from '@/lib/axios-instance';

export const cupboardService = {
  async list(): Promise<Cupboard[]> {
    const { data } = await axiosInstance.get<Cupboard[]>('/cupboards');
    return data;
  },

  async create(payload: CupboardPayload): Promise<Cupboard> {
    const { data } = await axiosInstance.post<Cupboard>('/cupboards', payload);
    return data;
  },

  async update(id: number, payload: CupboardPayload): Promise<Cupboard> {
    const { data } = await axiosInstance.put<Cupboard>(`/cupboards/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await axiosInstance.delete(`/cupboards/${id}`);
  },
};
