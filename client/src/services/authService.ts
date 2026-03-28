// src/services/authService.ts
import axiosInstance from "./axiosInstance";
import { useUserStore } from "../store/useUserStore";

export const authService = {
  // Login User
  login: async (credentials: any) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      console.log('Login response:', response.data);

      // Backend returns: {message: "...", data: {id, email}}
      const userData = response.data?.data;

      if (!userData) {
        throw new Error('Invalid response from server');
      }

      // Store token if returned
      if (response.data?.token) {
        console.log('Storing auth token');
        localStorage.setItem("auth_token", response.data.token);
      }

      // Don't store user data here - let Zustand persist middleware handle it
      // The SignIn component will call setUser() which will trigger Zustand to persist
      console.log('User data extracted, returning to SignIn to update store');

      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register User
  register: async (userData: any) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);

      // Store token if returned
      if (response.data?.token) {
        console.log('Storing auth token');
        localStorage.setItem("auth_token", response.data.token);
      }

      // Backend returns: {message: "...", data: {id, email}}
      return response.data;
    } catch (err: any) {
      // Log exact backend error for debugging 400s
      console.error('REGISTER 400 ERROR:', {
        message: err.response?.data?.message,
        status: err.response?.status,
        data: err.response?.data
      });
      throw err;
    }
  },

  // Logout
  logout: () => {
    console.log('Logging out user');
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user-storage");
    useUserStore.getState().clearUser();
  },
};
