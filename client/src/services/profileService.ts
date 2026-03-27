// src/services/profileService.ts
import axiosInstance from './axiosInstance';

export const profileService = {
  getMyProfile: async () => {
    const res = await axiosInstance.get('/profile/me'); 
    return res.data; // expect { userId, name, bio, skills, avatarUrl, ... }
  },

  updateProfile: async (payload: any) => {
    const res = await axiosInstance.put('/profile/update', payload);
    return res.data;
  },
};
