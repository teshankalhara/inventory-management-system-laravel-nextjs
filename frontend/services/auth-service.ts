/**
 * services/auth-service.ts
 * 
 * @updated 03/10/2026
 */

import { AUTH_ROUTES } from "@/common/end-points";
import { saveAuth, clearAuth } from "@/lib/auth";
import axiosInstance from "@/lib/axios-instance";
import { AuthResponse, LoginPayload, User } from "@/types";
import axios from "axios";

export const authService = {
    async login(payload: LoginPayload) {
        try {
            const { data } = await axiosInstance.post<AuthResponse>(
                AUTH_ROUTES.LOGIN,
                payload
            );

            saveAuth(data.token, data.user);

            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Login failed");
            }

            throw new Error("Something went wrong");
        }
    },

    async logout() {
        try {
            await axiosInstance.post(AUTH_ROUTES.LOGOUT);
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            clearAuth();
        }
    },

    async me() {
        try {
            const { data } = await axiosInstance.get<User>(AUTH_ROUTES.ME);
            return data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Failed to fetch user");
            }

            throw new Error("Something went wrong");
        }
    },
};