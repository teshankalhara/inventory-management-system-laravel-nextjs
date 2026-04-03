import axiosInstance from '@/lib/axios-instance';
import { ActivityLog, PaginatedResponse } from '@/types';
import { ACTIVITY_LOG_ROUTES } from '@/common/end-points';

export const activityLogService = {
  async list(page = 1): Promise<PaginatedResponse<ActivityLog>> {
    const { data } = await axiosInstance.get<PaginatedResponse<ActivityLog>>(ACTIVITY_LOG_ROUTES.LIST, {
      params: { page },
    });
    return data;
  },
};
