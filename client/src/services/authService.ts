// src/services/authService.ts
import axiosInstance from "./axiosInstance";

export const authService = {
  // Login User
  login: async (credentials: any) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    // response.data = { message, data: { id, email } }

    // If you later add token, keep this pattern
    if ((response.data as any).token) {
      localStorage.setItem("auth_token", (response.data as any).token);
    }

    // Store the data object that contains id + email
    if (response.data?.data) {
      localStorage.setItem(
        "user-storage",
        JSON.stringify(response.data.data)
      );
    }

    return response.data;
  },

  // Register User
  register: async (userData: any) => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user-storage");
  },
};
