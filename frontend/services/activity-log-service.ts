import axiosInstance from '@/lib/axios-instance';
import { ActivityLog, PaginatedResponse } from '@/types';

export const activityLogService = {
  async list(page = 1): Promise<PaginatedResponse<ActivityLog>> {
    const { data } = await axiosInstance.get<PaginatedResponse<ActivityLog>>('/activity-logs', {
      params: { page },
    });
    return data;
  },
};
