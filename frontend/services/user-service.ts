/**
 * services/user-service.ts
 * 
 * @updated 03/10/2026
 */

import axios from "axios";
import axiosInstance from "@/lib/axios-instance";
import { PaginatedResponse, User, UserPayload } from "@/types";
import { USER_ROUTES } from "@/common/end-points";

export const userService = {
  async list(page = 1): Promise<PaginatedResponse<User>> {
    try {
      const { data } = await axiosInstance.get<PaginatedResponse<User>>(USER_ROUTES.LIST, {
        params: { page },
      });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch users");
      }
      throw new Error("Something went wrong");
    }
  },

  async create(payload: UserPayload): Promise<User> {
    try {
      const { data } = await axiosInstance.post<User>(USER_ROUTES.CREATE, payload);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to create user");
      }
      throw new Error("Something went wrong");
    }
  },

  async update(id: number, payload: Partial<UserPayload>): Promise<User> {
    try {
      const { data } = await axiosInstance.put<User>(USER_ROUTES.UPDATE(id), payload);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to update user");
      }
      throw new Error("Something went wrong");
    }
  },

  async remove(id: number): Promise<void> {
    try {
      await axiosInstance.delete(USER_ROUTES.DELETE(id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to delete user");
      }
      throw new Error("Something went wrong");
    }
  },
};