import axiosInstance from '@/lib/axios-instance';
import { Item, ItemPayload, PaginatedResponse } from '@/types';
import { ITEM_ROUTES } from '@/common/end-points';

export const itemService = {
  async list(page = 1, search?: string): Promise<PaginatedResponse<Item>> {
    const { data } = await axiosInstance.get<PaginatedResponse<Item>>(ITEM_ROUTES.LIST, {
      params: { page, search },
    });
    return data;
  },

  async get(id: number): Promise<Item> {
    const { data } = await axiosInstance.get<Item>(ITEM_ROUTES.GET(id));
    return data;
  },

  async create(payload: ItemPayload): Promise<Item> {
    const form = buildFormData(payload);
    const { data } = await axiosInstance.post<Item>(ITEM_ROUTES.CREATE, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async update(id: number, payload: Partial<ItemPayload>): Promise<Item> {
    const form = buildFormData(payload);
    // Laravel does not support multipart PUT — use POST with _method spoofing
    form.append('_method', 'PUT');
    const { data } = await axiosInstance.post<Item>(ITEM_ROUTES.UPDATE(id), form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async remove(id: number): Promise<void> {
    await axiosInstance.delete(ITEM_ROUTES.DELETE(id));
  },
};

function buildFormData(payload: Partial<ItemPayload>): FormData {
  const form = new FormData();
  Object.entries(payload).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      form.append(key, val instanceof File ? val : String(val));
    }
  });
  return form;
}
