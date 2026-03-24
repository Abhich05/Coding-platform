import axiosInstance from './axiosInstance';

export const dashboardService = {
  // Fetch Overview Stats
  getOverviewStats: async () => {
    // Matches your backend route for dashboard data
    const response = await axiosInstance.get('/dashboard/overview'); 
    return response.data;
  },
  
  // Example: Fetch Recent Activity or Graphs
  getActivity: async () => {
    const response = await axiosInstance.get('/dashboard/activity');
    return response.data;
  }
};
