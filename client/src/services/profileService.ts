// src/services/profileService.ts
import apiClient from '../lib/apiClient';

export const profileService = {
  getMyProfile: async () => {
    const res = await apiClient.get('/profile/me');
    return res.data;
  },

  updateProfile: async (payload: any) => {
    const res = await apiClient.put('/profile/update', payload);
    return res.data;
  },
};
