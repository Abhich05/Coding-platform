// src/services/dashboardService.ts
import axiosInstance from './axiosInstance';

export const dashboardService = {
  // Fetch Overview Stats
  getOverviewStats: async () => {
    // -> GET http://localhost:4000/api/overview/stats
    const response = await axiosInstance.get('/overview/stats');
    return response.data;
  },

  // Example: Fetch Recent Activity or Graphs (if you add this route)
  getActivity: async () => {
    // adjust to whatever route you actually create:
    const response = await axiosInstance.get('/overview/activity');
    return response.data;
  },
};
