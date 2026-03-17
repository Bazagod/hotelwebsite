import { apiClient } from '@/services/api-client';
import type { DashboardData } from '@/types/api';

export const dashboardApi = {
  getData: async (): Promise<DashboardData> => {
    const { data } = await apiClient.get('/dashboard');
    return data;
  },
};
