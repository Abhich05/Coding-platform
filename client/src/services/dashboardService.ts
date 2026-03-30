// src/services/dashboardService.ts
import apiClient from '../lib/apiClient';

export const dashboardService = {
  getOverviewStats: async () => {
    const response = await apiClient.get('/overview/stats');
    return response.data;
  },

  getActivity: async () => {
    const response = await apiClient.get('/overview/activity');
    return response.data;
  },
};
