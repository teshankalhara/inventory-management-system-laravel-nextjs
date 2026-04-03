import axiosInstance from '@/lib/axios-instance';
import { Place, PlacePayload } from '@/types';
import { PLACE_ROUTES } from '@/common/end-points';

export const placeService = {
  async list(): Promise<Place[]> {
    const { data } = await axiosInstance.get<Place[]>(PLACE_ROUTES.LIST);
    return data;
  },

  async create(payload: PlacePayload): Promise<Place> {
    const { data } = await axiosInstance.post<Place>(PLACE_ROUTES.CREATE, payload);
    return data;
  },

  async update(id: number, payload: PlacePayload): Promise<Place> {
    const { data } = await axiosInstance.put<Place>(PLACE_ROUTES.UPDATE(id), payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await axiosInstance.delete(PLACE_ROUTES.DELETE(id));
  },
};
