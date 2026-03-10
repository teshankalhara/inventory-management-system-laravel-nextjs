/**
 * services/place-service.ts
 * 
 * @updated 03/11/2026
 */

import axios from "axios";
import axiosInstance from "@/lib/axios-instance";
import { Place, PlacePayload } from "@/types";
import { PLACE_ROUTES } from "@/common/end-points";

export const placeService = {
  async list(): Promise<Place[]> {
    try {
      const { data } = await axiosInstance.get<Place[]>(PLACE_ROUTES.LIST);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch places");
      }
      throw new Error("Something went wrong");
    }
  },

  async create(payload: PlacePayload): Promise<Place> {
    try {
      const { data } = await axiosInstance.post<Place>(PLACE_ROUTES.CREATE, payload);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to create place");
      }
      throw new Error("Something went wrong");
    }
  },

  async update(id: number, payload: Partial<PlacePayload>): Promise<Place> {
    try {
      const { data } = await axiosInstance.put<Place>(PLACE_ROUTES.UPDATE(id), payload);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to update place");
      }
      throw new Error("Something went wrong");
    }
  },

  async remove(id: number): Promise<void> {
    try {
      await axiosInstance.delete(PLACE_ROUTES.DELETE(id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to delete place");
      }
      throw new Error("Something went wrong");
    }
  },
};