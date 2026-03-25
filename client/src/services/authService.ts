// src/services/authService.ts
import axiosInstance from "./axiosInstance";

export const authService = {
  // Login User
  login: async (credentials: any) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    
    // Store token if returned
    if ((response.data as any).token) {
      localStorage.setItem("auth_token", (response.data as any).token);
    }

    // Store user data (handles both {data: {...}} and {user: {...}})
    const userData = response.data?.data || response.data?.user;
    if (userData) {
      localStorage.setItem(
        "user-storage",
        JSON.stringify(userData)  // {id, email}
      );
    }

    return response.data;
  },

  // Register User - FIXED: Now saves user data like login
  register: async (userData: any) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      
      // Backend returns: {message: "...", data: {id, email}}
      const backendData = response.data;
      
      // Save user data to localStorage (same format as login)
      if (backendData?.data) {
        localStorage.setItem(
          "user-storage", 
          JSON.stringify(backendData.data)  // {id, email}
        );
      }
      
      return backendData;
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
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user-storage");
  },
};
