/**
 * services/cupboard-service.ts
 * 
 * @updated 03/10/2026
 */

import axios from "axios";
import axiosInstance from "@/lib/axios-instance";
import { Cupboard, CupboardPayload } from "@/types";
import { CUPBOARD_ROUTES } from "@/common/end-points";

export const cupboardService = {
  async list(): Promise<Cupboard[]> {
    try {
      const { data } = await axiosInstance.get<Cupboard[]>(CUPBOARD_ROUTES.LIST);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch cupboards");
      }
      throw new Error("Something went wrong");
    }
  },

  async create(payload: CupboardPayload): Promise<Cupboard> {
    try {
      const { data } = await axiosInstance.post<Cupboard>(CUPBOARD_ROUTES.CREATE, payload);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to create cupboard");
      }
      throw new Error("Something went wrong");
    }
  },

  async update(id: number, payload: Partial<CupboardPayload>): Promise<Cupboard> {
    try {
      const { data } = await axiosInstance.put<Cupboard>(CUPBOARD_ROUTES.UPDATE(id), payload);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to update cupboard");
      }
      throw new Error("Something went wrong");
    }
  },

  async remove(id: number): Promise<void> {
    try {
      await axiosInstance.delete(CUPBOARD_ROUTES.DELETE(id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to delete cupboard");
      }
      throw new Error("Something went wrong");
    }
  },
};