import axiosInstance from '@/lib/axios-instance';
import { Place, PlacePayload } from '@/types';

export const placeService = {
  async list(): Promise<Place[]> {
    const { data } = await axiosInstance.get<Place[]>('/places');
    return data;
  },

  async create(payload: PlacePayload): Promise<Place> {
    const { data } = await axiosInstance.post<Place>('/places', payload);
    return data;
  },

  async update(id: number, payload: PlacePayload): Promise<Place> {
    const { data } = await axiosInstance.put<Place>(`/places/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await axiosInstance.delete(`/places/${id}`);
  },
};
